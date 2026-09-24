import type { Metadata } from "next";
import Link from "next/link";
import { SpaceBody, SpaceHeader } from "@/components/app/space-header";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { overlaps } from "@/lib/data/agent";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Qualité du cadastre · Espace agent" };

export default function CadastreQuality() {
  const rows = overlaps();
  return (
    <>
      <SpaceHeader title="Qualité du cadastre" lead={`${rows.length} chevauchements détectés entre emprises. La correction la plus probable est proposée ; le service du cadastre valide.`} />
      <SpaceBody>
        <div className="overflow-x-auto rounded-lg border bg-card">
          <Table>
            <TableHeader><TableRow><TableHead className="pl-4">Parcelle A</TableHead><TableHead>Parcelle B</TableHead><TableHead>Surface commune</TableHead><TableHead>Part</TableHead><TableHead className="pr-4">Correction suggérée</TableHead></TableRow></TableHeader>
            <TableBody>
              {rows.map((o) => (
                <TableRow key={o.a + o.b}>
                  <TableCell className="pl-4"><Link href={`/agent/parcelles/${o.a}`} className="tabular font-semibold text-navy hover:underline">{o.a}</Link></TableCell>
                  <TableCell><Link href={`/agent/parcelles/${o.b}`} className="tabular font-semibold text-navy hover:underline">{o.b}</Link></TableCell>
                  <TableCell className="tabular">{new Intl.NumberFormat("fr-FR").format(o.overlapM2)} m²</TableCell>
                  <TableCell><Badge className={cn("tabular rounded-sm", o.share > 0.5 ? "bg-danger-soft text-danger" : "bg-caution-soft text-caution")}>{Math.round(o.share * 100)} %</Badge></TableCell>
                  <TableCell className="pr-4 whitespace-normal">{o.suggestion}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </SpaceBody>
    </>
  );
}
