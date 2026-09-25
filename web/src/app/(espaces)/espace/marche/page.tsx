import { verdictFn } from "@/lib/geo/verdict";
import type { Metadata } from "next";
import { SpaceBody, SpaceHeader } from "@/components/app/space-header";
import { ParcelRow } from "@/components/parcel/parcel-row";
import { Badge } from "@/components/ui/badge";
import { ItemGroup } from "@/components/ui/item";
import { allParcels } from "@/lib/data/parcels";
import { fmtFcfa } from "@/lib/labels";

export const metadata: Metadata = { title: "Parcelles recommandées · Foncier Intelligent" };

export default async function Market() {
  const judge = await verdictFn();
  // ponytail: « recommandation » = filtre feu vert + tri par prix ; moteur de recommandation prévu en V3 (IA-16)
  const picks = allParcels()
    .filter((p) => p.landUse === "urbain" && judge(p).level === "clear")
    .sort((a, b) => a.pricePerM2.low * a.areaM2 - b.pricePerM2.low * b.areaM2)
    .slice(0, 12);
  return (
    <>
      <SpaceHeader title="Parcelles recommandées" lead="Uniquement des parcelles au verdict vert, mises en vente volontairement par leur titulaire. Fonctionnalité en préparation : annonces de démonstration.">
        <Badge variant="secondary" className="rounded-sm">Bientôt</Badge>
      </SpaceHeader>
      <SpaceBody>
        <ItemGroup className="max-w-4xl gap-2">
          {picks.map((p) => (
            <ParcelRow key={p.nup} parcel={p} aside={<span className="tabular text-sm font-semibold text-navy">à partir de {fmtFcfa(p.pricePerM2.low * p.areaM2)}</span>} />
          ))}
        </ItemGroup>
      </SpaceBody>
    </>
  );
}
