# /// script
# requires-python = ">=3.11"
# dependencies = ["rasterio", "numpy", "scipy", "shapely", "pyproj", "psycopg[binary]", "python-dotenv"]
# ///
"""Détection d'empiètements sur les terrains à protéger (titres de l'État, aires protégées, domaine public)
à partir des composites annuels Sentinel-2 GeoMAD de Digital Earth Africa (10 m, 2017 → 2025).

Signal : passage végétation/sol nu → surface bâtie entre 2017 et 2025 (NDVI qui chute, NDBI qui monte),
regroupé en taches ≥ MIN_PX pixels à l'intérieur d'une zone. Année d'apparition = première année où la tache
bascule. Usage : uv run scripts/encroachment.py [--out fichier.json]
ponytail: seuils fixes sur une zone test (Grand Nokoué) ; à calibrer sur les alertes confirmées par les agents.
"""
import json, os, sys
from pathlib import Path

import numpy as np
import psycopg
import rasterio
from dotenv import load_dotenv
from pyproj import Transformer
from rasterio.windows import from_bounds
from scipy import ndimage
from shapely import geometry, ops
from rasterio.features import geometry_mask, shapes

load_dotenv(Path(__file__).parent.parent / ".env.local")
os.environ.update(AWS_NO_SIGN_REQUEST="YES", GDAL_DISABLE_READDIR_ON_OPEN="EMPTY_DIR", CPL_VSIL_CURL_ALLOWED_EXTENSIONS=".tif",
                  VSI_CACHE="TRUE", GDAL_HTTP_MERGE_CONSECUTIVE_RANGES="YES", GDAL_HTTP_MULTIPLEX="YES", GDAL_HTTP_VERSION="2")

BBOX = (1.95, 6.30, 2.75, 6.62)  # Grand Nokoué : Ouidah → Sèmè-Podji
# ZDUP/PAG exclues : l'État y construit légitimement ; domaine lagunaire exclu (berges en eau changeantes)
LAYERS = ("tf_etat", "aire_protegee", "dpm")
YEARS = [2017, 2019, 2021, 2023, 2025]
MIN_PX = 40  # 0,4 ha
STAC = "https://explorer.digitalearth.africa/stac/search"
S3 = "https://deafrica-services.s3.af-south-1.amazonaws.com/"


def catalog():
    """Composites de la zone d'étude, une seule requête STAC : [(année, emprise de la tuile, liens des bandes)]."""
    import time, urllib.request
    q = f"{STAC}?collections=gm_s2_annual&bbox={','.join(map(str, BBOX))}&limit=500"
    for attempt in range(5):
        try:
            with urllib.request.urlopen(q, timeout=60) as r:
                feats = json.load(r)["features"]
            break
        except OSError:
            time.sleep(5 * (attempt + 1))
    return [(int(f["properties"]["datetime"][:4]), f["bbox"], {b: "/vsicurl/" + f["assets"][b]["href"].replace("s3://deafrica-services/", S3) for b in ("B04", "B08", "B11")}) for f in feats]


def items_for(cat, bounds):
    """Pour chaque année, la tuile qui contient l'emprise de la zone."""
    x0, y0, x1, y1 = bounds
    return {y: h for y, bb, h in cat if bb[0] <= x0 and bb[1] <= y0 and bb[2] >= x1 and bb[3] >= y1}


def read_band(href, bounds_ll):
    """Une bande d'un composite, fenêtre sur une emprise lon/lat."""
    with rasterio.open(href) as src:
        tr = Transformer.from_crs(4326, src.crs, always_xy=True)
        x0, y0 = tr.transform(bounds_ll[0], bounds_ll[1])
        x1, y1 = tr.transform(bounds_ll[2], bounds_ll[3])
        win = from_bounds(min(x0, x1), min(y0, y1), max(x0, x1), max(y0, y1), src.transform).round_offsets().round_lengths()
        return src.read(1, window=win, boundless=True, fill_value=0).astype("float32"), src.window_transform(win), src.crs


