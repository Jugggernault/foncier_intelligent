import type { Metadata } from "next";
import { SpaceBody, SpaceHeader } from "@/components/app/space-header";
import { ParcelRow } from "@/components/parcel/parcel-row";
import { ItemGroup } from "@/components/ui/item";
import { allParcels } from "@/lib/data/parcels";

export const metadata: Metadata = { title: "Patrimoine communal · Espace commune" };

export default function Heritage() {
  const plots = allParcels().filter((p) => p.right === "etat").slice(0, 10);
  return (
    <>
      <SpaceHeader title="Patrimoine public" lead="Parcelles publiques sur le territoire communal, surveillées par satellite contre les occupations illégales." />
      <SpaceBody>
        <ItemGroup className="max-w-4xl gap-2">{plots.map((p) => <ParcelRow key={p.nup} parcel={p} />)}</ItemGroup>
      </SpaceBody>
    </>
  );
}
