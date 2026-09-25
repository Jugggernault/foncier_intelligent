// Applique toutes les migrations (idempotentes) dans l'ordre. Usage : bun scripts/migrate.ts (lit DIRECT_URL ou DATABASE_URL)
import { readdirSync } from "node:fs";
import { join } from "node:path";
import postgres from "postgres";

const url = (process.env.DIRECT_URL ?? process.env.DATABASE_URL)?.replace(/[?&]pgbouncer=true\b/, "");
if (!url) throw new Error("DIRECT_URL ou DATABASE_URL manquant");
const sql = postgres(url, { max: 1, onnotice: () => {} });
const dir = join(import.meta.dir, "../supabase/migrations");
for (const f of readdirSync(dir).filter((f) => f.endsWith(".sql")).sort()) {
  await sql.file(join(dir, f));
  console.log("appliquée :", f);
}
await sql.end();
