import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SpaceBody, SpaceHeader } from "@/components/app/space-header";
import { Steps } from "@/components/app/workflow-bits";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MUTATIONS } from "@/lib/data/pro";
import { getParcel } from "@/lib/data/parcels";
import { mutationFee } from "@/lib/fees";
import { fmtFcfa } from "@/lib/labels";
import { PriceCheck } from "../price-check";

export const metadata: Metadata = { title: "Mutation · Espace professionnel" };

export default async function MutationDetail({ params }: PageProps<"/pro/mutations/[id]">) {
  const { id } = await params;
  const mu = MUTATIONS.find((x) => x.id === id);
  if (!mu) notFound();
  const p = getParcel(mu.nup)!;
  const fee = mutationFee(mu.price);
  const at = ["preparation", "transmise", "enregistree"].indexOf(mu.status);
  return (
    <>
      <SpaceHeader title={`Mutation ${mu.id}`} lead={`Parcelle ${mu.nup} · ${mu.seller} → ${mu.buyer}`} />
      <SpaceBody>
        <div className="grid max-w-5xl gap-6 lg:grid-cols-2">
          <Card className="rounded-lg">
            <CardHeader><CardTitle className="text-base">Prix et frais</CardTitle></CardHeader>
            <CardContent className="space-y-4 text-sm">
              <p>Prix déclaré : <span className="tabular font-semibold">{fmtFcfa(mu.price)}</span></p>
              <p>Frais ANDF : <span className="tabular font-semibold">{fmtFcfa(fee.total)}</span> ({fee.rule})</p>
              <PriceCheck price={mu.price} low={p.pricePerM2.low * p.areaM2} high={p.pricePerM2.high * p.areaM2} />
            </CardContent>
          </Card>
          <Card className="rounded-lg">
            <CardHeader><CardTitle className="text-base">Avancement</CardTitle></CardHeader>
            <CardContent>
              <Steps steps={[
                { label: "Préparation par l'étude", state: at > 0 ? "done" : "current" },
                { label: "Transmission via E-Notaire", state: at > 1 ? "done" : at === 1 ? "current" : "todo" },
                { label: "Nouveau titre au nom de l'acquéreur", state: at === 2 ? "done" : "todo" },
              ]} />
            </CardContent>
          </Card>
        </div>
      </SpaceBody>
    </>
  );
}
