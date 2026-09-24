// Dossiers, litiges, paiements et vérifications de démonstration, partagés entre l'espace citoyen et l'espace agent.
// ponytail: jeu statique dérivé des parcelles mock ; à remplacer par e-Foncier (accès partenaire ANDF).
import { listParcels } from "./parcels";
import type { Parcel } from "./types";

const DAY = 86_400_000;
const iso = (t: number) => new Date(t).toISOString().slice(0, 10);
const NOW = Date.now();

export type DossierKind = "titre" | "mutation" | "appartenance" | "etat-descriptif" | "morcellement";
export type DossierStatus = "brouillon" | "depose" | "instruction" | "complement" | "publicite" | "valide" | "rejete";
export type StepState = "done" | "current" | "todo";

export type DocCheck = { name: string; status: "ok" | "missing" | "suspect" | "unreadable"; note?: string; extracted?: Record<string, string> };

export type Dossier = {
  id: string;
  kind: DossierKind;
  nup: string;
  applicant: string;
  applicantInitials: string;
  status: DossierStatus;
  createdAt: string;
  dueAt: string;
  completeness: number;
  anomalyScore: number;
  documents: DocCheck[];
  steps: { label: string; date?: string; state: StepState }[];
  messages: { from: "agent" | "usager" | "systeme"; date: string; text: string }[];
};

export type Litige = {
  id: string;
  nup: string;
  kind: "limites" | "double-vente" | "succession" | "contestation";
  status: "ouvert" | "mediation" | "cgp" | "tribunal" | "clos";
  opened: string;
  parties: string[];
  summary: string;
  nextStep?: { label: string; date: string };
  aiCategory?: { label: string; confidence: number };
};

export type Payment = { id: string; date: string; label: string; amount: number; method: "MTN MoMo" | "Moov Money" | "Carte Visa"; ref: string };

export const KIND_LABEL: Record<DossierKind, string> = {
  titre: "Demande de titre foncier",
  mutation: "Mutation de titre foncier",
  appartenance: "Certificat d'appartenance",
  "etat-descriptif": "État descriptif",
  morcellement: "Morcellement",
};

export const STATUS_LABEL: Record<DossierStatus, string> = {
  brouillon: "Brouillon",
  depose: "Déposé",
  instruction: "En instruction",
  complement: "Complément demandé",
  publicite: "En publicité",
  valide: "Validé",
  rejete: "Rejeté",
};

export const LITIGE_STATUS: Record<Litige["status"], string> = {
  ouvert: "Ouvert",
  mediation: "Médiation CoGeF",
  cgp: "Commission des plaintes",
  tribunal: "Tribunal",
  clos: "Clos",
};

const APPLICANTS: [string, string][] = [
  ["Afi Houngbédji", "AH"],
  ["Koffi Dossa", "KD"],
  ["Mariam Sanni", "MS"],
  ["Parfait Akakpo", "PA"],
  ["Rachidatou Bio", "RB"],
  ["Élodie Ahouansou", "EA"],
  ["Gildas Tossou", "GT"],
  ["Nafissatou Yessoufou", "NY"],
];

const STATUSES: DossierStatus[] = ["depose", "instruction", "complement", "instruction", "publicite", "valide", "instruction", "depose"];

function steps(status: DossierStatus, created: number): Dossier["steps"] {
  const order: DossierStatus[] = ["depose", "instruction", "publicite", "valide"];
  const at = Math.max(0, order.indexOf(status === "complement" ? "instruction" : status));
  return [
    { label: "Dossier déposé", date: iso(created), state: "done" },
    { label: "Instruction par le BCDF", date: at >= 1 ? iso(created + 6 * DAY) : undefined, state: at > 1 ? "done" : at === 1 ? "current" : "todo" },
    { label: "Publicité foncière (15 jours)", date: at >= 2 ? iso(created + 30 * DAY) : undefined, state: at > 2 ? "done" : at === 2 ? "current" : "todo" },
    { label: "Décision et délivrance", date: at >= 3 ? iso(created + 60 * DAY) : undefined, state: at === 3 ? "done" : "todo" },
  ];
}

function documents(kind: DossierKind, p: Parcel, i: number): DocCheck[] {
  const docs: DocCheck[] = [
    { name: "Pièce d'identité", status: "ok", extracted: { NPI: `10${(83421907 + i * 7919).toString().slice(0, 8)}` } },
    {
      name: kind === "mutation" ? "Expédition notariale" : "Attestation de détention coutumière",
      status: i % 5 === 3 ? "suspect" : "ok",
      note: i % 5 === 3 ? "Cachet différent des spécimens de la mairie ; date de signature postérieure au mandat du signataire." : undefined,
      extracted: { Superficie: `${Math.round(p.areaM2 * (i % 4 === 1 ? 1.18 : 1))} m²`, Commune: p.commune },
    },
    { name: "Levé topographique", status: i % 4 === 2 ? "missing" : "ok" },
  ];
  if (kind === "titre") docs.push({ name: "Convention de vente", status: i % 6 === 4 ? "unreadable" : "ok", note: i % 6 === 4 ? "Photo floue : la page 2 est illisible." : undefined });
  return docs;
}

