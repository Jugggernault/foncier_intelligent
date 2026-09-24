import type { Metadata } from "next";
import Link from "next/link";
import { SpaceBody, SpaceHeader } from "@/components/app/space-header";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { listPublicityNotices } from "@/lib/data/parcels";
import { fmtDate } from "@/lib/labels";

export const metadata: Metadata = { title: "Oppositions · Espace agent" };

const GROUNDS = ["Empiètement sur parcelle voisine", "Revendication de propriété", "Ayant droit non consulté"];

export default function Oppositions() {
  const rows = listPublicityNotices().filter((p) => Number(p.nup.slice(-1)) % 3 === 0).slice(0, 10);
  return (
    <>
      <SpaceHeader title="Oppositions reçues" lead="Chaque opposition est rattachée à l'avis et au dossier correspondants." />
      <SpaceBody>
        <div className="overflow-x-auto rounded-lg border bg-card">
          <Table>
            <TableHeader><TableRow><TableHead className="pl-4">Avis</TableHead><TableHead>Parcelle</TableHead><TableHead>Motif</TableHead><TableHead className="pr-4">Reçue le</TableHead></TableRow></TableHeader>
            <TableBody>
              {rows.map((p, i) => (
                <TableRow key={p.nup}>
                  <TableCell className="tabular pl-4">{p.procedure!.requestNumber}</TableCell>
                  <TableCell><Link href={`/agent/publicite/${p.nup}`} className="tabular font-semibold text-navy hover:underline">{p.nup}</Link></TableCell>
                  <TableCell>{GROUNDS[i % GROUNDS.length]}</TableCell>
                  <TableCell className="pr-4">{fmtDate(p.procedure!.publicity.start)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </SpaceBody>
    </>
  );
}
