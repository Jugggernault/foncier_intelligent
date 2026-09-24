import type { Metadata } from "next";
import { SpaceBody, SpaceHeader } from "@/components/app/space-header";
import { Item, ItemActions, ItemContent, ItemGroup, ItemTitle } from "@/components/ui/item";
import { THRESHOLDS } from "@/lib/data/admin";

export const metadata: Metadata = { title: "Modèles et seuils · Administration" };

export default function Models() {
  return (
    <>
      <SpaceHeader title="Modèles et seuils" lead="Seuils de déclenchement des alertes et signalements. Toute modification est journalisée." />
      <SpaceBody>
        <ItemGroup className="max-w-3xl gap-2">
          {THRESHOLDS.map((t) => (
            <Item key={t.name} variant="outline" className="bg-card">
              <ItemContent><ItemTitle>{t.name}</ItemTitle></ItemContent>
              <ItemActions className="tabular text-sm font-semibold text-navy">{t.value}</ItemActions>
            </Item>
          ))}
        </ItemGroup>
      </SpaceBody>
    </>
  );
}
