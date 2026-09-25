// Charge les 12 couches GeoJSON du hackathon dans PostGIS (local ou Supabase).
// Usage : bun scripts/load-layers.ts [dossier des .geojson] (lit DIRECT_URL, sinon DATABASE_URL, depuis .env.local)
// Les attributs sont filtrés : aucun nom de personne (demandeur, défendeur, avocat) ne quitte les fichiers source.
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import postgres from "postgres";

type Props = Record<string, unknown>;
type Layer = {
  file: string;
  id: string;
  label: string;
  category: "droit" | "restriction" | "risque" | "domaine-public" | "cadastre";
  severity: "danger" | "caution" | "info";
  description: string;
  /** Tampon en mètres pour les couches linéaires (bande du domaine public). */
  buffer?: number;
  pick: (p: Props) => Props;
};

const s = (v: unknown) => (v == null || v === "" ? undefined : String(v).trim());

// Les motifs de rejet sont du texte libre qui cite parfois des personnes : on ne garde qu'une catégorie.
export const MOTIFS: [code: string, label: string, test: RegExp][] = [
  ["calage", "Calage de la parcelle à revoir", /calage|décalage|borne/i],
  ["element_physique", "Élément physique à relever sur le terrain", /élément physique|elements? physiques?|éléments physiques/i],
  ["procedure_judiciaire", "Zone en cours de procédure judiciaire", /procédure judiciaire|litige/i],
  ["autre_plan", "Correspond à un autre plan de bornage", /autre plan|plan de bornage/i],
  ["restriction", "Zone d'utilité publique ou réservée", /zdup|utilité publique|réserv|domaine public/i],
  ["transmis", "Plan transmis ou retransmis", /transmi/i],
];
const motif = (v: unknown) => {
  const t = s(v);
  if (!t) return {};
  const m = MOTIFS.find(([, , re]) => re.test(t));
  return m ? { motif_code: m[0], motif: m[1] } : { motif_code: "autre", motif: "Autre motif (voir dossier)" };
};

const LAYERS: Layer[] = [
  {
    file: "litige.geojson", id: "litige", label: "Zone en litige", category: "droit", severity: "danger",
    description: "Parcelle concernée par une procédure devant les juridictions.",
    pick: (p) => ({ label: "Litige", commune: s(p.commune), tribunal: s(p.tribunal), objet: s(p.objet), role: s(p.num_role_alea), statut: p.statut_litige ? "levé" : "en cours" }),
  },
  {
    file: "restriction.geojson", id: "restriction", label: "Restriction d'utilité publique", category: "restriction", severity: "danger",
    description: "Zone déclarée d'utilité publique (ZDUP), site du PAG, domaine public naturel ou zone de sécurité.",
    pick: (p) => ({ label: [s(p.type), s(p.designation)].filter(Boolean).join(" · "), type: s(p.type), designation: s(p.designation), commune: s(p.commune) }),
  },
  {
    file: "tf_etat.geojson", id: "tf_etat", label: "Titre foncier de l'État", category: "droit", severity: "danger",
    description: "Terrain objet d'un titre foncier au nom de l'État béninois.",
    pick: (p) => ({ label: `TF État ${s(p.tf_alea)}`, tf: s(p.tf_alea), surface: p.surface }),
  },
  {
    file: "air_proteges.geojson", id: "aire_protegee", label: "Aire protégée", category: "domaine-public", severity: "danger",
    description: "Forêt classée, parc ou zone cynégétique. Contours de fiabilité variable.",
    pick: (p) => ({ label: s(p.designation), designation: s(p.designation) }),
  },
  {
    file: "dpm.geojson", id: "dpm", label: "Domaine public maritime", category: "domaine-public", severity: "danger", buffer: 100,
    description: "Bande indicative de 100 m depuis le trait de côte, inaliénable.",
    pick: () => ({ label: "Domaine public maritime" }),
  },
  {
    file: "dpl.geojson", id: "dpl", label: "Domaine public lagunaire et fluvial", category: "domaine-public", severity: "danger", buffer: 25,
    description: "Bande indicative de 25 m le long des berges, inaliénable.",
    pick: (p) => ({ label: "Domaine public lagunaire", couche: s(p.Layer) }),
  },
  {
    file: "tf_en_cours.geojson", id: "tf_en_cours", label: "Titre foncier en cours", category: "droit", severity: "caution",
    description: "Plan déposé pour l'obtention d'un titre foncier, en cours d'instruction.",
    pick: (p) => ({ label: "TF en cours", commune: s(p.commune), arrondissement: s(p.arrond), quartier: s(p.qu_village), validation: s(p.validation), ...motif(p.motif), nup: s(p.nup), tf: s(p.tf_alea) }),
  },
  {
    file: "zone_inondable.geojson", id: "zone_inondable", label: "Zone inondable", category: "risque", severity: "caution",
    description: "Zone exposée aux inondations (restitution cartographique).",
    pick: (p) => ({ label: "Zone inondable", source: s(p.source) }),
  },
  {
    file: "aif.geojson", id: "aif", label: "Association d'intérêts fonciers", category: "droit", severity: "caution",
    description: "Périmètre géré par une association d'intérêts fonciers : vente encadrée.",
    pick: (p) => ({ label: `AIF ${s(p.commune) ?? ""}`, commune: s(p.commune), arrondissement: s(p.arrondissement), tf: s(p.TF_alea) }),
  },
  {
    file: "tf_demembres.geojson", id: "tf_demembre", label: "Titre foncier démembré", category: "droit", severity: "info",
    description: "Parcelle issue d'un titre foncier morcelé ou recasé.",
    pick: (p) => ({ label: `TF démembré ${s(p.tf_alea)}`, commune: s(p.Commune), tf: s(p.tf_alea) }),
  },
  {
    file: "titre_reconstitue.geojson", id: "tf_reconstitue", label: "Titre foncier reconstitué", category: "droit", severity: "info",
    description: "Titre foncier reconstitué sur une grande superficie.",
    pick: (p) => ({ label: `TF reconstitué ${s(p.tf_alea)}`, nup: s(p.nup), ville: s(p.ville), bcdf: s(p.bcdf), tf: s(p.tf_alea) }),
  },
  {
    file: "enregistrement individuel.geojson", id: "enregistrement", label: "Parcelle enregistrée au cadastre", category: "cadastre", severity: "info",
    description: "Parcelle objet d'un enregistrement individuel au cadastre.",
    pick: (p) => ({ label: `Parcelle ${s(p.CODE_PARCELLE) ?? ""}`, commune: s(p.COMMUNE), arrondissement: s(p.ARRONDISSEMENT), quartier: s(p.VILLAGE_QUARTIER), superficie: p.SUPERFICIE, bloc: s(p.CODE_BLOC) }),
  },
];

