import type { Metadata } from "next";
import { PageHeader } from "@/components/site/page-header";
import { Prose } from "@/components/site/prose";

export const metadata: Metadata = { title: "Développeurs · Foncier Intelligent" };

export default function DevelopersPage() {
  return (
    <>
      <PageHeader title="API pour les développeurs" lead="Les banques, notaires et applications partenaires pourront interroger la plateforme. Deux points d'accès sont déjà disponibles en démonstration." crumbs={[["Développeurs"]]} />
      <Prose>
        <h2>Fiche d&apos;une parcelle</h2>
        <p><code>GET /api/parcels/{"{nup}"}</code> renvoie la parcelle (sans identité du propriétaire) et son score de risque avec ses raisons.</p>
        <pre className="mt-4 overflow-x-auto rounded-lg bg-navy-deep p-4 text-sm text-white"><code className="bg-transparent! p-0!">curl https://…/api/parcels/101236198</code></pre>
        <h2>Frais de mutation</h2>
        <p><code>GET /api/fees?amount=25000000</code> applique le barème de l&apos;ANDF.</p>
        <h2>À venir</h2>
        <ul>
          <li><code>GET /api/parcels/{"{nup}"}/imagery</code> : indicateurs satellite par année.</li>
          <li><code>POST /api/documents/extract</code> : lecture d&apos;une pièce foncière.</li>
          <li><code>POST /api/subscriptions</code> : alertes sur une parcelle.</li>
        </ul>
        <p>Authentification OAuth2 prévue, avec des clés par partenaire.</p>
      </Prose>
    </>
  );
}
