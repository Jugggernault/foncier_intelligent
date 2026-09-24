import type { Metadata } from "next";
import { SpaceBody, SpaceHeader } from "@/components/app/space-header";
import { Badge } from "@/components/ui/badge";
import { Item, ItemActions, ItemContent, ItemDescription, ItemGroup, ItemTitle } from "@/components/ui/item";
import { ARCHIVES } from "@/lib/data/agent";

export const metadata: Metadata = { title: "Numérisation des archives · Espace agent" };

const LABEL = { "en-cours": "Lecture en cours", "a-valider": "À valider", termine: "Terminé" };

export default function Archives() {
  return (
    <>
      <SpaceHeader title="Numérisation des archives" lead="Les registres papier sont scannés puis lus automatiquement ; les agents valident les pages signalées. Une mission légale de l'ANDF : protéger les archives." />
      <SpaceBody>
        <ItemGroup className="max-w-4xl gap-2">
          {ARCHIVES.map((a) => (
            <Item key={a.id} variant="outline" className="bg-card">
              <ItemContent>
                <ItemTitle>{a.register}</ItemTitle>
                <ItemDescription>
                  <span className="tabular">{a.extracted}/{a.pages}</span> pages lues · <span className="tabular">{a.flagged}</span> à relire
                </ItemDescription>
                <div className="mt-2 h-1.5 w-full max-w-sm overflow-hidden rounded-full bg-sky-line">
                  <div className="h-full bg-navy" style={{ width: `${(a.extracted / a.pages) * 100}%` }} />
                </div>
              </ItemContent>
              <ItemActions><Badge variant={a.status === "termine" ? "outline" : "secondary"} className="rounded-sm">{LABEL[a.status]}</Badge></ItemActions>
            </Item>
          ))}
        </ItemGroup>
      </SpaceBody>
    </>
  );
}
