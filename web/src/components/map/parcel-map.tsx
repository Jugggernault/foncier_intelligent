"use client";

import { useEffect, useRef } from "react";
import type { GeoJSONSource, Map as MlMap, RasterTileSource } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import type { RiskLevel } from "@/lib/risk";
import { cn } from "@/lib/utils";

export type MapParcel = { nup: string; polygon: [number, number][]; level?: RiskLevel };
export type Basemap = "satellite" | "plan";

// ponytail: EOX s2cloudless = démo non commerciale (DATA_SOURCES.md § 4) ; bascule vers DE Africa GeoMAD en production
const s2Tiles = (year: number) =>
  `https://tiles.maps.eox.at/wmts/1.0.0/${year === 2016 ? "s2cloudless" : `s2cloudless-${year}`}_3857/default/g/{z}/{y}/{x}.jpg`;
const S2_ATTRIBUTION =
  'Sentinel-2 cloudless © <a href="https://s2maps.eu">EOX IT Services</a> (CC BY-NC-SA 4.0), données Copernicus modifiées';

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
  year = 2024,
  onSelect,
  padding = 60,
  maxZoom = 16.5,
  className,
  label,
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
}) {
  const el = useRef<HTMLDivElement>(null);
  const map = useRef<MlMap | null>(null);
  const onSelectRef = useRef(onSelect);
  onSelectRef.current = onSelect;

  // Création (et recréation au changement de fond)
  useEffect(() => {
    let cancelled = false;
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
                sources: { s2: { type: "raster", tiles: [s2Tiles(year)], tileSize: 256, maxzoom: 15, attribution: S2_ATTRIBUTION } },
                layers: [{ id: "s2", type: "raster", source: "s2" }],
              },
        bounds: parcels.length ? bounds(parcels) : undefined,
        center: parcels.length ? undefined : [2.35, 6.45],
        zoom: parcels.length ? undefined : 9,
        fitBoundsOptions: { padding, maxZoom },
        attributionControl: { compact: true },
        cooperativeGestures: true,
        locale: {
          "CooperativeGesturesHandler.WindowsHelpText": "Ctrl + molette pour zoomer",
          "CooperativeGesturesHandler.MacHelpText": "⌘ + molette pour zoomer",
          "CooperativeGesturesHandler.MobileHelpText": "Deux doigts pour déplacer la carte",
        },
      });
      m.addControl(new ml.NavigationControl({ showCompass: false }), "top-right");
      m.on("load", () => {
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
        m.on("click", "parcels-fill", (e: { features?: { properties?: Record<string, unknown> }[] }) => {
          const nup = e.features?.[0]?.properties?.nup;
          if (nup) onSelectRef.current?.(String(nup));
        });
        m.on("mouseenter", "parcels-fill", () => (m.getCanvas().style.cursor = onSelectRef.current ? "pointer" : ""));
        m.on("mouseleave", "parcels-fill", () => (m.getCanvas().style.cursor = ""));
      });
      map.current = m;
    })();
    return () => {
      cancelled = true;
      map.current?.remove();
      map.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- la carte n'est recréée qu'au changement de fond
  }, [basemap]);

  // Données
  useEffect(() => {
    const src = map.current?.getSource("parcels") as GeoJSONSource | undefined;
    src?.setData(toGeoJSON(parcels, selected));
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
