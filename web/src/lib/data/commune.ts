// Espace commune (démo : Abomey-Calavi). ponytail: filtres sur les données mock ; brancher le WFS ANDF par code commune INSAE.
import { allParcels } from "./parcels";
import { LITIGES, listDossiers } from "./workflow";

export const COMMUNE = "Abomey-Calavi";
const DAY = 86_400_000;
const iso = (t: number) => new Date(t).toISOString().slice(0, 10);
const NOW = Date.now();

export const communeParcels = () => allParcels().filter((p) => p.commune === COMMUNE);
export const communeLitiges = () => {
  const nups = new Set(communeParcels().map((p) => p.nup));
  const own = LITIGES.filter((l) => nups.has(l.nup));
  return own.length ? own : LITIGES.slice(0, 4); // ponytail: repli pour que la démo ne soit jamais vide
};
export const communeDossiers = () => {
  const nups = new Set(communeParcels().map((p) => p.nup));
  return listDossiers().filter((d) => nups.has(d.nup));
};

export type Mediation = { id: string; litige: string; date: string; place: string; status: "planifiee" | "accord" | "echec"; mediator: string };

export const MEDIATIONS: Mediation[] = communeLitiges().map((l, i) => ({
  id: `MD-${String(71 + i)}`,
  litige: l.id,
  date: iso(NOW + (i - 1) * 6 * DAY),
  place: ["Mairie d'Abomey-Calavi, salle du conseil", "Arrondissement de Godomey", "Arrondissement de Ouèdo"][i % 3],
  status: i === 0 ? "accord" : i === 1 ? "echec" : "planifiee",
  mediator: ["Président de la CoGeF", "Chef d'arrondissement", "Chef de village"][i % 3],
}));

/** Parcelles bâties probablement non déclarées à la TFU (IA-05) : bâti détecté + statut fiscal « non bâti ». */
export const TFU_CANDIDATES = allParcels()
  .filter((p) => p.landUse === "urbain" && p.right !== "etat")
  .filter((_, i) => i % 5 === 0)
  .slice(0, 14)
  .map((p, i) => ({
    parcel: p,
    builtM2: Math.round(p.areaM2 * (0.25 + (i % 5) * 0.1)),
    confidence: +(0.72 + (i % 4) * 0.06).toFixed(2),
    source: i % 2 ? "Google Open Buildings 2.5D (2023)" : "Microsoft Building Footprints (2026)",
    estimatedTax: Math.round(p.areaM2 * 200 * 0.06),
  }));

export const RURAL_TX = allParcels()
  .filter((p) => p.landUse === "rural")
  .slice(0, 6)
  .map((p, i) => ({ parcel: p, village: ["Zinvié", "Sô-Ava", "Ouèdo", "Hêvié"][i % 4], stage: (["PV de palabre", "Visa SVGF", "Transmis à l'ANDF"] as const)[i % 3] }));
