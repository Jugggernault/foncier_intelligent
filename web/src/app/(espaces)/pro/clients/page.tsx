import type { Metadata } from "next";
import { SpaceBody, SpaceHeader } from "@/components/app/space-header";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CLIENTS } from "@/lib/data/pro";
import { fmtDate } from "@/lib/labels";

export const metadata: Metadata = { title: "Clients · Espace professionnel" };

export default function Clients() {
  return (
    <>
      <SpaceHeader title="Clients et dossiers" />
      <SpaceBody>
        <div className="max-w-4xl overflow-x-auto rounded-lg border bg-card">
          <Table>
            <TableHeader><TableRow><TableHead className="pl-4">Client</TableHead><TableHead>Dossiers</TableHead><TableHead>Téléphone</TableHead><TableHead className="pr-4">Dernière activité</TableHead></TableRow></TableHeader>
            <TableBody>
              {CLIENTS.map((c) => (
                <TableRow key={c.name}>
                  <TableCell className="pl-4 font-medium">{c.name}</TableCell>
                  <TableCell className="tabular">{c.files}</TableCell>
                  <TableCell className="tabular">{c.phone}</TableCell>
                  <TableCell className="pr-4">{fmtDate(c.last)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </SpaceBody>
    </>
  );
}
