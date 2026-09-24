import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarIcon } from "lucide-react";
import { SpaceBody, SpaceHeader } from "@/components/app/space-header";
import { LitigeBadge } from "@/components/app/workflow-bits";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { myLitiges } from "@/lib/data/citizen";
import { disputeLabel, fmtDate } from "@/lib/labels";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Litige · Foncier Intelligent" };

export default async function MyLitige({ params }: PageProps<"/espace/litiges/[id]">) {
  const { id } = await params;
  const l = myLitiges().find((x) => x.id === id);
  if (!l) notFound();
  return (
    <>
      <SpaceHeader title={`${disputeLabel[l.kind]} · ${l.id}`} lead={`Parcelle ${l.nup} · ouvert le ${fmtDate(l.opened, "long")}`}>
        <LitigeBadge status={l.status} />
      </SpaceHeader>
      <SpaceBody>
        <div className="grid max-w-5xl gap-6 lg:grid-cols-2">
          <Card className="rounded-lg">
            <CardHeader><CardTitle className="text-base">Résumé</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <p>{l.summary}</p>
              <p className="text-sm text-muted-foreground">Parties : {l.parties.join(" et ")}</p>
              <Link href={`/parcelle/${l.nup}`} className={cn(buttonVariants({ variant: "outline" }))}>Voir la parcelle</Link>
            </CardContent>
          </Card>
          {l.nextStep && (
            <Card className="rounded-lg">
              <CardHeader><CardTitle className="text-base">Prochaine étape</CardTitle></CardHeader>
              <CardContent className="flex items-start gap-3">
                <CalendarIcon className="mt-0.5 size-5 text-navy" />
                <div>
                  <p className="font-semibold">{l.nextStep.label}</p>
                  <p className="text-muted-foreground">{fmtDate(l.nextStep.date, "long")}</p>
                  <p className="mt-3 text-sm text-muted-foreground">Apportez vos titres, actes et tout témoignage utile.</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </SpaceBody>
    </>
  );
}
