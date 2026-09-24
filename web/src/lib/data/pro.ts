// Données de l'espace professionnel (notaire, géomètre, huissier, banque).
// ponytail: dérivées des parcelles et dossiers mock ; E-Notaire et API partenaires à brancher plus tard.
import { listParcels } from "./parcels";
import type { Parcel } from "./types";

const DAY = 86_400_000;
const iso = (t: number) => new Date(t).toISOString().slice(0, 10);
const NOW = Date.now();
const titled = listParcels().filter((p) => p.right === "titre" && p.landUse === "urbain");

export type Mutation = { id: string; nup: string; seller: string; buyer: string; price: number; status: "preparation" | "transmise" | "enregistree"; date: string };

const NAMES = ["Koffi Dossa", "Mariam Sanni", "Parfait Akakpo", "Rachidatou Bio", "Élodie Ahouansou", "Gildas Tossou", "Nafissatou Yessoufou", "Afi Houngbédji"];

export const MUTATIONS: Mutation[] = titled.slice(0, 9).map((p, i) => ({
  id: `MU-${String(1180 + i)}`,
  nup: p.nup,
  seller: NAMES[i % NAMES.length],
  buyer: NAMES[(i + 3) % NAMES.length],
  // un prix sur trois est anormalement bas, pour montrer le contrôle AVM
  price: Math.round(((p.pricePerM2.low + p.pricePerM2.high) / 2) * p.areaM2 * (i % 3 === 1 ? 0.45 : 1) / 100_000) * 100_000,
  status: (["preparation", "transmise", "enregistree"] as const)[i % 3],
  date: iso(NOW - i * 5 * DAY),
}));

export const CLIENTS = NAMES.map((name, i) => ({ name, files: 1 + (i % 3), last: iso(NOW - i * 7 * DAY), phone: `+229 01 9${i} 00 00 0${i}` }));

export type Survey = { id: string; nup: string; client: string; date: string; points: number; status: "brouillon" | "controle" | "transmis"; issues: number };

export const SURVEYS: Survey[] = titled.slice(9, 15).map((p, i) => ({
  id: `LV-${String(640 + i)}`,
  nup: p.nup,
  client: NAMES[(i + 1) % NAMES.length],
  date: iso(NOW - i * 4 * DAY),
  points: 4 + (i % 3) * 2,
  status: (["brouillon", "controle", "transmis"] as const)[i % 3],
  issues: i % 3 === 0 ? 1 : 0,
}));

export type Deed = { id: string; kind: "Compulsion" | "État descriptif"; nup: string; requester: string; date: string; status: "demandee" | "delivree" };

export const DEEDS: Deed[] = titled.slice(15, 22).map((p, i) => ({
  id: `AC-${String(310 + i)}`,
  kind: i % 2 ? "État descriptif" : "Compulsion",
  nup: p.nup,
  requester: i % 2 ? "Me Rodrigue Agossou" : "Me Clarisse Zinsou",
  date: iso(NOW - i * 3 * DAY),
  status: i < 2 ? "demandee" : "delivree",
}));

export type Collateral = { parcel: Parcel; loan: number; borrower: string; since: string };

export const PORTFOLIO: Collateral[] = [...titled.slice(22, 30), ...listParcels().filter((p) => p.dispute).slice(0, 2)].map((parcel, i) => ({
  parcel,
  loan: Math.round((parcel.pricePerM2.low * parcel.areaM2 * 0.6) / 100_000) * 100_000,
  borrower: NAMES[i % NAMES.length],
  since: iso(NOW - (60 + i * 45) * DAY),
}));

export const INVOICES = [
  { id: "F-2026-091", label: "Vérifications foncières (septembre)", amount: 45000, status: "À payer" },
  { id: "F-2026-078", label: "Vérifications foncières (août)", amount: 60000, status: "Payée" },
  { id: "F-2026-061", label: "Vérifications foncières (juillet)", amount: 30000, status: "Payée" },
];
