"use client";

import { useEffect, useRef } from "react";
import type { GeoJSONSource, Map as MlMap, RasterTileSource } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import type { RiskLevel } from "@/lib/risk";
import benin from "@/content/benin.json";
import { LAYER_COLOR } from "@/lib/geo/palette";
import { cn } from "@/lib/utils";

export type MapParcel = { nup: string; polygon: [number, number][]; level?: RiskLevel };
export type Basemap = "satellite" | "plan";

// Composites annuels Sentinel-2 sans nuages de Digital Earth Africa (CC BY 4.0, usage commercial permis), 2017 à 2025.
// ponytail: WMS public interrogé tuile par tuile ; mettre un cache (CDN ou proxy) devant si le trafic grandit.
const s2Tiles = (year: number) =>
  `https://ows.digitalearth.africa/wms?service=WMS&version=1.3.0&request=GetMap&layers=gm_s2_annual&styles=simple_rgb&format=image/png&crs=EPSG:3857&width=256&height=256&bbox={bbox-epsg-3857}&time=${Math.min(2025, Math.max(2017, year))}-01-01`;
const S2_ATTRIBUTION =
  'Sentinel-2 GeoMAD © <a href="https://www.digitalearthafrica.org">Digital Earth Africa</a> (CC BY 4.0), données Copernicus modifiées';

// La carte ne montre que le Bénin : cadrage limité et masque sur le reste du monde (frontière geoBoundaries, CC BY 4.0).
const BENIN_BOUNDS: [[number, number], [number, number]] = [[0.2, 5.6], [4.5, 12.9]];
const OUTSIDE_BENIN: GeoJSON.Feature = {
  type: "Feature",
  properties: {},
  geometry: { type: "Polygon", coordinates: [[[-180, -85], [180, -85], [180, 85], [-180, 85], [-180, -85]], benin.coordinates[0]] },
};

const LEVEL_COLOR: Record<RiskLevel | "none", string> = {
  danger: "#e8112d",
  caution: "#ffb020",
  clear: "#27c46b",
  none: "#ffd400",
};

function toGeoJSON(parcels: MapParcel[], selected?: string): GeoJSON.FeatureCollection {
  return {
    type: "FeatureCollection",
    features: parcels.map((p) => ({
      type: "Feature",
      properties: { nup: p.nup, color: LEVEL_COLOR[p.level ?? "none"], selected: p.nup === selected },
      geometry: { type: "Polygon", coordinates: [p.polygon] },
    })),
  };
}

function toPoints(parcels: MapParcel[]): GeoJSON.FeatureCollection {
  return {
    type: "FeatureCollection",
    features: parcels.map((p) => {
      const ring = p.polygon.slice(0, -1);
      const lon = ring.reduce((a, c) => a + c[0], 0) / ring.length;
      const lat = ring.reduce((a, c) => a + c[1], 0) / ring.length;
      return { type: "Feature", properties: { nup: p.nup, color: LEVEL_COLOR[p.level ?? "none"] }, geometry: { type: "Point", coordinates: [lon, lat] } };
    }),
  };
}

/** Ajoute ou retire les couches ANDF (sources MVT servies par /api/layers/{id}/tiles). */
function syncLayers(m: MlMap, wanted: string[]) {
  const before = m.getLayer("parcels-fill") ? "parcels-fill" : undefined;
  for (const id of Object.keys(LAYER_COLOR)) {
    const src = `andf-${id}`;
    const on = wanted.includes(id);
    if (on && !m.getSource(src)) {
      m.addSource(src, { type: "vector", tiles: [`${location.origin}/api/layers/${id}/tiles/{z}/{x}/{y}`], minzoom: 6, maxzoom: 16 });
      m.addLayer({ id: `${src}-fill`, type: "fill", source: src, "source-layer": id, paint: { "fill-color": LAYER_COLOR[id], "fill-opacity": 0.22 } }, before);
      m.addLayer({ id: `${src}-line`, type: "line", source: src, "source-layer": id, paint: { "line-color": LAYER_COLOR[id], "line-width": 1.2 } }, before);
    } else if (!on && m.getSource(src)) {
      m.removeLayer(`${src}-line`);
      m.removeLayer(`${src}-fill`);
      m.removeSource(src);
    }
  }
}

