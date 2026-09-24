// Jeu de démonstration : 5 parcelles réelles (avis ANDF + API cadastre) et des parcelles fictives
// générées de façon déterministe. ponytail: remplacé commune par commune quand l'API ANDF sera branchée.
import type { LatLon, Parcel, RightType, TerrainAlert } from "./types";

const DAY = 86_400_000;
const iso = (t: number) => new Date(t).toISOString().slice(0, 10);

/** Rectangle géoréférencé de la bonne surface autour d'un centre (approximation d'emprise). */
export function rectangle(c: LatLon, areaM2: number, ratio = 1.3, angle = 0): [number, number][] {
  const w = Math.sqrt(areaM2 * ratio);
  const h = areaM2 / w;
  const mLat = 110_574;
  const mLon = 111_320 * Math.cos((c.lat * Math.PI) / 180);
  const pts: [number, number][] = [
    [-w / 2, -h / 2],
    [w / 2, -h / 2],
    [w / 2, h / 2],
    [-w / 2, h / 2],
  ].map(([x, y]) => {
    const rx = x * Math.cos(angle) - y * Math.sin(angle);
    const ry = x * Math.sin(angle) + y * Math.cos(angle);
    return [+(c.lon + rx / mLon).toFixed(7), +(c.lat + ry / mLat).toFixed(7)];
  });
  return [...pts, pts[0]];
}

const REAL: Parcel[] = [
  {
    nup: "101236198",
    department: "Atlantique",
    commune: "Abomey-Calavi",
    arrondissement: "Godomey",
    quartier: "Togbin-Daho",
    areaM2: 187420,
    nature: "ETAT",
    right: "etat",
    owner: { kind: "state" },
    landUse: "urbain",
    zone: "non-loti",
    center: { lat: 6.349309, lon: 2.303307 },
    polygon: [],
    procedure: { kind: "confirmation", requestNumber: "8712", requestDate: "2025-02-04", publicity: { start: "2025-02-04", end: "2025-02-19" } },
    alerts: [
      { id: "al-198-1", kind: "construction", date: "2022-06-01", confidence: 0.91, text: "Terrassement littoral apparu entre 2020 et 2022." },
    ],
    pricePerM2: { low: 15000, high: 35000 },
    real: true,
  },
  {
    nup: "101236087",
    department: "Atlantique",
    commune: "Ouidah",
    arrondissement: "Avlékété",
    quartier: "Adounko",
    areaM2: 206097,
    nature: "ETAT",
    right: "etat",
    owner: { kind: "state" },
    landUse: "rural",
    zone: "non-loti",
    center: { lat: 6.348165, lon: 2.293327 },
    polygon: [],
    procedure: { kind: "confirmation", requestNumber: "1014", requestDate: "2025-02-04", publicity: { start: "2025-02-04", end: "2025-02-19" } },
    alerts: [],
    pricePerM2: { low: 6000, high: 14000 },
    real: true,
  },
  {
    nup: "101236307",
    department: "Atlantique",
    commune: "Ouidah",
    arrondissement: "Ouidah II",
    quartier: "Gbèna-Nord",
    areaM2: 124285,
    nature: "ETAT",
    right: "etat",
    owner: { kind: "state" },
    landUse: "urbain",
    zone: "non-loti",
    center: { lat: 6.357959, lon: 2.069438 },
    polygon: [],
    procedure: { kind: "confirmation", requestNumber: "1011", requestDate: "2025-01-27", publicity: { start: "2025-02-04", end: "2025-02-19" } },
    alerts: [],
    pricePerM2: { low: 8000, high: 20000 },
    real: true,
  },
  {
    nup: "101232574",
    department: "Ouémé",
    commune: "Porto-Novo",
    arrondissement: "5ᵉ arrondissement",
    quartier: "Ouando Clékanmè",
    areaM2: 105530,
    nature: "ETAT",
    right: "etat",
    owner: { kind: "state" },
    landUse: "urbain",
    zone: "loti",
    center: { lat: 6.501987, lon: 2.615429 },
    polygon: [],
    procedure: { kind: "confirmation", requestNumber: "2750", requestDate: "2024-08-22", publicity: { start: "2025-02-04", end: "2025-02-19" } },
    alerts: [],
    pricePerM2: { low: 15000, high: 40000 },
    real: true,
  },
  {
    // Attributs réels (API cadastre ANDF) ; identité du demandeur masquée.
    nup: "100666667",
    department: "Atlantique",
    commune: "Abomey-Calavi",
    arrondissement: "Ouèdo",
    quartier: "Kpossidja",
    areaM2: 616,
    nature: "Individuelle",
    right: "presume",
    owner: { kind: "private", initials: "M. T." },
    landUse: "urbain",
    zone: "non-loti",
    center: { lat: 6.519104, lon: 2.251108 },
    polygon: [],
    procedure: { kind: "titre", requestNumber: "9416", requestDate: "2025-08-25", publicity: { start: "2025-09-08", end: "2025-09-23" } },
    alerts: [],
    pricePerM2: { low: 5000, high: 12000 },
    real: true,
  },
].map((p) => ({ ...p, polygon: rectangle(p.center, p.areaM2, 1.2) }) as Parcel);

