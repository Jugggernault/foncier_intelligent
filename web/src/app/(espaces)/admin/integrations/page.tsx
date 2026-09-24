import type { Metadata } from "next";
import { SpaceBody, SpaceHeader } from "@/components/app/space-header";
import { Badge } from "@/components/ui/badge";
import { Item, ItemActions, ItemContent, ItemDescription, ItemGroup, ItemTitle } from "@/components/ui/item";
import { INTEGRATIONS } from "@/lib/data/admin";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Intégrations · Administration" };

const TONE = { reel: "bg-clear-soft text-clear", mock: "bg-caution-soft text-caution", accord: "bg-muted text-muted-foreground" };
const LABEL = { reel: "Données réelles", mock: "Simulé", accord: "Accord requis" };

export default function Integrations() {
  return (
    <>
      <SpaceHeader title="Intégrations" lead="État de chaque source de données et service tiers. Détail et plan de branchement : DATA_SOURCES.md." />
      <SpaceBody>
        <ItemGroup className="max-w-4xl gap-2">
          {INTEGRATIONS.map((i) => (
            <Item key={i.name} variant="outline" className="bg-card">
              <ItemContent>
                <ItemTitle>{i.name}</ItemTitle>
                <ItemDescription>{i.purpose} · {i.detail}</ItemDescription>
              </ItemContent>
              <ItemActions><Badge className={cn("rounded-sm", TONE[i.status])}>{LABEL[i.status]}</Badge></ItemActions>
            </Item>
          ))}
        </ItemGroup>
      </SpaceBody>
    </>
  );
}
