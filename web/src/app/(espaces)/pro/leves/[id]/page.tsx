import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SpaceBody, SpaceHeader } from "@/components/app/space-header";
import { ParcelExplorer } from "@/components/parcel/parcel-explorer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getParcel, neighbours } from "@/lib/data/parcels";
import { SURVEYS } from "@/lib/data/pro";
import { fmtArea, fmtDate } from "@/lib/labels";

export const metadata: Metadata = { title: "Levé · Espace professionnel" };

export default async function Survey({ params }: PageProps<"/pro/leves/[id]">) {
  const { id } = await params;
  const s = SURVEYS.find((x) => x.id === id);
  if (!s) notFound();
  const p = getParcel(s.nup)!;
  return (
    <>
      <SpaceHeader title={`Levé ${s.id}`} lead={`Parcelle ${s.nup} · ${s.client} · ${fmtDate(s.date, "long")}`} />
      <SpaceBody>
        <div className="grid gap-6 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <ParcelExplorer parcel={{ nup: p.nup, polygon: p.polygon, level: s.issues ? "caution" : "clear" }} neighbours={neighbours(p, 2500).slice(0, 10).map((n) => ({ nup: n.nup, polygon: n.polygon }))} />
          </div>
          <Card className="h-fit rounded-lg lg:col-span-4">
            <CardHeader><CardTitle className="text-base">Contrôle topologique</CardTitle></CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p>{s.points} sommets · {fmtArea(p.areaM2)}</p>
              <p className={s.issues ? "text-caution" : "text-clear"}>{s.issues ? "Un chevauchement de 2,4 m sur la limite nord avec la parcelle voisine." : "Aucun chevauchement ni trou avec les parcelles voisines."}</p>
              <p className="text-muted-foreground">Pré-tracé IA disponible : IoU 0,86 avec votre levé.</p>
            </CardContent>
          </Card>
        </div>
      </SpaceBody>
    </>
  );
}
