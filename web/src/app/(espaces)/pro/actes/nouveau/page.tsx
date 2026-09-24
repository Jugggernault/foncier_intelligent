import type { Metadata } from "next";
import { SpaceBody, SpaceHeader } from "@/components/app/space-header";
import { DeedForm } from "./deed-form";

export const metadata: Metadata = { title: "Demander un acte · Espace professionnel" };

export default function NewDeed() {
  return (
    <>
      <SpaceHeader title="Demander un acte" />
      <SpaceBody><DeedForm /></SpaceBody>
    </>
  );
}
