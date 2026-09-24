import type { Metadata } from "next";
import Link from "next/link";
import { SpaceBody, SpaceHeader } from "@/components/app/space-header";
import { LitigeBadge } from "@/components/app/workflow-bits";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { LITIGES } from "@/lib/data/workflow";
import { fmtDate } from "@/lib/labels";

export const metadata: Metadata = { title: "Litiges · Espace agent" };

export default function AgentLitiges() {
  return (
    <>
      <SpaceHeader title="Litiges" lead="Classés automatiquement par type ; l'agent confirme l'orientation." />
      <SpaceBody>
        <div className="overflow-x-auto rounded-lg border bg-card">
          <Table>
            <TableHeader><TableRow><TableHead className="pl-4">Litige</TableHead><TableHead>Parcelle</TableHead><TableHead>Type (IA)</TableHead><TableHead>Ouvert le</TableHead><TableHead>Prochaine étape</TableHead><TableHead className="pr-4">Instance</TableHead></TableRow></TableHeader>
            <TableBody>
              {LITIGES.map((l) => (
                <TableRow key={l.id}>
                  <TableCell className="pl-4"><Link href={`/agent/litiges/${l.id}`} className="tabular font-semibold text-navy hover:underline">{l.id}</Link></TableCell>
                  <TableCell className="tabular">{l.nup}</TableCell>
                  <TableCell>{l.aiCategory?.label} <span className="tabular text-xs text-muted-foreground">{Math.round((l.aiCategory?.confidence ?? 0) * 100)} %</span></TableCell>
                  <TableCell>{fmtDate(l.opened)}</TableCell>
                  <TableCell>{l.nextStep ? `${l.nextStep.label}, ${fmtDate(l.nextStep.date)}` : "—"}</TableCell>
                  <TableCell className="pr-4"><LitigeBadge status={l.status} /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </SpaceBody>
    </>
  );
}
