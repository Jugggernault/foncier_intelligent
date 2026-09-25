import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SpaceBody, SpaceHeader } from "@/components/app/space-header";
import { CompareYears } from "@/components/map/compare-years";
import { buttonVariants } from "@/components/ui/button";
import { WATCHED } from "@/lib/data/citizen";
import { alertLabel, fmtDate } from "@/lib/labels";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Alerte · Foncier Intelligent" };

export default async function AlertPage({ params }: PageProps<"/espace/alertes/[id]">) {
  const { id } = await params;
  const hit = WATCHED.flatMap((w) => w.parcel.alerts.map((a) => ({ a, p: w.parcel }))).find((x) => x.a.id === id);
  if (!hit) notFound();
  const { a, p } = hit;
  const year = Number(a.date.slice(0, 4));

  return (
    <>
      <SpaceHeader title={`${alertLabel[a.kind]} sur ${p.nup}`} lead={`${a.text} Détecté le ${fmtDate(a.date, "long")}, confiance ${Math.round(a.confidence * 100)} %.`}>
        <Link href={`/parcelle/${p.nup}`} className={cn(buttonVariants({ variant: "outline", size: "lg" }), "h-10 px-4")}>Fiche de la parcelle</Link>
        <Link href="/espace/litiges/nouveau" className={cn(buttonVariants({ size: "lg" }), "h-10 px-4")}>Signaler un empiètement</Link>
      </SpaceHeader>
      <SpaceBody>
        <div className="max-w-5xl">
          <CompareYears parcel={{ nup: p.nup, polygon: p.polygon, level: "caution" }} before={Math.max(2017, Math.min(year, 2025) - 4)} after={2025} />
          <p className="mt-4 text-sm text-muted-foreground">
            Une alerte déclenche une vérification, jamais une sanction. Si le changement est normal (vos propres travaux, par exemple), vous pouvez l&apos;ignorer.
          </p>
        </div>
      </SpaceBody>
    </>
  );
}
