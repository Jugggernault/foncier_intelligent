import type { Metadata } from "next";
import { PageHeader } from "@/components/site/page-header";
import { Eligibility } from "@/components/tools/eligibility";

export const metadata: Metadata = { title: "Qui peut acheter ? · Foncier Intelligent" };

export default function EligibilityPage() {
  return (
    <>
      <PageHeader
        title="Qui peut acheter ?"
        lead="Trois questions pour savoir si vous pouvez acheter un terrain au Bénin, et quelles règles s'appliquent."
        crumbs={[["Outils"], ["Qui peut acheter ?"]]}
      />
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <Eligibility />
      </div>
    </>
  );
}
