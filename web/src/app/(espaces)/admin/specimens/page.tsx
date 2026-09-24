import type { Metadata } from "next";
import { SpaceBody, SpaceHeader } from "@/components/app/space-header";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { SPECIMENS } from "@/lib/data/admin";
import { fmtDate } from "@/lib/labels";

export const metadata: Metadata = { title: "Spécimens · Administration" };

export default function Specimens() {
  return (
    <>
      <SpaceHeader title="Spécimens de cachets et signatures" lead="Référentiel utilisé pour détecter les faux documents. Il doit être constitué avec les communes." />
      <SpaceBody>
        <div className="max-w-3xl overflow-x-auto rounded-lg border bg-card">
          <Table>
            <TableHeader><TableRow><TableHead className="pl-4">Autorité</TableHead><TableHead>Spécimens</TableHead><TableHead className="pr-4">Mis à jour</TableHead></TableRow></TableHeader>
            <TableBody>
              {SPECIMENS.map((s) => (
                <TableRow key={s.authority}>
                  <TableCell className="pl-4 font-medium">{s.authority}</TableCell>
                  <TableCell className="tabular">{s.items}</TableCell>
                  <TableCell className="pr-4">{fmtDate(s.updated)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </SpaceBody>
    </>
  );
}
