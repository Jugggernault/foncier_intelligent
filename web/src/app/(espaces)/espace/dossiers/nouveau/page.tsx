import type { Metadata } from "next";
import { SpaceBody, SpaceHeader } from "@/components/app/space-header";
import { OWNED } from "@/lib/data/citizen";
import { DossierWizard } from "./dossier-wizard";

export const metadata: Metadata = { title: "Nouveau dossier · Foncier Intelligent" };

export default function NewDossier() {
  return (
    <>
      <SpaceHeader title="Nouveau dossier" lead="Les pièces sont lues et contrôlées avant le dépôt : fini les allers-retours pour une pièce manquante." />
      <SpaceBody>
        <DossierWizard ownedNups={OWNED.map((p) => p.nup)} />
      </SpaceBody>
    </>
  );
}
