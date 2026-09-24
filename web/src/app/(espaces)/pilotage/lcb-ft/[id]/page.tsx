import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SpaceBody, SpaceHeader } from "@/components/app/space-header";
import { AmlGraph } from "@/components/app/aml-graph";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAmlCase } from "@/lib/data/pilotage";
import { fmtDate } from "@/lib/labels";

export const metadata: Metadata = { title: "Cas LCB-FT · Pilotage" };

export default async function AmlCase({ params }: PageProps<"/pilotage/lcb-ft/[id]">) {
  const c = getAmlCase((await params).id);
  if (!c) notFound();
  return (
    <>
      <SpaceHeader title={`${c.id} · ${c.title}`} lead={c.pattern} />
      <SpaceBody>
        <div className="grid gap-6 xl:grid-cols-12">
          <div className="h-[60dvh] overflow-hidden rounded-lg border bg-card xl:col-span-8"><AmlGraph nodes={c.nodes} edges={c.edges} /></div>
          <Card className="h-fit rounded-lg xl:col-span-4">
            <CardHeader><CardTitle className="text-base">Chronologie</CardTitle></CardHeader>
            <CardContent>
              <ol className="space-y-3 border-l-2 border-sky-line pl-5 text-sm">
                {c.timeline.map(([d, t]) => (
                  <li key={d + t}><p className="font-semibold">{fmtDate(d)}</p><p className="text-muted-foreground">{t}</p></li>
                ))}
              </ol>
              <p className="mt-4 text-xs text-muted-foreground">Un signalement n&apos;est pas une accusation : il déclenche une analyse humaine avant toute transmission.</p>
            </CardContent>
          </Card>
        </div>
      </SpaceBody>
    </>
  );
}
