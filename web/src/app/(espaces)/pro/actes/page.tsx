import type { Metadata } from "next";
import Link from "next/link";
import { SpaceBody, SpaceHeader } from "@/components/app/space-header";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DEEDS } from "@/lib/data/pro";
import { fmtDate } from "@/lib/labels";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Actes · Espace professionnel" };

export default function Deeds() {
  return (
    <>
      <SpaceHeader title="Actes et compulsions" lead="États descriptifs (5 500 F, 24 h) et compulsions (10 000 F, 24 h).">
        <Link href="/pro/actes/nouveau" className={cn(buttonVariants({ size: "lg" }), "h-10 px-4")}>Demander un acte</Link>
      </SpaceHeader>
      <SpaceBody>
        <div className="max-w-4xl overflow-x-auto rounded-lg border bg-card">
          <Table>
            <TableHeader><TableRow><TableHead className="pl-4">Demande</TableHead><TableHead>Acte</TableHead><TableHead>Parcelle</TableHead><TableHead>Date</TableHead><TableHead className="pr-4">État</TableHead></TableRow></TableHeader>
            <TableBody>
              {DEEDS.map((d) => (
                <TableRow key={d.id}>
                  <TableCell className="tabular pl-4 font-semibold">{d.id}</TableCell>
                  <TableCell>{d.kind}</TableCell>
                  <TableCell className="tabular">{d.nup}</TableCell>
                  <TableCell>{fmtDate(d.date)}</TableCell>
                  <TableCell className="pr-4"><Badge variant={d.status === "delivree" ? "outline" : "secondary"} className="rounded-sm">{d.status === "delivree" ? "Délivré" : "Demandé"}</Badge></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </SpaceBody>
    </>
  );
}
