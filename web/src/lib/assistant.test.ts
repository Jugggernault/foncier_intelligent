import { expect, test } from "bun:test";
import { answer } from "./assistant";

test("outils déterministes de l'assistant", () => {
  expect(answer("Vérifie la parcelle 101236198").nup).toBe("101236198");
  expect(answer("Combien coûte une mutation pour 25 millions ?").text[0]).toMatch(/30\s500/);
  expect(answer("Je suis Togolais, puis-je acheter à Cotonou ?").text[0]).toContain("réciprocité");
  expect(answer("bonjour").followUps?.length).toBeGreaterThan(0);
});
