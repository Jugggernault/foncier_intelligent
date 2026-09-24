// Point d'accès unique aux parcelles. Les écrans ne lisent que ces fonctions :
// brancher l'API cadastre ANDF ici (DATA_SOURCES.md § 7, priorité 1) sans toucher à l'UI.
import imageryMeta from "../../../public/imagery/meta.json";
import { PARCELS } from "./mock";
import type { Imagery, Parcel } from "./types";

export type { Imagery, Parcel } from "./types";

export const NUP_PATTERN = /^\d{9}$/;
export const cadastreUrl = (nup: string) => `https://cadastre.andf.bj/nup/${nup}`;

export function getParcel(nup: string): Parcel | undefined {
  return PARCELS.find((p) => p.nup === nup);
}

export function listParcels(): Parcel[] {
  return PARCELS;
}

/** Recherche plein texte simple : NUP (préfixe), n° de TF, commune, arrondissement, quartier. */
export function searchParcels(q: string, limit = 20): Parcel[] {
  const s = q.trim().toLowerCase();
  if (!s) return [];
  return PARCELS.filter(
    (p) =>
      p.nup.startsWith(s) ||
      p.titleNumber === s ||
      [p.commune, p.arrondissement, p.quartier].some((v) => v.toLowerCase().includes(s))
  ).slice(0, limit);
}

/** Vignettes Sentinel-2 précalculées (parcelles réelles uniquement). */
export function getImagery(nup: string): Imagery | undefined {
  return (imageryMeta as Record<string, Imagery>)[nup];
}

export function listPublicityNotices(): Parcel[] {
  return PARCELS.filter((p) => p.procedure).sort((a, b) =>
    b.procedure!.publicity.end.localeCompare(a.procedure!.publicity.end)
  );
}

export function isPublicityOpen(p: Parcel, today = new Date().toISOString().slice(0, 10)) {
  return !!p.procedure && p.procedure.publicity.start <= today && today <= p.procedure.publicity.end;
}

/** Parcelles dont le centre est à moins de `meters` (veille des riverains). */
export function neighbours(p: Parcel, meters = 400): Parcel[] {
  const mLat = 110_574;
  const mLon = 111_320 * Math.cos((p.center.lat * Math.PI) / 180);
  return PARCELS.filter(
    (o) => o.nup !== p.nup && Math.hypot((o.center.lat - p.center.lat) * mLat, (o.center.lon - p.center.lon) * mLon) < meters
  );
}
