import "server-only";
import { listPublicityNotices } from "../data/parcels";
import type { Parcel } from "../data/types";
import { db } from "./db";
import type { LayerHit } from "./layers";
import { hitsFn } from "./verdict";

export type NoticeFlag = { level: "danger" | "caution"; text: string };

const pct = (s: number) => `${Math.max(1, Math.round(s * 100))} %`;
const BLOCKING = ["litige", "restriction", "tf_etat", "aire_protegee", "dpm", "dpl"];

/** Ce que l'ANDF devrait voir avant la fin du délai d'opposition : l'avis touche-t-il une zone où le droit ne peut pas être confirmé ? */
export function flagsFromHits(hits: LayerHit[]): NoticeFlag[] {
  const flags: NoticeFlag[] = [];
  for (const h of hits) {
    if (BLOCKING.includes(h.layerId) && h.share >= 0.05) {
      const what = h.props.designation ? `${h.label} (${h.props.designation})` : h.props.tf ? `${h.label}, TF n° ${h.props.tf}` : h.label;
      flags.push({ level: "danger", text: `Situé à ${pct(h.share)} dans : ${what}.` });
    }
    if ((h.layerId === "tf_demembre" || h.layerId === "tf_reconstitue") && h.share >= 0.1)
      flags.push({ level: "caution", text: `Recouvre à ${pct(h.share)} un titre foncier existant (${h.props.label ?? h.label}) : une confirmation de droits présumés sur un terrain déjà titré doit être justifiée.` });
    if (h.layerId === "tf_en_cours" && h.share >= 0.3 && h.props.validation === "non")
      flags.push({ level: "caution", text: `Un plan déposé sur cette emprise a déjà été rejeté (${String(h.props.motif ?? "motif non précisé").toLowerCase()}).` });
  }
  return flags;
}

// ponytail: calculé une fois par processus, comme l'index des couches ; recalcul à chaque déploiement (liste des avis figée)
let overlaps: Promise<Map<string, { nup: string; share: number }[]>> | undefined;

/** Avis qui se chevauchent entre eux (deux demandes sur le même terrain). */
function noticeOverlaps(notices: Parcel[]) {
  overlaps ??= (async () => {
    const map = new Map<string, { nup: string; share: number }[]>();
    const sql = db();
    if (!sql) return map;
    try {
      const input = notices.map((p) => ({ nup: p.nup, geom: { type: "Polygon", coordinates: [p.polygon] } }));
      const rows = await sql<{ a: string; b: string; share: number }[]>`
        with p as (
          select x.nup, st_makevalid(st_setsrid(st_geomfromgeojson(x.geom::text), 4326)) as g
          from jsonb_to_recordset(${sql.json(input)}) as x(nup text, geom jsonb)
        )
        select a.nup as a, b.nup as b, st_area(st_intersection(a.g, b.g)::geography) / nullif(st_area(a.g::geography), 0) as share
        from p a join p b on a.nup <> b.nup and st_intersects(a.g, b.g)`;
      for (const r of rows) if (r.share >= 0.05) map.set(r.a, [...(map.get(r.a) ?? []), { nup: r.b, share: r.share }]);
    } catch (e) {
      console.error("noticeOverlaps", e);
      overlaps = undefined;
    }
    return map;
  })();
  return overlaps;
}

/** Contrôle automatique de tous les avis publiés : NUP → signalements (vide = rien à signaler). */
export async function noticeChecks(): Promise<Map<string, NoticeFlag[]>> {
  const notices = listPublicityNotices();
  const [hits, over] = await Promise.all([hitsFn(), noticeOverlaps(notices)]);
  return new Map(
    notices.map((n) => [
      n.nup,
      [
        ...flagsFromHits(hits(n.nup)),
        ...(over.get(n.nup) ?? []).map((o) => ({ level: "caution" as const, text: `Chevauche à ${pct(o.share)} un autre avis publié (NUP ${o.nup}) : deux demandes sur le même terrain.` })),
      ].sort((a, b) => (a.level === b.level ? 0 : a.level === "danger" ? -1 : 1)),
    ])
  );
}
