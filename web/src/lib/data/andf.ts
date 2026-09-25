// Adaptateur ANDF en direct (ANDF_LIVE=true) : API fiche parcelle + WFS efb_parcel, à la demande, cache 24 h.
// ponytail: aucune indexation en masse (DATA_SOURCES.md § 9) ; seules les parcelles demandées sont lues.
import { PARCELS } from "./mock";
import type { Parcel } from "./types";

const API = "https://b-cadastre.andf.bj:9293/getInformationParcel";
const WFS = "https://geoserver.andf.bj/geoserver/efb/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=efb:efb_parcel&outputFormat=application/json&srsName=EPSG:4326";

export const andfLive = () => process.env.ANDF_LIVE === "true";

type Props = {
  nup: string;
  calculated_area: number | null;
  surveyed_area: number | null;
  register_type: string;
  right_type: string | null;
  title_number_number: string | null;
  party_exists: boolean;
  departement_name: string;
  commune_name: string;
  arrondissement_name: string;
  quartier_name: string;
};

const get = (url: string) => fetch(url, { next: { revalidate: 86_400 }, signal: AbortSignal.timeout(8000) }).then((r) => (r.ok ? r.json() : undefined));

export async function fetchAndfParcel(nup: string): Promise<Parcel | undefined> {
  if (!/^\d{9}$/.test(nup)) return;
  try {
    const wfs = await get(`${WFS}&CQL_FILTER=${encodeURIComponent(`nup='${nup}'`)}`);
    const f = wfs?.features?.[0];
    if (f) return toParcel(f.properties, f.geometry);
    // Parcelle sans polygone publié : l'API fiche donne au moins la localisation
    const api = await get(`${API}/${nup}?documentNumber=`);
    if (!api?.status || !api.data?.coordinate) return;
    const d = api.data;
    const { utmToLonLat } = await import("../survey");
    const [lon, lat] = utmToLonLat(d.coordinate.x, d.coordinate.y);
    const r = Math.sqrt(d.calculatedArea ?? 500) / 2 / 111_000;
    const ring: [number, number][] = [[lon - r, lat - r], [lon + r, lat - r], [lon + r, lat + r], [lon - r, lat + r], [lon - r, lat - r]];
    return toParcel(
      { nup, calculated_area: d.calculatedArea, surveyed_area: d.surveyedArea, register_type: d.registerType, right_type: null, title_number_number: d.titleNumberNumber, party_exists: true, departement_name: d.departementName, commune_name: d.communeName, arrondissement_name: d.arrondissementName, quartier_name: d.quartierName },
      { type: "Polygon", coordinates: [ring] }
    );
  } catch {
    return; // ANDF injoignable : l'appelant retombe sur la démonstration
  }
}

function toParcel(p: Props, geom: { type: string; coordinates: number[][][] | number[][][][] }): Parcel {
  const ring = (geom.type === "MultiPolygon" ? (geom.coordinates as number[][][][])[0][0] : (geom.coordinates as number[][][])[0]) as [number, number][];
  const lon = ring.reduce((s, c) => s + c[0], 0) / ring.length;
  const lat = ring.reduce((s, c) => s + c[1], 0) / ring.length;
  const state = /state|public/i.test(p.register_type);
  const peers = PARCELS.filter((x) => x.commune === p.commune_name);
  const avg = (k: "low" | "high") => (peers.length ? Math.round(peers.reduce((s, x) => s + x.pricePerM2[k], 0) / peers.length) : k === "low" ? 15_000 : 35_000);
  return {
    nup: p.nup,
    department: p.departement_name,
    commune: p.commune_name,
    arrondissement: p.arrondissement_name,
    quartier: p.quartier_name,
    areaM2: Math.round(p.surveyed_area ?? p.calculated_area ?? 0),
    nature: state ? "ETAT" : "Individuelle",
    right: state ? "etat" : p.title_number_number ? "titre" : "presume",
    // Identité jamais exposée : l'ANDF indique seulement qu'un titulaire existe
    owner: state ? { kind: "state" } : { kind: "private", initials: "—" },
    landUse: "urbain",
    zone: "non-loti",
    titleNumber: p.title_number_number ?? undefined,
    center: { lat, lon },
    polygon: ring,
    alerts: [],
    pricePerM2: { low: avg("low"), high: avg("high") },
    real: true,
    live: true,
  };
}
