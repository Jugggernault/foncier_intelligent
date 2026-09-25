import "server-only";
import { db } from "../geo/db";
import type { Precheck } from "../geo/precheck";

export type PlanStatus = "recu" | "accepte" | "renvoye";
export const PLAN_STATUS: Record<PlanStatus, { label: string; className: string }> = {
  recu: { label: "En attente de l'ANDF", className: "bg-sky text-navy" },
  accepte: { label: "Accepté pour instruction", className: "bg-clear-soft text-clear" },
  renvoye: { label: "Renvoyé pour correction", className: "bg-danger-soft text-danger" },
};
export type StoredPrecheck = Omit<Precheck, "hits"> & { hits: { layerId: string; label: string; share: number }[] };
export type Plan = {
  id: number;
  createdAt: Date;
  surveyor: string;
  commune: string | null;
  declaredM2: number | null;
  areaM2: number;
  bornes: [number, number][];
  ring: [number, number][];
  precheck: StoredPrecheck;
  rejectRisk: number;
  status: PlanStatus;
  decidedAt: Date | null;
  note: string | null;
};

const COLS = `id, created_at as "createdAt", surveyor, commune, declared_m2 as "declaredM2", area_m2 as "areaM2", bornes, ring, precheck,
  reject_risk as "rejectRisk", status, decided_at as "decidedAt", note`;

export async function listPlans(surveyor?: string): Promise<Plan[]> {
  const sql = db();
  if (!sql) return [];
  return surveyor
    ? sql<Plan[]>`select ${sql.unsafe(COLS)} from plan_submissions where surveyor = ${surveyor} order by created_at desc limit 50`
    : sql<Plan[]>`select ${sql.unsafe(COLS)} from plan_submissions order by status = 'recu' desc, created_at desc limit 100`;
}

export async function getPlan(id: number): Promise<Plan | undefined> {
  const sql = db();
  if (!sql || !Number.isInteger(id)) return;
  return (await sql<Plan[]>`select ${sql.unsafe(COLS)} from plan_submissions where id = ${id}`)[0];
}

export async function createPlan(p: Pick<Plan, "surveyor" | "commune" | "declaredM2" | "areaM2" | "bornes" | "ring" | "precheck" | "rejectRisk">): Promise<number> {
  const sql = db();
  if (!sql) throw new Error("Base indisponible");
  const [row] = await sql<{ id: number }[]>`
    insert into plan_submissions (surveyor, commune, declared_m2, area_m2, bornes, ring, precheck, reject_risk)
    values (${p.surveyor}, ${p.commune}, ${p.declaredM2}, ${p.areaM2}, ${sql.json(p.bornes)}, ${sql.json(p.ring)}, ${sql.json(p.precheck as unknown as Parameters<typeof sql.json>[0])}, ${p.rejectRisk})
    returning id`;
  return Number(row.id);
}

export async function decidePlan(id: number, status: Exclude<PlanStatus, "recu">, note?: string) {
  const sql = db();
  if (!sql) throw new Error("Base indisponible");
  await sql`update plan_submissions set status = ${status}, note = ${note ?? null}, decided_at = now() where id = ${id}`;
}
