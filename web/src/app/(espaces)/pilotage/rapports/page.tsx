import type { Metadata } from "next";
import { FileDownIcon } from "lucide-react";
import { SpaceBody, SpaceHeader } from "@/components/app/space-header";
import { Item, ItemActions, ItemContent, ItemDescription, ItemGroup, ItemMedia, ItemTitle } from "@/components/ui/item";

export const metadata: Metadata = { title: "Rapports · Pilotage" };

const REPORTS = [
  ["Tableau de bord trimestriel T3 2026", "Indicateurs PRD, délais, risques"],
  ["Rapport qualité et équité des modèles IA", "Pour le comité de pilotage"],
  ["Bilan des alertes d'empiètement", "Domaine de l'État et forêts classées"],
  ["Note fiscale TFU et mutations", "Pour la DGI"],
];

export default function PilotReports() {
  return (
    <>
      <SpaceHeader title="Rapports" />
      <SpaceBody>
        <ItemGroup className="max-w-2xl gap-2">
          {REPORTS.map(([t, d]) => (
            <Item key={t} variant="outline" className="bg-card">
              <ItemMedia variant="icon"><FileDownIcon /></ItemMedia>
              <ItemContent><ItemTitle>{t}</ItemTitle><ItemDescription>{d}</ItemDescription></ItemContent>
              <ItemActions className="text-sm text-muted-foreground">Bientôt</ItemActions>
            </Item>
          ))}
        </ItemGroup>
      </SpaceBody>
    </>
  );
}
