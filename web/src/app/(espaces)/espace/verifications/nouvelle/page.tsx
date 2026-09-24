import type { Metadata } from "next";
import { SpaceBody, SpaceHeader } from "@/components/app/space-header";
import { VerificationWizard } from "./verification-wizard";

export const metadata: Metadata = { title: "Vérifier avant d'acheter · Foncier Intelligent" };

export default function NewVerification() {
  return (
    <>
      <SpaceHeader title="Vérifier avant d'acheter" lead="Le NUP et les pièces du vendeur suffisent : la plateforme croise le cadastre, l'image satellite et les documents." />
      <SpaceBody>
        <VerificationWizard />
      </SpaceBody>
    </>
  );
}
