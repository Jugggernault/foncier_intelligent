import { findParcel, NUP_PATTERN } from "@/lib/data/parcels";
import { assessFull } from "@/lib/geo/verdict";

// Fiche publique d'une parcelle : démonstration, puis ANDF en direct si ANDF_LIVE=true (lib/data/andf.ts).
export async function GET(_req: Request, ctx: RouteContext<"/api/parcels/[nup]">) {
  const { nup } = await ctx.params;
  if (!NUP_PATTERN.test(nup)) return Response.json({ error: "Un NUP compte 9 chiffres." }, { status: 400 });
  const p = await findParcel(nup);
  if (!p) return Response.json({ error: "Parcelle introuvable." }, { status: 404 });
  const { owner, ...pub } = p;
  const { hits, result } = await assessFull(p);
  return Response.json({ ...pub, owner: owner.kind, risk: result, layers: hits });
}
