import type { Metadata } from "next";
import { SpaceBody, SpaceHeader } from "@/components/app/space-header";
import { SurveyImport } from "./survey-import";

export const metadata: Metadata = { title: "Pré-contrôler un plan · Espace professionnel" };

export default function NewSurvey() {
  return (
    <>
      <SpaceHeader
        title="Pré-contrôler un plan avant dépôt"
        lead="Les motifs de rejet les plus fréquents (calage, autre plan de bornage, zone en procédure, zone réservée) sont vérifiés avant le dépôt, à partir des couches et des décisions réelles de l'ANDF."
      />
      <SpaceBody><SurveyImport /></SpaceBody>
    </>
  );
}