// ---- Parcelles fictives ----------------------------------------------------

type Place = { department: string; commune: string; center: LatLon; areas: string[][]; price: [number, number]; rural?: boolean };

const PLACES: Place[] = [
  { department: "Littoral", commune: "Cotonou", center: { lat: 6.3703, lon: 2.3912 }, areas: [["12ᵉ arrondissement", "Fidjrossè"], ["13ᵉ arrondissement", "Agla"], ["1ᵉʳ arrondissement", "Akpakpa"], ["12ᵉ arrondissement", "Cadjèhoun"], ["9ᵉ arrondissement", "Zogbo"]], price: [60000, 150000] },
  { department: "Atlantique", commune: "Abomey-Calavi", center: { lat: 6.4485, lon: 2.3557 }, areas: [["Godomey", "Togba"], ["Akassato", "Akassato-Centre"], ["Zinvié", "Zinvié-Zoumè"], ["Ouèdo", "Ouèdo-Centre"], ["Abomey-Calavi", "Kpota"]], price: [10000, 30000] },
  { department: "Ouémé", commune: "Porto-Novo", center: { lat: 6.4969, lon: 2.6289 }, areas: [["5ᵉ arrondissement", "Ouando"], ["3ᵉ arrondissement", "Djègan-Kpèvi"], ["4ᵉ arrondissement", "Tokpota"]], price: [15000, 40000] },
  { department: "Ouémé", commune: "Sèmè-Podji", center: { lat: 6.3833, lon: 2.6167 }, areas: [["Agblangandan", "Agblangandan"], ["Ekpè", "Ekpè-Plage"], ["Djrègbé", "Djrègbé"]], price: [10000, 25000] },
  { department: "Atlantique", commune: "Ouidah", center: { lat: 6.3631, lon: 2.0851 }, areas: [["Pahou", "Pahou-Centre"], ["Ouidah I", "Djègbadji"]], price: [8000, 20000] },
  { department: "Borgou", commune: "Parakou", center: { lat: 9.3372, lon: 2.6303 }, areas: [["1ᵉʳ arrondissement", "Banikanni"], ["2ᵉ arrondissement", "Titirou"], ["3ᵉ arrondissement", "Zongo"]], price: [4000, 12000] },
  { department: "Zou", commune: "Bohicon", center: { lat: 7.1782, lon: 2.0667 }, areas: [["Passagon", "Agbangnizoun-Route"], ["Sodohomè", "Sodohomè"]], price: [3000, 9000], rural: true },
];

