import type { Metadata } from "next";
import Link from "next/link";
import { SpaceBody, SpaceHeader } from "@/components/app/space-header";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { listPlans, PLAN_STATUS } from "@/lib/data/plans";
import { SURVEYS } from "@/lib/data/pro";
import { requirePersona } from "@/lib/session";
import { fmtDate, titleCase } from "@/lib/labels";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Mes levés · Espace professionnel" };

const LABEL = { brouillon: "Brouillon", controle: "Contrôlé", transmis: "Transmis" };

export default async function Surveys() {
  const persona = await requirePersona("pro");
  const plans = await listPlans(persona.name);
  return (
    <>
      <SpaceHeader title="Mes levés" lead="Import, contrôle topologique automatique et transmission au cadastre.">
        <Link href="/pro/leves/nouveau" className={cn(buttonVariants({ size: "lg" }), "h-10 px-4")}>Importer un levé</Link>
      </SpaceHeader>
      <SpaceBody>
        {plans.length > 0 && (
          <section className="mb-10 max-w-5xl">
            <h2 className="font-bold text-navy">Transmis au cadastre</h2>
            <div className="mt-3 overflow-x-auto rounded-lg border bg-card">
              <Table>
                <TableHeader><TableRow><TableHead className="pl-4">Plan</TableHead><TableHead>Commune</TableHead><TableHead className="text-right">Surface</TableHead><TableHead className="text-right">Risque de rejet</TableHead><TableHead className="pr-4">Décision de l&apos;ANDF</TableHead></TableRow></TableHeader>
                <TableBody>
                  {plans.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell className="pl-4 tabular font-semibold text-navy">P-{p.id}<span className="block text-xs font-normal text-muted-foreground">{fmtDate(p.createdAt.toISOString())}</span></TableCell>
                      <TableCell>{p.commune ? titleCase(p.commune) : "—"}</TableCell>
                      <TableCell className="tabular text-right">{p.areaM2} m²</TableCell>
                      <TableCell className="tabular text-right">{Math.round(p.rejectRisk * 100)} %</TableCell>
                      <TableCell className="pr-4">
                        <Badge className={cn("rounded-sm", PLAN_STATUS[p.status].className)}>{PLAN_STATUS[p.status].label}</Badge>
                        {p.note && <span className="mt-1 block text-xs text-muted-foreground">{p.note}</span>}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </section>
        )}
        <h2 className="mb-3 font-bold text-navy">Levés du cabinet</h2>
        <div className="max-w-5xl overflow-x-auto rounded-lg border bg-card">
          <Table>
            <TableHeader><TableRow><TableHead className="pl-4">Levé</TableHead><TableHead>Parcelle</TableHead><TableHead>Client</TableHead><TableHead>Sommets</TableHead><TableHead>Contrôle</TableHead><TableHead className="pr-4">État</TableHead></TableRow></TableHeader>
            <TableBody>
              {SURVEYS.map((s) => (
                <TableRow key={s.id}>
                  <TableCell className="pl-4"><Link href={`/pro/leves/${s.id}`} className="tabular font-semibold text-navy hover:underline">{s.id}</Link></TableCell>
                  <TableCell className="tabular">{s.nup}</TableCell>
                  <TableCell>{s.client}</TableCell>
                  <TableCell className="tabular">{s.points}</TableCell>
                  <TableCell>{s.issues ? <Badge className="rounded-sm bg-caution-soft text-caution">1 chevauchement</Badge> : <Badge className="rounded-sm bg-clear-soft text-clear">Conforme</Badge>}</TableCell>
                  <TableCell className="pr-4">{LABEL[s.status]} · {fmtDate(s.date)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </SpaceBody>
    </>
  );
}
