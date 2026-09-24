import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SpaceBody, SpaceHeader } from "@/components/app/space-header";
import { CompareYears } from "@/components/map/compare-years";
import { NdviChart } from "@/components/app/ndvi-chart";
import { parcelOf, RURAL } from "@/lib/data/agent";

export const metadata: Metadata = { title: "Projet de mise en valeur · Espace agent" };

export default async function DevelopmentProject({ params }: PageProps<"/agent/rural/mise-en-valeur/[nup]">) {
  const { nup } = await params;
  const r = RURAL.find((x) => x.nup === nup);
  if (!r) notFound();
  const p = parcelOf(nup);
  return (
    <>
      <SpaceHeader title={`Projet agricole · ${nup}`} lead={`${r.buyer} · ${r.areaHa} ha · ${p.quartier}, ${p.commune}`} />
      <SpaceBody>
        <div className="grid max-w-6xl gap-6 lg:grid-cols-2">
          <div className="rounded-lg border bg-card p-4">
            <h2 className="font-bold text-navy">Indice de végétation (NDVI) moyen de la parcelle</h2>
            <NdviChart values={r.ndvi} expected={r.expected} />
            <p className="mt-2 text-xs text-muted-foreground">Données de démonstration ; source prévue : Sentinel-2 via Digital Earth Africa.</p>
          </div>
          <CompareYears parcel={{ nup: p.nup, polygon: p.polygon, level: "caution" }} before={2018} after={2024} />
        </div>
      </SpaceBody>
    </>
  );
}
