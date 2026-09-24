import type { Metadata } from "next";
import Link from "next/link";
import { SpaceBody, SpaceHeader } from "@/components/app/space-header";
import { buttonVariants } from "@/components/ui/button";
import { getParcel, isPublicityOpen } from "@/lib/data/parcels";
import { fmtDate, procedureLabel } from "@/lib/labels";
import { cn } from "@/lib/utils";
import { OppositionForm } from "./opposition-form";

export const metadata: Metadata = { title: "Faire opposition · Foncier Intelligent" };

export default async function NewOpposition({ searchParams }: PageProps<"/espace/oppositions/nouvelle">) {
  const nup = String((await searchParams).nup ?? "");
  const p = getParcel(nup);
  if (!p?.procedure || !isPublicityOpen(p))
    return (
      <>
        <SpaceHeader title="Faire opposition" lead="Choisissez un avis de publicité foncière ouvert." />
        <SpaceBody>
          <Link href="/publicite" className={cn(buttonVariants({ size: "lg" }), "h-11 px-5")}>Voir les avis ouverts</Link>
        </SpaceBody>
      </>
    );
  return (
    <>
      <SpaceHeader
        title={`Opposition à l'avis n° ${p.procedure.requestNumber}`}
        lead={`${procedureLabel(p.procedure)} · parcelle ${p.nup}, ${p.quartier}. À déposer avant le ${fmtDate(p.procedure.publicity.end, "long")}.`}
      />
      <SpaceBody>
        <OppositionForm nup={p.nup} requestNumber={p.procedure.requestNumber} deadline={fmtDate(p.procedure.publicity.end, "long")} />
      </SpaceBody>
    </>
  );
}
