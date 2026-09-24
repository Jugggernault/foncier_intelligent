import type { Metadata } from "next";
import Link from "next/link";
import { SpaceBody, SpaceHeader } from "@/components/app/space-header";
import { SimpleBarChart } from "@/components/app/bar-chart";
import { StatusBadge } from "@/components/app/workflow-bits";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Item, ItemActions, ItemContent, ItemDescription, ItemGroup, ItemTitle } from "@/components/ui/item";
import { COMMUNE, communeDossiers, communeLitiges, communeParcels, MEDIATIONS, TFU_CANDIDATES } from "@/lib/data/commune";
import { KIND_LABEL } from "@/lib/data/workflow";
import { disputeLabel, fmtDate, fmtFcfa } from "@/lib/labels";

export const metadata: Metadata = { title: "Tableau de bord · Espace commune" };

export default function CommuneHome() {
  const litiges = communeLitiges();
  const byKind = Object.entries(disputeLabel).map(([k, name]) => ({ name, value: litiges.filter((l) => l.kind === k).length }));
  const next = MEDIATIONS.filter((m) => m.status === "planifiee").slice(0, 3);
  const tfu = TFU_CANDIDATES.reduce((s, c) => s + c.estimatedTax, 0);
  return (
    <>
      <SpaceHeader
        title={`Commune de ${COMMUNE}`}
        lead={`${communeParcels().length} parcelles suivies, ${communeDossiers().length} dossiers en cours, ${litiges.length} litiges, environ ${fmtFcfa(tfu)} de TFU potentielle non recouvrée.`}
      />
      <SpaceBody>
        <div className="grid gap-6 xl:grid-cols-12">
          <Card className="rounded-lg xl:col-span-7">
            <CardHeader><CardTitle className="text-base">Litiges par type</CardTitle></CardHeader>
            <CardContent><SimpleBarChart data={byKind} label="Litiges" /></CardContent>
          </Card>
          <Card className="rounded-lg xl:col-span-5">
            <CardHeader>
              <CardTitle className="text-base">Prochaines médiations</CardTitle>
              <CardAction><Link href="/commune/mediations" className="text-sm font-medium text-navy hover:underline">Calendrier</Link></CardAction>
            </CardHeader>
            <CardContent>
              <ItemGroup className="gap-2">
                {next.map((m) => (
                  <Item key={m.id} variant="outline" render={<Link href={`/commune/mediations/${m.id}`} />}>
                    <ItemContent>
                      <ItemTitle>{fmtDate(m.date, "long")}</ItemTitle>
                      <ItemDescription>{m.place} · litige {m.litige}</ItemDescription>
                    </ItemContent>
                  </Item>
                ))}
                {!next.length && <p className="text-sm text-muted-foreground">Aucune séance planifiée.</p>}
              </ItemGroup>
            </CardContent>
          </Card>
          <Card className="rounded-lg xl:col-span-12">
            <CardHeader><CardTitle className="text-base">Dossiers fonciers de la commune</CardTitle></CardHeader>
            <CardContent>
              <ItemGroup className="grid gap-2 md:grid-cols-2 xl:grid-cols-3">
                {communeDossiers().slice(0, 6).map((d) => (
                  <Item key={d.id} variant="outline">
                    <ItemContent>
                      <ItemTitle className="tabular">{d.id}</ItemTitle>
                      <ItemDescription>{KIND_LABEL[d.kind]} · {d.nup}</ItemDescription>
                    </ItemContent>
                    <ItemActions><StatusBadge status={d.status} /></ItemActions>
                  </Item>
                ))}
              </ItemGroup>
            </CardContent>
          </Card>
        </div>
      </SpaceBody>
    </>
  );
}
