import type { Metadata } from "next";
import Link from "next/link";
import { ShieldCheckIcon } from "lucide-react";
import { SpaceBody, SpaceHeader } from "@/components/app/space-header";
import { ParcelRow } from "@/components/parcel/parcel-row";
import { buttonVariants } from "@/components/ui/button";
import { ItemGroup } from "@/components/ui/item";
import { VERIFICATIONS } from "@/lib/data/citizen";
import { getParcel } from "@/lib/data/parcels";
import { fmtDate } from "@/lib/labels";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Mes vérifications · Foncier Intelligent" };

export default function Verifications() {
  return (
    <>
      <SpaceHeader title="Mes vérifications" lead="Les rapports que vous avez générés avant un achat ou pour un dossier.">
        <Link href="/espace/verifications/nouvelle" className={cn(buttonVariants({ size: "lg" }), "h-10 bg-signal px-4 font-bold text-signal-ink hover:bg-[#ffe033]")}>
          <ShieldCheckIcon data-icon="inline-start" /> Nouvelle vérification
        </Link>
      </SpaceHeader>
      <SpaceBody>
        <ItemGroup className="max-w-4xl gap-2">
          {VERIFICATIONS.map((v) => {
            const p = getParcel(v.nup);
            return p ? (
              <ParcelRow
                key={v.id}
                parcel={p}
                href={`/parcelle/${v.nup}/rapport`}
                aside={<span className="text-right text-xs text-muted-foreground">{v.note}<br />{v.id} · {fmtDate(v.date)}</span>}
              />
            ) : null;
          })}
        </ItemGroup>
      </SpaceBody>
    </>
  );
}
