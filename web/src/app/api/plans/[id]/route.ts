import { decidePlan, getPlan } from "@/lib/data/plans";
import { currentPersona } from "@/lib/session";

// Décision de l'agent sur un plan reçu : POST { status: "accepte" | "renvoye", note? }
export async function POST(req: Request, ctx: RouteContext<"/api/plans/[id]">) {
  const persona = await currentPersona();
  if (persona?.space !== "agent") return Response.json({ error: "Réservé aux agents de l'ANDF." }, { status: 403 });
  const id = Number((await ctx.params).id);
  if (!(await getPlan(id))) return Response.json({ error: "Plan introuvable." }, { status: 404 });
  const body = (await req.json().catch(() => null)) as { status?: string; note?: string } | null;
  if (body?.status !== "accepte" && body?.status !== "renvoye") return Response.json({ error: "status : accepte ou renvoye." }, { status: 400 });
  await decidePlan(id, body.status, body.note?.slice(0, 500));
  return Response.json({ ok: true });
}
