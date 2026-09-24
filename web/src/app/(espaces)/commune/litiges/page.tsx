import type { Metadata } from "next";
import { SpaceBody, SpaceHeader } from "@/components/app/space-header";
import { LitigeBadge } from "@/components/app/workflow-bits";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { communeLitiges } from "@/lib/data/commune";
import { disputeLabel, fmtDate } from "@/lib/labels";

export const metadata: Metadata = { title: "Litiges · Espace commune" };

export default function CommuneLitiges() {
  return (
    <>
      <SpaceHeader title="Litiges de la commune" lead="Les conflits de limites relèvent d'abord d'une médiation CoGeF ou SVGF." />
      <SpaceBody>
        <div className="overflow-x-auto rounded-lg border bg-card">
          <Table>
            <TableHeader><TableRow><TableHead className="pl-4">Litige</TableHead><TableHead>Type</TableHead><TableHead>Parcelle</TableHead><TableHead>Parties</TableHead><TableHead>Ouvert le</TableHead><TableHead className="pr-4">Instance</TableHead></TableRow></TableHeader>
            <TableBody>
              {communeLitiges().map((l) => (
                <TableRow key={l.id}>
                  <TableCell className="tabular pl-4 font-semibold">{l.id}</TableCell>
                  <TableCell>{disputeLabel[l.kind]}</TableCell>
                  <TableCell className="tabular">{l.nup}</TableCell>
                  <TableCell>{l.parties.join(" c/ ")}</TableCell>
                  <TableCell>{fmtDate(l.opened)}</TableCell>
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
