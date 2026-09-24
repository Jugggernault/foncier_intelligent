import type { Metadata } from "next";
import Link from "next/link";
import { SpaceBody, SpaceHeader } from "@/components/app/space-header";
import { LEVEL } from "@/components/parcel/verdict";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PORTFOLIO } from "@/lib/data/pro";
import { fmtFcfa } from "@/lib/labels";
import { assess } from "@/lib/risk";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Garanties · Espace professionnel" };

export default function Portfolio() {
  return (
    <>
      <SpaceHeader title="Parcelles en garantie" lead="Surveillance continue des biens hypothéqués : litiges, empiètements, évolution de la valeur." />
      <SpaceBody>
        <div className="overflow-x-auto rounded-lg border bg-card">
          <Table>
            <TableHeader><TableRow><TableHead className="pl-4">Parcelle</TableHead><TableHead>Emprunteur</TableHead><TableHead>Encours</TableHead><TableHead>Valeur estimée</TableHead><TableHead>Couverture</TableHead><TableHead className="pr-4">Verdict</TableHead></TableRow></TableHeader>
            <TableBody>
              {PORTFOLIO.map(({ parcel: p, loan, borrower }) => {
                const r = assess(p);
                const mid = ((p.pricePerM2.low + p.pricePerM2.high) / 2) * p.areaM2;
                return (
                  <TableRow key={p.nup}>
                    <TableCell className="pl-4"><Link href={`/pro/portefeuille/${p.nup}`} className="tabular font-semibold text-navy hover:underline">{p.nup}</Link></TableCell>
                    <TableCell>{borrower}</TableCell>
                    <TableCell className="tabular">{fmtFcfa(loan)}</TableCell>
                    <TableCell className="tabular">{fmtFcfa(mid)}</TableCell>
                    <TableCell className="tabular">{Math.round((mid / loan) * 100)} %</TableCell>
                    <TableCell className="pr-4"><Badge className={cn("rounded-sm", LEVEL[r.level].soft)}>{LEVEL[r.level].label}</Badge></TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </SpaceBody>
    </>
  );
}
