import type { Metadata } from "next";
import { PageHeader } from "@/components/site/page-header";
import { Prose } from "@/components/site/prose";

export const metadata: Metadata = { title: "Conditions d'utilisation · Foncier Intelligent" };

export default function TermsPage() {
  return (
    <>
      <PageHeader title="Conditions d'utilisation" lead="Une démonstration, pas un service officiel." crumbs={[["Conditions"]]} />
      <Prose>
        <h2>Nature du service</h2>
        <p>Foncier Intelligent est une démonstration portée par UDI-AFRICA. Il ne s&apos;agit pas d&apos;un service de l&apos;ANDF ni du gouvernement. Pour tout acte, adressez-vous à l&apos;ANDF ou à un notaire.</p>
        <h2>Pas de conseil juridique</h2>
        <p>Les verdicts, estimations et réponses de l&apos;assistant sont des informations générales. Ils ne remplacent ni l&apos;état descriptif délivré par l&apos;ANDF, ni l&apos;avis d&apos;un professionnel.</p>
        <h2>Données et licences</h2>
        <ul>
          <li>Imagerie : Sentinel-2 GeoMAD annuel © Digital Earth Africa (CC BY 4.0), données Copernicus modifiées.</li>
          <li>Fond de carte : OpenFreeMap, © OpenMapTiles, données © contributeurs OpenStreetMap (ODbL).</li>
          <li>Textes juridiques : Code foncier et domanial, décrets et arrêtés publiés par le SGG et l&apos;ANDF.</li>
        </ul>
      </Prose>
    </>
  );
}
