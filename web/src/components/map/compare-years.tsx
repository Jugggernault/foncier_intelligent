"use client";

import { ParcelMap, type MapParcel } from "./parcel-map";

/** Deux images satellite côte à côte : avant / après. */
export function CompareYears({ parcel, before, after }: { parcel: MapParcel; before: number; after: number }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {[before, after].map((y) => (
        <figure key={y}>
          <div className="relative aspect-square overflow-hidden rounded-lg border">
            <ParcelMap parcels={[parcel]} selected={parcel.nup} year={y} padding={70} label={`Image ${y} de la parcelle ${parcel.nup}`} />
            <span className="tabular absolute top-3 left-3 rounded-sm bg-navy-deep/80 px-2 py-1 font-display text-sm font-bold text-white">{y}</span>
          </div>
          <figcaption className="mt-1 text-xs text-muted-foreground">{y === before ? "Avant" : "Après"}</figcaption>
        </figure>
      ))}
    </div>
  );
}
