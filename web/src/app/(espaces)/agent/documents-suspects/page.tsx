import type { Metadata } from "next";
import Link from "next/link";
import { AlertTriangleIcon } from "lucide-react";
import { SpaceBody, SpaceHeader } from "@/components/app/space-header";
import { Item, ItemActions, ItemContent, ItemDescription, ItemGroup, ItemMedia, ItemTitle } from "@/components/ui/item";
import { listDossiers } from "@/lib/data/workflow";

export const metadata: Metadata = { title: "Documents suspects · Espace agent" };

export default function SuspectDocuments() {
  const rows = listDossiers().flatMap((d) => d.documents.filter((x) => x.status === "suspect").map((doc) => ({ d, doc })));
  return (
    <>
      <SpaceHeader title="Documents suspects" lead="Pièces signalées par la comparaison aux spécimens de cachets et signatures et par les contrôles de cohérence. Un signalement n'est jamais un rejet automatique." />
      <SpaceBody>
        <ItemGroup className="max-w-4xl gap-2">
          {rows.map(({ d, doc }) => (
            <Item key={d.id + doc.name} variant="outline" className="bg-card" render={<Link href={`/agent/dossiers/${d.id}`} />}>
              <ItemMedia variant="icon" className="text-danger"><AlertTriangleIcon /></ItemMedia>
              <ItemContent>
                <ItemTitle>{doc.name} · <span className="tabular">{d.id}</span></ItemTitle>
                <ItemDescription>{doc.note}</ItemDescription>
              </ItemContent>
              <ItemActions className="text-xs text-muted-foreground">{d.applicant}</ItemActions>
            </Item>
          ))}
        </ItemGroup>
      </SpaceBody>
    </>
  );
}
