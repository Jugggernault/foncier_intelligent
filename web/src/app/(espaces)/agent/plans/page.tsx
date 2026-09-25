import type { Metadata } from "next";
import Link from "next/link";
import { SpaceBody, SpaceHeader } from "@/components/app/space-header";
import { Badge } from "@/components/ui/badge";
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from "@/components/ui/empty";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { listPlans, PLAN_STATUS } from "@/lib/data/plans";
import { fmtDate, titleCase } from "@/lib/labels";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Plans des géomètres · Espace agent" };
export const dynamic = "force-dynamic";

export default async function AgentPlans() {
  const plans = await listPlans();
  return (
    <>
      <SpaceHeader title="Plans des géomètres" lead="Chaque plan arrive avec son rapport de pré-contrôle : géométrie, surface, zones bloquantes, chevauchements et risque de rejet appris sur les décisions de la commune." />
      <SpaceBody>
        {plans.length ? (
          <div className="max-w-6xl overflow-x-auto rounded-lg border bg-card">
            <Table>
              <TableHeader>
                <TableRow><TableHead className="pl-4">Plan</TableHead><TableHead>Géomètre</TableHead><TableHead>Commune</TableHead><TableHead className="text-right">Surface</TableHead><TableHead>Pré-contrôle</TableHead><TableHead className="pr-4">Statut</TableHead></TableRow>
              </TableHeader>
              <TableBody>
                {plans.map((p) => {
                  const fails = p.precheck.checks.filter((c) => c.status === "fail").length;
                  const warns = p.precheck.checks.filter((c) => c.status === "warn").length;
                  return (
                    <TableRow key={p.id}>
                      <TableCell className="pl-4">
                        <Link href={`/agent/plans/${p.id}`} className="tabular font-semibold text-navy hover:underline">P-{p.id}</Link>
                        <span className="block text-xs text-muted-foreground">{fmtDate(p.createdAt.toISOString())}</span>
                      </TableCell>
                      <TableCell>{p.surveyor}</TableCell>
                      <TableCell>{p.commune ? titleCase(p.commune) : "—"}</TableCell>
                      <TableCell className="tabular text-right">{p.areaM2} m²</TableCell>
                      <TableCell>
                        <span className={cn("tabular text-sm font-semibold", p.rejectRisk > 0.6 ? "text-danger" : p.rejectRisk > 0.3 ? "text-caution" : "text-clear")}>{Math.round(p.rejectRisk * 100)} %</span>
                        <span className="ml-2 text-xs text-muted-foreground">{fails ? `${fails} bloquant${fails > 1 ? "s" : ""}` : warns ? `${warns} à vérifier` : "conforme"}</span>
                      </TableCell>
                      <TableCell className="pr-4"><Badge className={cn("rounded-sm", PLAN_STATUS[p.status].className)}>{p.status === "recu" ? "À examiner" : PLAN_STATUS[p.status].label}</Badge></TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        ) : (
          <Empty className="max-w-xl border">
            <EmptyHeader>
              <EmptyTitle>Aucun plan reçu</EmptyTitle>
              <EmptyDescription>Les plans transmis depuis l&apos;espace géomètre (« Pré-contrôler un plan ») arrivent ici avec leur rapport.</EmptyDescription>
            </EmptyHeader>
          </Empty>
        )}
      </SpaceBody>
    </>
  );
}
