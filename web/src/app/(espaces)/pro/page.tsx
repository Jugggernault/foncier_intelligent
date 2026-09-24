import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";
import { SpaceBody, SpaceHeader } from "@/components/app/space-header";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DEEDS, MUTATIONS, PORTFOLIO, SURVEYS } from "@/lib/data/pro";
import { assess } from "@/lib/risk";
import { requirePersona } from "@/lib/session";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Tableau de bord · Espace professionnel" };

export default async function ProHome() {
  const persona = await requirePersona("pro");
  const blocks: Record<string, { title: string; lines: string[]; cta: [string, string] }[]> = {
    notaire: [
      { title: "Mutations", lines: [`${MUTATIONS.filter((m) => m.status === "preparation").length} en préparation`, `${MUTATIONS.filter((m) => m.status === "transmise").length} transmises à l'ANDF`], cta: ["Préparer une mutation", "/pro/mutations/nouvelle"] },
      { title: "Vérifications avant signature", lines: ["Croisement cadastre, pièces et imagerie", "Rapport horodaté à joindre à l'acte"], cta: ["Nouvelle vérification", "/pro/due-diligence/nouvelle"] },
    ],
    geometre: [
      { title: "Levés", lines: [`${SURVEYS.length} levés ce mois`, `${SURVEYS.filter((s) => s.issues).length} chevauchement à corriger`], cta: ["Importer un levé", "/pro/leves/nouveau"] },
    ],
    huissier: [
      { title: "Actes", lines: [`${DEEDS.filter((d) => d.status === "demandee").length} demandes en cours`, "Délai : 24 h"], cta: ["Demander un acte", "/pro/actes/nouveau"] },
    ],
    banque: [
      { title: "Garanties", lines: [`${PORTFOLIO.length} parcelles en garantie`, `${PORTFOLIO.filter((c) => assess(c.parcel).level !== "clear").length} avec un signal d'alerte`], cta: ["Voir le portefeuille", "/pro/portefeuille"] },
      { title: "Vérification avant crédit", lines: ["Score de risque et valeur estimée", "Accessible aussi par API"], cta: ["Nouvelle vérification", "/pro/due-diligence/nouvelle"] },
    ],
  };
  return (
    <>
      <SpaceHeader title={`Bonjour ${persona.name}`} lead={persona.description} />
      <SpaceBody>
        <div className="grid max-w-5xl gap-6 md:grid-cols-2">
          {blocks[persona.proRole ?? "notaire"].map((b) => (
            <Card key={b.title} className="rounded-lg">
              <CardHeader><CardTitle className="text-base">{b.title}</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-1 text-sm">{b.lines.map((l) => <li key={l}>{l}</li>)}</ul>
                <Link href={b.cta[1]} className={cn(buttonVariants(), "px-4")}>{b.cta[0]} <ArrowRightIcon data-icon="inline-end" /></Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </SpaceBody>
    </>
  );
}
