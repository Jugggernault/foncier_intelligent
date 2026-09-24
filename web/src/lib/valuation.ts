// Estimation de valeur (IA-13), démonstration : médiane des prix au m² des parcelles connues par commune et type de zone.
// ponytail: médiane simple ; remplacer par un modèle entraîné sur annonces + mutations (DATA_SOURCES.md § 2).
import { listParcels } from "./data/parcels";

export type PriceRef = { commune: string; zone: "loti" | "non-loti"; low: number; high: number; count: number };

const median = (xs: number[]) => {
  const s = [...xs].sort((a, b) => a - b);
  return s.length % 2 ? s[(s.length - 1) / 2] : (s[s.length / 2 - 1] + s[s.length / 2]) / 2;
};

export function priceReferences(): PriceRef[] {
  const groups = new Map<string, { commune: string; zone: "loti" | "non-loti"; lows: number[]; highs: number[] }>();
  for (const p of listParcels().filter((p) => p.landUse === "urbain")) {
    const k = `${p.commune}|${p.zone}`;
    const g = groups.get(k) ?? { commune: p.commune, zone: p.zone, lows: [], highs: [] };
    g.lows.push(p.pricePerM2.low);
    g.highs.push(p.pricePerM2.high);
    groups.set(k, g);
  }
  return [...groups.values()]
    .map((g) => ({ commune: g.commune, zone: g.zone, low: median(g.lows), high: median(g.highs), count: g.lows.length }))
    .sort((a, b) => a.commune.localeCompare(b.commune));
}
