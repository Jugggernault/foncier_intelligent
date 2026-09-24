// Modèle de parcelle, inspiré de ce que renvoient l'API cadastre ANDF et le WFS efb_parcel (DATA_SOURCES.md § 3.1).

export type LatLon = { lat: number; lon: number };

/** titre = titre foncier délivré · presume = droit présumé (confirmation à faire) · etat = domaine de l'État */
export type RightType = "titre" | "presume" | "etat";

export type Owner = { kind: "state" } | { kind: "private"; initials: string };

export type Procedure = {
  kind: "confirmation" | "titre";
  requestNumber: string;
  requestDate: string;
  publicity: { start: string; end: string };
};

export type Dispute = {
  kind: "limites" | "double-vente" | "succession" | "contestation";
  since: string;
  body: "CoGeF" | "CGP" | "Tribunal";
};

export type TerrainAlert = {
  id: string;
  kind: "construction" | "defrichement" | "inondation" | "empietement";
  date: string;
  confidence: number;
  text: string;
};

export type Parcel = {
  nup: string;
  department: string;
  commune: string;
  arrondissement: string;
  quartier: string;
  areaM2: number;
  nature: "Individuelle" | "ETAT" | "Collective";
  right: RightType;
  owner: Owner;
  landUse: "urbain" | "rural";
  zone: "loti" | "non-loti";
  titleNumber?: string;
  center: LatLon;
  /** Anneau [lon, lat] fermé */
  polygon: [number, number][];
  procedure?: Procedure;
  dispute?: Dispute;
  alerts: TerrainAlert[];
  /** Prix estimé en FCFA/m² (mock AVM) */
  pricePerM2: { low: number; high: number };
  /** true = données réelles publiées par l'ANDF, false = parcelle fictive de démonstration */
  real: boolean;
};

export type Imagery = {
  lat: number;
  lon: number;
  metersPerPixel: number;
  size: number;
  years: number[];
};
