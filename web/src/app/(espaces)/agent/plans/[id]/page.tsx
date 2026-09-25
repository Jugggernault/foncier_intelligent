import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SpaceBody, SpaceHeader } from "@/components/app/space-header";
import { ParcelMap } from "@/components/map/parcel-map";
import { PrecheckReport } from "@/components/parcel/precheck-report";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getPlan, PLAN_STATUS } from "@/lib/data/plans";
import { fmtDate, titleCase } from "@/lib/labels";
import { cn } from "@/lib/utils";
import { PlanDecision } from "./plan-decision";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: PageProps<"/agent/plans/[id]">): Promise<Metadata> {
  return { title: `Plan P-${(await params).id} · Espace agent` };
}

export default async function AgentPlan({ params }: PageProps<"/agent/plans/[id]">) {
  const p = await getPlan(Number((await params).id));
  if (!p) notFound();
  const blocking = p.precheck.checks.some((c) => c.status === "fail");
  return (
    <>
      <SpaceHeader title={`Plan P-${p.id}`} lead={`Transmis par ${p.surveyor} le ${fmtDate(p.createdAt.toISOString(), "long")}${p.commune ? ` · ${titleCase(p.commune)}` : ""} · ${p.areaM2} m² calculés${p.declaredM2 ? `, ${p.declaredM2} m² déclarés` : ""}.`}>
        <Badge className={cn("rounded-sm", PLAN_STATUS[p.status].className)}>{PLAN_STATUS[p.status].label}</Badge>
      </SpaceHeader>
      <SpaceBody>
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="space-y-6">
            <section className="rounded-lg border bg-card p-5"><PrecheckReport report={p.precheck} title="Rapport de pré-contrôle" /></section>
            {p.status === "recu" ? <PlanDecision id={p.id} blocking={blocking} /> : p.note && <p className="text-sm text-muted-foreground">Motif transmis au géomètre : {p.note}</p>}
            <section>
              <h2 className="font-bold text-navy">Bornes (UTM 31N)</h2>
              <div className="mt-2 max-h-72 overflow-auto rounded-lg border bg-card">
                <Table>
                  <TableHeader><TableRow><TableHead className="pl-4">Borne</TableHead><TableHead className="text-right">X</TableHead><TableHead className="pr-4 text-right">Y</TableHead></TableRow></TableHeader>
                  <TableBody>
                    {p.bornes.map(([x, y], i) => (
                      <TableRow key={i}><TableCell className="pl-4">B{i + 1}</TableCell><TableCell className="tabular text-right">{x.toFixed(2)}</TableCell><TableCell className="tabular pr-4 text-right">{y.toFixed(2)}</TableCell></TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </section>
          </div>
          <div className="aspect-square overflow-hidden rounded-lg border lg:sticky lg:top-20">
            <ParcelMap
              parcels={[{ nup: `P-${p.id}`, polygon: p.ring, level: blocking ? "danger" : p.rejectRisk > 0.3 ? "caution" : "clear" }]}
              selected={`P-${p.id}`}
              layers={p.precheck.hits.map((h) => h.layerId)}
              padding={80}
              label={`Plan P-${p.id} sur imagerie satellite`}
            />
          </div>
        </div>
      </SpaceBody>
    </>
  );
}
