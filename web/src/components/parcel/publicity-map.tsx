"use client";

import { useRouter } from "next/navigation";
import { ParcelMap, type MapParcel } from "@/components/map/parcel-map";

/** Carte plan des avis, clic = ouverture de l'avis. */
export function PublicityMap({ parcels, selected }: { parcels: MapParcel[]; selected?: string }) {
  const router = useRouter();
  return (
    <ParcelMap
      parcels={parcels}
      selected={selected}
      basemap="plan"
      padding={50}
      maxZoom={15}
      label="Carte des avis de publicité foncière"
      onSelect={(nup) => router.push(`/publicite/${nup}`)}
    />
  );
}
