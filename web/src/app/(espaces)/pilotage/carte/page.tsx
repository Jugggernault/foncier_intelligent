import { verdictFn } from "@/lib/geo/verdict";
import type { Metadata } from "next";
import { SpaceBody, SpaceHeader } from "@/components/app/space-header";
import { LinkedMap } from "@/components/map/linked-map";
import { listParcels } from "@/lib/data/parcels";

export const metadata: Metadata = { title: "Carte nationale · Pilotage" };

export default async function NationalMap() {
  const judge = await verdictFn();
  return (
    <>
      <SpaceHeader title="Carte nationale" lead="Toutes les parcelles connues, colorées par verdict. Couverture cadastrale : 12 communes e-Foncier, 14 au programme Terra Benin." />
      <SpaceBody>
        <div className="h-[72dvh] overflow-hidden rounded-lg border">
          <LinkedMap parcels={listParcels().map((p) => ({ nup: p.nup, polygon: p.polygon, level: judge(p).level }))} hrefBase="/parcelle" label="Carte nationale des parcelles" />
        </div>
      </SpaceBody>
    </>
  );
}
