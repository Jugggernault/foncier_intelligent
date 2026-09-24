import type { Metadata } from "next";
import Link from "next/link";
import { SpaceBody, SpaceHeader } from "@/components/app/space-header";
import { ParcelRow } from "@/components/parcel/parcel-row";
import { buttonVariants } from "@/components/ui/button";
import { ItemGroup } from "@/components/ui/item";
import { MUTATIONS } from "@/lib/data/pro";
import { getParcel } from "@/lib/data/parcels";
import { fmtDate } from "@/lib/labels";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Vérifications · Espace professionnel" };

export default function DueDiligence() {
  return (
    <>
      <SpaceHeader title="Vérifications" lead="Rapports horodatés à joindre à l'acte ou au dossier de crédit.">
        <Link href="/pro/due-diligence/nouvelle" className={cn(buttonVariants({ size: "lg" }), "h-10 px-4")}>Nouvelle vérification</Link>
      </SpaceHeader>
      <SpaceBody>
        <ItemGroup className="max-w-4xl gap-2">
          {MUTATIONS.map((m) => (
            <ParcelRow key={m.id} parcel={getParcel(m.nup)!} href={`/parcelle/${m.nup}/rapport`} aside={<span className="text-xs text-muted-foreground">{fmtDate(m.date)}</span>} />
          ))}
        </ItemGroup>
      </SpaceBody>
    </>
  );
}
