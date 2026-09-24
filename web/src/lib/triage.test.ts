import { expect, test } from "bun:test";
import { triage } from "./triage";

test("triage des plaintes", () => {
  expect(triage("Mon terrain a été vendu deux fois, il y a deux acheteurs").route).toBe("CGP");
  expect(triage("Le voisin a déplacé la borne et la clôture").category).toBe("limites");
  expect(triage("Les héritiers contestent la vente").category).toBe("succession");
  expect(triage("bonjour").confidence).toBeLessThan(0.5);
});
