import type { Metadata } from "next";
import { SpaceBody, SpaceHeader } from "@/components/app/space-header";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { fr } from "@/i18n/fr";

export const metadata: Metadata = { title: "Barème des frais · Administration" };

export default function Schedule() {
  return (
    <>
      <SpaceHeader title="Barème des frais" lead="Barème de la mutation de titre foncier appliqué par le calculateur, l'assistant et l'API. Source : catalogue service-public.bj (PS01427)." />
      <SpaceBody>
        <div className="max-w-2xl overflow-x-auto rounded-lg border bg-card">
          <Table>
            <TableHeader><TableRow><TableHead className="pl-4">Tranche</TableHead><TableHead className="pr-4">Règle</TableHead></TableRow></TableHeader>
            <TableBody>
              {fr.fees.rules.map((r) => (
                <TableRow key={r.range}><TableCell className="pl-4">{r.range}</TableCell><TableCell className="pr-4 font-semibold">{r.rule}</TableCell></TableRow>
              ))}
              <TableRow><TableCell className="pl-4">Frais de régie</TableCell><TableCell className="pr-4 font-semibold">500 F</TableCell></TableRow>
            </TableBody>
          </Table>
        </div>
      </SpaceBody>
    </>
  );
}
