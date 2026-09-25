import type { Metadata } from "next";
import { LeveVerifier } from "@/components/app/leve-verifier";
import { PageHeader } from "@/components/site/page-header";
import { DEMO_DOCS } from "@/content/demo-documents";

export const metadata: Metadata = { title: "Vérifier un levé · Foncier Intelligent" };

export default function LevePage() {
  const demos = DEMO_DOCS.filter((d) => d.kind === "leve").map(({ file, title, scenario }) => ({ file, title, scenario }));
  return (
    <>
      <PageHeader
        title="Pas de NUP ? Vérifiez avec le levé."
        lead="Beaucoup de terrains se vendent avec un simple plan de géomètre. Déposez-le : les bornes sont lues, placées sur l'image satellite et croisées avec les litiges, zones d'utilité publique, domaine public, forêts classées et titres connus de l'ANDF."
        crumbs={[["Vérifier un levé"]]}
      />
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <LeveVerifier demos={demos} />
      </div>
    </>
  );
}
