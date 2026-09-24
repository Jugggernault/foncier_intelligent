import type { Metadata } from "next";
import { SpaceBody, SpaceHeader } from "@/components/app/space-header";
import { ComplaintForm } from "./complaint-form";

export const metadata: Metadata = { title: "Déposer une plainte · Foncier Intelligent" };

export default async function NewComplaint({ searchParams }: PageProps<"/espace/litiges/nouveau">) {
  const nup = (await searchParams).nup;
  return (
    <>
      <SpaceHeader title="Déposer une plainte" lead="Conflit de limites, double vente, succession, empiètement : décrivez la situation, nous vous orientons." />
      <SpaceBody>
        <ComplaintForm defaultNup={typeof nup === "string" ? nup : undefined} />
      </SpaceBody>
    </>
  );
}
