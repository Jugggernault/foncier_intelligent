import "server-only";
import { allParcels } from "../data/parcels";
import type { Parcel } from "../data/types";
import { assess, type Assessment } from "../risk";
import { db } from "./db";
import { layersAt, type LayerHit } from "./layers";

type Row = { nup: string; layer_id: string; label: string; category: string; severity: LayerHit["severity"]; description: string; props: LayerHit["props"]; overlap_m2: number; share: number | null };

// ponytail: index calculé une fois par processus (jeu de parcelles figé) ; à invalider quand les parcelles viendront de l'ANDF
let index: Promise<Map<string, LayerHit[]>> | undefined;

/** Couches touchées par chaque parcelle connue, en une seule requête spatiale. */
function hitsIndex(): Promise<Map<string, LayerHit[]>> {
  index ??= (async () => {
    const map = new Map<string, LayerHit[]>();
    const sql = db();
    if (!sql) return map;
    try {
      const input = allParcels().map((p) => ({ nup: p.nup, geom: { type: "Polygon", coordinates: [p.polygon] } }));
      const rows = await sql<Row[]>`
        with p as (
          select x.nup, st_makevalid(st_setsrid(st_geomfromgeojson(x.geom::text), 4326)) as g
          from jsonb_to_recordset(${sql.json(input)}) as x(nup text, geom jsonb)
        )
        select p.nup, l.id as layer_id, l.label, l.category, l.severity, l.description, f.props,
               st_area(st_intersection(f.geom, p.g)::geography) as overlap_m2,
               st_area(st_intersection(f.geom, p.g)::geography) / nullif(st_area(p.g::geography), 0) as share
        from p join layer_features f on st_intersects(f.geom, p.g) join layers l on l.id = f.layer_id`;
      for (const r of rows) {
        const list = map.get(r.nup) ?? [];
        const share = r.share ?? 0;
        const hit = list.find((h) => h.layerId === r.layer_id);
        if (!hit) list.push({ layerId: r.layer_id, label: r.label, category: r.category, severity: r.severity, description: r.description, count: 1, share, overlapM2: r.overlap_m2, props: r.props });
        else {
          hit.count++;
          hit.overlapM2 += r.overlap_m2;
          if (share > hit.share) Object.assign(hit, { share, props: r.props });
        }
        map.set(r.nup, list);
      }
      const order = { danger: 0, caution: 1, info: 2 };
      for (const [k, list] of map) map.set(k, list.filter((h) => h.share >= 0.01 || h.overlapM2 >= 5).sort((a, b) => order[a.severity] - order[b.severity] || b.share - a.share));
    } catch (e) {
      console.error("hitsIndex", e);
      index = undefined;
    }
    return map;
  })();
  return index;
}

/** Couches touchées par parcelle (index préchargé), pour les contrôles en lot. */
export async function hitsFn(): Promise<(nup: string) => LayerHit[]> {
  const idx = await hitsIndex();
  return (nup) => idx.get(nup) ?? [];
}

/** Verdict complet : règles de la parcelle + couches géographiques ANDF. */
export async function assessFull(p: Parcel, today = new Date()): Promise<{ hits: LayerHit[]; result: Assessment }> {
  const known = (await hitsIndex()).get(p.nup);
  const hits = known ?? (allParcels().some((x) => x.nup === p.nup) ? [] : await layersAt(p.polygon));
  return { hits, result: assess(p, today, hits) };
}

/** Verdict seul, pour les listes et les cartes. */
export async function verdictOf(p: Parcel): Promise<Assessment> {
  return assess(p, new Date(), (await hitsIndex()).get(p.nup) ?? []);
}

/** Fonction de verdict synchrone (couches préchargées), pour les listes et cartes rendues côté serveur. */
export async function verdictFn(): Promise<(p: Parcel) => Assessment> {
  const idx = await hitsIndex();
  return (p) => assess(p, new Date(), idx.get(p.nup) ?? []);
}
