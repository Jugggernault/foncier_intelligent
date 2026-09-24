import type { Metadata } from "next";
import { FileDownIcon } from "lucide-react";
import { SpaceBody, SpaceHeader } from "@/components/app/space-header";
import { Item, ItemActions, ItemContent, ItemDescription, ItemGroup, ItemMedia, ItemTitle } from "@/components/ui/item";

export const metadata: Metadata = { title: "Rapports · Espace commune" };

const REPORTS = ["Septembre 2026", "Août 2026", "Juillet 2026", "Juin 2026"];

export default function Reports() {
  return (
    <>
      <SpaceHeader title="Rapports mensuels" lead="Dossiers, litiges, médiations, alertes et assiette TFU de la commune." />
      <SpaceBody>
        <ItemGroup className="max-w-2xl gap-2">
          {REPORTS.map((r) => (
            <Item key={r} variant="outline" className="bg-card">
              <ItemMedia variant="icon"><FileDownIcon /></ItemMedia>
              <ItemContent>
                <ItemTitle>Rapport foncier · {r}</ItemTitle>
                <ItemDescription>PDF et tableur (démonstration)</ItemDescription>
              </ItemContent>
              <ItemActions className="text-sm text-muted-foreground">Bientôt</ItemActions>
            </Item>
          ))}
        </ItemGroup>
      </SpaceBody>
    </>
  );
}
