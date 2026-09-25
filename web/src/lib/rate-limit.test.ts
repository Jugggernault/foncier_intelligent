import { expect, test } from "bun:test";
import { limited } from "./rate-limit";

test("fenêtre glissante", () => {
  expect(limited("t", 2, 1000, 0)).toBe(false);
  expect(limited("t", 2, 1000, 10)).toBe(false);
  expect(limited("t", 2, 1000, 20)).toBe(true);
  expect(limited("t", 2, 1000, 1001)).toBe(false);
});
