import type { Metadata } from "next";
import { SpaceBody, SpaceHeader } from "@/components/app/space-header";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AUDIT } from "@/lib/data/admin";

export const metadata: Metadata = { title: "Journal d'audit · Administration" };

export default function Audit() {
  return (
    <>
      <SpaceHeader title="Journal d'audit" lead="Chaque action humaine et chaque suggestion de l'IA, horodatées et non modifiables." />
      <SpaceBody>
        <div className="overflow-x-auto rounded-lg border bg-card">
          <Table>
            <TableHeader><TableRow><TableHead className="pl-4">Horodatage</TableHead><TableHead>Auteur</TableHead><TableHead>Action</TableHead><TableHead className="pr-4">Détail</TableHead></TableRow></TableHeader>
            <TableBody>
              {AUDIT.map(([t, who, what, detail]) => (
                <TableRow key={t + detail}>
                  <TableCell className="tabular pl-4">{t}</TableCell>
                  <TableCell>{who}</TableCell>
                  <TableCell>{what}</TableCell>
                  <TableCell className="pr-4 whitespace-normal">{detail}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </SpaceBody>
    </>
  );
}
