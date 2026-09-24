import type { Metadata } from "next";
import { SpaceBody, SpaceHeader } from "@/components/app/space-header";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { INVOICES } from "@/lib/data/pro";
import { fmtFcfa } from "@/lib/labels";

export const metadata: Metadata = { title: "Facturation · Espace professionnel" };

export default function Billing() {
  return (
    <>
      <SpaceHeader title="Facturation" lead="Tarification de démonstration : 1 500 F par vérification professionnelle." />
      <SpaceBody>
        <div className="max-w-3xl overflow-x-auto rounded-lg border bg-card">
          <Table>
            <TableHeader><TableRow><TableHead className="pl-4">Facture</TableHead><TableHead>Objet</TableHead><TableHead>Montant</TableHead><TableHead className="pr-4">État</TableHead></TableRow></TableHeader>
            <TableBody>
              {INVOICES.map((i) => (
                <TableRow key={i.id}>
                  <TableCell className="tabular pl-4 font-semibold">{i.id}</TableCell>
                  <TableCell>{i.label}</TableCell>
                  <TableCell className="tabular">{fmtFcfa(i.amount)}</TableCell>
                  <TableCell className="pr-4"><Badge variant={i.status === "Payée" ? "outline" : "secondary"} className="rounded-sm">{i.status}</Badge></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </SpaceBody>
    </>
  );
}
