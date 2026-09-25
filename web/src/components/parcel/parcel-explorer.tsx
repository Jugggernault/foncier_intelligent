"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ParcelMap, type Basemap, type MapParcel } from "@/components/map/parcel-map";
import { Switch } from "@/components/ui/switch";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

const YEARS = [2017, 2019, 2021, 2023, 2025];

/** Carte de la fiche parcelle : la parcelle, ses voisines, le fond et l'année d'imagerie. */
export function ParcelExplorer({ parcel, neighbours, layers = [] }: { parcel: MapParcel; neighbours: MapParcel[]; layers?: string[] }) {
  const router = useRouter();
  const [year, setYear] = useState(2025);
  const [basemap, setBasemap] = useState<Basemap>("satellite");
  const [showLayers, setShowLayers] = useState(true);

  return (
    <div className="overflow-hidden rounded-lg border bg-card">
      <div className="relative aspect-[4/3] sm:aspect-[16/10]">
        <ParcelMap
          parcels={[...neighbours, parcel]}
          selected={parcel.nup}
          basemap={basemap}
          year={year}
          layers={showLayers ? layers : []}
          padding={120}
          label={`Carte de la parcelle ${parcel.nup}`}
          onSelect={(nup) => nup !== parcel.nup && router.push(`/parcelle/${nup}`)}
        />
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3 border-t px-4 py-3">
        <ToggleGroup
          value={[basemap]}
          onValueChange={(v) => v[0] && setBasemap(v[0] as Basemap)}
          size="sm"
          spacing={0}
          variant="outline"
          aria-label="Fond de carte"
        >
          <ToggleGroupItem value="satellite" className="px-3 data-pressed:bg-navy data-pressed:text-white">
            Satellite
          </ToggleGroupItem>
          <ToggleGroupItem value="plan" className="px-3 data-pressed:bg-navy data-pressed:text-white">
            Plan
          </ToggleGroupItem>
        </ToggleGroup>
        {layers.length > 0 && (
          <label className="flex items-center gap-2 text-sm">
            <Switch checked={showLayers} onCheckedChange={setShowLayers} />
            Couches ANDF
          </label>
        )}
        {basemap === "satellite" && (
          <ToggleGroup
            value={[String(year)]}
            onValueChange={(v) => v[0] && setYear(Number(v[0]))}
            size="sm"
            spacing={0}
            variant="outline"
            aria-label="Année de l'image"
          >
            {YEARS.map((y) => (
              <ToggleGroupItem key={y} value={String(y)} className="tabular px-2.5 data-pressed:bg-navy data-pressed:text-white">
                {y}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        )}
      </div>
    </div>
  );
}
