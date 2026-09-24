import type { Metadata } from "next";
import Link from "next/link";
import { AlertTriangleIcon, ArrowRightIcon, MegaphoneIcon, TimerIcon } from "lucide-react";
import { SpaceBody, SpaceHeader } from "@/components/app/space-header";
import { StatusBadge } from "@/components/app/workflow-bits";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Item, ItemActions, ItemContent, ItemDescription, ItemGroup, ItemMedia, ItemTitle } from "@/components/ui/item";
import { ENCROACHMENTS } from "@/lib/data/agent";
import { isPublicityOpen, listParcels } from "@/lib/data/parcels";
import { KIND_LABEL, listDossiers } from "@/lib/data/workflow";
import { daysUntil, fmtDate } from "@/lib/labels";

export const metadata: Metadata = { title: "Ma journée · Espace agent" };

export default function AgentHome() {
  const queue = listDossiers()
    .filter((d) => ["depose", "instruction", "complement"].includes(d.status))
    .sort((a, b) => b.anomalyScore - a.anomalyScore || a.dueAt.localeCompare(b.dueAt));
  const closing = listParcels().filter((p) => isPublicityOpen(p)).sort((a, b) => a.procedure!.publicity.end.localeCompare(b.procedure!.publicity.end)).slice(0, 5);
  const fresh = ENCROACHMENTS.filter((e) => e.status === "nouvelle");

  return (
    <>
      <SpaceHeader title="Ma journée" lead={`${queue.length} dossiers à instruire, ${closing.length} publicités qui se terminent bientôt, ${fresh.length} nouvelles alertes d'empiètement.`} />
      <SpaceBody>
        <div className="grid gap-6 xl:grid-cols-12">
          <Card className="rounded-lg xl:col-span-7">
            <CardHeader>
              <CardTitle className="text-base">À traiter en priorité</CardTitle>
              <CardAction><Link href="/agent/dossiers" className="text-sm font-medium text-navy hover:underline">File complète</Link></CardAction>
            </CardHeader>
            <CardContent>
              <p className="mb-3 text-xs text-muted-foreground">Classés par le copilote : anomalies d&apos;abord, puis échéance.</p>
              <ItemGroup className="gap-2">
                {queue.slice(0, 7).map((d) => (
                  <Item key={d.id} variant="outline" render={<Link href={`/agent/dossiers/${d.id}`} />}>
                    <ItemContent>
                      <ItemTitle><span className="tabular">{d.id}</span> · {KIND_LABEL[d.kind]}</ItemTitle>
                      <ItemDescription>{d.applicant} · parcelle <span className="tabular">{d.nup}</span> · anomalies {Math.round(d.anomalyScore * 100)}</ItemDescription>
                    </ItemContent>
                    <ItemActions><StatusBadge status={d.status} /><ArrowRightIcon className="size-4 text-muted-foreground" /></ItemActions>
                  </Item>
                ))}
              </ItemGroup>
            </CardContent>
          </Card>
          <div className="space-y-6 xl:col-span-5">
            <Card className="rounded-lg">
              <CardHeader>
                <CardTitle className="text-base">Publicités qui se terminent</CardTitle>
                <CardAction><Link href="/agent/publicite" className="text-sm font-medium text-navy hover:underline">Toutes</Link></CardAction>
              </CardHeader>
              <CardContent>
                <ItemGroup className="gap-1">
                  {closing.map((p) => (
                    <Item key={p.nup} size="sm" render={<Link href={`/agent/publicite/${p.nup}`} />}>
                      <ItemMedia variant="icon"><MegaphoneIcon /></ItemMedia>
                      <ItemContent>
                        <ItemTitle className="tabular">{p.nup}</ItemTitle>
                        <ItemDescription>{p.quartier}, {p.commune}</ItemDescription>
                      </ItemContent>
                      <ItemActions className="text-xs text-muted-foreground"><TimerIcon className="size-3.5" />{daysUntil(p.procedure!.publicity.end)} j</ItemActions>
                    </Item>
                  ))}
                </ItemGroup>
              </CardContent>
            </Card>
            <Card className="rounded-lg">
              <CardHeader>
                <CardTitle className="text-base">Nouvelles alertes d&apos;empiètement</CardTitle>
                <CardAction><Link href="/agent/alertes" className="text-sm font-medium text-navy hover:underline">Carte</Link></CardAction>
              </CardHeader>
              <CardContent>
                <ItemGroup className="gap-1">
                  {fresh.slice(0, 4).map((e) => (
                    <Item key={e.id} size="sm" render={<Link href={`/agent/alertes/${e.id}`} />}>
                      <ItemMedia variant="icon" className="text-danger"><AlertTriangleIcon /></ItemMedia>
                      <ItemContent>
                        <ItemTitle>{e.zone} · <span className="tabular">{e.nup}</span></ItemTitle>
                        <ItemDescription>{e.areaM2} m² bâtis · confiance {Math.round(e.confidence * 100)} %</ItemDescription>
                      </ItemContent>
                      <ItemActions className="text-xs text-muted-foreground">{fmtDate(e.detected)}</ItemActions>
                    </Item>
                  ))}
                </ItemGroup>
              </CardContent>
            </Card>
          </div>
        </div>
      </SpaceBody>
    </>
  );
}
