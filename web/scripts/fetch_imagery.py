"""Télécharge les vignettes Sentinel-2 GeoMAD annuelles (Digital Earth Africa, CC BY 4.0) autour des parcelles
publiées dans les avis de publicité foncière ANDF. Usage : python3 scripts/fetch_imagery.py"""
import io, json, math, os, urllib.request
from PIL import Image

# ponytail: 4 parcelles des avis publics ; brancher sur l'API cadastre quand l'ANDF l'ouvre
PARCELS = {
    "101236198": (422946, 701870),
    "101236087": (421842, 701745),
    "101236307": (397080, 702867),
    "101232574": (457480, 718712),
}
YEARS = [2017, 2019, 2021, 2023, 2025]
WMS = "https://ows.digitalearth.africa/wms?service=WMS&version=1.3.0&request=GetMap&layers=gm_s2_annual&styles=simple_rgb&format=image/png&crs=EPSG:3857"
Z, CROP = 15, 768  # z15 ≈ 4,8 m/px : proche du 10 m natif, moins flou que z16
OUT = os.path.join(os.path.dirname(__file__), "..", "public", "imagery")


def utm_to_latlon(e, n, zone=31):
    # Inverse UTM (WGS84), hémisphère nord — précision sub-métrique suffisante ici
    a, f, k0 = 6378137.0, 1 / 298.257223563, 0.9996
    e2 = f * (2 - f); ep2 = e2 / (1 - e2)
    x, m = e - 500000.0, n / k0
    mu = m / (a * (1 - e2 / 4 - 3 * e2**2 / 64 - 5 * e2**3 / 256))
    e1 = (1 - math.sqrt(1 - e2)) / (1 + math.sqrt(1 - e2))
    p = mu + (3 * e1 / 2 - 27 * e1**3 / 32) * math.sin(2 * mu) + (21 * e1**2 / 16 - 55 * e1**4 / 32) * math.sin(4 * mu) \
        + (151 * e1**3 / 96) * math.sin(6 * mu)
    c1 = ep2 * math.cos(p) ** 2; t1 = math.tan(p) ** 2
    n1 = a / math.sqrt(1 - e2 * math.sin(p) ** 2)
    r1 = a * (1 - e2) / (1 - e2 * math.sin(p) ** 2) ** 1.5
    d = x / (n1 * k0)
    lat = p - (n1 * math.tan(p) / r1) * (d**2 / 2 - (5 + 3 * t1 + 10 * c1 - 4 * c1**2 - 9 * ep2) * d**4 / 24
                                         + (61 + 90 * t1 + 298 * c1 + 45 * t1**2 - 252 * ep2 - 3 * c1**2) * d**6 / 720)
    lon = (d - (1 + 2 * t1 + c1) * d**3 / 6 + (5 - 2 * c1 + 28 * t1 - 3 * c1**2 + 8 * ep2 + 24 * t1**2) * d**5 / 120) / math.cos(p)
    return math.degrees(lat), (zone - 1) * 6 - 180 + 3 + math.degrees(lon)


def world_px(lat, lon):
    s = 256 * 2**Z
    x = (lon + 180) / 360 * s
    y = (1 - math.log(math.tan(math.radians(lat)) + 1 / math.cos(math.radians(lat))) / math.pi) / 2 * s
    return x, y


def fetch(year, bbox):
    url = f"{WMS}&width=512&height=512&bbox={','.join(f'{v:.2f}' for v in bbox)}&time={year}-01-01"
    with urllib.request.urlopen(urllib.request.Request(url, headers={"User-Agent": "foncier-intelligent-demo"})) as r:
        # ponytail: le WMS plafonne à 512 px ; Sentinel-2 est à 10 m natif, le rééchantillonnage ne perd rien
        return Image.open(io.BytesIO(r.read())).convert("RGB").resize((CROP, CROP), Image.LANCZOS)


meta = {}
for nup, (e, n) in PARCELS.items():
    lat, lon = utm_to_latlon(e, n)
    px, py = world_px(lat, lon)
    # Emprise de la vignette en EPSG:3857 (même cadrage qu'avant : CROP pixels au zoom Z)
    res = 2 * math.pi * 6378137 / (256 * 2**Z)
    cx, cy = px * res - math.pi * 6378137, math.pi * 6378137 - py * res
    half = CROP / 2 * res
    os.makedirs(os.path.join(OUT, nup), exist_ok=True)
    for year in YEARS:
        fetch(year, (cx - half, cy - half, cx + half, cy + half)).save(os.path.join(OUT, nup, f"{year}.jpg"), quality=82)
    mpp = 156543.03392 * math.cos(math.radians(lat)) / 2**Z
    meta[nup] = {"lat": round(lat, 6), "lon": round(lon, 6), "metersPerPixel": round(mpp, 4), "size": CROP,
                 "years": YEARS}
    print(nup, round(lat, 5), round(lon, 5))

with open(os.path.join(OUT, "meta.json"), "w") as fh:
    json.dump(meta, fh, indent=2)
