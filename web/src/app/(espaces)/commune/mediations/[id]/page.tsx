import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SpaceBody, SpaceHeader } from "@/components/app/space-header";
import { MEDIATIONS } from "@/lib/data/commune";
import { getLitige } from "@/lib/data/workflow";
import { disputeLabel, fmtDate } from "@/lib/labels";
import { MinutesEditor } from "./minutes-editor";

export const metadata: Metadata = { title: "Séance de médiation · Espace commune" };

export default async function Mediation({ params }: PageProps<"/commune/mediations/[id]">) {
  const { id } = await params;
  const m = MEDIATIONS.find((x) => x.id === id);
  if (!m) notFound();
  const l = getLitige(m.litige)!;
  return (
    <>
      <SpaceHeader title={`Séance ${m.id}`} lead={`${disputeLabel[l.kind]} · parcelle ${l.nup} · ${fmtDate(m.date, "long")} · ${m.place}`} />
      <SpaceBody>
        <MinutesEditor parties={l.parties} summary={l.summary} date={fmtDate(m.date, "long")} place={m.place} mediator={m.mediator} nup={l.nup} />
      </SpaceBody>
    </>
  );
}
