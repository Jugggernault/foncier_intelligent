import { listLayers } from "@/lib/geo/layers";

// Catalogue des couches géographiques disponibles.
export async function GET() {
  return Response.json(await listLayers(), { headers: { "Cache-Control": "public, s-maxage=3600" } });
}
