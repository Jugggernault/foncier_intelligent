import type { Metadata } from "next";
import { SpaceBody, SpaceHeader } from "@/components/app/space-header";
import { SimpleBarChart } from "@/components/app/bar-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ENCROACHMENTS } from "@/lib/data/agent";
import { allParcels } from "@/lib/data/parcels";
import { LITIGES } from "@/lib/data/workflow";
import { climate } from "@/lib/climate";

export const metadata: Metadata = { title: "Risques · Pilotage" };

export default function Risks() {
  const communes = [...new Set(allParcels().map((p) => p.commune))];
  const litigesBy = communes.map((c) => ({ name: c, value: LITIGES.filter((l) => allParcels().find((p) => p.nup === l.nup)?.commune === c).length }));
  const flood = communes.map((c) => ({ name: c, value: allParcels().filter((p) => p.commune === c && climate(p).flood === "élevé").length }));
  return (
    <>
      <SpaceHeader title="Risques" lead={`${ENCROACHMENTS.filter((e) => e.status !== "faux-positif").length} empiètements actifs sur le domaine public, ${LITIGES.length} litiges, parcelles en zone inondable par commune.`} />
      <SpaceBody>
        <div className="grid gap-6 xl:grid-cols-2">
          <Card className="rounded-lg"><CardHeader><CardTitle className="text-base">Litiges par commune</CardTitle></CardHeader><CardContent><SimpleBarChart data={litigesBy} label="Litiges" /></CardContent></Card>
          <Card className="rounded-lg"><CardHeader><CardTitle className="text-base">Parcelles à risque d&apos;inondation élevé</CardTitle></CardHeader><CardContent><SimpleBarChart data={flood} label="Parcelles" /></CardContent></Card>
        </div>
      </SpaceBody>
    </>
  );
}