const dir = process.argv[2] ?? join(import.meta.dir, "../../ilemi-main/public/data_files");
// Migration et chargement : connexion de session (DIRECT_URL, port 5432) plutôt que le pooler transactionnel
const url = (process.env.DIRECT_URL ?? process.env.DATABASE_URL)?.replace(/[?&]pgbouncer=true\b/, "");
if (!url) throw new Error("DIRECT_URL ou DATABASE_URL manquant");
const sql = postgres(url, { max: 1, onnotice: () => {} });

await sql.file(join(import.meta.dir, "../supabase/migrations/0001_layers.sql"));

for (const l of LAYERS) {
  const fc = JSON.parse(await readFile(join(dir, l.file), "utf8")) as { features: { geometry: unknown; properties: Props }[] };
  const rows = fc.features.filter((f) => f.geometry).map((f) => ({ props: l.pick(f.properties ?? {}), geom: f.geometry }));
  await sql`delete from layers where id = ${l.id}`;
  await sql`insert into layers (id, label, category, severity, description) values (${l.id}, ${l.label}, ${l.category}, ${l.severity}, ${l.description})`;
  // ponytail: simplification à 0,5 m en UTM avant reprojection ; suffisant pour l'affichage et les croisements
  const geomExpr = l.buffer
    ? sql`st_transform(st_buffer(st_force2d(st_setsrid(st_geomfromgeojson(r->>'geom'), 32631)), ${l.buffer}), 4326)`
    : sql`st_transform(st_makevalid(st_simplifypreservetopology(st_force2d(st_setsrid(st_geomfromgeojson(r->>'geom'), 32631)), 0.5)), 4326)`;
  for (let i = 0; i < rows.length; i += 500) {
    const batch = rows.slice(i, i + 500).map((r) => ({ props: r.props, geom: JSON.stringify(r.geom) }));
    await sql`
      insert into layer_features (layer_id, props, geom)
      select ${l.id}, (r->'props'), ${geomExpr}
      from jsonb_array_elements(${sql.json(batch as unknown as postgres.JSONValue)}) r`;
  }
  console.log(`${l.id.padEnd(16)} ${rows.length} objets`);
}

await sql`analyze layer_features`;
await sql.end();
