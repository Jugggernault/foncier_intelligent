import type { Metadata } from "next";
import { SpaceBody, SpaceHeader } from "@/components/app/space-header";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { RURAL } from "@/lib/data/agent";
import { fmtFcfa } from "@/lib/labels";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Origine des fonds · Espace agent" };

const TONE = { fournie: "bg-clear-soft text-clear", manquante: "bg-danger-soft text-danger", "a-verifier": "bg-caution-soft text-caution" };
const LABEL = { fournie: "Fournie", manquante: "Manquante", "a-verifier": "À vérifier" };

export default function FundsOrigin() {
  const rows = RURAL.filter((r) => r.proof);
  return (
    <>
      <SpaceHeader title="Origine des fonds" lead="Acquisitions de terres rurales de plus de 20 ha : sans justification de l'origine des fonds, la demande d'approbation est rejetée (décision ANDF du 27 décembre 2024)." />
      <SpaceBody>
        <div className="overflow-x-auto rounded-lg border bg-card">
          <Table>
            <TableHeader><TableRow><TableHead className="pl-4">Parcelle</TableHead><TableHead>Surface</TableHead><TableHead>Acquéreur</TableHead><TableHead>Montant</TableHead><TableHead className="pr-4">Justificatif</TableHead></TableRow></TableHeader>
            <TableBody>
              {rows.map((r) => (
                <TableRow key={r.nup}>
                  <TableCell className="tabular pl-4 font-semibold">{r.nup}</TableCell>
                  <TableCell className="tabular">{r.areaHa} ha</TableCell>
                  <TableCell>{r.buyer}</TableCell>
                  <TableCell className="tabular">{fmtFcfa(r.price)}</TableCell>
                  <TableCell className="pr-4"><Badge className={cn("rounded-sm", TONE[r.proof!])}>{LABEL[r.proof!]}</Badge></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </SpaceBody>
    </>
  );
}
