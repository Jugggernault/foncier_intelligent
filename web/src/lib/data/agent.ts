// Données de l'espace agent : alertes d'empiètement, missions terrain, qualité du cadastre, rural, numérisation.
// ponytail: dérivées des parcelles mock ; brancher la détection de changement Sentinel et le WFS ANDF (DATA_SOURCES.md).
import { getParcel, allParcels } from "./parcels";
import type { Parcel } from "./types";
import { listDossiers } from "./workflow";

const DAY = 86_400_000;
const iso = (t: number) => new Date(t).toISOString().slice(0, 10);
const NOW = Date.now();

export type EncroachmentStatus = "nouvelle" | "verification" | "confirmee" | "faux-positif";
export type Encroachment = { id: string; nup: string; detected: string; confidence: number; areaM2: number; status: EncroachmentStatus; zone: string; note: string };

export const ENCROACHMENT_LABEL: Record<EncroachmentStatus, string> = {
  nouvelle: "Nouvelle",
  verification: "En vérification",
  confirmee: "Confirmée",
  "faux-positif": "Faux positif",
};

const statePlots = allParcels().filter((p) => p.right === "etat");

export const ENCROACHMENTS: Encroachment[] = statePlots.map((p, i) => ({
  id: `E-${String(801 + i).padStart(4, "0")}`,
  nup: p.nup,
  detected: p.alerts[0]?.date ?? iso(NOW - (6 + i * 9) * DAY),
  confidence: p.alerts[0]?.confidence ?? +(0.66 + ((i * 7) % 30) / 100).toFixed(2),
  areaM2: Math.round(120 + ((i * 131) % 900)),
  status: (["nouvelle", "verification", "nouvelle", "confirmee", "faux-positif"] as const)[i % 5],
  zone: p.real ? "Domaine de l'État (publié)" : i % 3 === 0 ? "Zone inondable" : "Domaine de l'État",
  note: p.alerts[0]?.text ?? "Nouvelle emprise bâtie détectée entre deux passages Sentinel-2.",
}));

export const getEncroachment = (id: string) => ENCROACHMENTS.find((e) => e.id === id);

export type Mission = {
  id: string;
  kind: "Vérification d'empiètement" | "Bornage contradictoire" | "Constat de mise en valeur";
  nup: string;
  date: string;
  status: "planifiee" | "en-cours" | "terminee";
  agent: string;
  checklist: string[];
};

export const MISSIONS: Mission[] = [
  ...ENCROACHMENTS.filter((e) => e.status === "verification").map((e, i) => ({
    id: `M-${String(201 + i).padStart(3, "0")}`,
    kind: "Vérification d'empiètement" as const,
    nup: e.nup,
    date: iso(NOW + (i + 1) * DAY),
    status: "planifiee" as const,
    agent: "Sènami Adjovi",
    checklist: ["Photographier la construction (photo géolocalisée)", "Relever l'identité de l'occupant", "Vérifier la présence de bornes", "Remplir le procès-verbal"],
  })),
  ...listDossiers()
    .filter((d) => d.status === "instruction")
    .slice(0, 3)
    .map((d, i) => ({
      id: `M-${String(301 + i).padStart(3, "0")}`,
      kind: "Bornage contradictoire" as const,
      nup: d.nup,
      date: iso(NOW - (i + 2) * DAY),
      status: (i === 0 ? "en-cours" : "terminee") as Mission["status"],
      agent: "Sènami Adjovi",
      checklist: ["Convoquer les riverains", "Contrôler les bornes avec le géomètre", "Signer le PV de bornage"],
    })),
];

export const getMission = (id: string) => MISSIONS.find((m) => m.id === id);

/** Chevauchements réels entre emprises (IA-17) : intersection des boîtes englobantes, puis surface approchée. */
export type Overlap = { a: string; b: string; overlapM2: number; share: number; suggestion: string };

function bbox(p: Parcel) {
  const xs = p.polygon.map((c) => c[0]);
  const ys = p.polygon.map((c) => c[1]);
  return { x0: Math.min(...xs), x1: Math.max(...xs), y0: Math.min(...ys), y1: Math.max(...ys) };
}

