import type { Metadata } from "next";
import { MapExplorer, type ExplorerParcel } from "@/components/map/map-explorer";
import { isPublicityOpen, listParcels } from "@/lib/data/parcels";
import { fmtArea, rightLabel } from "@/lib/labels";
import { assess } from "@/lib/risk";
import { listLayers } from "@/lib/geo/layers";

// Les fenêtres de publicité dépendent du jour : régénération horaire.
export const revalidate = 3600;

export const metadata: Metadata = { title: "Carte des parcelles · Foncier Intelligent" };

export default async function MapPage() {
  const parcels: ExplorerParcel[] = listParcels().map((p) => {
    const r = assess(p);
    return {
      nup: p.nup,
      polygon: p.polygon,
      level: r.level,
      commune: p.commune,
      quartier: p.quartier,
      area: fmtArea(p.areaM2),
      right: rightLabel(p),
      headline: r.headline,
      alert: p.alerts.length > 0,
      publicity: isPublicityOpen(p),
    };
  });
  const layers = (await listLayers()).map(({ id, label, severity }) => ({ id, label, severity }));
  return <MapExplorer parcels={parcels} layers={layers} />;
}
