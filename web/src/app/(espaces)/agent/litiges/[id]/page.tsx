import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SpaceBody, SpaceHeader } from "@/components/app/space-header";
import { LitigeBadge } from "@/components/app/workflow-bits";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getLitige, LITIGES } from "@/lib/data/workflow";
import { disputeLabel, fmtDate } from "@/lib/labels";

export const metadata: Metadata = { title: "Litige · Espace agent" };

export default async function AgentLitige({ params }: PageProps<"/agent/litiges/[id]">) {
  const l = getLitige((await params).id);
  if (!l) notFound();
  const similar = LITIGES.filter((x) => x.kind === l.kind && x.id !== l.id).slice(0, 3);
  return (
    <>
      <SpaceHeader title={`${disputeLabel[l.kind]} · ${l.id}`} lead={`Parcelle ${l.nup} · ouvert le ${fmtDate(l.opened, "long")} · ${l.parties.join(" c/ ")}`}>
        <LitigeBadge status={l.status} />
      </SpaceHeader>
      <SpaceBody>
        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="rounded-lg lg:col-span-2">
            <CardHeader><CardTitle className="text-base">Faits</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <p>{l.summary}</p>
              <Link href={`/agent/parcelles/${l.nup}`} className="text-sm font-medium text-navy hover:underline">Fiche interne de la parcelle</Link>
            </CardContent>
          </Card>
          <Card className="rounded-lg bg-sky">
            <CardHeader><CardTitle className="text-base">Analyse IA</CardTitle></CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p className="font-semibold">{l.aiCategory?.label} · {Math.round((l.aiCategory?.confidence ?? 0) * 100)} %</p>
              <p>Orientation suggérée : {l.kind === "limites" ? "médiation CoGeF" : l.kind === "succession" ? "tribunal" : "Commission de gestion des plaintes"}.</p>
              <p className="pt-2 font-semibold">Cas similaires</p>
              <ul className="space-y-1">
                {similar.map((s) => (
                  <li key={s.id}><Link href={`/agent/litiges/${s.id}`} className="tabular text-navy hover:underline">{s.id}</Link> · {s.status === "clos" ? "clos" : "en cours"}</li>
                ))}
                {!similar.length && <li className="text-muted-foreground">Aucun cas comparable.</li>}
              </ul>
            </CardContent>
          </Card>
        </div>
      </SpaceBody>
    </>
  );
}
