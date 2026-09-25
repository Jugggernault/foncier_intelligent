// Point d'accès unique aux parcelles. Les écrans ne lisent que ces fonctions :
// brancher l'API cadastre ANDF ici (DATA_SOURCES.md § 7, priorité 1) sans toucher à l'UI.
import imageryMeta from "../../../public/imagery/meta.json";
import { andfLive, fetchAndfParcel } from "./andf";
import { DEMO_PARCELS, REAL_PARCELS } from "./mock";
import type { Imagery, Parcel } from "./types";

export type { Imagery, Parcel } from "./types";

export const NUP_PATTERN = /^\d{9}$/;
export const cadastreUrl = (nup: string) => `https://cadastre.andf.bj/nup/${nup}`;

const ALL = [...REAL_PARCELS, ...DEMO_PARCELS];

export function getParcel(nup: string): Parcel | undefined {
  return ALL.find((p) => p.nup === nup);
}

/** Démonstration d'abord, puis ANDF en direct si ANDF_LIVE=true. */
export async function findParcel(nup: string): Promise<Parcel | undefined> {
  return getParcel(nup) ?? (andfLive() ? fetchAndfParcel(nup) : undefined);
}

/** Parcelles réelles (avis ANDF, polygones du cadastre) : tout ce que voit le public. */
export function listParcels(): Parcel[] {
  return REAL_PARCELS;
}

/** Réelles et fictives : pour les espaces de travail de démonstration. */
export function allParcels(): Parcel[] {
  return ALL;
}

/** Recherche plein texte simple : NUP (préfixe), n° de TF, commune, arrondissement, quartier. */
export function searchParcels(q: string, limit = 20): Parcel[] {
  const s = q.trim().toLowerCase();
  if (!s) return [];
  return REAL_PARCELS.filter(
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
  return REAL_PARCELS.filter((p) => p.procedure).sort((a, b) =>
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
  return REAL_PARCELS.filter(
    (o) => o.nup !== p.nup && Math.hypot((o.center.lat - p.center.lat) * mLat, (o.center.lon - p.center.lon) * mLon) < meters
  );
}
