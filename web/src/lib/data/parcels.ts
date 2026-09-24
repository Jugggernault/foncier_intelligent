// Parcelles issues des avis de publicité foncière publiés par l'ANDF (hackathon_documents/pub-foncières.txt).
// ponytail: tableau statique ; même interface que la future API cadastre (SITEMAP § 13), on remplacera getParcel.
import imageryMeta from "../../../public/imagery/meta.json";

export type Owner = { kind: "state" } | { kind: "private" };

export type Parcel = {
  nup: string;
  department?: string;
  commune?: string;
  arrondissement?: string;
  quartier?: string;
  /** Centroïde UTM zone 31N, tel que publié */
  centroid?: { x: number; y: number };
  areaM2?: number;
  owner: Owner;
  procedure: {
    kind: "confirmation" | "titre";
    requestNumber: string;
    requestDate: string;
    publicity: { start: string; end: string };
  };
  titles?: string[];
};

export type Imagery = {
  lat: number;
  lon: number;
  metersPerPixel: number;
  size: number;
  years: number[];
};

const PARCELS: Parcel[] = [
  {
    nup: "101236198",
    department: "Atlantique",
    commune: "Abomey-Calavi",
    arrondissement: "Godomey",
    quartier: "Togbin-Daho",
    centroid: { x: 422946, y: 701870 },
    areaM2: 187420,
    owner: { kind: "state" },
    procedure: {
      kind: "confirmation",
      requestNumber: "8712",
      requestDate: "2025-02-04",
      publicity: { start: "2025-02-04", end: "2025-02-19" },
    },
    titles: ["2207", "2699", "2785", "2792", "4136", "4236", "8015", "20090", "26189", "26190"],
  },
  {
    nup: "101236087",
    commune: "Ouidah",
    arrondissement: "Avlékété",
    quartier: "Adounko",
    centroid: { x: 421842, y: 701745 },
    areaM2: 206097,
    owner: { kind: "state" },
    procedure: {
      kind: "confirmation",
      requestNumber: "1014",
      requestDate: "2025-02-04",
      publicity: { start: "2025-02-04", end: "2025-02-19" },
    },
    titles: ["3510", "3511", "3512", "3513", "3514", "3515"],
  },
  {
    nup: "101236307",
    commune: "Ouidah",
    arrondissement: "Ouidah II",
    quartier: "Gbèna-Nord",
    centroid: { x: 397080, y: 702867 },
    areaM2: 124285,
    owner: { kind: "state" },
    procedure: {
      kind: "confirmation",
      requestNumber: "1011",
      requestDate: "2025-01-27",
      publicity: { start: "2025-02-04", end: "2025-02-19" },
    },
  },
  {
    nup: "101232574",
    commune: "Porto-Novo",
    arrondissement: "5ᵉ arrondissement",
    quartier: "Ouando Clékanmè",
    centroid: { x: 457480, y: 718712 },
    areaM2: 105530,
    owner: { kind: "state" },
    procedure: {
      kind: "confirmation",
      requestNumber: "2750",
      requestDate: "2024-08-22",
      publicity: { start: "2025-02-04", end: "2025-02-19" },
    },
  },
  {
    // Avis publié sans localisation : l'identité du demandeur est masquée (FP-07).
    nup: "100666667",
    owner: { kind: "private" },
    procedure: {
      kind: "titre",
      requestNumber: "9416",
      requestDate: "2025-08-25",
      publicity: { start: "2025-09-08", end: "2025-09-23" },
    },
  },
];

export const NUP_PATTERN = /^\d{9}$/;

export function getParcel(nup: string): Parcel | undefined {
  return PARCELS.find((p) => p.nup === nup);
}

export function getImagery(nup: string): Imagery | undefined {
  return (imageryMeta as Record<string, Imagery>)[nup];
}

export function listPublicityNotices(): Parcel[] {
  return [...PARCELS].sort((a, b) => b.procedure.publicity.end.localeCompare(a.procedure.publicity.end));
}

export const cadastreUrl = (nup: string) => `https://cadastre.andf.bj/nup/${nup}`;
