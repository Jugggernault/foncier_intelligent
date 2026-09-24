import type { Metadata } from "next";
import { SpaceBody, SpaceHeader } from "@/components/app/space-header";
import { PRETRACE } from "@/lib/data/agent";
import { PretraceTable } from "./pretrace-table";

export const metadata: Metadata = { title: "Pré-tracé IA · Espace agent" };

export default function Pretrace() {
  return (
    <>
      <SpaceHeader title="Pré-tracé des limites par IA" lead="Lots de polygones proposés par segmentation de l'orthophoto. Ils n'ont aucune valeur juridique avant validation par un géomètre assermenté." />
      <SpaceBody>
        <PretraceTable lots={PRETRACE} />
      </SpaceBody>
    </>
  );
}
