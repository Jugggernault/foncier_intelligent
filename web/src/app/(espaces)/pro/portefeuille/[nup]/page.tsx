import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SpaceBody, SpaceHeader } from "@/components/app/space-header";
import { ParcelExplorer } from "@/components/parcel/parcel-explorer";
import { Verdict } from "@/components/parcel/verdict";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PORTFOLIO } from "@/lib/data/pro";
import { fmtDate, fmtFcfa } from "@/lib/labels";
import { assess } from "@/lib/risk";

export const metadata: Metadata = { title: "Garantie · Espace professionnel" };

export default async function Collateral({ params }: PageProps<"/pro/portefeuille/[nup]">) {
  const { nup } = await params;
  const c = PORTFOLIO.find((x) => x.parcel.nup === nup);
  if (!c) notFound();
  const p = c.parcel;
  const r = assess(p);
  return (
    <>
      <SpaceHeader title={`Garantie · ${p.nup}`} lead={`${c.borrower} · encours ${fmtFcfa(c.loan)} depuis le ${fmtDate(c.since, "long")}`} />
      <SpaceBody>
        <div className="grid gap-6 lg:grid-cols-12">
          <div className="lg:col-span-7"><ParcelExplorer parcel={{ nup: p.nup, polygon: p.polygon, level: r.level }} neighbours={[]} /></div>
          <div className="space-y-6 lg:col-span-5">
            <Verdict result={r} />
            <Card className="rounded-lg">
              <CardHeader><CardTitle className="text-base">Valeur</CardTitle></CardHeader>
              <CardContent className="text-sm">
                <p className="tabular text-2xl font-extrabold text-navy">{fmtFcfa(p.pricePerM2.low * p.areaM2)} – {fmtFcfa(p.pricePerM2.high * p.areaM2)}</p>
                <p className="mt-1 text-muted-foreground">Estimation de démonstration, mise à jour trimestrielle.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </SpaceBody>
    </>
  );
}
