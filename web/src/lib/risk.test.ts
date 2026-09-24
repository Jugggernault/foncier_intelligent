import { expect, test } from "bun:test";
import { getParcel } from "./data/parcels";
import { assess } from "./risk";

test("parcelle de l'État = danger", () => {
  expect(assess(getParcel("101236198")!).level).toBe("danger");
});

test("titre en cours sans localisation = prudence, publicité ouverte détectée", () => {
  const p = getParcel("100666667")!;
  expect(assess(p, new Date("2026-09-24")).level).toBe("caution");
  const open = assess(p, new Date("2025-09-15"));
  expect(open.reasons.some((r) => r.text.includes("publicité foncière est ouverte"))).toBe(true);
});
