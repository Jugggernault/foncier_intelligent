import { verdictFn } from "@/lib/geo/verdict";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FileTextIcon } from "lucide-react";
import { SpaceBody, SpaceHeader } from "@/components/app/space-header";
import { ParcelExplorer } from "@/components/parcel/parcel-explorer";
import { Verdict } from "@/components/parcel/verdict";
import { buttonVariants } from "@/components/ui/button";
import { Item, ItemActions, ItemContent, ItemDescription, ItemGroup, ItemMedia, ItemTitle } from "@/components/ui/item";
import { OWNED } from "@/lib/data/citizen";
import { neighbours } from "@/lib/data/parcels";
import { fmtArea, fmtDate, rightLabel } from "@/lib/labels";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Ma parcelle · Foncier Intelligent" };

export default async function MyParcel({ params }: PageProps<"/espace/parcelles/[nup]">) {
  const judge = await verdictFn();
  const { nup } = await params;
  const p = OWNED.find((o) => o.nup === nup);
  if (!p) notFound();
  const result = judge(p);
  const docs = [
    ["Titre foncier ou attestation", p.right === "titre" ? `TF n° ${p.titleNumber}` : "Attestation de détention coutumière", "2024-11-02"],
    ["Levé topographique", "Géomètre-expert agréé", "2024-10-18"],
    ["Quittance TFU 2025", "Direction générale des impôts", "2025-04-30"],
  ];

  return (
    <>
      <SpaceHeader title={`Parcelle ${p.nup}`} lead={`${p.quartier}, ${p.commune} · ${fmtArea(p.areaM2)} · ${rightLabel(p)}`}>
        <Link href={`/parcelle/${p.nup}/rapport`} className={cn(buttonVariants({ variant: "outline", size: "lg" }), "h-10 px-4")}>Rapport</Link>
        <Link href={`/parcelle/${p.nup}`} className={cn(buttonVariants({ size: "lg" }), "h-10 px-4")}>Fiche publique</Link>
      </SpaceHeader>
      <SpaceBody>
        <div className="grid gap-6 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <ParcelExplorer
              parcel={{ nup: p.nup, polygon: p.polygon, level: result.level }}
              neighbours={neighbours(p, 2500).slice(0, 10).map((n) => ({ nup: n.nup, polygon: n.polygon }))}
            />
          </div>
          <div className="space-y-6 lg:col-span-5">
            <Verdict result={result} />
            <section>
              <h2 className="font-bold text-navy">Mes documents</h2>
              <ItemGroup className="mt-3 gap-2">
                {docs.map(([name, source, date]) => (
                  <Item key={name} variant="outline" className="bg-card">
                    <ItemMedia variant="icon"><FileTextIcon /></ItemMedia>
                    <ItemContent>
                      <ItemTitle>{name}</ItemTitle>
                      <ItemDescription>{source}</ItemDescription>
                    </ItemContent>
                    <ItemActions className="text-xs text-muted-foreground">{fmtDate(date)}</ItemActions>
                  </Item>
                ))}
              </ItemGroup>
            </section>
          </div>
        </div>
      </SpaceBody>
    </>
  );
}
