import { expect, test } from "bun:test";
import { rules } from "./eligibility";

test("règles d'accès au foncier", () => {
  expect(rules("reciprocite", "urbain", "lt2")[0].tone).toBe("ok");
  expect(rules("sans-reciprocite", "urbain", "lt2")[0].tone).toBe("no");
  expect(rules("reciprocite", "rural", "lt2")[0].tone).toBe("no");
  const big = rules("beninois", "rural", "20-500").map((l) => l.text).join(" ");
  expect(big).toContain("préemption");
  expect(big).toContain("origine des fonds");
});
