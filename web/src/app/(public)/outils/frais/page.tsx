import type { Metadata } from "next";
import { FeeCalculator } from "@/components/landing/fee-calculator";
import { PageHeader } from "@/components/site/page-header";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { fr } from "@/i18n/fr";

export const metadata: Metadata = { title: "Calcul des frais · Foncier Intelligent" };

// Tarifs publiés par l'ANDF (catalogue service-public.bj). ponytail: à lire depuis l'API du catalogue.
const TARIFFS = [
  ["État descriptif", "5 500 F", "24 h"],
  ["Compulsion (huissier)", "10 000 F", "24 h"],
  ["Attestation de demande de confirmation de droits", "10 500 F", "48 h"],
  ["Certificat d'appartenance", "50 500 F", "10 jours"],
  ["Mutation de titre foncier", "Barème ci-dessus", "72 h"],
  ["Demande de titre foncier", "Selon la superficie (100 000 F hors bornage)", "120 jours"],
];

export default function FeesPage() {
  return (
    <>
      <PageHeader title={fr.fees.title} lead={fr.fees.lead} crumbs={[["Outils"], ["Calcul des frais"]]} />
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <FeeCalculator />
        <dl className="mt-6 grid gap-x-8 gap-y-2 text-sm sm:grid-cols-3">
          {fr.fees.rules.map((r) => (
            <div key={r.range} className="flex justify-between gap-4 border-b py-2 sm:block">
              <dt className="text-muted-foreground">{r.range}</dt>
              <dd className="font-semibold text-navy">{r.rule}</dd>
            </div>
          ))}
        </dl>

        <h2 className="mt-16 text-2xl font-extrabold text-navy">Autres prestations de l&apos;ANDF</h2>
        <div className="mt-6 overflow-x-auto rounded-lg border">
          <Table>
            <TableHeader className="bg-sky">
              <TableRow>
                <TableHead className="pl-5 text-navy">Prestation</TableHead>
                <TableHead className="text-navy">Coût</TableHead>
                <TableHead className="pr-5 text-navy">Délai</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {TARIFFS.map(([name, cost, delay]) => (
                <TableRow key={name}>
                  <TableCell className="py-3 pl-5 font-medium whitespace-normal">{name}</TableCell>
                  <TableCell className="tabular whitespace-normal">{cost}</TableCell>
                  <TableCell className="tabular pr-5">{delay}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">Source : catalogue des e-services (service-public.bj), fiches ANDF.</p>
      </div>
    </>
  );
}
