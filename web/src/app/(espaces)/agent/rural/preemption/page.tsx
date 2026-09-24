import type { Metadata } from "next";
import Link from "next/link";
import { SpaceBody, SpaceHeader } from "@/components/app/space-header";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { RURAL } from "@/lib/data/agent";
import { daysUntil, fmtFcfa } from "@/lib/labels";

export const metadata: Metadata = { title: "Préemption · Espace agent" };

export default function Preemption() {
  const rows = RURAL.filter((r) => r.areaHa >= 2);
  return (
    <>
      <SpaceHeader title="Droit de préemption" lead="Transactions sur des terres rurales de 2 ha ou plus : l'ANDF peut se substituer à l'acquéreur et doit viser la vente." />
      <SpaceBody>
        <div className="overflow-x-auto rounded-lg border bg-card">
          <Table>
            <TableHeader><TableRow><TableHead className="pl-4">Parcelle</TableHead><TableHead>Surface</TableHead><TableHead>Acquéreur</TableHead><TableHead>Prix déclaré</TableHead><TableHead className="pr-4">Délai de réponse</TableHead></TableRow></TableHeader>
            <TableBody>
              {rows.map((r) => (
                <TableRow key={r.nup}>
                  <TableCell className="pl-4"><Link href={`/agent/parcelles/${r.nup}`} className="tabular font-semibold text-navy hover:underline">{r.nup}</Link></TableCell>
                  <TableCell className="tabular">{r.areaHa} ha</TableCell>
                  <TableCell>{r.buyer}</TableCell>
                  <TableCell className="tabular">{fmtFcfa(r.price)}</TableCell>
                  <TableCell className="tabular pr-4">{daysUntil(r.deadline)} jours</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </SpaceBody>
    </>
  );
}
