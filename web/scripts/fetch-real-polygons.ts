// Polygones réels des parcelles publiées (WFS efb_parcel de l'ANDF), lus une fois et figés dans le dépôt.
// Usage : bun scripts/fetch-real-polygons.ts
// ponytail: 5 requêtes à la demande ; pas de moissonnage (DATA_SOURCES.md § 9).
const NUPS = ["101236198", "101236087", "101236307", "101232574", "100666667"];
const WFS = "https://geoserver.andf.bj/geoserver/efb/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=efb:efb_parcel&outputFormat=application/json&srsName=EPSG:4326&propertyName=nup,boundary";

const out: Record<string, number[][]> = {};
for (const nup of NUPS) {
  const d = await (await fetch(`${WFS}&CQL_FILTER=${encodeURIComponent(`nup='${nup}'`)}`)).json();
  const g = d.features?.[0]?.geometry;
  if (!g) throw new Error(`${nup} : aucun polygone`);
  const ring = g.type === "MultiPolygon" ? g.coordinates[0][0] : g.coordinates[0];
  out[nup] = ring.map(([x, y]: number[]) => [+x.toFixed(7), +y.toFixed(7)]);
  console.log(nup, out[nup].length, "sommets");
}
await Bun.write(new URL("../src/content/real-parcels.json", import.meta.url), JSON.stringify(out) + "\n");
