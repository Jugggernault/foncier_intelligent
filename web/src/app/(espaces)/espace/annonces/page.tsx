import type { Metadata } from "next";
import { MegaphoneIcon } from "lucide-react";
import { SpaceBody, SpaceHeader } from "@/components/app/space-header";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";

export const metadata: Metadata = { title: "Mes annonces · Foncier Intelligent" };

export default function Listings() {
  return (
    <>
      <SpaceHeader title="Mes annonces" />
      <SpaceBody>
        <Empty className="max-w-2xl border bg-card">
          <EmptyHeader>
            <EmptyMedia variant="icon"><MegaphoneIcon /></EmptyMedia>
            <EmptyTitle>Bientôt : vendre une parcelle vérifiée</EmptyTitle>
            <EmptyDescription>
              Vous pourrez publier une annonce pour une parcelle au verdict vert. Les acheteurs verront la fiche vérifiée, sans intermédiaire.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      </SpaceBody>
    </>
  );
}
