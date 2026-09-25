import { getParcel, NUP_PATTERN } from "@/lib/data/parcels";
import { assessFull } from "@/lib/geo/verdict";

// Fiche publique d'une parcelle. ponytail: lit le jeu de démonstration ; brancher l'API cadastre ANDF dans lib/data.
export async function GET(_req: Request, ctx: RouteContext<"/api/parcels/[nup]">) {
  const { nup } = await ctx.params;
  if (!NUP_PATTERN.test(nup)) return Response.json({ error: "Un NUP compte 9 chiffres." }, { status: 400 });
  const p = getParcel(nup);
  if (!p) return Response.json({ error: "Parcelle introuvable." }, { status: 404 });
  const { owner, ...pub } = p;
  const { hits, result } = await assessFull(p);
  return Response.json({ ...pub, owner: owner.kind, risk: result, layers: hits });
}