function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const INITIALS = ["A. H.", "K. D.", "S. A.", "R. G.", "E. K.", "F. B.", "C. Z.", "M. A.", "J. T.", "P. O."];
const DISPUTES = ["limites", "double-vente", "succession", "contestation"] as const;

function generate(count: number, now: number): Parcel[] {
  const rnd = mulberry32(229);
  const pick = <T,>(a: readonly T[]) => a[Math.floor(rnd() * a.length)];
  const out: Parcel[] = [];
  for (let i = 0; i < count; i++) {
    const place = PLACES[i % PLACES.length];
    const [arrondissement, quartier] = pick(place.areas);
    const rural = place.rural || rnd() < 0.08;
    const areaM2 = rural ? Math.round(20000 + rnd() * 400000) : Math.round(300 + rnd() * 700);
    const roll = rnd();
    const right: RightType = roll < 0.08 ? "etat" : roll < 0.52 ? "titre" : "presume";
    const center = {
      lat: +(place.center.lat + (rnd() - 0.5) * 0.035).toFixed(6),
      lon: +(place.center.lon + (rnd() - 0.5) * 0.035).toFixed(6),
    };
    const nup = String(101300000 + Math.floor(rnd() * 90000) * 7 + i);
    const zone = rural ? "non-loti" : rnd() < 0.65 ? "loti" : "non-loti";
    const [pl, ph] = place.price;
    const base = pl + rnd() * (ph - pl) * (zone === "loti" ? 1 : 0.55);
    const alerts: TerrainAlert[] = [];
    if (rnd() < 0.18) {
      const kind = right === "etat" ? "empietement" : pick(["construction", "defrichement", "inondation"] as const);
      alerts.push({
        id: `al-${nup}`,
        kind,
        date: iso(now - Math.floor(rnd() * 120) * DAY),
        confidence: +(0.62 + rnd() * 0.35).toFixed(2),
        text: {
          construction: "Nouvelle construction détectée sur l'emprise.",
          defrichement: "Défrichement récent de la végétation.",
          inondation: "Eau stagnante détectée pendant la saison des pluies.",
          empietement: "Construction détectée sur une parcelle du domaine de l'État.",
        }[kind],
      });
    }
    let procedure: Parcel["procedure"];
    if (right === "presume" && rnd() < 0.55) {
      const start = now - Math.floor(rnd() * 40 - 8) * DAY;
      procedure = {
        kind: rnd() < 0.5 ? "titre" : "confirmation",
        requestNumber: String(9000 + Math.floor(rnd() * 3000)),
        requestDate: iso(start - 20 * DAY),
        publicity: { start: iso(start), end: iso(start + 15 * DAY) },
      };
    }
    out.push({
      nup,
      department: place.department,
      commune: place.commune,
      arrondissement,
      quartier,
      areaM2,
      nature: right === "etat" ? "ETAT" : "Individuelle",
      right,
      owner: right === "etat" ? { kind: "state" } : { kind: "private", initials: pick(INITIALS) },
      landUse: rural ? "rural" : "urbain",
      zone,
      titleNumber: right === "titre" ? String(1000 + Math.floor(rnd() * 30000)) : undefined,
      center,
      polygon: rectangle(center, areaM2, 1 + rnd() * 0.8, rnd() * 0.6),
      procedure,
      dispute:
        right !== "etat" && rnd() < 0.1
          ? { kind: pick(DISPUTES), since: iso(now - Math.floor(60 + rnd() * 600) * DAY), body: pick(["CoGeF", "CGP", "Tribunal"] as const) }
          : undefined,
      alerts,
      pricePerM2: { low: Math.round((base * 0.85) / 500) * 500, high: Math.round((base * 1.15) / 500) * 500 },
      real: false,
    });
  }
  return out;
}

// ponytail: fenêtre de publicité relative au jour du build ; fixer DEMO_TODAY si la démo doit être rejouable à date fixe
export const PARCELS: Parcel[] = [...REAL, ...generate(140, Date.now())];
