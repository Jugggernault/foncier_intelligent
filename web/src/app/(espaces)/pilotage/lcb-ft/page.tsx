import type { Metadata } from "next";
import Link from "next/link";
import { NetworkIcon } from "lucide-react";
import { SpaceBody, SpaceHeader } from "@/components/app/space-header";
import { Badge } from "@/components/ui/badge";
import { Item, ItemActions, ItemContent, ItemDescription, ItemGroup, ItemMedia, ItemTitle } from "@/components/ui/item";
import { AML_CASES } from "@/lib/data/pilotage";

export const metadata: Metadata = { title: "Anti-blanchiment · Pilotage" };

const LABEL = { ouvert: "Ouvert", "transmis-centif": "Transmis à la CENTIF", clos: "Clos" };

export default function Aml() {
  return (
    <>
      <SpaceHeader title="Lutte contre le blanchiment" lead="Détection de schémas atypiques sur le graphe personnes, sociétés et parcelles : fractionnement sous les seuils, prête-noms, reventes rapides. Accès restreint." />
      <SpaceBody>
        <ItemGroup className="max-w-4xl gap-2">
          {AML_CASES.map((c) => (
            <Item key={c.id} variant="outline" className="bg-card" render={<Link href={`/pilotage/lcb-ft/${c.id}`} />}>
              <ItemMedia variant="icon"><NetworkIcon /></ItemMedia>
              <ItemContent>
                <ItemTitle>{c.id} · {c.title}</ItemTitle>
                <ItemDescription>{c.pattern}</ItemDescription>
              </ItemContent>
              <ItemActions className="flex-col items-end gap-1">
                <Badge className="tabular rounded-sm bg-danger-soft text-danger">Score {Math.round(c.score * 100)}</Badge>
                <span className="text-xs text-muted-foreground">{LABEL[c.status]}</span>
              </ItemActions>
            </Item>
          ))}
        </ItemGroup>
      </SpaceBody>
    </>
  );
}
