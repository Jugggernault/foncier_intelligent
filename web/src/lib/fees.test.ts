import { expect, test } from "bun:test";
import { mutationFee } from "./fees";

test("barème de mutation", () => {
  expect(mutationFee(5_000_000).total).toBe(15_500);
  expect(mutationFee(10_000_000).total).toBe(30_500); // continu à la frontière
  expect(mutationFee(25_000_000).total).toBe(30_500);
  expect(mutationFee(80_000_000).total).toBe(400_500);
  expect(mutationFee(0).total).toBe(0);
});
