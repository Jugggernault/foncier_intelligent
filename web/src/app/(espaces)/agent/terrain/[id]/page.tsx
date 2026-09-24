import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SpaceBody, SpaceHeader } from "@/components/app/space-header";
import { ParcelMap } from "@/components/map/parcel-map";
import { getMission, parcelOf } from "@/lib/data/agent";
import { fmtDate } from "@/lib/labels";
import { MissionForm } from "./mission-form";

export const metadata: Metadata = { title: "Mission terrain · Espace agent" };

export default async function Mission({ params }: PageProps<"/agent/terrain/[id]">) {
  const m = getMission((await params).id);
  if (!m) notFound();
  const p = parcelOf(m.nup);
  return (
    <>
      <SpaceHeader title={`${m.kind} · ${m.id}`} lead={`Parcelle ${p.nup}, ${p.quartier}, ${p.commune} · ${fmtDate(m.date, "long")} · ${m.agent}`} />
      <SpaceBody>
        <div className="grid max-w-5xl gap-6 lg:grid-cols-2">
          <div className="aspect-square overflow-hidden rounded-lg border">
            <ParcelMap parcels={[{ nup: p.nup, polygon: p.polygon, level: "caution" }]} selected={p.nup} basemap="plan" padding={80} label={`Plan d'accès à la parcelle ${p.nup}`} />
          </div>
          <MissionForm checklist={m.checklist} done={m.status === "terminee"} />
        </div>
      </SpaceBody>
    </>
  );
}
