// Données d'administration de démonstration.
import { PERSONAS, SPACE_LABEL } from "../personas";

export const USERS = PERSONAS.map((p, i) => ({ name: p.name, role: p.title, space: SPACE_LABEL[p.space], lastSeen: `il y a ${i + 1} h`, twoFactor: p.space !== "espace" }));

export const ROLES = [
  { role: "Citoyen", rights: ["Consulter les fiches publiques", "Gérer ses parcelles, dossiers et alertes"] },
  { role: "Notaire", rights: ["Vérifications", "Préparer et transmettre les mutations", "États descriptifs"] },
  { role: "Géomètre", rights: ["Importer et transmettre les levés", "Valider les pré-tracés IA"] },
  { role: "Banque", rights: ["Vérifications", "Suivi des garanties", "Accès API"] },
  { role: "Agent ANDF / BCDF", rights: ["Instruire les dossiers", "Voir l'identité des titulaires", "Publier les avis", "Traiter les alertes"] },
  { role: "Commune", rights: ["Litiges et médiations de la commune", "Assiette TFU", "Patrimoine communal"] },
  { role: "Pilotage", rights: ["Indicateurs nationaux", "Dossiers LCB-FT (accès restreint)"] },
];

export const COVERAGE = [
  ...["Cotonou", "Porto-Novo", "Parakou", "Abomey-Calavi", "Sèmè-Podji", "Djougou", "Pobè", "Aplahoué", "Bohicon", "Sakété", "N'Dali", "Grand-Popo"].map((c) => ({ commune: c, efoncier: true, terra: false })),
  ...["Ouidah", "Allada", "Lokossa", "Natitingou", "Kandi", "Savalou", "Dassa-Zoumè", "Comè", "Malanville", "Tchaourou", "Nikki", "Kétou", "Adjohoun", "Zè"].map((c) => ({ commune: c, efoncier: false, terra: true })),
];

export type Integration = { name: string; purpose: string; status: "reel" | "mock" | "accord"; detail: string };

export const INTEGRATIONS: Integration[] = [
  { name: "Imagerie Sentinel-2 (Digital Earth Africa)", purpose: "Fiche terrain, alertes", status: "reel", detail: "GeoMAD annuel 2017–2025, CC BY 4.0" },
  { name: "OpenFreeMap", purpose: "Fond de carte", status: "reel", detail: "Style Liberty, données OSM" },
  { name: "Cadastre ANDF (API NUP + WFS)", purpose: "Fiches parcelles", status: "mock", detail: "API publique identifiée, branchement à venir (DATA_SOURCES.md)" },
  { name: "Publicité foncière ANDF", purpose: "Veille et alertes", status: "mock", detail: "Table andf.bj lisible, scraping à brancher" },
  { name: "Catalogue service-public.bj", purpose: "Démarches, frais", status: "mock", detail: "API JSON publique, en cache à brancher" },
  { name: "Claude API", purpose: "Assistant, lecture des pièces, copilote", status: "mock", detail: "Réponses simulées en attendant la clé" },
  { name: "FedaPay / Kkiapay", purpose: "Paiement Mobile Money", status: "mock", detail: "Sandbox gratuite disponible" },
  { name: "WhatsApp Cloud API", purpose: "Alertes", status: "mock", detail: "Numéro de test gratuit" },
  { name: "PNS / NPI (ASIN, ANIP)", purpose: "Connexion", status: "accord", detail: "Convention requise" },
  { name: "E-Notaire / e-Foncier", purpose: "Transmission des actes", status: "accord", detail: "Accès partenaire ANDF" },
];

export const CORPUS = [
  { title: "Loi 2013-01 portant Code foncier et domanial", source: "sgg.gouv.bj (scan, OCR)", chunks: 1240, indexed: true },
  { title: "Loi 2017-15 modifiant le Code foncier", source: "FAOLEX", chunks: 188, indexed: true },
  { title: "Décret 2025-176 (NUP, confirmation cadastrale)", source: "FAOLEX", chunks: 96, indexed: true },
  { title: "Décret 2015-010 (attributions de l'ANDF)", source: "sgg.gouv.bj", chunks: 74, indexed: true },
  { title: "Décret 2015-017 (CoGeF, SVGF)", source: "sgg.gouv.bj", chunks: 52, indexed: true },
  { title: "Catalogue des e-services fonciers", source: "service-public.bj", chunks: 41, indexed: true },
  { title: "Circulaire DGI 709 (valeurs TFU)", source: "andf.bj (scan)", chunks: 0, indexed: false },
];

export const THRESHOLDS = [
  { name: "Alerte d'empiètement", value: "Confiance ≥ 70 % et emprise ≥ 100 m²" },
  { name: "Document suspect", value: "Distance au spécimen ≥ 0,35" },
  { name: "Écart de superficie signalé", value: "≥ 10 %" },
  { name: "Prix de mutation sous-déclaré", value: "< 70 % de l'estimation basse" },
  { name: "Score LCB-FT transmis pour analyse", value: "≥ 0,70" },
];

export const SPECIMENS = [
  { authority: "Mairie d'Abomey-Calavi", items: 14, updated: "2026-07-12" },
  { authority: "Mairie de Cotonou", items: 22, updated: "2026-08-02" },
  { authority: "Mairie de Porto-Novo", items: 9, updated: "2026-05-30" },
  { authority: "Mairie de Sèmè-Podji", items: 6, updated: "2026-06-18" },
];

export const AUDIT = [
  ["2026-09-24 09:12", "Sènami Adjovi", "Décision", "D-2026-04103 rejeté (suggestion du copilote suivie)"],
  ["2026-09-24 08:47", "IA · lecture des pièces", "Extraction", "D-2026-04141 : 4 pièces lues"],
  ["2026-09-23 17:30", "Administrateur", "Seuil modifié", "Alerte d'empiètement : confiance 65 % → 70 %"],
  ["2026-09-23 15:02", "Me Rodrigue Agossou", "Mutation", "MU-1181 transmise via E-Notaire"],
  ["2026-09-23 11:18", "IA · détection de bâti", "Alerte", "E-0803 créée (confiance 91 %)"],
];
