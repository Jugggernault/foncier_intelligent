import "server-only";
import postgres from "postgres";

// Connexion PostGIS (Supabase en ligne, conteneur local en dev). Optionnelle : sans DATABASE_URL, la démo
// fonctionne sur ses données simulées. `prepare: false` est requis par le pooler Supabase en mode transaction.
const g = globalThis as unknown as { __pg?: postgres.Sql };

export function db(): postgres.Sql | undefined {
  if (!process.env.DATABASE_URL) return undefined;
  // `pgbouncer=true` (chaîne fournie par Supabase) serait transmis à Postgres comme paramètre inconnu : on le retire.
  g.__pg ??= postgres(process.env.DATABASE_URL.replace(/[?&]pgbouncer=true\b/, ""), { max: 5, prepare: false, idle_timeout: 20 });
  return g.__pg;
}
