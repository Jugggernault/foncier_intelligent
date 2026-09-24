import type { Metadata } from "next";
import { SpaceBody, SpaceHeader } from "@/components/app/space-header";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PAYMENTS } from "@/lib/data/workflow";
import { fmtDate, fmtFcfa } from "@/lib/labels";

export const metadata: Metadata = { title: "Paiements · Foncier Intelligent" };

export default function Payments() {
  return (
    <>
      <SpaceHeader title="Paiements" lead="Vos reçus de prestations ANDF." />
      <SpaceBody>
        <div className="max-w-4xl overflow-x-auto rounded-lg border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-4">Date</TableHead>
                <TableHead>Prestation</TableHead>
                <TableHead>Moyen</TableHead>
                <TableHead>Référence</TableHead>
                <TableHead className="pr-4 text-right">Montant</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {PAYMENTS.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="pl-4">{fmtDate(p.date)}</TableCell>
                  <TableCell>{p.label}</TableCell>
                  <TableCell>{p.method}</TableCell>
                  <TableCell className="tabular text-muted-foreground">{p.ref}</TableCell>
                  <TableCell className="tabular pr-4 text-right font-semibold">{p.amount ? fmtFcfa(p.amount) : "Gratuit"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </SpaceBody>
    </>
  );
}
