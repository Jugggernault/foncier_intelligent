import { assessFull, verdictFn } from "@/lib/geo/verdict";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { copilot } from "@/lib/copilot";
import { getParcel, neighbours } from "@/lib/data/parcels";
import { getDossier } from "@/lib/data/workflow";
import { fmtArea, ownerLabel, rightLabel } from "@/lib/labels";
import { Workstation } from "./workstation";

export async function generateMetadata({ params }: PageProps<"/agent/dossiers/[id]">): Promise<Metadata> {
  return { title: `Dossier ${(await params).id} · Espace agent` };
}

export default async function DossierWorkstation({ params }: PageProps<"/agent/dossiers/[id]">) {
  const judge = await verdictFn();
  const d = getDossier((await params).id);
  if (!d) notFound();
  const p = getParcel(d.nup)!;
  const { result: r, hits } = await assessFull(p);
  return (
    <Workstation
      dossier={d}
      parcel={{ nup: p.nup, polygon: p.polygon, level: r.level }}
      neighbours={neighbours(p, 2500).slice(0, 10).map((n) => ({ nup: n.nup, polygon: n.polygon, level: judge(n).level }))}
      facts={[
        ["Localisation", `${p.quartier}, ${p.commune}`],
        ["Superficie cadastrale", fmtArea(p.areaM2)],
        ["Situation", rightLabel(p)],
        ["Propriétaire", ownerLabel(p)],
        ["Verdict", r.headline],
        ["Alertes satellite", p.alerts.length ? String(p.alerts.length) : "Aucune"],
      ]}
      ai={copilot(d, p, hits)}
    />
  );
}
