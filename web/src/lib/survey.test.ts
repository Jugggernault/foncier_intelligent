import { expect, test } from "bun:test";
import { areaM2, parseSurvey, utmToLonLat } from "./survey";

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
