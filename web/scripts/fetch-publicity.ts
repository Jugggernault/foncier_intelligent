// Parcelles des avis de publicité foncière publiés sur andf.bj, avec leur polygone réel (WFS efb_parcel).
// Usage : bun scripts/fetch-publicity.ts
// Aucune donnée nominative n'est conservée : le texte de l'avis (nom, téléphone du demandeur) sert
// seulement à extraire le NUP, les dates, le numéro de demande et si le demandeur est l'État.
// ponytail: une requête WFS par NUP publié (environ 150), à relancer à la main ; pas de moissonnage du cadastre.
const PAGE = "https://andf.bj/les-publicites-foncieres/";
const WFS = "https://geoserver.andf.bj/geoserver/efb/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=efb:efb_parcel&outputFormat=application/json&srsName=EPSG:4326";
const MONTHS = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];

const html = await (await fetch(PAGE, { headers: { "user-agent": "foncier-intelligent-demo" } })).text();
const text = (s: string) => s.replace(/<[^>]+>/g, "").replace(/&#0?39;|&rsquo;/g, "'").replace(/&amp;/g, "&").replace(/&nbsp;/g, " ").trim();
const dmy = (s: string) => {
  const m = s.match(/(\d{1,2})[-/](\d{1,2})[-/](\d{4})/);
  if (m) return `${m[3]}-${m[2].padStart(2, "0")}-${m[1].padStart(2, "0")}`;
  const w = s.match(/(\d{1,2})(?:er)?\s+([a-zéû]+)\s+(\d{4})/i);
  const mo = w ? MONTHS.indexOf(w[2].toLowerCase()) : -1;
  return w && mo >= 0 ? `${w[3]}-${String(mo + 1).padStart(2, "0")}-${w[1].padStart(2, "0")}` : undefined;
};

type Notice = { nup: string; kind: "titre" | "confirmation"; requester: "state" | "private"; requestNumber?: string; requestDate?: string; publicity: { start: string; end: string }; bcdf?: string };
const notices = new Map<string, Notice>();
for (const [, c, a, b] of html.matchAll(/<tr data-row_id="\d+"[^>]*>\s*<td>([\s\S]*?)<\/td>\s*<td>([\s\S]*?)<\/td>\s*<td>([\s\S]*?)<\/td>/g)) {
  const t = text(c);
  const nup = t.match(/NUP\s*(\d{9})/)?.[1];
  const start = dmy(a), end = dmy(b);
  if (!nup || !start || !end) continue;
  const prev = notices.get(nup);
  if (prev && prev.publicity.end >= end) continue; // garder l'avis le plus récent
  const req = t.match(/num[ée]ro\s*(\d+)\s*du\s*([^,»]+)/i);
  notices.set(nup, {
    nup,
    kind: /confirmation cadastrale/i.test(t) ? "confirmation" : "titre",
    requester: /compte de l'[ÉE]tat/i.test(t) ? "state" : "private",
    requestNumber: req?.[1],
    requestDate: req ? dmy(req[2]) : undefined,
    publicity: { start, end },
    bcdf: t.match(/BCDF d[e’']\s*([A-ZÀ-Üa-zà-ü -]+?)[.\s]*$/)?.[1]?.trim(),
  });
}
console.log(notices.size, "NUP publiés");

const out = [];
for (const n of notices.values()) {
  const d = await (await fetch(`${WFS}&CQL_FILTER=${encodeURIComponent(`nup='${n.nup}'`)}`)).json().catch(() => undefined);
  const f = d?.features?.[0];
  if (!f?.geometry) {
    console.log(n.nup, "sans polygone");
    continue;
  }
  const g = f.geometry;
  const ring = (g.type === "MultiPolygon" ? g.coordinates[0][0] : g.coordinates[0]).map(([x, y]: number[]) => [+x.toFixed(7), +y.toFixed(7)]);
  const p = f.properties;
  out.push({
    ...n,
    department: p.departement_name,
    commune: p.commune_name,
    arrondissement: p.arrondissement_name,
    quartier: p.quartier_name,
    areaM2: Math.round(p.surveyed_area ?? p.calculated_area ?? 0),
    rightType: p.right_type,
    registerType: p.register_type,
    titleNumber: p.title_number_number,
    polygon: ring,
  });
  await Bun.sleep(250);
}
console.log(out.length, "parcelles avec polygone");
await Bun.write(new URL("../src/content/publicity-parcels.json", import.meta.url), JSON.stringify(out) + "\n");
