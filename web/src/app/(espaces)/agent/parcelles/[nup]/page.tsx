import { verdictFn } from "@/lib/geo/verdict";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SpaceBody, SpaceHeader } from "@/components/app/space-header";
import { StatusBadge } from "@/components/app/workflow-bits";
import { ParcelExplorer } from "@/components/parcel/parcel-explorer";
import { Verdict } from "@/components/parcel/verdict";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getParcel, neighbours } from "@/lib/data/parcels";
import { KIND_LABEL, LITIGES, listDossiers } from "@/lib/data/workflow";
import { fmtArea, rightLabel } from "@/lib/labels";

export const metadata: Metadata = { title: "Fiche interne · Espace agent" };

export default async function InternalParcel({ params }: PageProps<"/agent/parcelles/[nup]">) {
  const judge = await verdictFn();
  const p = getParcel((await params).nup);
  if (!p) notFound();
  const r = judge(p);
  const dossiers = listDossiers().filter((d) => d.nup === p.nup);
  const litiges = LITIGES.filter((l) => l.nup === p.nup);
  return (
    <>
      <SpaceHeader title={`Parcelle ${p.nup}`} lead={`${p.quartier}, ${p.arrondissement}, ${p.commune} · ${fmtArea(p.areaM2)} · ${rightLabel(p)}`} />
      <SpaceBody>
        <div className="grid gap-6 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <ParcelExplorer parcel={{ nup: p.nup, polygon: p.polygon, level: r.level }} neighbours={neighbours(p, 2500).slice(0, 10).map((n) => ({ nup: n.nup, polygon: n.polygon, level: judge(n).level }))} />
          </div>
          <div className="space-y-6 lg:col-span-5">
            <Verdict result={r} />
            <Card className="rounded-lg">
              <CardHeader><CardTitle className="text-base">Titulaire (accès agent)</CardTitle></CardHeader>
              <CardContent className="text-sm">
                {p.owner.kind === "state" ? "État béninois" : `Particulier ${p.owner.initials} · identité complète visible dans e-Foncier`}
              </CardContent>
            </Card>
            <Card className="rounded-lg">
              <CardHeader><CardTitle className="text-base">Dossiers et litiges</CardTitle></CardHeader>
              <CardContent className="space-y-2 text-sm">
                {dossiers.map((d) => (
                  <p key={d.id} className="flex items-center justify-between gap-2">
                    <Link href={`/agent/dossiers/${d.id}`} className="tabular font-semibold text-navy hover:underline">{d.id}</Link>
                    <span>{KIND_LABEL[d.kind]}</span>
                    <StatusBadge status={d.status} />
                  </p>
                ))}
                {litiges.map((l) => (
                  <p key={l.id}><Link href={`/agent/litiges/${l.id}`} className="tabular font-semibold text-navy hover:underline">{l.id}</Link> · litige</p>
                ))}
                {!dossiers.length && !litiges.length && <p className="text-muted-foreground">Aucun dossier ni litige.</p>}
              </CardContent>
            </Card>
          </div>
        </div>
      </SpaceBody>
    </>
  );
}
