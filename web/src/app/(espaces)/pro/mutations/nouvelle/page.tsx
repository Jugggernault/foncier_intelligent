import type { Metadata } from "next";
import { SpaceBody, SpaceHeader } from "@/components/app/space-header";
import { MutationForm } from "./mutation-form";

export const metadata: Metadata = { title: "Préparer une mutation · Espace professionnel" };

export default function NewMutation() {
  return (
    <>
      <SpaceHeader title="Préparer une mutation" lead="Vérification de la parcelle, calcul des frais et contrôle du prix déclaré avant transmission." />
      <SpaceBody><MutationForm /></SpaceBody>
    </>
  );
}
