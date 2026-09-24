import type { Metadata } from "next";
import { PageHeader } from "@/components/site/page-header";
import { Prose } from "@/components/site/prose";

export const metadata: Metadata = { title: "Confidentialité · Foncier Intelligent" };

export default function PrivacyPage() {
  return (
    <>
      <PageHeader title="Confidentialité" lead="Comment la démonstration traite les données personnelles." crumbs={[["Confidentialité"]]} />
      <Prose>
        <h2>Identité des propriétaires</h2>
        <p>L&apos;identité des propriétaires et des demandeurs n&apos;est jamais affichée au public. Les avis de publicité foncière sont repris sans nom ni téléphone.</p>
        <h2>Données que vous saisissez</h2>
        <p>La démonstration ne conserve aucune donnée : recherches, questions à l&apos;assistant et calculs restent dans votre navigateur.</p>
        <h2>Cadre légal</h2>
        <p>La version opérationnelle respectera le Code du numérique (loi 2017-20) et les avis de l&apos;Autorité de protection des données personnelles (APDP).</p>
      </Prose>
    </>
  );
}
