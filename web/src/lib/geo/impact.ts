import "server-only";
import { db } from "./db";

// Motifs de rejet détectables avant le dépôt avec les données disponibles (couches ANDF, plans voisins, surface).
// ponytail: le calage n'est que partiellement détectable (chevauchement, écart de surface) ; compté entier, à nuancer à l'oral.
export const DETECTABLE = ["calage", "autre_plan", "procedure_judiciaire", "restriction"];

export type Impact = {
  plans: number;
  rejected: number;
  byMotif: { code: string; label: string; n: number }[];
  byCommune: { commune: string; plans: number; rejected: number; topMotif: string | null }[];
};

/** Statistiques réelles des décisions sur les plans « TF en cours » (couche fournie par l'ANDF au hackathon). */
export async function impactStats(): Promise<Impact | undefined> {
  const sql = db();
  if (!sql) return;
  try {
    // Rejeté = tout ce qui n'est pas validé (« non », « manque d'éléments physiques », « hors orthophotographie »)
    const [tot] = await sql<{ plans: number; rejected: number }[]>`
      select count(*)::int as plans, count(*) filter (where coalesce(props->>'validation', '') <> 'oui')::int as rejected
      from layer_features where layer_id = 'tf_en_cours'`;
    const byMotif = await sql<{ code: string; label: string; n: number }[]>`
      select coalesce(props->>'motif_code', 'non_precise') as code, coalesce(props->>'motif', 'Motif non précisé') as label, count(*)::int as n
      from layer_features where layer_id = 'tf_en_cours' and coalesce(props->>'validation', '') <> 'oui'
      group by 1, 2 order by 3 desc`;
    const byCommune = await sql<Impact["byCommune"]>`
      with r as (
        select props->>'commune' as commune, props->>'motif' as motif, coalesce(props->>'validation', '') <> 'oui' as rej
        from layer_features where layer_id = 'tf_en_cours' and props->>'commune' is not null
      )
      select commune, count(*)::int as plans, count(*) filter (where rej)::int as rejected,
             (select motif from r r2 where r2.commune = r.commune and r2.rej and r2.motif not like 'Autre%' group by motif order by count(*) desc limit 1) as "topMotif"
      from r group by commune order by plans desc limit 10`;
    return { ...tot, byMotif, byCommune };
  } catch (e) {
    console.error("impactStats", e);
  }
}
