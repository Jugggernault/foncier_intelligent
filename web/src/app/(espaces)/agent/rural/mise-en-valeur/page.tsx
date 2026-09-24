import type { Metadata } from "next";
import Link from "next/link";
import { SpaceBody, SpaceHeader } from "@/components/app/space-header";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { RURAL } from "@/lib/data/agent";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Mise en valeur · Espace agent" };

export default function Development() {
  const rows = RURAL.filter((r) => r.kind === "mise-en-valeur");
  return (
    <>
      <SpaceHeader title="Contrôle de mise en valeur" lead="Terres rurales de plus de 20 ha : l'indice de végétation (NDVI) mesuré par satellite est comparé au projet agricole approuvé." />
      <SpaceBody>
        <div className="overflow-x-auto rounded-lg border bg-card">
          <Table>
            <TableHeader><TableRow><TableHead className="pl-4">Parcelle</TableHead><TableHead>Surface</TableHead><TableHead>Porteur</TableHead><TableHead>NDVI actuel / attendu</TableHead><TableHead className="pr-4">Constat</TableHead></TableRow></TableHeader>
            <TableBody>
              {rows.map((r) => {
                const now = r.ndvi.at(-1)!;
                const ok = now >= r.expected;
                return (
                  <TableRow key={r.nup}>
                    <TableCell className="pl-4"><Link href={`/agent/rural/mise-en-valeur/${r.nup}`} className="tabular font-semibold text-navy hover:underline">{r.nup}</Link></TableCell>
                    <TableCell className="tabular">{r.areaHa} ha</TableCell>
                    <TableCell>{r.buyer}</TableCell>
                    <TableCell className="tabular">{now.toFixed(2)} / {r.expected.toFixed(2)}</TableCell>
                    <TableCell className="pr-4"><Badge className={cn("rounded-sm", ok ? "bg-clear-soft text-clear" : "bg-caution-soft text-caution")}>{ok ? "Mise en valeur constatée" : "À contrôler"}</Badge></TableCell>
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