function buildDossiers(): Dossier[] {
  const parcels = listParcels().filter((p) => p.owner.kind === "private");
  const kinds: DossierKind[] = ["titre", "titre", "mutation", "appartenance", "titre", "etat-descriptif", "morcellement", "titre"];
  return parcels.slice(0, 42).map((p, i) => {
    const [applicant, initials] = APPLICANTS[i % APPLICANTS.length];
    const round = Math.floor(i / APPLICANTS.length);
    const kind = kinds[(i + round * 3) % kinds.length];
    const status = STATUSES[(i + round * 5) % STATUSES.length];
    const created = NOW - (5 + ((i * 13) % 110)) * DAY;
    const docs = documents(kind, p, i);
    const bad = docs.filter((d) => d.status !== "ok").length;
    const areaMismatch = i % 4 === 1;
    return {
      id: `D-2026-${String(4100 + i).padStart(5, "0")}`,
      kind,
      nup: p.nup,
      applicant,
      applicantInitials: initials,
      status,
      createdAt: iso(created),
      dueAt: iso(created + (kind === "titre" ? 120 : kind === "mutation" ? 3 : 10) * DAY),
      completeness: Math.round(((docs.length - docs.filter((d) => d.status === "missing").length) / docs.length) * 100),
      anomalyScore: Math.min(0.97, +(0.08 + bad * 0.28 + (areaMismatch ? 0.22 : 0) + (p.dispute ? 0.3 : 0)).toFixed(2)),
      documents: docs,
      steps: steps(status, created),
      messages: [
        { from: "systeme", date: iso(created), text: "Dossier reçu. Les pièces ont été lues automatiquement." },
        ...(status === "complement"
          ? [{ from: "agent" as const, date: iso(created + 8 * DAY), text: "Merci de fournir le levé topographique géoréférencé de la parcelle." }]
          : []),
      ],
    };
  });
}

export const DOSSIERS = buildDossiers();

export const listDossiers = () => DOSSIERS;
export const getDossier = (id: string) => DOSSIERS.find((d) => d.id === id);
export const dossiersOf = (initials: string) => DOSSIERS.filter((d) => d.applicantInitials === initials).slice(0, 3);

export const LITIGES: Litige[] = listParcels()
  .filter((p) => p.dispute)
  .map((p, i) => ({
    id: `L-2026-${String(310 + i).padStart(4, "0")}`,
    nup: p.nup,
    kind: p.dispute!.kind,
    status: p.dispute!.body === "CoGeF" ? "mediation" : p.dispute!.body === "CGP" ? "cgp" : "tribunal",
    opened: p.dispute!.since,
    parties: [APPLICANTS[i % APPLICANTS.length][0], APPLICANTS[(i + 3) % APPLICANTS.length][0]],
    summary: {
      limites: "Désaccord sur la limite est : une clôture empiète d'environ 3 m sur la parcelle voisine.",
      "double-vente": "La parcelle aurait été vendue à deux acquéreurs à six mois d'intervalle.",
      succession: "Les héritiers contestent la vente réalisée par l'un d'eux sans l'accord des autres.",
      contestation: "Un tiers revendique la propriété sur la base d'une attestation coutumière antérieure.",
    }[p.dispute!.kind],
    nextStep: { label: p.dispute!.body === "CoGeF" ? "Séance de médiation" : "Audience", date: iso(NOW + (7 + i * 3) * DAY) },
    aiCategory: { label: { limites: "Conflit de limites", "double-vente": "Double vente", succession: "Succession", contestation: "Contestation de droit" }[p.dispute!.kind], confidence: 0.81 + (i % 4) * 0.04 },
  }));

export const getLitige = (id: string) => LITIGES.find((l) => l.id === id);

export const PAYMENTS: Payment[] = [
  { id: "P-1", date: iso(NOW - 64 * DAY), label: "Certificat d'appartenance", amount: 50500, method: "MTN MoMo", ref: "MOMO-7Q2K81" },
  { id: "P-2", date: iso(NOW - 40 * DAY), label: "État descriptif", amount: 5500, method: "Moov Money", ref: "MOOV-44Z1TA" },
  { id: "P-3", date: iso(NOW - 12 * DAY), label: "Rapport de vérification", amount: 0, method: "Carte Visa", ref: "GRATUIT-DEMO" },
];
