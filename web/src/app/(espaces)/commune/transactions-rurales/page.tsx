import type { Metadata } from "next";
import { SpaceBody, SpaceHeader } from "@/components/app/space-header";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { RURAL_TX } from "@/lib/data/commune";
import { fmtArea } from "@/lib/labels";

export const metadata: Metadata = { title: "Transactions rurales · Espace commune" };

export default function RuralTransactions() {
  return (
    <>
      <SpaceHeader title="Transactions rurales" lead="Les Sections villageoises de gestion foncière (SVGF) accompagnent la formalisation des ventes au village." />
      <SpaceBody>
        <div className="max-w-4xl overflow-x-auto rounded-lg border bg-card">
          <Table>
            <TableHeader><TableRow><TableHead className="pl-4">Parcelle</TableHead><TableHead>Village</TableHead><TableHead>Surface</TableHead><TableHead className="pr-4">Étape</TableHead></TableRow></TableHeader>
            <TableBody>
              {RURAL_TX.map((t) => (
                <TableRow key={t.parcel.nup}>
                  <TableCell className="tabular pl-4 font-semibold">{t.parcel.nup}</TableCell>
                  <TableCell>{t.village}</TableCell>
                  <TableCell className="tabular">{fmtArea(t.parcel.areaM2)}</TableCell>
                  <TableCell className="pr-4"><Badge variant="secondary" className="rounded-sm">{t.stage}</Badge></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </SpaceBody>
    </>
  );
}
