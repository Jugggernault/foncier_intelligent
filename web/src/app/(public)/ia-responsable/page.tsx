import type { Metadata } from "next";
import { PageHeader } from "@/components/site/page-header";
import { Prose } from "@/components/site/prose";

export const metadata: Metadata = { title: "Charte IA · Foncier Intelligent" };

export default function AiCharterPage() {
  return (
    <>
      <PageHeader title="Charte d'intelligence artificielle" lead="Ce que l'IA fait sur cette plateforme, ce qu'elle ne fait jamais, et comment nous la contrôlons." crumbs={[["Charte IA"]]} />
      <Prose>
        <h2>L&apos;IA propose, l&apos;agent dispose</h2>
        <p>Aucun droit n&apos;est accordé, refusé ou modifié par un modèle. Chaque décision foncière reste celle d&apos;un agent assermenté, d&apos;un notaire ou d&apos;un juge.</p>
        <h2>Explicable</h2>
        <p>Chaque verdict affiche ses raisons et ce qu&apos;il faut faire pour lever le doute. Chaque réponse de l&apos;assistant cite sa source.</p>
        <h2>Là où l&apos;IA n&apos;intervient pas</h2>
        <ul>
          <li>Le registre des droits : source de vérité déterministe, jamais « prédite ».</li>
          <li>Le calcul des frais : une règle réglementaire.</li>
          <li>Le paiement et la signature.</li>
          <li>La décision d&apos;attribuer un droit.</li>
        </ul>
        <h2>Équité</h2>
        <p>Les droits coutumiers et les droits des femmes ne doivent pas être pénalisés par des modèles entraînés sur des données urbaines. Les performances sont mesurées par commune, par type de droit et par genre.</p>
        <h2>Traçabilité</h2>
        <p>Chaque suggestion de l&apos;IA, acceptée ou rejetée, est journalisée. Une alerte satellite déclenche une vérification, jamais une sanction.</p>
        <h2>Souveraineté et données personnelles</h2>
        <p>Hébergement visé au Bénin, modèles ouverts auto-hébergés pour les données sensibles, conformité au Code du numérique (loi 2017-20) sous le contrôle de l&apos;APDP.</p>
      </Prose>
    </>
  );
}