function bounds(parcels: MapParcel[]): [[number, number], [number, number]] {
  const xs = parcels.flatMap((p) => p.polygon.map((c) => c[0]));
  const ys = parcels.flatMap((p) => p.polygon.map((c) => c[1]));
  return [
    [Math.min(...xs), Math.min(...ys)],
    [Math.max(...xs), Math.max(...ys)],
  ];
}

export function ParcelMap({
  parcels,
  selected,
  basemap = "satellite",
  year = 2025,
  onSelect,
  padding = 60,
  maxZoom = 16.5,
  className,
  label,
  layers = [],
}: {
  parcels: MapParcel[];
  selected?: string;
  basemap?: Basemap;
  year?: number;
  onSelect?: (nup: string) => void;
  padding?: number;
  maxZoom?: number;
  className?: string;
  label: string;
  /** Couches ANDF (tuiles vectorielles PostGIS) affichées sous les parcelles */
  layers?: string[];
}) {
  const el = useRef<HTMLDivElement>(null);
  const map = useRef<MlMap | null>(null);
  const parcelsRef = useRef(parcels);
  const selectedRef = useRef(selected);
  useEffect(() => {
    parcelsRef.current = parcels;
    selectedRef.current = selected;
  }, [parcels, selected]);
  const layersRef = useRef(layers);
  const onSelectRef = useRef(onSelect);
  useEffect(() => {
    onSelectRef.current = onSelect;
  }, [onSelect]);

  // Création (et recréation au changement de fond)
  useEffect(() => {
    let cancelled = false;
    let ro: ResizeObserver | undefined;
    (async () => {
      const ml = await import("maplibre-gl");
      // ponytail: worker copié par le postinstall (Turbopack ne sait pas bundler le module worker de MapLibre 6)
      ml.setWorkerUrl("/maplibre/maplibre-gl-worker.mjs");
      if (cancelled || !el.current) return;
      const m = new ml.Map({
        container: el.current,
        style:
          basemap === "plan"
            ? "https://tiles.openfreemap.org/styles/liberty"
            : {
                version: 8,
                sources: { s2: { type: "raster", tiles: [s2Tiles(year)], tileSize: 256, maxzoom: 14, attribution: S2_ATTRIBUTION } },
                layers: [{ id: "s2", type: "raster", source: "s2" }],
              },
        bounds: parcels.length ? bounds(parcels) : undefined,
        center: parcels.length ? undefined : [2.35, 6.45],
        zoom: parcels.length ? undefined : 9,
        fitBoundsOptions: { padding, maxZoom },
        maxBounds: BENIN_BOUNDS,
        minZoom: 6,
        attributionControl: { compact: true },
        cooperativeGestures: true,
        locale: {
          "CooperativeGesturesHandler.WindowsHelpText": "Ctrl + molette pour zoomer",
          "CooperativeGesturesHandler.MacHelpText": "⌘ + molette pour zoomer",
          "CooperativeGesturesHandler.MobileHelpText": "Deux doigts pour déplacer la carte",
        },
      });
      m.addControl(new ml.NavigationControl({ showCompass: false }), "top-right");
      // « style.load » plutôt que « load » : n'attend pas que toutes les tuiles du fond soient arrivées
      m.once("style.load", () => {
        // Attribution repliée par défaut (bouton ⓘ) pour ne pas masquer la parcelle
        m.getContainer().querySelector(".maplibregl-ctrl-attrib")?.classList.remove("maplibregl-compact-show");
        // Au-dessus du fond (libellés compris), sous les couches et les parcelles
        m.addSource("hors-benin", { type: "geojson", data: OUTSIDE_BENIN, attribution: "Frontière © geoBoundaries (CC BY 4.0)" });
        m.addLayer({ id: "hors-benin", type: "fill", source: "hors-benin", paint: { "fill-color": basemap === "plan" ? "#e9edf2" : "#06111f", "fill-opacity": basemap === "plan" ? 1 : 0.88 } });
        m.addLayer({ id: "frontiere", type: "line", source: "hors-benin", paint: { "line-color": basemap === "plan" ? "#0b3a6e" : "#ffd400", "line-width": 1.5, "line-opacity": 0.7 } });
        syncLayers(m, layersRef.current);
        m.addSource("parcels", { type: "geojson", data: toGeoJSON(parcels, selected) });
        m.addLayer({
          id: "parcels-fill",
          type: "fill",
          source: "parcels",
          paint: { "fill-color": ["get", "color"], "fill-opacity": ["case", ["get", "selected"], 0.28, 0.14] },
        });
        m.addLayer({
          id: "parcels-line",
          type: "line",
          source: "parcels",
          paint: {
            "line-color": ["get", "color"],
            "line-width": ["case", ["get", "selected"], 3.5, 1.8],
            "line-dasharray": ["case", ["get", "selected"], ["literal", [1, 0]], ["literal", [2, 1.5]]],
          },
        });
        // À petite échelle les parcelles sont invisibles : un point par parcelle jusqu'au zoom 14
        m.addSource("points", { type: "geojson", data: toPoints(parcels) });
        m.addLayer({
          id: "parcels-points",
          type: "circle",
          source: "points",
          maxzoom: 14,
          paint: { "circle-radius": 5, "circle-color": ["get", "color"], "circle-stroke-color": "#06111f", "circle-stroke-width": 1.5 },
        });
        m.on("click", "parcels-points", (e: { features?: { properties?: Record<string, unknown> }[] }) => {
          const nup = e.features?.[0]?.properties?.nup;
          if (nup) onSelectRef.current?.(String(nup));
        });
        m.on("click", "parcels-fill", (e: { features?: { properties?: Record<string, unknown> }[] }) => {
          const nup = e.features?.[0]?.properties?.nup;
          if (nup) onSelectRef.current?.(String(nup));
        });
        m.on("mouseenter", "parcels-fill", () => (m.getCanvas().style.cursor = onSelectRef.current ? "pointer" : ""));
        m.on("mouseleave", "parcels-fill", () => (m.getCanvas().style.cursor = ""));
      });
      map.current = m;
      // Recadrage quand le conteneur prend sa vraie taille (panneaux redimensionnables, onglets…)
      let lastW = 0;
      ro = new ResizeObserver(() => {
        m.resize();
        const w = el.current?.clientWidth ?? 0;
        if (w > 0 && Math.abs(w - lastW) > 40 && parcelsRef.current.length) {
          const focus = parcelsRef.current.find((x) => x.nup === selectedRef.current);
          m.fitBounds(bounds(focus ? [focus] : parcelsRef.current), { padding, maxZoom, duration: 0 });
        }
        lastW = w;
      });
      ro.observe(el.current);
    })();
    return () => {
      cancelled = true;
      ro?.disconnect();
      map.current?.remove();
      map.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- la carte n'est recréée qu'au changement de fond
  }, [basemap]);

  // Couches ANDF
  useEffect(() => {
    layersRef.current = layers;
    const m = map.current;
    if (m?.isStyleLoaded()) syncLayers(m, layers);
  }, [layers]);

  // Données
  useEffect(() => {
    const src = map.current?.getSource("parcels") as GeoJSONSource | undefined;
    src?.setData(toGeoJSON(parcels, selected));
    (map.current?.getSource("points") as GeoJSONSource | undefined)?.setData(toPoints(parcels));
  }, [parcels, selected]);

  // Année d'imagerie
  useEffect(() => {
    const src = map.current?.getSource("s2") as RasterTileSource | undefined;
    src?.setTiles([s2Tiles(year)]);
  }, [year]);

  // Recentrage sur la parcelle sélectionnée
  useEffect(() => {
    const p = parcels.find((x) => x.nup === selected);
    if (p && map.current) map.current.fitBounds(bounds([p]), { padding, maxZoom, duration: 900 });
  }, [selected, parcels, padding, maxZoom]);

  return <div ref={el} role="region" aria-label={label} className={cn("size-full bg-navy-ink", className)} />;
}
