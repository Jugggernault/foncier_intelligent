// Import de levés topographiques (CA-03) : GeoJSON (lon/lat) ou CSV de sommets (UTM 31N ou lon/lat).
// Calculs réels : reprojection UTM → WGS84, surface (formule du lacet), contrôle de chevauchement avec les voisins.
import type { Parcel } from "./data/types";

export type Ring = [number, number][];

/** Inverse UTM zone 31N (WGS84), précision métrique. */
export function utmToLonLat(e: number, n: number): [number, number] {
  const a = 6378137, f = 1 / 298.257223563, k0 = 0.9996;
  const e2 = f * (2 - f), ep2 = e2 / (1 - e2);
  const x = e - 500000, m = n / k0;
  const mu = m / (a * (1 - e2 / 4 - (3 * e2 ** 2) / 64 - (5 * e2 ** 3) / 256));
  const e1 = (1 - Math.sqrt(1 - e2)) / (1 + Math.sqrt(1 - e2));
  const p = mu + ((3 * e1) / 2 - (27 * e1 ** 3) / 32) * Math.sin(2 * mu) + ((21 * e1 ** 2) / 16 - (55 * e1 ** 4) / 32) * Math.sin(4 * mu) + ((151 * e1 ** 3) / 96) * Math.sin(6 * mu);
  const c1 = ep2 * Math.cos(p) ** 2, t1 = Math.tan(p) ** 2;
  const n1 = a / Math.sqrt(1 - e2 * Math.sin(p) ** 2), r1 = (a * (1 - e2)) / (1 - e2 * Math.sin(p) ** 2) ** 1.5;
  const d = x / (n1 * k0);
  const lat = p - ((n1 * Math.tan(p)) / r1) * (d ** 2 / 2 - ((5 + 3 * t1 + 10 * c1 - 4 * c1 ** 2 - 9 * ep2) * d ** 4) / 24);
  const lon = (d - ((1 + 2 * t1 + c1) * d ** 3) / 6) / Math.cos(p);
  return [+(3 + (lon * 180) / Math.PI).toFixed(7), +((lat * 180) / Math.PI).toFixed(7)];
}

export function parseSurvey(text: string): Ring {
  const t = text.trim();
  let pts: [number, number][];
  if (t.startsWith("{")) {
    const g = JSON.parse(t);
    const geom = g.type === "FeatureCollection" ? g.features[0].geometry : g.type === "Feature" ? g.geometry : g;
    if (geom.type !== "Polygon") throw new Error("Le GeoJSON doit contenir un polygone.");
    pts = geom.coordinates[0];
  } else {
    pts = t
      .split(/\r?\n/)
      .map((l) => l.split(/[;,\t ]+/).map(Number))
      .filter((r) => r.length >= 2 && r.every((v) => Number.isFinite(v)))
      .map(([x, y]) => (x > 1000 ? utmToLonLat(x, y) : [x, y]) as [number, number]);
  }
  if (pts.length < 3) throw new Error("Il faut au moins 3 sommets.");
  const ring = pts.slice();
  const [f, l] = [ring[0], ring[ring.length - 1]];
  if (f[0] !== l[0] || f[1] !== l[1]) ring.push(f);
  return ring;
}

/** Surface en m² (lacet sur projection locale équirectangulaire). */
export function areaM2(ring: Ring): number {
  const lat0 = (ring.reduce((s, p) => s + p[1], 0) / ring.length) * (Math.PI / 180);
  const xy = ring.map(([lon, lat]) => [lon * 111_320 * Math.cos(lat0), lat * 110_574]);
  let s = 0;
  for (let i = 0; i < xy.length - 1; i++) s += xy[i][0] * xy[i + 1][1] - xy[i + 1][0] * xy[i][1];
  return Math.round(Math.abs(s) / 2);
}

/** Voisins dont la boîte englobante recoupe le levé. */
export function conflicts(ring: Ring, parcels: Parcel[]): string[] {
  const bb = (r: Ring) => ({ x0: Math.min(...r.map((p) => p[0])), x1: Math.max(...r.map((p) => p[0])), y0: Math.min(...r.map((p) => p[1])), y1: Math.max(...r.map((p) => p[1])) });
  const A = bb(ring);
  return parcels
    .filter((p) => {
      const B = bb(p.polygon);
      return Math.min(A.x1, B.x1) > Math.max(A.x0, B.x0) && Math.min(A.y1, B.y1) > Math.max(A.y0, B.y0);
    })
    .map((p) => p.nup);
}

/**
 * Bornes lues dans le texte d'un plan (couche texte d'un PDF) : on repère les nombres qui ont la forme de
 * coordonnées UTM 31N au Bénin (X de 250 000 à 650 000, Y de 690 000 à 1 400 000) et on les apparie dans l'ordre.
 * ponytail: heuristique sans OCR ; suffit pour les PDF numériques, un OCR prendra le relais pour les scans.
 */
export function bornesFromText(text: string): [number, number][] {
  const nums = [...text.matchAll(/\b(\d{6,7})(?:[.,](\d{1,3}))?\b/g)].map((m) => Number(`${m[1]}.${m[2] ?? 0}`));
  const xs = nums.filter((n) => n >= 250_000 && n <= 650_000);
  const ys = nums.filter((n) => n >= 690_000 && n <= 1_400_000);
  const n = Math.min(xs.length, ys.length);
  return n >= 3 ? Array.from({ length: n }, (_, i) => [xs[i], ys[i]] as [number, number]) : [];
}

/** Anneau WGS84 fermé à partir de bornes UTM 31N. */
export function ringFromUtm(bornes: [number, number][]): Ring {
  const ring = bornes.map(([x, y]) => utmToLonLat(x, y));
  if (ring.length && (ring[0][0] !== ring.at(-1)![0] || ring[0][1] !== ring.at(-1)![1])) ring.push(ring[0]);
  return ring;
}
