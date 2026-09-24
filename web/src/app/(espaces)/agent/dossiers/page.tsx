import type { Metadata } from "next";
import { DossierTable } from "@/components/app/dossier-table";
import { SpaceBody, SpaceHeader } from "@/components/app/space-header";
import { getParcel } from "@/lib/data/parcels";
import { listDossiers } from "@/lib/data/workflow";

export const metadata: Metadata = { title: "File d'instruction · Espace agent" };

export default function AgentQueue() {
  const rows = listDossiers().map(({ id, kind, nup, applicant, status, createdAt, dueAt, completeness, anomalyScore }) => ({
    id, kind, nup, applicant, status, createdAt, dueAt, completeness, anomalyScore, commune: getParcel(nup)?.commune ?? "",
  }));
  return (
    <>
      <SpaceHeader title="File d'instruction" lead="Tous les dossiers du bureau. Le score d'anomalies agrège la lecture des pièces, le croisement avec le cadastre et l'imagerie." />
      <SpaceBody>
        <DossierTable rows={rows} hrefBase="/agent/dossiers" />
      </SpaceBody>
    </>
  );
}
