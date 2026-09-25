import { layerTile } from "@/lib/geo/layers";

// Tuiles vectorielles (MVT) générées par PostGIS et mises en cache par le CDN : pas de fichiers de tuiles à héberger.
export async function GET(_req: Request, ctx: RouteContext<"/api/layers/[id]/tiles/[z]/[x]/[y]">) {
  const { id, z, x, y } = await ctx.params;
  const tile = await layerTile(id, Number(z), Number(x), Number(y.replace(/\.pbf$/, "")));
  if (!tile) return new Response(null, { status: 204 });
  return new Response(Buffer.from(tile), {
    headers: { "Content-Type": "application/vnd.mapbox-vector-tile", "Cache-Control": "public, max-age=3600, s-maxage=86400" },
  });
}
