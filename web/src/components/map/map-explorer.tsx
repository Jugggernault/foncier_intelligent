"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRightIcon, XIcon } from "lucide-react";
import { LEVEL } from "@/components/parcel/verdict";
import { Button, buttonVariants } from "@/components/ui/button";
import { Item, ItemContent, ItemDescription, ItemGroup, ItemTitle } from "@/components/ui/item";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { LAYER_COLOR } from "@/lib/geo/palette";
import { Label } from "@/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import type { RiskLevel } from "@/lib/risk";
import { cn } from "@/lib/utils";
import { ParcelMap, type Basemap } from "./parcel-map";

// Le sud (Atlantique, Littoral, Ouémé, Zou, Plateau) concentre presque tous les avis de publicité
const SOUTH: [[number, number], [number, number]] = [[1.95, 6.3], [2.8, 7.5]];

export type ExplorerParcel = {
  nup: string;
  polygon: [number, number][];
  level: RiskLevel;
  commune: string;
  quartier: string;
  area: string;
  right: string;
  headline: string;
  alert: boolean;
  publicity: boolean;
};

const LEVELS: RiskLevel[] = ["danger", "caution", "clear"];

export function MapExplorer({ parcels, layers = [] }: { parcels: ExplorerParcel[]; layers?: { id: string; label: string; severity: string }[] }) {
  const [shown, setShown] = useState<string[]>(["litige", "restriction", "tf_etat", "aire_protegee", "dpm", "dpl"]);
  const [levels, setLevels] = useState<string[]>(LEVELS);
  const [commune, setCommune] = useState("toutes");
  const [onlyAlerts, setOnlyAlerts] = useState(false);
  const [onlyPublicity, setOnlyPublicity] = useState(false);
  const [basemap, setBasemap] = useState<Basemap>("plan");
  const [selected, setSelected] = useState<string>();

  const communes = useMemo(() => [...new Set(parcels.map((p) => p.commune))].sort(), [parcels]);
  const visible = useMemo(
    () =>
      parcels.filter(
        (p) =>
          levels.includes(p.level) &&
          (commune === "toutes" || p.commune === commune) &&
          (!onlyAlerts || p.alert) &&
          (!onlyPublicity || p.publicity)
      ),
    [parcels, levels, commune, onlyAlerts, onlyPublicity]
  );
  const current = parcels.find((p) => p.nup === selected);

  return (
    <div className="grid h-[calc(100dvh-4.25rem)] lg:grid-cols-[22rem_1fr]">
      <aside className="flex min-h-0 flex-col border-r bg-card max-lg:order-2 max-lg:h-[45dvh]">
        <div className="space-y-5 border-b p-4">
          <div className="flex items-center justify-between gap-3">
            <h1 className="text-xl font-extrabold text-navy">Carte des parcelles</h1>
            <span className="tabular text-sm text-muted-foreground">{visible.length}</span>
          </div>
          <ToggleGroup multiple value={levels} onValueChange={(v) => setLevels(v as string[])} variant="outline" size="sm" spacing={0} aria-label="Verdicts affichés" className="w-full">
            {LEVELS.map((l) => {
              const Icon = LEVEL[l].icon;
              return (
                <ToggleGroupItem key={l} value={l} className="flex-1 gap-1.5 data-pressed:bg-navy data-pressed:text-white">
                  <Icon className="size-3.5" />
                  {LEVEL[l].label}
                </ToggleGroupItem>
              );
            })}
          </ToggleGroup>
          <Select
            value={commune}
            onValueChange={(v) => setCommune(String(v))}
            items={[{ value: "toutes", label: "Toutes les communes" }, ...communes.map((c) => ({ value: c, label: c }))]}
          >
            <SelectTrigger className="w-full" aria-label="Commune">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="toutes">Toutes les communes</SelectItem>
              {communes.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-3">
              <Label htmlFor="f-alert" className="font-normal">Alertes satellite</Label>
              <Switch id="f-alert" checked={onlyAlerts} onCheckedChange={setOnlyAlerts} />
            </div>
            <div className="flex items-center justify-between gap-3">
              <Label htmlFor="f-pub" className="font-normal">Publicité en cours</Label>
              <Switch id="f-pub" checked={onlyPublicity} onCheckedChange={setOnlyPublicity} />
            </div>
          </div>
        </div>
        {layers.length > 0 && (
          <details className="border-b px-4 py-3" open>
            <summary className="cursor-pointer text-sm font-semibold">Couches de l&apos;ANDF</summary>
            <ul className="mt-3 space-y-2">
              {layers.map((l) => (
                <li key={l.id} className="flex items-center gap-2 text-sm">
                  <Checkbox
                    id={`layer-${l.id}`}
                    checked={shown.includes(l.id)}
                    onCheckedChange={(v) => setShown(v ? [...shown, l.id] : shown.filter((x) => x !== l.id))}
                  />
                  <span className="size-3 rounded-sm" style={{ backgroundColor: LAYER_COLOR[l.id] }} aria-hidden="true" />
                  <Label htmlFor={`layer-${l.id}`} className="font-normal">{l.label}</Label>
                </li>
              ))}
            </ul>
          </details>
        )}
        <ScrollArea className="min-h-0 flex-1">
          <ItemGroup className="gap-1 p-2">
            {visible.map((p) => {
              const Icon = LEVEL[p.level].icon;
              return (
                <Item
                  key={p.nup}
                  size="sm"
                  render={<button type="button" onClick={() => setSelected(p.nup)} />}
                  className={cn("text-left", p.nup === selected && "bg-sky")}
                >
                  <span className={cn("grid size-8 shrink-0 place-items-center rounded-md", LEVEL[p.level].soft)}>
                    <Icon className="size-4" />
                  </span>
                  <ItemContent>
                    <ItemTitle className="tabular font-bold text-navy">{p.nup}</ItemTitle>
                    <ItemDescription>{p.quartier}, {p.commune}</ItemDescription>
                  </ItemContent>
                </Item>
              );
            })}
          </ItemGroup>
        </ScrollArea>
      </aside>

      <div className="relative min-h-0 max-lg:h-[calc(55dvh-4.25rem)]">
        <ParcelMap
          parcels={visible}
          selected={selected}
          basemap={basemap}
          padding={70}
          label="Carte des parcelles"
          layers={shown}
          view={SOUTH}
          onSelect={setSelected}
        />
        <ToggleGroup
          value={[basemap]}
          onValueChange={(v) => v[0] && setBasemap(v[0] as Basemap)}
          size="sm"
          spacing={0}
          variant="outline"
          aria-label="Fond de carte"
          className="absolute top-3 left-3 bg-card shadow-sm"
        >
          <ToggleGroupItem value="plan" className="px-3 data-pressed:bg-navy data-pressed:text-white">Plan</ToggleGroupItem>
          <ToggleGroupItem value="satellite" className="px-3 data-pressed:bg-navy data-pressed:text-white">Satellite</ToggleGroupItem>
        </ToggleGroup>

        {current && (
          <div className="absolute right-3 bottom-8 left-3 max-w-sm rounded-lg bg-card p-4 shadow-[0_18px_40px_-16px_rgba(2,12,27,0.5)] sm:left-auto sm:w-96">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="tabular font-display text-xl font-extrabold text-navy">{current.nup}</p>
                <p className="text-sm text-muted-foreground">{current.quartier}, {current.commune} · {current.area}</p>
              </div>
              <Button variant="ghost" size="icon-sm" onClick={() => setSelected(undefined)} aria-label="Fermer">
                <XIcon />
              </Button>
            </div>
            <p className={cn("mt-3 rounded-md px-3 py-2 text-sm font-semibold", LEVEL[current.level].soft)}>{current.headline}</p>
            <p className="mt-2 text-sm">{current.right}</p>
            <Link href={`/parcelle/${current.nup}`} className={cn(buttonVariants({ size: "lg" }), "mt-4 h-10 w-full")}>
              Ouvrir la fiche
              <ArrowRightIcon data-icon="inline-end" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
