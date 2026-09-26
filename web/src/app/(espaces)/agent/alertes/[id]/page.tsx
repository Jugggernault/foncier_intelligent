import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { NdviChart } from "@/components/app/ndvi-chart";
import { SpaceBody, SpaceHeader } from "@/components/app/space-header";
import { CompareYears } from "@/components/map/compare-years";
import { ENCROACHMENT_LABEL, getEncroachment, parcelOf } from "@/lib/data/agent";
import { getSatelliteAlert } from "@/lib/data/satellite-alerts";
import { fmtDate } from "@/lib/labels";
import { AlertActions } from "./alert-actions";

export const metadata: Metadata = { title: "Alerte d'empiètement · Espace agent" };

export default async function Encroachment({ params }: PageProps<"/agent/alertes/[id]">) {
  const id = (await params).id;
  const sat = getSatelliteAlert(id);
  if (sat) {
    const ha = (sat.areaM2 / 10_000).toLocaleString("fr-FR", { maximumFractionDigits: 1 });
    return (
      <>
        <SpaceHeader title={`${sat.id} · ${sat.zone}`} lead={`${sat.note} Environ ${ha} ha, apparu entre ${sat.from} et ${sat.to}. Détection automatique, à confirmer sur le terrain.`} />
        <SpaceBody>
          <div className="max-w-5xl space-y-8">
            <figure>
              <Image src={`/alerts/${sat.id}.jpg`} alt={`Même emprise en 2017 et en 2025 : ${sat.zone}`} width={1024} height={512} className="w-full rounded-lg border" />
              <figcaption className="mt-1 text-xs text-muted-foreground">À gauche 2017, à droite 2025. Contour jaune : zone qui a changé. Sentinel-2 GeoMAD © Digital Earth Africa (CC BY 4.0).</figcaption>
            </figure>
            <section>
              <h2 className="font-bold text-navy">Explorer année par année</h2>
              <div className="mt-3">
                <CompareYears parcel={{ nup: sat.id, polygon: sat.polygon, level: "danger" }} before={sat.years[0]} after={sat.to} />
              </div>
            </section>
            <section className="max-w-2xl">
              <h2 className="font-bold text-navy">Indice de végétation (NDVI) de la zone</h2>
              <p className="mt-1 text-sm text-muted-foreground">Un couvert forestier se situe autour de 0,5. La chute sous 0,25 signale un sol mis à nu ou bâti.</p>
              <NdviChart values={sat.ndvi} expected={0.5} years={sat.years} />
            </section>
            <p className="text-xs text-muted-foreground">
              Méthode : composites annuels sans nuages (10 m par pixel), baisse de l&apos;indice de végétation et hausse de l&apos;indice de bâti entre 2017 et 2025, pixels regroupés en taches d&apos;au moins 0,4 ha à l&apos;intérieur des zones à protéger (couches de l&apos;ANDF). Limites : une maison isolée n&apos;est pas visible à cette résolution, et une partie d&apos;une forêt classée peut avoir été déclassée par décret.
            </p>
            <AlertActions />
          </div>
        </SpaceBody>
      </>
    );
  }

  const e = getEncroachment(id);
  if (!e) notFound();
  const p = parcelOf(e.nup);
  return (
    <>
      <SpaceHeader title={`${e.id} · ${e.zone}`} lead={`${e.note} Parcelle ${e.nup}, ${p.quartier}, ${p.commune}. Détectée le ${fmtDate(e.detected, "long")}, ${e.areaM2} m² bâtis, confiance ${Math.round(e.confidence * 100)} %. État : ${ENCROACHMENT_LABEL[e.status].toLowerCase()}. (Exemple simulé.)`} />
      <SpaceBody>
        <div className="max-w-5xl space-y-6">
          <CompareYears parcel={{ nup: p.nup, polygon: p.polygon, level: "danger" }} before={2018} after={2025} />
          <AlertActions />
        </div>
      </SpaceBody>
    </>
  );
}
