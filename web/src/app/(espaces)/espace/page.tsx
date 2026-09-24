import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRightIcon, BellIcon, FileWarningIcon, ScanSearchIcon, ShieldCheckIcon } from "lucide-react";
import { SpaceBody, SpaceHeader } from "@/components/app/space-header";
import { StatusBadge } from "@/components/app/workflow-bits";
import { ParcelRow } from "@/components/parcel/parcel-row";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Item, ItemActions, ItemContent, ItemDescription, ItemGroup, ItemMedia, ItemTitle } from "@/components/ui/item";
import { citizenAlerts, ME, OWNED } from "@/lib/data/citizen";
import { dossiersOf, KIND_LABEL } from "@/lib/data/workflow";
import { fmtDate } from "@/lib/labels";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Mon espace · Foncier Intelligent" };

export default function CitizenHome() {
  const dossiers = dossiersOf(ME.initials);
  const todo = dossiers.filter((d) => d.status === "complement");
  const alerts = citizenAlerts().slice(0, 5);

  return (
    <>
      <SpaceHeader title={`Bonjour ${ME.name.split(" ")[0]}`} lead="Vos parcelles, vos démarches et ce qui a bougé autour de vous.">
        <Link href="/espace/verifications/nouvelle" className={cn(buttonVariants({ size: "lg" }), "h-10 bg-signal px-4 font-bold text-signal-ink hover:bg-[#ffe033]")}>
          <ShieldCheckIcon data-icon="inline-start" />
          Vérifier avant d&apos;acheter
        </Link>
      </SpaceHeader>
      <SpaceBody>
        {todo.map((d) => (
          <Link
            key={d.id}
            href={`/espace/dossiers/${d.id}`}
            className="mb-6 flex items-start gap-3 rounded-lg bg-caution-soft px-5 py-4 text-caution transition-colors hover:bg-caution-soft/70"
          >
            <FileWarningIcon className="mt-0.5 size-5 shrink-0" />
            <div className="flex-1">
              <p className="font-semibold">Action requise : {d.messages.at(-1)?.text}</p>
              <p className="text-sm">Dossier {d.id} · {KIND_LABEL[d.kind]}</p>
            </div>
            <ArrowRightIcon className="mt-0.5 size-5" />
          </Link>
        ))}

        <div className="grid gap-6 xl:grid-cols-12">
          <Card className="rounded-lg xl:col-span-7">
            <CardHeader>
              <CardTitle className="text-base">Mes parcelles</CardTitle>
              <CardAction>
                <Link href="/espace/parcelles" className="text-sm font-medium text-navy hover:underline">Tout voir</Link>
              </CardAction>
            </CardHeader>
            <CardContent>
              <ItemGroup className="gap-2">
                {OWNED.map((p) => (
                  <ParcelRow key={p.nup} parcel={p} href={`/espace/parcelles/${p.nup}`} />
                ))}
              </ItemGroup>
            </CardContent>
          </Card>

          <Card className="rounded-lg xl:col-span-5">
            <CardHeader>
              <CardTitle className="text-base">Dernières alertes</CardTitle>
              <CardAction>
                <Link href="/espace/alertes" className="text-sm font-medium text-navy hover:underline">Toutes</Link>
              </CardAction>
            </CardHeader>
            <CardContent>
              <ItemGroup className="gap-1">
                {alerts.map((a) => (
                  <Item key={a.id} size="sm" render={<Link href={a.href} />}>
                    <ItemMedia variant="icon">{a.kind === "satellite" ? <ScanSearchIcon /> : <BellIcon />}</ItemMedia>
                    <ItemContent>
                      <ItemTitle className={cn(a.unread && "font-semibold")}>{a.title}</ItemTitle>
                      <ItemDescription className="line-clamp-1">{a.text}</ItemDescription>
                    </ItemContent>
                    <ItemActions className="text-xs text-muted-foreground">{fmtDate(a.date)}</ItemActions>
                  </Item>
                ))}
              </ItemGroup>
            </CardContent>
          </Card>

          <Card className="rounded-lg xl:col-span-12">
            <CardHeader>
              <CardTitle className="text-base">Mes dossiers</CardTitle>
              <CardAction>
                <Link href="/espace/dossiers/nouveau" className="text-sm font-medium text-navy hover:underline">Nouveau dossier</Link>
              </CardAction>
            </CardHeader>
            <CardContent>
              <ItemGroup className="grid gap-2 md:grid-cols-3">
                {dossiers.map((d) => (
                  <Item key={d.id} variant="outline" render={<Link href={`/espace/dossiers/${d.id}`} />} className="items-start">
                    <ItemContent>
                      <ItemTitle>{KIND_LABEL[d.kind]}</ItemTitle>
                      <ItemDescription className="tabular">{d.id} · parcelle {d.nup}</ItemDescription>
                      <div className="mt-2"><StatusBadge status={d.status} /></div>
                    </ItemContent>
                  </Item>
                ))}
              </ItemGroup>
            </CardContent>
          </Card>
        </div>
      </SpaceBody>
    </>
  );
}
