import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SpaceBody, SpaceHeader } from "@/components/app/space-header";
import { CompareYears } from "@/components/map/compare-years";
import { ENCROACHMENT_LABEL, getEncroachment, parcelOf } from "@/lib/data/agent";
import { fmtDate } from "@/lib/labels";
import { AlertActions } from "./alert-actions";

export const metadata: Metadata = { title: "Alerte d'empiètement · Espace agent" };

export default async function Encroachment({ params }: PageProps<"/agent/alertes/[id]">) {
  const e = getEncroachment((await params).id);
  if (!e) notFound();
  const p = parcelOf(e.nup);
  return (
    <>
      <SpaceHeader title={`${e.id} · ${e.zone}`} lead={`${e.note} Parcelle ${e.nup}, ${p.quartier}, ${p.commune}. Détectée le ${fmtDate(e.detected, "long")}, ${e.areaM2} m² bâtis, confiance ${Math.round(e.confidence * 100)} %. État : ${ENCROACHMENT_LABEL[e.status].toLowerCase()}.`} />
      <SpaceBody>
        <div className="max-w-5xl space-y-6">
          <CompareYears parcel={{ nup: p.nup, polygon: p.polygon, level: "danger" }} before={2018} after={2025} />
          <AlertActions />
        </div>
      </SpaceBody>
    </>
  );
}