export function overlaps(): Overlap[] {
  const ps = allParcels();
  const out: Overlap[] = [];
  for (let i = 0; i < ps.length; i++)
    for (let j = i + 1; j < ps.length; j++) {
      const A = bbox(ps[i]);
      const B = bbox(ps[j]);
      const w = Math.min(A.x1, B.x1) - Math.max(A.x0, B.x0);
      const h = Math.min(A.y1, B.y1) - Math.max(A.y0, B.y0);
      if (w <= 0 || h <= 0) continue;
      const m2 = w * 111_320 * Math.cos((ps[i].center.lat * Math.PI) / 180) * h * 110_574;
      const share = m2 / Math.min(ps[i].areaM2, ps[j].areaM2);
      out.push({
        a: ps[i].nup,
        b: ps[j].nup,
        overlapM2: Math.round(m2),
        share: +Math.min(1, share).toFixed(2),
        suggestion: share > 0.5 ? "Doublon probable : même parcelle enregistrée deux fois." : "Décalage de levé probable : réajuster la limite commune.",
      });
    }
  return out.sort((x, y) => y.share - x.share);
}

export type PretraceLot = { id: string; commune: string; zone: string; polygons: number; iou: number; status: "a-valider" | "valide" | "rejete"; produced: string };

export const PRETRACE: PretraceLot[] = [
  { id: "PT-014", commune: "Abomey-Calavi", zone: "Zinvié-Zoumè", polygons: 412, iou: 0.86, status: "a-valider", produced: iso(NOW - 2 * DAY) },
  { id: "PT-013", commune: "Abomey-Calavi", zone: "Akassato", polygons: 388, iou: 0.83, status: "a-valider", produced: iso(NOW - 4 * DAY) },
  { id: "PT-012", commune: "Sèmè-Podji", zone: "Djrègbé", polygons: 241, iou: 0.79, status: "a-valider", produced: iso(NOW - 6 * DAY) },
  { id: "PT-011", commune: "Porto-Novo", zone: "Tokpota", polygons: 519, iou: 0.88, status: "valide", produced: iso(NOW - 12 * DAY) },
  { id: "PT-010", commune: "Ouidah", zone: "Pahou", polygons: 173, iou: 0.71, status: "rejete", produced: iso(NOW - 15 * DAY) },
];

export type RuralCase = { nup: string; areaHa: number; price: number; buyer: string; deadline: string; kind: "preemption" | "mise-en-valeur" | "origine-fonds"; ndvi: number[]; expected: number; proof?: "fournie" | "manquante" | "a-verifier" };

const rural = allParcels().filter((p) => p.landUse === "rural");

export const RURAL: RuralCase[] = rural.map((p, i) => ({
  nup: p.nup,
  areaHa: +(p.areaM2 / 10_000).toFixed(1),
  price: Math.round((p.pricePerM2.low * p.areaM2) / 100_000) * 100_000,
  buyer: ["SARL Agro Mono", "Coopérative des maraîchers", "M. K. Ahouandjinou", "Société Bénin Palm"][i % 4],
  deadline: iso(NOW + (5 + i * 4) * DAY),
  kind: p.areaM2 > 200_000 ? "mise-en-valeur" : "preemption",
  ndvi: [0.62, 0.58, 0.41, 0.38 + (i % 3) * 0.12, 0.35 + (i % 4) * 0.1],
  expected: 0.55,
  proof: p.areaM2 > 200_000 ? (["fournie", "manquante", "a-verifier"] as const)[i % 3] : undefined,
}));

export type ArchiveBatch = { id: string; register: string; pages: number; extracted: number; flagged: number; status: "en-cours" | "a-valider" | "termine" };

export const ARCHIVES: ArchiveBatch[] = [
  { id: "A-07", register: "Livre foncier de Cotonou, volume 12 (1968-1974)", pages: 480, extracted: 480, flagged: 23, status: "a-valider" },
  { id: "A-08", register: "Livre foncier de Cotonou, volume 13 (1974-1979)", pages: 512, extracted: 318, flagged: 9, status: "en-cours" },
  { id: "A-06", register: "Registre des certificats fonciers ruraux, Bohicon", pages: 260, extracted: 260, flagged: 4, status: "termine" },
  { id: "A-05", register: "Livre foncier de Porto-Novo, volume 4 (1952-1960)", pages: 395, extracted: 395, flagged: 31, status: "termine" },
];

export const parcelOf = (nup: string) => getParcel(nup)!;
