import { guard } from "@/lib/rate-limit";
import { precheck } from "@/lib/geo/precheck";
import { ringFromUtm } from "@/lib/survey";

// Pré-contrôle d'un plan : POST { bornes: [[X, Y], …] (UTM 31N) | polygon: [[lon, lat], …], declaredM2? }
export async function POST(req: Request) {
  const tooMany = guard(req, "precheck", 30);
  if (tooMany) return tooMany;
  const body = (await req.json().catch(() => null)) as { bornes?: [number, number][]; polygon?: [number, number][]; declaredM2?: number } | null;
  const ring = body?.bornes?.length ? ringFromUtm(body.bornes) : body?.polygon;
  if (!Array.isArray(ring) || ring.length < 4) return Response.json({ error: "bornes (UTM 31N) ou polygon (WGS84) requis, 3 points minimum." }, { status: 400 });
  return Response.json(await precheck(ring, body?.declaredM2));
}
