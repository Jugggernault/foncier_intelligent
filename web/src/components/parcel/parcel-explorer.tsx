"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ParcelMap, type Basemap, type MapParcel } from "@/components/map/parcel-map";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

const YEARS = [2016, 2018, 2020, 2022, 2024];

/** Carte de la fiche parcelle : la parcelle, ses voisines, le fond et l'année d'imagerie. */
export function ParcelExplorer({ parcel, neighbours }: { parcel: MapParcel; neighbours: MapParcel[] }) {
  const router = useRouter();
  const [year, setYear] = useState(2024);
  const [basemap, setBasemap] = useState<Basemap>("satellite");

  return (
    <div className="overflow-hidden rounded-lg border bg-card">
      <div className="relative aspect-[4/3] sm:aspect-[16/10]">
        <ParcelMap
          parcels={[...neighbours, parcel]}
          selected={parcel.nup}
          basemap={basemap}
          year={year}
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
