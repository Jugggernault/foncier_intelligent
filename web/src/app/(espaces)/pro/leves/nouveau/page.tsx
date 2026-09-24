import type { Metadata } from "next";
import { SpaceBody, SpaceHeader } from "@/components/app/space-header";
import { listParcels } from "@/lib/data/parcels";
import { SurveyImport } from "./survey-import";

export const metadata: Metadata = { title: "Importer un levé · Espace professionnel" };

export default function NewSurvey() {
  return (
    <>
      <SpaceHeader title="Importer un levé" lead="Reprojection UTM 31N, calcul de surface et contrôle des chevauchements avec le cadastre, instantanément." />
      <SpaceBody><SurveyImport parcels={listParcels()} /></SpaceBody>
    </>
  );
}