def read_years(cat, bounds_ll):
    """Toutes les bandes de toutes les années en parallèle (la latence réseau domine)."""
    from concurrent.futures import ThreadPoolExecutor
    jobs = [(y, b, h) for y in YEARS for b, h in cat[y].items()]
    with ThreadPoolExecutor(max_workers=len(jobs)) as ex:
        res = list(ex.map(lambda j: read_band(j[2], bounds_ll), jobs))
    out, transform, crs = {}, res[0][1], res[0][2]
    for (y, b, _), (arr, _, _) in zip(jobs, res):
        out.setdefault(y, {})[b] = arr
    return out, transform, crs


def indices(b):
    with np.errstate(divide="ignore", invalid="ignore"):
        ndvi = (b["B08"] - b["B04"]) / (b["B08"] + b["B04"])
        ndbi = (b["B11"] - b["B08"]) / (b["B11"] + b["B08"])
    return np.nan_to_num(ndvi), np.nan_to_num(ndbi)


def main():
    out_path = sys.argv[sys.argv.index("--out") + 1] if "--out" in sys.argv else "/tmp/encroachment.json"
    url = (os.environ.get("DIRECT_URL") or os.environ["DATABASE_URL"]).replace("?pgbouncer=true", "")
    with psycopg.connect(url) as con:
        rows = con.execute(
            """select f.id, f.layer_id, l.label, coalesce(f.props->>'designation', f.props->>'label', l.label), st_asgeojson(f.geom)
               from layer_features f join layers l on l.id = f.layer_id
               where f.layer_id = any(%s) and f.geom && st_makeenvelope(%s, %s, %s, %s, 4326)
                 and st_area(f.geom::geography) between 5e4 and 5e7""",
            (list(LAYERS), *BBOX),
        ).fetchall()
    print(len(rows), "zones à surveiller", flush=True)
    cat_all = catalog()
    alerts = []
    for fid, layer, label, name, gj in rows:
        zone = geometry.shape(json.loads(gj))
        b = zone.bounds
        cat = items_for(cat_all, b)
        if not all(y in cat for y in YEARS):
            continue
        try:
            raw, transform, crs = read_years(cat, b)
            stack = {y: indices(raw[y]) for y in YEARS}
        except rasterio.errors.RasterioIOError as e:
            print("illisible, zone ignorée :", name, e)
            continue
        tr = Transformer.from_crs(4326, crs, always_xy=True).transform
        inside = ~geometry_mask([ops.transform(tr, zone)], out_shape=stack[2017][0].shape, transform=transform)
        (v0, n0), (v1, n1) = stack[2017], stack[2025]
        # Bâti apparu : végétation qui chute nettement, indice de bâti qui monte, et qui reste bas en fin de période
        change = inside & ((v0 - v1) > 0.2) & ((n1 - n0) > 0.08) & (v1 < 0.35) & (v0 > 0.3)
        change = ndimage.binary_opening(change, iterations=1)
        lab, n = ndimage.label(change)
        for k in range(1, n + 1):
            m = lab == k
            px = int(m.sum())
            if px < MIN_PX:
                continue
            ndvi_series = [float(stack[y][0][m].mean()) for y in YEARS]
            mid = (ndvi_series[0] + ndvi_series[-1]) / 2
            year = next(y for y, v in zip(YEARS, ndvi_series) if v <= mid)
            poly = ops.unary_union([geometry.shape(g) for g, val in shapes(m.astype("uint8"), mask=m, transform=transform) if val == 1])
            back = Transformer.from_crs(crs, 4326, always_xy=True).transform
            poly_ll = ops.transform(back, poly).simplify(0.00003)
            alerts.append({
                "zoneId": fid, "layer": layer, "layerLabel": label, "zone": name,
                "areaM2": px * 100, "year": year, "ndvi": [round(v, 3) for v in ndvi_series],
                "drop": round(ndvi_series[0] - ndvi_series[-1], 3),
                "center": [round(poly_ll.centroid.x, 6), round(poly_ll.centroid.y, 6)],
                "polygon": geometry.mapping(poly_ll),
            })
        print(f"{layer:14} {str(name)[:50]:50} {n:4} taches", flush=True)
    alerts.sort(key=lambda a: a["areaM2"] * a["drop"], reverse=True)
    Path(out_path).write_text(json.dumps(alerts, ensure_ascii=False))
    print(len(alerts), "taches ≥", MIN_PX * 100, "m² ->", out_path)


if __name__ == "__main__":
    main()
