import type { Metadata } from "next";
import { SpaceBody, SpaceHeader } from "@/components/app/space-header";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TFU_CANDIDATES } from "@/lib/data/commune";
import { MUTATIONS } from "@/lib/data/pro";
import { getParcel } from "@/lib/data/parcels";
import { fmtFcfa } from "@/lib/labels";

export const metadata: Metadata = { title: "Fiscalité · Pilotage" };

export default function Fiscal() {
  const under = MUTATIONS.map((m) => ({ m, p: getParcel(m.nup)! })).filter(({ m, p }) => m.price < p.pricePerM2.low * p.areaM2 * 0.7);
  const tfu = TFU_CANDIDATES.reduce((s, c) => s + c.estimatedTax, 0);
  return (
    <>
      <SpaceHeader title="Fiscalité foncière" lead={`TFU potentielle détectée : ${fmtFcfa(tfu)} par an. ${under.length} mutations déclarées nettement sous l'estimation du secteur.`} />
      <SpaceBody>
        <h2 className="font-bold text-navy">Prix de mutation sous-déclarés</h2>
        <div className="mt-3 max-w-4xl overflow-x-auto rounded-lg border bg-card">
          <Table>
            <TableHeader><TableRow><TableHead className="pl-4">Mutation</TableHead><TableHead>Parcelle</TableHead><TableHead>Prix déclaré</TableHead><TableHead className="pr-4">Estimation basse</TableHead></TableRow></TableHeader>
            <TableBody>
              {under.map(({ m, p }) => (
                <TableRow key={m.id}>
                  <TableCell className="tabular pl-4 font-semibold">{m.id}</TableCell>
                  <TableCell className="tabular">{m.nup}</TableCell>
                  <TableCell className="tabular">{fmtFcfa(m.price)}</TableCell>
                  <TableCell className="tabular pr-4">{fmtFcfa(p.pricePerM2.low * p.areaM2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </SpaceBody>
    </>
  );
}
