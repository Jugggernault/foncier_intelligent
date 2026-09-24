import type { Metadata } from "next";
import Link from "next/link";
import { MapPinIcon } from "lucide-react";
import { SpaceBody, SpaceHeader } from "@/components/app/space-header";
import { Badge } from "@/components/ui/badge";
import { Item, ItemActions, ItemContent, ItemDescription, ItemGroup, ItemMedia, ItemTitle } from "@/components/ui/item";
import { MISSIONS, parcelOf } from "@/lib/data/agent";
import { fmtDate } from "@/lib/labels";

export const metadata: Metadata = { title: "Missions terrain · Espace agent" };

const STATUS = { planifiee: "Planifiée", "en-cours": "En cours", terminee: "Terminée" };

export default function Missions() {
  return (
    <>
      <SpaceHeader title="Missions terrain" lead="Vérifications et bornages à mener sur place. Utilisable sur téléphone, même sans connexion." />
      <SpaceBody>
        <ItemGroup className="max-w-3xl gap-2">
          {MISSIONS.map((m) => {
            const p = parcelOf(m.nup);
            return (
              <Item key={m.id} variant="outline" className="bg-card" render={<Link href={`/agent/terrain/${m.id}`} />}>
                <ItemMedia variant="icon"><MapPinIcon /></ItemMedia>
                <ItemContent>
                  <ItemTitle>{m.kind}</ItemTitle>
                  <ItemDescription><span className="tabular">{m.nup}</span> · {p.quartier}, {p.commune}</ItemDescription>
                </ItemContent>
                <ItemActions className="flex-col items-end gap-1">
                  <Badge variant={m.status === "terminee" ? "outline" : "secondary"} className="rounded-sm">{STATUS[m.status]}</Badge>
                  <span className="text-xs text-muted-foreground">{fmtDate(m.date)}</span>
                </ItemActions>
              </Item>
            );
          })}
        </ItemGroup>
      </SpaceBody>
    </>
  );
}
