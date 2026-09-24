import { expect, test } from "bun:test";
import { copilot } from "./copilot";
import { getParcel } from "./data/parcels";
import { listDossiers } from "./data/workflow";

test("le copilote recommande selon la gravité des anomalies", () => {
  const all = listDossiers().map((d) => ({ d, out: copilot(d, getParcel(d.nup)!) }));
  const suspect = all.find(({ d }) => d.documents.some((x) => x.status === "suspect"))!;
  expect(suspect.out.recommendation).toBe("rejeter");
  const missing = all.find(({ d }) => d.documents.some((x) => x.status === "missing") && !d.documents.some((x) => x.status === "suspect"))!;
  expect(["complement", "rejeter"]).toContain(missing.out.recommendation);
  expect(all.some(({ out }) => out.recommendation === "valider")).toBe(true);
});
