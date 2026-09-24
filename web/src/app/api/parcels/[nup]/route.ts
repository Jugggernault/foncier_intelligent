import { getParcel, NUP_PATTERN } from "@/lib/data/parcels";
import { assess } from "@/lib/risk";

// Fiche publique d'une parcelle. ponytail: lit le jeu de démonstration ; brancher l'API cadastre ANDF dans lib/data.
export async function GET(_req: Request, ctx: RouteContext<"/api/parcels/[nup]">) {
  const { nup } = await ctx.params;
  if (!NUP_PATTERN.test(nup)) return Response.json({ error: "Un NUP compte 9 chiffres." }, { status: 400 });
  const p = getParcel(nup);
  if (!p) return Response.json({ error: "Parcelle introuvable." }, { status: 404 });
  const { owner, ...pub } = p;
  return Response.json({ ...pub, owner: owner.kind, risk: assess(p) });
}
