import type { Metadata } from "next";
import Link from "next/link";
import { SpaceBody, SpaceHeader } from "@/components/app/space-header";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TFU_CANDIDATES } from "@/lib/data/commune";
import { fmtArea, fmtFcfa } from "@/lib/labels";

export const metadata: Metadata = { title: "Assiette TFU · Espace commune" };

export default function Tax() {
  const total = TFU_CANDIDATES.reduce((s, c) => s + c.estimatedTax, 0);
  return (
    <>
      <SpaceHeader title="Assiette de la Taxe foncière unique" lead={`${TFU_CANDIDATES.length} parcelles où un bâti est détecté alors qu'elles sont enregistrées comme non bâties. Recette potentielle estimée : ${fmtFcfa(total)} par an.`} />
      <SpaceBody>
        <div className="overflow-x-auto rounded-lg border bg-card">
          <Table>
            <TableHeader><TableRow><TableHead className="pl-4">Parcelle</TableHead><TableHead>Quartier</TableHead><TableHead>Bâti détecté</TableHead><TableHead>Confiance</TableHead><TableHead>Source</TableHead><TableHead className="pr-4 text-right">TFU estimée</TableHead></TableRow></TableHeader>
            <TableBody>
              {TFU_CANDIDATES.map((c) => (
                <TableRow key={c.parcel.nup}>
                  <TableCell className="pl-4"><Link href={`/parcelle/${c.parcel.nup}`} className="tabular font-semibold text-navy hover:underline">{c.parcel.nup}</Link></TableCell>
                  <TableCell>{c.parcel.quartier}, {c.parcel.commune}</TableCell>
                  <TableCell className="tabular">{fmtArea(c.builtM2)}</TableCell>
                  <TableCell className="tabular">{Math.round(c.confidence * 100)} %</TableCell>
                  <TableCell className="text-muted-foreground">{c.source}</TableCell>
                  <TableCell className="tabular pr-4 text-right font-semibold">{fmtFcfa(c.estimatedTax)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">Taux et valeurs administratives de démonstration (circulaire DGI 709 à intégrer). Une détection déclenche un contrôle, pas un redressement automatique.</p>
      </SpaceBody>
    </>
  );
}
