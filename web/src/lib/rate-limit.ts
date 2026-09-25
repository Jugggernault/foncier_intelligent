// Limitation de débit par IP, fenêtre glissante en mémoire.
// ponytail: mémoire propre à chaque instance Vercel ; passer à Upstash/Supabase si l'abus devient réel.
const hits = new Map<string, number[]>();

export function limited(key: string, max: number, windowMs = 60_000, now = Date.now()): boolean {
  const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  if (recent.length >= max) return hits.set(key, recent), true;
  recent.push(now);
  hits.set(key, recent);
  if (hits.size > 10_000) hits.clear();
  return false;
}

/** 429 si l'IP dépasse `max` requêtes par minute sur cette route, sinon undefined. */
export function guard(req: Request, route: string, max: number): Response | undefined {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() || "local";
  if (limited(`${route}:${ip}`, max))
    return Response.json({ error: "Trop de demandes. Réessayez dans une minute." }, { status: 429, headers: { "retry-after": "60" } });
}
