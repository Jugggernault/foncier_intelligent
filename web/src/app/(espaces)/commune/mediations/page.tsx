import type { Metadata } from "next";
import Link from "next/link";
import { HandshakeIcon } from "lucide-react";
import { SpaceBody, SpaceHeader } from "@/components/app/space-header";
import { Badge } from "@/components/ui/badge";
import { Item, ItemActions, ItemContent, ItemDescription, ItemGroup, ItemMedia, ItemTitle } from "@/components/ui/item";
import { MEDIATIONS } from "@/lib/data/commune";
import { fmtDate } from "@/lib/labels";

export const metadata: Metadata = { title: "Médiations · Espace commune" };

const MED_LABEL = { planifiee: "Planifiée", accord: "Accord trouvé", echec: "Sans accord" };

export default function Mediations() {
  return (
    <>
      <SpaceHeader title="Médiations CoGeF et SVGF" lead="Séances de conciliation ; le procès-verbal est rédigé automatiquement à partir des notes de séance." />
      <SpaceBody>
        <ItemGroup className="max-w-3xl gap-2">
          {MEDIATIONS.map((m) => (
            <Item key={m.id} variant="outline" className="bg-card" render={<Link href={`/commune/mediations/${m.id}`} />}>
              <ItemMedia variant="icon"><HandshakeIcon /></ItemMedia>
              <ItemContent>
                <ItemTitle>{fmtDate(m.date, "long")} · litige <span className="tabular">{m.litige}</span></ItemTitle>
                <ItemDescription>{m.place} · {m.mediator}</ItemDescription>
              </ItemContent>
              <ItemActions><Badge variant={m.status === "planifiee" ? "secondary" : "outline"} className="rounded-sm">{MED_LABEL[m.status]}</Badge></ItemActions>
            </Item>
          ))}
        </ItemGroup>
      </SpaceBody>
    </>
  );
}
