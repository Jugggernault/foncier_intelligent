import "server-only";
import { db } from "./db";

export type Severity = "danger" | "caution" | "info";

export type LayerHit = {
  layerId: string;
  label: string;
  category: string;
  severity: Severity;
  description: string;
  /** Nombre d'objets de la couche touchés */
  count: number;
  /** Part maximale du polygone couverte par un objet de la couche (0-1) */
  share: number;
  overlapM2: number;
  /** Attributs du principal objet touché (filtrés au chargement) */
  props: Record<string, string | number | null>;
};

type Row = { layer_id: string; label: string; category: string; severity: Severity; description: string; props: LayerHit["props"]; overlap_m2: number; share: number | null };

/** Couches du hackathon qui touchent un polygone [lon, lat]. Renvoie [] sans base configurée. */
export async function layersAt(ring: [number, number][]): Promise<LayerHit[]> {
  const sql = db();
  if (!sql || ring.length < 4) return [];
  try {
    const rows = await sql<Row[]>`select * from layers_at(${sql.json({ type: "Polygon", coordinates: [ring] })})`;
    const byLayer = new Map<string, LayerHit>();
    for (const r of rows) {
      const hit = byLayer.get(r.layer_id);
      const share = r.share ?? 0;
      if (!hit) {
        byLayer.set(r.layer_id, { layerId: r.layer_id, label: r.label, category: r.category, severity: r.severity, description: r.description, count: 1, share, overlapM2: r.overlap_m2, props: r.props });
      } else {
        hit.count++;
        hit.overlapM2 += r.overlap_m2;
        if (share > hit.share) Object.assign(hit, { share, props: r.props });
      }
    }
    // Ignorer les contacts de bord (moins de 1 % de la parcelle et moins de 5 m²)
    return [...byLayer.values()].filter((h) => h.share >= 0.01 || h.overlapM2 >= 5);
  } catch (e) {
    console.error("layersAt", e);
    return [];
  }
}

export type LayerInfo = { id: string; label: string; category: string; severity: Severity; description: string; count: number };

export async function listLayers(): Promise<LayerInfo[]> {
  const sql = db();
  if (!sql) return [];
  return sql<LayerInfo[]>`
    select l.id, l.label, l.category, l.severity, l.description, count(f.id)::int as count
    from layers l left join layer_features f on f.layer_id = l.id
    group by l.id order by case l.severity when 'danger' then 0 when 'caution' then 1 else 2 end, l.label`;
}

export async function layerTile(layer: string, z: number, x: number, y: number): Promise<Uint8Array | undefined> {
  const sql = db();
  if (!sql) return undefined;
  const [r] = await sql<{ t: Uint8Array }[]>`select layer_tile(${layer}, ${z}, ${x}, ${y}) as t`;
  return r?.t;
}
