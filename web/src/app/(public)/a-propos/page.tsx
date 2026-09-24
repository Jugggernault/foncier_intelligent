import type { Metadata } from "next";
import { PageHeader } from "@/components/site/page-header";
import { Prose } from "@/components/site/prose";

export const metadata: Metadata = { title: "À propos · Foncier Intelligent" };

export default function AboutPage() {
  return (
    <>
      <PageHeader
        title="À propos"
        lead="Foncier Intelligent est une démonstration portée par UDI-AFRICA, lauréat du Hackathon IA « Foncier Intelligent » organisé par l'ASIN et l'ANDF avec l'appui de LuxDev (septembre 2025)."
        crumbs={[["À propos"]]}
      />
      <Prose>
        <h2>Pourquoi</h2>
        <p>
          Acheter un terrain reste un pari : ventes multiples, faux documents, litiges découverts après l&apos;achat. Depuis 2025, le Bénin dispose de
          briques numériques solides : le numéro unique de parcelle (NUP), la plateforme e-Foncier, le portail des e-services. Il manque la capacité à
          vérifier, surveiller et anticiper.
        </p>
        <h2>Ce que fait la plateforme</h2>
        <ul>
          <li>Vérifier une parcelle en 30 secondes : statut juridique, image satellite, risques, valeur estimée.</li>
          <li>Surveiller le terrain dans la durée et prévenir les riverains des demandes de titre publiées.</li>
          <li>Aider les agents à instruire plus vite, avec un copilote qui lit les dossiers et signale les anomalies.</li>
          <li>Donner à l&apos;État des alertes d&apos;empiètement et une vision claire des délais et des risques.</li>
        </ul>
        <h2>Notre principe</h2>
        <p>
          On ne remplace pas le registre de l&apos;ANDF, qui reste la source de vérité : on l&apos;augmente. Et l&apos;IA propose, l&apos;agent dispose : aucun
          modèle n&apos;accorde ni ne refuse un droit.
        </p>
        <h2>État de la démonstration</h2>
        <p>
          Les parcelles marquées « données publiées par l&apos;ANDF » reprennent des avis de publicité foncière réels. Les autres sont fictives. Les images
          satellite sont réelles (Sentinel-2). Voir la <a href="/ia-responsable">charte IA</a> et les <a href="/conditions">conditions</a>.
        </p>
      </Prose>
    </>
  );
}
