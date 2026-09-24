import type { Metadata } from "next";
import Link from "next/link";
import { BellIcon, FilesIcon, ScaleIcon, ScanSearchIcon } from "lucide-react";
import { SpaceBody, SpaceHeader } from "@/components/app/space-header";
import { Item, ItemActions, ItemContent, ItemDescription, ItemGroup, ItemMedia, ItemTitle } from "@/components/ui/item";
import { citizenAlerts } from "@/lib/data/citizen";
import { fmtDate } from "@/lib/labels";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Alertes · Foncier Intelligent" };

const ICON = { satellite: ScanSearchIcon, publicite: BellIcon, dossier: FilesIcon, litige: ScaleIcon };
const LABEL = { satellite: "Satellite", publicite: "Publicité foncière", dossier: "Dossier", litige: "Litige" };

export default function AlertsPage() {
  const alerts = citizenAlerts();
  return (
    <>
      <SpaceHeader title="Alertes" lead="Tout ce qui a changé sur vos parcelles et autour d'elles." />
      <SpaceBody>
        <ItemGroup className="max-w-4xl gap-2">
          {alerts.map((a) => {
            const Icon = ICON[a.kind];
            return (
              <Item key={a.id} variant="outline" className="bg-card" render={<Link href={a.href} />}>
                <ItemMedia variant="icon" className={cn(a.unread && "text-navy")}><Icon /></ItemMedia>
                <ItemContent>
                  <ItemTitle className={cn(a.unread && "font-semibold")}>
                    {a.title}
                    {a.unread && <span className="size-2 rounded-full bg-signal" aria-label="non lue" />}
                  </ItemTitle>
                  <ItemDescription>{a.text}</ItemDescription>
                </ItemContent>
                <ItemActions className="flex-col items-end gap-1 text-xs text-muted-foreground">
                  <span>{LABEL[a.kind]}</span>
                  <span>{fmtDate(a.date)}</span>
                </ItemActions>
              </Item>
            );
          })}
        </ItemGroup>
      </SpaceBody>
    </>
  );
}
