import type { Metadata } from "next";
import Link from "next/link";
import { SpaceBody, SpaceHeader } from "@/components/app/space-header";
import { LinkedMap } from "@/components/map/linked-map";
import { Badge } from "@/components/ui/badge";
import { Item, ItemActions, ItemContent, ItemDescription, ItemGroup, ItemTitle } from "@/components/ui/item";
import Image from "next/image";
import { ENCROACHMENT_LABEL, ENCROACHMENTS, parcelOf } from "@/lib/data/agent";
import { SATELLITE_ALERTS } from "@/lib/data/satellite-alerts";
import { fmtDate } from "@/lib/labels";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Empiètements · Espace agent" };

const TONE = { nouvelle: "bg-danger-soft text-danger", verification: "bg-caution-soft text-caution", confirmee: "bg-danger text-white", "faux-positif": "bg-muted text-muted-foreground" };

export default function Encroachments() {
  return (
    <>
      <SpaceHeader title="Alertes d'empiètement" lead="Nouvelles constructions détectées par satellite sur le domaine de l'État, les forêts classées et les zones inondables." />
      <SpaceBody>
        <section className="mb-10">
          <h2 className="font-bold text-navy">Détections satellite réelles <span className="font-normal text-muted-foreground">· Sentinel-2, 2017 → 2025</span></h2>
          <p className="mt-1 max-w-3xl text-sm text-muted-foreground">
            Calculées sur les images annuelles de Digital Earth Africa : la végétation disparaît et le sol ou le bâti apparaît, à l&apos;intérieur d&apos;une zone à protéger. À confirmer sur le terrain.
          </p>
          <ul className="mt-4 grid gap-4 lg:grid-cols-3">
            {SATELLITE_ALERTS.map((a) => (
              <li key={a.id}>
                <Link href={`/agent/alertes/${a.id}`} className="block overflow-hidden rounded-lg border bg-card transition-colors hover:border-navy/40">
                  <Image src={`/alerts/${a.id}.jpg`} alt={`Avant (2017) et après (2025) : ${a.zone}`} width={1024} height={512} className="aspect-[2/1] w-full object-cover" />
                  <div className="p-4">
                    <p className="font-semibold"><span className="tabular">{a.id}</span> · {a.zone}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{(a.areaM2 / 10_000).toLocaleString("fr-FR", { maximumFractionDigits: 1 })} ha · apparu entre {a.from} et {a.to}</p>
                    <Badge className="mt-2 rounded-sm bg-danger-soft text-danger">À vérifier sur le terrain</Badge>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </section>
        <h2 className="mb-3 font-bold text-navy">Exemples simulés <span className="font-normal text-muted-foreground">· parcelles de démonstration</span></h2>
        <div className="grid gap-6 lg:grid-cols-12">
          <ItemGroup className="gap-2 lg:col-span-5">
            {ENCROACHMENTS.map((e) => (
              <Item key={e.id} variant="outline" className="bg-card" render={<Link href={`/agent/alertes/${e.id}`} />}>
                <ItemContent>
                  <ItemTitle><span className="tabular">{e.id}</span> · {e.zone}</ItemTitle>
                  <ItemDescription>Parcelle <span className="tabular">{e.nup}</span> · {e.areaM2} m² · confiance {Math.round(e.confidence * 100)} %</ItemDescription>
                </ItemContent>
                <ItemActions className="flex-col items-end gap-1">
                  <Badge className={cn("rounded-sm", TONE[e.status])}>{ENCROACHMENT_LABEL[e.status]}</Badge>
                  <span className="text-xs text-muted-foreground">{fmtDate(e.detected)}</span>
                </ItemActions>
              </Item>
            ))}
          </ItemGroup>
          <div className="aspect-square overflow-hidden rounded-lg border lg:sticky lg:top-20 lg:col-span-7">
            <LinkedMap
              parcels={ENCROACHMENTS.map((e) => ({ nup: e.nup, polygon: parcelOf(e.nup).polygon, level: e.status === "faux-positif" ? "clear" : e.status === "nouvelle" ? "danger" : "caution" }))}
              hrefBase="/agent/parcelles"
              label="Carte des empiètements"
            />
          </div>
        </div>
      </SpaceBody>
    </>
  );
}
