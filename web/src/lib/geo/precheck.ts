import "server-only";
import type { Ring } from "../survey";
import { areaM2 } from "../survey";
import { db } from "./db";
import { layersAt, type LayerHit } from "./layers";

export type CheckStatus = "ok" | "warn" | "fail";
export type Check = { id: string; label: string; status: CheckStatus; detail: string; fix?: string };
export type Precheck = {
  checks: Check[];
  /** Probabilité estimée d'un rejet par le BCDF (0-1) */
  rejectRisk: number;
  context?: { commune: string; plans: number; rejectRate: number; topReasons: { label: string; share: number }[] };
  hits: LayerHit[];
};

type Stat = { commune: string; plans: number; rejected: number };
type Reason = { motif: string; n: number };

/** Anneau auto-intersecté ? (test naïf O(n²), suffisant pour un plan de quelques bornes) */
function selfIntersects(ring: Ring) {
  const seg = (a: number[], b: number[], c: number[], d: number[]) => {
    const o = (p: number[], q: number[], r: number[]) => Math.sign((q[0] - p[0]) * (r[1] - p[1]) - (q[1] - p[1]) * (r[0] - p[0]));
    return o(a, b, c) * o(a, b, d) < 0 && o(c, d, a) * o(c, d, b) < 0;
  };
  const n = ring.length - 1;
  for (let i = 0; i < n; i++) for (let j = i + 2; j < n; j++) if (!(i === 0 && j === n - 1) && seg(ring[i], ring[i + 1], ring[j], ring[j + 1])) return true;
  return false;
}

/**
 * Pré-contrôle d'un plan avant dépôt (automatisation du cadastre) : géométrie, cohérence de surface, couches ANDF,
 * chevauchement de plans existants, et contexte appris sur les 13 594 décisions « TF en cours » (taux et motifs de rejet).
 * ponytail: score par règles pondérées ; un modèle entraîné sur les mêmes décisions pourra remplacer le calcul de rejectRisk.
 */
export async function precheck(ring: Ring, declaredM2?: number): Promise<Precheck> {
  const checks: Check[] = [];
  const computed = areaM2(ring);

  checks.push(
    ring.length - 1 < 3
      ? { id: "bornes", label: "Nombre de bornes", status: "fail", detail: "Moins de 3 bornes : le polygone n'est pas fermé." }
      : { id: "bornes", label: "Nombre de bornes", status: "ok", detail: `${ring.length - 1} bornes, polygone fermé.` }
  );
  checks.push(
    selfIntersects(ring)
      ? { id: "geometrie", label: "Géométrie", status: "fail", detail: "Les limites se croisent : l'ordre des bornes est probablement erroné.", fix: "Numérotez les bornes dans le sens du contour." }
      : { id: "geometrie", label: "Géométrie", status: "ok", detail: "Contour valide, sans croisement." }
  );
  if (declaredM2) {
    const gap = Math.abs(declaredM2 - computed) / computed;
    checks.push(
      gap > 0.1
        ? { id: "surface", label: "Cohérence de surface", status: "warn", detail: `Surface déclarée ${declaredM2} m², calculée ${computed} m² (écart ${Math.round(gap * 100)} %).`, fix: "Vérifiez le calage et les coordonnées des bornes." }
        : { id: "surface", label: "Cohérence de surface", status: "ok", detail: `Surface déclarée ${declaredM2} m², calculée ${computed} m².` }
    );
  }

  const hits = await layersAt(ring);
  const has = (id: string) => hits.find((h) => h.layerId === id);
  const blocking = hits.filter((h) => ["litige", "restriction", "tf_etat", "aire_protegee", "dpm", "dpl"].includes(h.layerId));
  checks.push(
    blocking.length
      ? { id: "zones", label: "Zones réservées et litiges", status: "fail", detail: blocking.map((h) => `${h.label}${h.props.designation ? ` (${h.props.designation})` : ""}`).join(" ; ") + ".", fix: "Le plan sera rejeté : la parcelle ne peut pas être titrée en l'état." }
      : { id: "zones", label: "Zones réservées et litiges", status: "ok", detail: "Hors litiges, ZDUP/PAG, domaine public, aires protégées et titres de l'État." }
  );
  const existing = hits.filter((h) => ["tf_en_cours", "tf_reconstitue", "tf_demembre", "enregistrement"].includes(h.layerId) && h.share > 0.05);
  const rejectedCalage = has("tf_en_cours")?.props.motif_code === "calage";
  checks.push(
    existing.length
      ? {
          id: "chevauchement",
          label: "Chevauchement avec un plan existant",
          status: existing.some((h) => h.share > 0.5) ? "fail" : "warn",
          detail: existing.map((h) => `${h.label} sur ${Math.round(h.share * 100)} % de la surface`).join(" ; ") + "." + (rejectedCalage ? " Un plan voisin a déjà été rejeté pour défaut de calage." : ""),
          fix: "Motif fréquent de rejet (« autre plan de bornage »). Rapprochez-vous du bureau communal ou du titulaire du plan existant.",
        }
      : { id: "chevauchement", label: "Chevauchement avec un plan existant", status: "ok", detail: "Aucun plan enregistré ne recouvre significativement la parcelle." }
  );
  if (has("zone_inondable")) checks.push({ id: "inondation", label: "Zone inondable", status: "warn", detail: `Parcelle en zone inondable sur ${Math.round(has("zone_inondable")!.share * 100)} %.`, fix: "Pas bloquant pour le titre, mais à signaler à l'acquéreur." });

  // Contexte appris : taux de rejet et motifs dans la commune du plan le plus proche
  let context: Precheck["context"];
  const sql = db();
  if (sql) {
    const poly = sql.json({ type: "Polygon", coordinates: [ring] });
    const [near] = await sql<{ commune: string }[]>`
      select props->>'commune' as commune from layer_features
      where layer_id = 'tf_en_cours' and props ? 'commune'
      order by geom <-> st_centroid(st_setsrid(st_geomfromgeojson(${poly}::text), 4326)) limit 1`;
    if (near?.commune) {
      const [st] = await sql<Stat[]>`
        select props->>'commune' as commune, count(*)::int as plans, sum((props->>'validation' = 'non')::int)::int as rejected
        from layer_features where layer_id = 'tf_en_cours' and props->>'commune' = ${near.commune} group by 1`;
      const reasons = await sql<Reason[]>`
        select props->>'motif' as motif, count(*)::int as n from layer_features
        where layer_id = 'tf_en_cours' and props->>'commune' = ${near.commune} and props->>'validation' = 'non'
          and props->>'motif_code' not in ('autre', 'transmis') group by 1 order by 2 desc limit 3`;
      const total = reasons.reduce((s, r) => s + r.n, 0) || 1;
      context = { commune: st.commune, plans: st.plans, rejectRate: st.rejected / st.plans, topReasons: reasons.map((r) => ({ label: r.motif, share: r.n / total })) };
    }
  }

  const fails = checks.filter((c) => c.status === "fail").length;
  const warns = checks.filter((c) => c.status === "warn").length;
  const base = context?.rejectRate ?? 0.25;
  const rejectRisk = Math.min(0.97, fails ? 0.9 : base * 0.6 + warns * 0.18);
  return { checks, rejectRisk, context, hits };
}
