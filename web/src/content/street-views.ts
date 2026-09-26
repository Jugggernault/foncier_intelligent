// Vues de rue repérées à la main pour les parcelles de démonstration (Mapillary, photos contributives CC BY-SA 4.0).
// Google Street View ne couvre pas ces quartiers du Bénin (vérifié en septembre 2026).
// Aperçu figé dans public/visits/{nup}.jpg (photo recadrée, même licence) ; la visite interactive s'ouvre dans Mapillary.
// ponytail: 3 parcelles choisies à la main ; l'API Mapillary (jeton gratuit) trouvera la vue la plus proche de toute parcelle.
export type StreetView = { key: string; lat: number; lon: number; date: string; by: string; note: string };

export const STREET_VIEWS: Record<string, StreetView> = {
  "101236198": { key: "2926719264264547", lat: 6.347975, lon: 2.307969, date: "2016-06-26", by: "saliousoft", note: "Route des Pêches, à la pointe est de la parcelle, avant l'aménagement littoral" },
  "101232574": { key: "472026684074565", lat: 6.500802, lon: 2.613019, date: "2020-10-27", by: "marledodo200", note: "Route de Porto-Novo, en bordure ouest du site" },
  "101236932": { key: "175391824447548", lat: 6.408068, lon: 2.343184, date: "2017-02-14", by: "saliousoft", note: "RNIE 2 à Godomey, à moins de 200 mètres de la parcelle" },
};

export const mapillaryUrl = (key: string) => `https://www.mapillary.com/app/?pKey=${key}&focus=photo`;
export const satelliteUrl = (lat: number, lon: number) => `https://www.google.com/maps/@${lat},${lon},180m/data=!3m1!1e3`;
