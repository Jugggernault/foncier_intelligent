import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SpaceBody, SpaceHeader } from "@/components/app/space-header";
import { LinkedMap } from "@/components/map/linked-map";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getParcel, isPublicityOpen, neighbours } from "@/lib/data/parcels";
import { fmtArea, fmtDate, procedureLabel } from "@/lib/labels";

export const metadata: Metadata = { title: "Avis de publicité · Espace agent" };

export default async function AgentNotice({ params }: PageProps<"/agent/publicite/[nup]">) {
  const p = getParcel((await params).nup);
  if (!p?.procedure) notFound();
  const near = neighbours(p, 800);
  const oppositions = isPublicityOpen(p) ? (Number(p.nup.slice(-1)) % 3 === 0 ? 1 : 0) : Number(p.nup.slice(-1)) % 4 === 0 ? 1 : 0;
  return (
    <>
      <SpaceHeader title={`Avis n° ${p.procedure.requestNumber}`} lead={`${procedureLabel(p.procedure)} · parcelle ${p.nup} · ${fmtDate(p.procedure.publicity.start)} → ${fmtDate(p.procedure.publicity.end)}`} />
      <SpaceBody>
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-6">
            <Card className="rounded-lg">
              <CardHeader><CardTitle className="text-base">Texte publié</CardTitle></CardHeader>
              <CardContent className="text-sm leading-relaxed">
                Demande n° {p.procedure.requestNumber} du {fmtDate(p.procedure.requestDate, "long")} portant sur la parcelle NUP {p.nup}, {p.quartier}, {p.arrondissement}, {p.commune}, superficie calculée {fmtArea(p.areaM2)}.
              </CardContent>
            </Card>
            <Card className="rounded-lg">
              <CardHeader><CardTitle className="text-base">Diffusion et oppositions</CardTitle></CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p><span className="tabular font-semibold">{near.length}</span> parcelles riveraines ; leurs titulaires abonnés ont reçu un SMS.</p>
                <p><span className="tabular font-semibold">{oppositions}</span> opposition{oppositions > 1 ? "s" : ""} reçue{oppositions > 1 ? "s" : ""}.</p>
              </CardContent>
            </Card>
          </div>
          <div className="aspect-square overflow-hidden rounded-lg border">
            <LinkedMap parcels={[...near.map((n) => ({ nup: n.nup, polygon: n.polygon })), { nup: p.nup, polygon: p.polygon, level: "caution" as const }]} selected={p.nup} hrefBase="/agent/parcelles" label="Carte de l'avis et des riverains" />
          </div>
        </div>
      </SpaceBody>
    </>
  );
}
