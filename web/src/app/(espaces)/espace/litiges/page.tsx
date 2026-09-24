import type { Metadata } from "next";
import Link from "next/link";
import { PlusIcon } from "lucide-react";
import { SpaceBody, SpaceHeader } from "@/components/app/space-header";
import { LitigeBadge } from "@/components/app/workflow-bits";
import { buttonVariants } from "@/components/ui/button";
import { Item, ItemActions, ItemContent, ItemDescription, ItemGroup, ItemTitle } from "@/components/ui/item";
import { myLitiges } from "@/lib/data/citizen";
import { disputeLabel } from "@/lib/labels";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Litiges et plaintes · Foncier Intelligent" };

export default function MyLitiges() {
  const litiges = myLitiges();
  return (
    <>
      <SpaceHeader title="Litiges et plaintes" lead="Vos litiges déclarés, leur instance et la prochaine étape.">
        <Link href="/espace/litiges/nouveau" className={cn(buttonVariants({ size: "lg" }), "h-10 px-4")}>
          <PlusIcon data-icon="inline-start" /> Déposer une plainte
        </Link>
      </SpaceHeader>
      <SpaceBody>
        <ItemGroup className="max-w-4xl gap-2">
          {litiges.map((l) => (
            <Item key={l.id} variant="outline" className="bg-card" render={<Link href={`/espace/litiges/${l.id}`} />}>
              <ItemContent>
                <ItemTitle>{disputeLabel[l.kind]} · parcelle <span className="tabular">{l.nup}</span></ItemTitle>
                <ItemDescription>{l.summary}</ItemDescription>
              </ItemContent>
              <ItemActions className="flex-col items-end gap-1">
                <LitigeBadge status={l.status} />
                <span className="tabular text-xs text-muted-foreground">{l.id}</span>
              </ItemActions>
            </Item>
          ))}
        </ItemGroup>
        {!litiges.length && <p className="text-muted-foreground">Aucun litige déclaré.</p>}
      </SpaceBody>
    </>
  );
}
