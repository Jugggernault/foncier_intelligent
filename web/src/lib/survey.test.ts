import { expect, test } from "bun:test";
import { areaM2, bornesFromText, parseSurvey, ringFromUtm, utmToLonLat } from "./survey";

test("import de levé", () => {
  const [lon, lat] = utmToLonLat(422946, 701870);
  expect(lon).toBeCloseTo(2.3033, 3);
  expect(lat).toBeCloseTo(6.3493, 3);
  // carré de 20 m × 30 m en UTM
  const ring = parseSurvey("422000;702000\n422020;702000\n422020;702030\n422000;702030");
  expect(ring.length).toBe(5);
  expect(Math.abs(areaM2(ring) - 600)).toBeLessThan(15);
  expect(() => parseSurvey("1;2")).toThrow();
});

test("bornes lues dans le texte d'un plan", () => {
  // Ordre de lecture perturbé (colonnes), comme dans certains PDF
  const text = "Borne X (m) Y (m) B1 422951.84 701866.23 B2 422971.64 701869.01 B3 B4 422968.16 422948.36 701893.77 701890.99 Superficie 500 m²";
  const b = bornesFromText(text);
  expect(b.length).toBe(4);
  expect(b[3]).toEqual([422948.36, 701890.99]);
  expect(areaM2(ringFromUtm(b))).toBeGreaterThan(450);
  expect(bornesFromText("Téléphone 97000000")).toEqual([]);
});
