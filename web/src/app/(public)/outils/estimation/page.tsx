import type { Metadata } from "next";
import { PageHeader } from "@/components/site/page-header";
import { Estimator } from "@/components/tools/estimator";
import { priceReferences } from "@/lib/valuation";

export const metadata: Metadata = { title: "Estimer un terrain · Foncier Intelligent" };

export default function EstimationPage() {
  return (
    <>
      <PageHeader
        title="Combien vaut un terrain ?"
        lead="Une fourchette de prix à partir des parcelles comparables de la commune. Utile pour repérer un prix trop beau pour être vrai."
        crumbs={[["Outils"], ["Estimation"]]}
      />
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <Estimator refs={priceReferences()} />
      </div>
    </>
  );
}
