// Indicateurs nationaux de démonstration (PRD § 13) et cas LCB-FT.
// ponytail: valeurs fictives cohérentes ; sources prévues : statistiques ANDF (PDF), e-Foncier, DGI.
import { listParcels } from "./parcels";

export const KPIS = [
  { label: "Délai moyen d'un titre foncier", unit: "jours", start: 120, now: 96, target: 60, lowerIsBetter: true },
  { label: "Mutation de titre foncier", unit: "heures", start: 72, now: 41, target: 24, lowerIsBetter: true },
  { label: "Dossiers complets au premier dépôt", unit: "%", start: 52, now: 78, target: 90, lowerIsBetter: false },
  { label: "Délai de détection d'un empiètement", unit: "jours", start: 365, now: 34, target: 30, lowerIsBetter: true },
  { label: "Litiges sur parcelles vérifiées", unit: "% d'évolution", start: 0, now: -18, target: -30, lowerIsBetter: true },
  { label: "Recettes TFU des communes pilotes", unit: "% d'évolution", start: 0, now: 9, target: 15, lowerIsBetter: false },
];

export const OFFICES = [
  { name: "Cotonou", backlog: 412, delay: 88, forecast: 460 },
  { name: "Abomey-Calavi", backlog: 655, delay: 121, forecast: 720 },
  { name: "Porto-Novo", backlog: 238, delay: 79, forecast: 250 },
  { name: "Parakou", backlog: 190, delay: 102, forecast: 205 },
  { name: "Sèmè-Podji", backlog: 301, delay: 110, forecast: 340 },
  { name: "Ouidah", backlog: 142, delay: 74, forecast: 150 },
  { name: "Bohicon", backlog: 97, delay: 69, forecast: 101 },
];

export const MODELS = [
  { name: "Lecture des pièces (IA-07)", metric: "Exactitude des champs clés", value: 0.95, target: 0.95, acceptance: 0.91 },
  { name: "Détection de bâti (IA-01/02)", metric: "Rappel > 100 m²", value: 0.92, target: 0.9, acceptance: 0.74 },
  { name: "Copilote agent (IA-10)", metric: "Suggestions acceptées", value: 0.83, target: 0.8, acceptance: 0.83 },
  { name: "Assistant citoyen (IA-09)", metric: "Réponses jugées correctes", value: 0.9, target: 0.9, acceptance: 0.88 },
  { name: "Faux documents (IA-08)", metric: "Précision des signalements", value: 0.68, target: 0.75, acceptance: 0.62 },
  { name: "Estimation de valeur (IA-13)", metric: "Erreur médiane", value: 0.22, target: 0.2, acceptance: 0.7 },
];

export const FAIRNESS = [
  { group: "Droits coutumiers", accuracy: 0.9 },
  { group: "Titres fonciers", accuracy: 0.96 },
  { group: "Demandeuses", accuracy: 0.94 },
  { group: "Demandeurs", accuracy: 0.95 },
  { group: "Communes rurales", accuracy: 0.89 },
  { group: "Communes urbaines", accuracy: 0.96 },
];

export type GraphNode = { id: string; label: string; kind: "personne" | "societe" | "parcelle" };
export type GraphEdge = { from: string; to: string; label: string };
export type AmlCase = { id: string; title: string; score: number; pattern: string; status: "ouvert" | "transmis-centif" | "clos"; nodes: GraphNode[]; edges: GraphEdge[]; timeline: [string, string][] };

const rural = listParcels().filter((p) => p.landUse === "rural" && !p.real);

export const AML_CASES: AmlCase[] = [
  {
    id: "LCB-014",
    title: "Accumulation sous le seuil de 20 ha",
    score: 0.87,
    pattern: "Cinq acquisitions de 18 à 19,5 ha en 7 mois par trois sociétés au même gérant : 94 ha au total sans justification d'origine des fonds.",
    status: "ouvert",
    nodes: [
      { id: "g", label: "M. K. A. (gérant)", kind: "personne" },
      { id: "s1", label: "SARL Terra Nova", kind: "societe" },
      { id: "s2", label: "SAS Agro Plus", kind: "societe" },
      { id: "s3", label: "SARL Horizon Vert", kind: "societe" },
      ...rural.slice(0, 5).map((p, i) => ({ id: `p${i}`, label: `${p.nup} · 19 ha`, kind: "parcelle" as const })),
    ],
    edges: [
      { from: "g", to: "s1", label: "gérant" },
      { from: "g", to: "s2", label: "gérant" },
      { from: "g", to: "s3", label: "gérant" },
      { from: "s1", to: "p0", label: "achat" },
      { from: "s1", to: "p1", label: "achat" },
      { from: "s2", to: "p2", label: "achat" },
      { from: "s2", to: "p3", label: "achat" },
      { from: "s3", to: "p4", label: "achat" },
    ],
    timeline: [["2026-02-11", "Achat 18,9 ha par SARL Terra Nova"], ["2026-04-03", "Achat 19,4 ha par SAS Agro Plus"], ["2026-06-20", "Achat 19,5 ha par SARL Horizon Vert"], ["2026-08-29", "Signalement automatique"]],
  },
  {
    id: "LCB-012",
    title: "Reventes rapides avec plus-value atypique",
    score: 0.71,
    pattern: "Trois parcelles urbaines revendues moins de 90 jours après l'achat, à plus de 3 fois le prix déclaré initial.",
    status: "transmis-centif",
    nodes: [
      { id: "a", label: "M. R. T.", kind: "personne" },
      { id: "b", label: "Mme S. B.", kind: "personne" },
      { id: "q0", label: "Parcelle Fidjrossè", kind: "parcelle" },
      { id: "q1", label: "Parcelle Agla", kind: "parcelle" },
    ],
    edges: [
      { from: "a", to: "q0", label: "achat 8 M" },
      { from: "q0", to: "b", label: "revente 27 M" },
      { from: "a", to: "q1", label: "achat 6 M" },
      { from: "q1", to: "b", label: "revente 21 M" },
    ],
    timeline: [["2026-05-02", "Achats par M. R. T."], ["2026-07-18", "Reventes à Mme S. B."], ["2026-08-05", "Transmis à la CENTIF"]],
  },
];

export const getAmlCase = (id: string) => AML_CASES.find((c) => c.id === id);
