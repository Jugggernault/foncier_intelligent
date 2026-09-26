// Empiètements réellement détectés par scripts/encroachment.py (Sentinel-2 GeoMAD, Digital Earth Africa)
// sur les forêts classées du Grand Nokoué, puis retenus après contrôle visuel des images avant/après.
// ponytail: liste figée de démonstration ; la table Supabase prendra le relais quand le calcul tournera chaque année.
import raw from "../../content/satellite-alerts.json";

export type SatelliteAlert = {
  id: string;
  zone: string;
  layer: string;
  areaM2: number;
  /** Période d'apparition : entre deux composites annuels */
  from: number;
  to: number;
  years: number[];
  ndvi: number[];
  center: [number, number];
  polygon: [number, number][];
  note: string;
};

export const SATELLITE_ALERTS = raw as unknown as SatelliteAlert[];
export const getSatelliteAlert = (id: string) => SATELLITE_ALERTS.find((a) => a.id === id);
