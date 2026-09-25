import "server-only";
import type { Parcel } from "../data/types";
import { assess } from "../risk";
import { layersAt } from "./layers";

/** Verdict complet : règles de la parcelle + couches géographiques ANDF. */
export async function assessFull(p: Parcel) {
  const hits = await layersAt(p.polygon);
  return { hits, result: assess(p, new Date(), hits) };
}
