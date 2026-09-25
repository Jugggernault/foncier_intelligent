import { layersAt } from "@/lib/geo/layers";
import { layerReasons } from "@/lib/risk";

// Croise un polygone quelconque (levé, dessin) avec les couches : POST { polygon: [[lon, lat], …] }
export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as { polygon?: [number, number][] } | null;
  const ring = body?.polygon;
  if (!Array.isArray(ring) || ring.length < 4 || !ring.every((c) => Array.isArray(c) && c.length === 2 && c.every(Number.isFinite)))
    return Response.json({ error: "polygon : anneau fermé de coordonnées [lon, lat] attendu." }, { status: 400 });
  const hits = await layersAt(ring);
  return Response.json({ hits, reasons: layerReasons(hits) });
}
