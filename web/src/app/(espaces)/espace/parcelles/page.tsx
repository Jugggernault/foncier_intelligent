import type { Metadata } from "next";
import { SpaceBody, SpaceHeader } from "@/components/app/space-header";
import { LinkedMap } from "@/components/map/linked-map";
import { ParcelRow } from "@/components/parcel/parcel-row";
import { ItemGroup } from "@/components/ui/item";
import { OWNED } from "@/lib/data/citizen";
import { assess } from "@/lib/risk";

export const metadata: Metadata = { title: "Mes parcelles · Foncier Intelligent" };

export default function MyParcels() {
  return (
    <>
      <SpaceHeader title="Mes parcelles" lead="Les parcelles dont vous êtes titulaire ou présumée propriétaire, rattachées à votre NPI." />
      <SpaceBody>
        <div className="grid gap-6 lg:grid-cols-12">
          <ItemGroup className="gap-2 lg:col-span-6">
            {OWNED.map((p) => (
              <ParcelRow key={p.nup} parcel={p} href={`/espace/parcelles/${p.nup}`} />
            ))}
          </ItemGroup>
          <div className="aspect-square overflow-hidden rounded-lg border lg:col-span-6">
            <LinkedMap
              parcels={OWNED.map((p) => ({ nup: p.nup, polygon: p.polygon, level: assess(p).level }))}
              hrefBase="/espace/parcelles"
              label="Carte de mes parcelles"
            />
          </div>
        </div>
      </SpaceBody>
    </>
  );
}
