import { createPlan } from "@/lib/data/plans";
import { precheck } from "@/lib/geo/precheck";
import { guard } from "@/lib/rate-limit";
import { currentPersona } from "@/lib/session";
import { areaM2, ringFromUtm } from "@/lib/survey";

// Transmission d'un plan au cadastre par un géomètre : le pré-contrôle est recalculé ici (le rapport reçu par l'agent ne dépend pas du navigateur).
export async function POST(req: Request) {
  const tooMany = guard(req, "plans", 6);
  if (tooMany) return tooMany;
  const persona = await currentPersona();
  if (persona?.space !== "pro") return Response.json({ error: "Réservé aux géomètres connectés." }, { status: 403 });
  const body = (await req.json().catch(() => null)) as { bornes?: unknown; declaredM2?: unknown } | null;
  const bornes = body?.bornes;
  const ok =
    Array.isArray(bornes) &&
    bornes.length >= 3 &&
    bornes.length <= 200 &&
    bornes.every((b) => Array.isArray(b) && b.length === 2 && b[0] > 250_000 && b[0] < 650_000 && b[1] > 690_000 && b[1] < 1_400_000);
  if (!ok) return Response.json({ error: "Bornes invalides : 3 à 200 points [X, Y] en UTM 31N au Bénin." }, { status: 400 });
  const declared = typeof body?.declaredM2 === "number" && body.declaredM2 > 0 ? Math.round(body.declaredM2) : null;
  const ring = ringFromUtm(bornes as [number, number][]);
  const pc = await precheck(ring, declared ?? undefined);
  const id = await createPlan({
    surveyor: persona.name,
    commune: pc.context?.commune ?? null,
    declaredM2: declared,
    areaM2: areaM2(ring),
    bornes: bornes as [number, number][],
    ring,
    precheck: { ...pc, hits: pc.hits.map((h) => ({ layerId: h.layerId, label: h.label, share: h.share })) },
    rejectRisk: pc.rejectRisk,
  });
  return Response.json({ id });
}
