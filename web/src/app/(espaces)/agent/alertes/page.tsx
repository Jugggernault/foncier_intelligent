import type { Metadata } from "next";
import Link from "next/link";
import { SpaceBody, SpaceHeader } from "@/components/app/space-header";
import { LinkedMap } from "@/components/map/linked-map";
import { Badge } from "@/components/ui/badge";
import { Item, ItemActions, ItemContent, ItemDescription, ItemGroup, ItemTitle } from "@/components/ui/item";
import { ENCROACHMENT_LABEL, ENCROACHMENTS, parcelOf } from "@/lib/data/agent";
import { fmtDate } from "@/lib/labels";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Empiètements · Espace agent" };

const TONE = { nouvelle: "bg-danger-soft text-danger", verification: "bg-caution-soft text-caution", confirmee: "bg-danger text-white", "faux-positif": "bg-muted text-muted-foreground" };

export default function Encroachments() {
  return (
    <>
      <SpaceHeader title="Alertes d'empiètement" lead="Nouvelles constructions détectées par satellite sur le domaine de l'État, les forêts classées et les zones inondables." />
      <SpaceBody>
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
