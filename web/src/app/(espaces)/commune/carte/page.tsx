import { verdictFn } from "@/lib/geo/verdict";
import type { Metadata } from "next";
import { SpaceBody, SpaceHeader } from "@/components/app/space-header";
import { LinkedMap } from "@/components/map/linked-map";
import { communeLitiges, communeParcels } from "@/lib/data/commune";
import { getParcel } from "@/lib/data/parcels";

export const metadata: Metadata = { title: "Carte communale · Espace commune" };

export default async function CommuneMap() {
  const judge = await verdictFn();
  const parcels = communeParcels();
  const disputed = communeLitiges().map((l) => getParcel(l.nup)!).filter(Boolean);
  const all = [...new Map([...parcels, ...disputed].map((p) => [p.nup, p])).values()];
  return (
    <>
      <SpaceHeader title="Carte communale" lead="Parcelles de la commune colorées par verdict : les foyers rouges signalent litiges et terrains de l'État convoités." />
      <SpaceBody>
        <div className="h-[70dvh] overflow-hidden rounded-lg border">
          <LinkedMap parcels={all.map((p) => ({ nup: p.nup, polygon: p.polygon, level: judge(p).level }))} hrefBase="/parcelle" label="Carte communale" />
        </div>
      </SpaceBody>
    </>
  );
}
