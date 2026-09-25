import { expect, test } from "bun:test";
import { getParcel, listParcels } from "./data/parcels";
import { assess } from "./risk";

test("parcelle de l'État = danger", () => {
  expect(assess(getParcel("101236198")!).level).toBe("danger");
});

test("droit présumé avec titre en cours = prudence, publicité ouverte détectée", () => {
  const p = getParcel("100666667")!;
  expect(assess(p, new Date("2026-09-24")).level).toBe("caution");
  const open = assess(p, new Date("2025-09-15"));
  expect(open.reasons.some((r) => r.text.includes("publicité foncière est ouverte"))).toBe(true);
});

test("litige = danger, titre sans signal = vert", () => {
  const all = listParcels();
  const disputed = all.find((p) => p.dispute)!;
  expect(assess(disputed).level).toBe("danger");
  const clean = all.find((p) => p.right === "titre" && !p.dispute && !p.alerts.length && p.landUse === "urbain")!;
  expect(assess(clean).level).toBe("clear");
});

test("les NUP de démonstration sont uniques et au format", () => {
  const nups = listParcels().map((p) => p.nup);
  expect(new Set(nups).size).toBe(nups.length);
  expect(nups.every((n) => /^\d{9}$/.test(n))).toBe(true);
});

test("les couches ANDF alimentent le verdict", () => {
  const p = listParcels().find((x) => x.right === "titre" && !x.dispute && !x.alerts.length && x.landUse === "urbain")!;
  const zdup = assess(p, new Date(), [{ layerId: "restriction", label: "Restriction", severity: "danger", share: 1, props: { type: "ZDUP", designation: "Route des Pêches" } }]);
  expect(zdup.level).toBe("danger");
  expect(zdup.headline).toContain("projet public");
  const flood = assess(p, new Date(), [{ layerId: "zone_inondable", label: "Zone inondable", severity: "caution", share: 0.3, props: {} }]);
  expect(flood.level).toBe("caution");
});
