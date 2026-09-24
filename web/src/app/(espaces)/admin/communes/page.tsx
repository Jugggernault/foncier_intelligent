import type { Metadata } from "next";
import { SpaceBody, SpaceHeader } from "@/components/app/space-header";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { COVERAGE } from "@/lib/data/admin";

export const metadata: Metadata = { title: "Couverture · Administration" };

export default function Coverage() {
  return (
    <>
      <SpaceHeader title="Couverture des communes" lead="12 communes en e-Foncier depuis janvier 2025 ; la liste des communes Terra Benin est indicative (à confirmer avec l'ANDF)." />
      <SpaceBody>
        <div className="max-w-3xl overflow-x-auto rounded-lg border bg-card">
          <Table>
            <TableHeader><TableRow><TableHead className="pl-4">Commune</TableHead><TableHead>e-Foncier</TableHead><TableHead className="pr-4">Terra Benin</TableHead></TableRow></TableHeader>
            <TableBody>
              {COVERAGE.map((c) => (
                <TableRow key={c.commune}>
                  <TableCell className="pl-4 font-medium">{c.commune}</TableCell>
                  <TableCell>{c.efoncier ? <Badge className="rounded-sm bg-clear-soft text-clear">Actif</Badge> : "—"}</TableCell>
                  <TableCell className="pr-4">{c.terra ? <Badge variant="secondary" className="rounded-sm">Prévu</Badge> : "—"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </SpaceBody>
    </>
  );
}
