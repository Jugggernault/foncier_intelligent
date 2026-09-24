"use client";

import { useRouter } from "next/navigation";
import { ParcelMap, type Basemap, type MapParcel } from "./parcel-map";

/** Carte dont chaque parcelle ouvre une page : `${hrefBase}/${nup}`. */
export function LinkedMap({
  parcels,
  selected,
  hrefBase,
  basemap = "plan",
  label,
}: {
  parcels: MapParcel[];
  selected?: string;
  hrefBase: string;
  basemap?: Basemap;
  label: string;
}) {
  const router = useRouter();
  return (
    <ParcelMap
      parcels={parcels}
      selected={selected}
      basemap={basemap}
      padding={50}
      maxZoom={15}
      label={label}
      onSelect={(nup) => router.push(`${hrefBase}/${nup}`)}
    />
  );
}
