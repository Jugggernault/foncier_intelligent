import type { Metadata } from "next";
import { SpaceBody, SpaceHeader } from "@/components/app/space-header";
import { VerificationWizard } from "@/components/app/verification-wizard";

export const metadata: Metadata = { title: "Nouvelle vérification · Espace professionnel" };

export default function NewDueDiligence() {
  return (
    <>
      <SpaceHeader title="Nouvelle vérification" lead="NUP et pièces du vendeur : cadastre, imagerie et documents croisés en une fois." />
      <SpaceBody><VerificationWizard /></SpaceBody>
    </>
  );
}
