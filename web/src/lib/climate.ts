// Risque climatique (IA-06). ponytail: heuristique de démonstration (distance à la côte + hachage du NUP) ;
// à remplacer par JRC GloFAS (inondation) et DE Africa Coastlines (érosion), cf. DATA_SOURCES.md.
import type { Parcel } from "./data/types";

export type Level = "faible" | "moyen" | "élevé";
export type Climate = { flood: Level; erosion: Level; note: string };

const COAST_LAT = 6.355; // trait de côte approximatif entre Grand-Popo et Sèmè-Podji

function hash(s: string) {
  let h = 0;
  for (const c of s) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return h;
}

export function climate(p: Parcel): Climate {
  const kmFromCoast = Math.max(0, (p.center.lat - COAST_LAT) * 110.6);
  const erosion: Level = kmFromCoast < 1 ? "élevé" : kmFromCoast < 3 ? "moyen" : "faible";
  const lowland = ["Cotonou", "Sèmè-Podji", "Porto-Novo", "Abomey-Calavi"].includes(p.commune);
  const r = hash(p.nup) % 10;
  const flood: Level = p.alerts.some((a) => a.kind === "inondation") || (lowland && r < 3) ? "élevé" : lowland && r < 7 ? "moyen" : "faible";
  return {
    flood,
    erosion,
    note: kmFromCoast < 3 ? `À environ ${kmFromCoast.toFixed(1).replace(".", ",")} km du littoral.` : "Hors de la bande côtière.",
  };
}
