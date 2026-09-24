// Copilote de l'agent (IA-10), démonstration : synthèse et projet d'acte générés à partir des faits du dossier.
// ponytail: gabarits déterministes ; un LLM reprendra la même sortie structurée. L'agent décide toujours.
import type { Parcel } from "./data/types";
import { KIND_LABEL, type Dossier } from "./data/workflow";
import { fmtArea, fmtDate } from "./labels";
import { assess } from "./risk";

export type Anomaly = { severity: "haute" | "moyenne" | "basse"; text: string; source: string };
export type CopilotOutput = {
  summary: string[];
  anomalies: Anomaly[];
  recommendation: "valider" | "complement" | "rejeter";
  rationale: string;
  draft: string;
};

export function copilot(d: Dossier, p: Parcel): CopilotOutput {
  const anomalies: Anomaly[] = [];
  const risk = assess(p);

  for (const doc of d.documents) {
    if (doc.status === "missing") anomalies.push({ severity: "moyenne", text: `Pièce manquante : ${doc.name.toLowerCase()}.`, source: "Lecture des pièces" });
    if (doc.status === "unreadable") anomalies.push({ severity: "basse", text: `${doc.name} : ${doc.note ?? "illisible"}`, source: "Lecture des pièces" });
    if (doc.status === "suspect") anomalies.push({ severity: "haute", text: `${doc.name} : ${doc.note}`, source: "Détection de faux documents" });
    const declared = doc.extracted?.Superficie ? Number(doc.extracted.Superficie.replace(/\D/g, "")) : undefined;
    if (declared && Math.abs(declared - p.areaM2) / p.areaM2 > 0.1)
      anomalies.push({
        severity: "moyenne",
        text: `Superficie déclarée (${fmtArea(declared)}) différente de la superficie cadastrale (${fmtArea(p.areaM2)}).`,
        source: "Croisement pièces / cadastre",
      });
  }
  if (p.owner.kind === "state") anomalies.push({ severity: "haute", text: "La parcelle est inscrite au domaine de l'État.", source: "Cadastre" });
  if (p.dispute) anomalies.push({ severity: "haute", text: `Litige déclaré (${p.dispute.body}) depuis le ${fmtDate(p.dispute.since)}.`, source: "Registre des litiges" });
  for (const a of p.alerts) anomalies.push({ severity: "basse", text: `${a.text} (${fmtDate(a.date)})`, source: "Imagerie satellite" });

  const high = anomalies.some((a) => a.severity === "haute");
  const fixable = anomalies.some((a) => a.severity === "moyenne" || a.text.startsWith("Pièce manquante"));
  const recommendation = high ? "rejeter" : fixable || d.completeness < 100 ? "complement" : "valider";

  const missing = d.documents.filter((x) => x.status === "missing" || x.status === "unreadable").map((x) => x.name.toLowerCase());
  const draft =
    recommendation === "complement"
      ? `Madame, Monsieur,\n\nVotre demande n° ${d.id} (${KIND_LABEL[d.kind].toLowerCase()}, parcelle ${p.nup}) a bien été reçue. Pour poursuivre l'instruction, merci de fournir : ${missing.length ? missing.join(", ") : "un levé topographique confirmant la superficie"}.\n\nVous pouvez déposer ces pièces depuis votre espace Foncier Intelligent ou au bureau communal.\n\nLe Chef du BCDF`
      : recommendation === "rejeter"
        ? `Madame, Monsieur,\n\nAprès examen, votre demande n° ${d.id} portant sur la parcelle ${p.nup} ne peut être poursuivie en l'état : ${anomalies.filter((a) => a.severity === "haute").map((a) => a.text.toLowerCase()).join(" ")}\n\nVous pouvez contester cette décision auprès de la Commission de gestion des plaintes.\n\nLe Chef du BCDF`
        : `Avis de publicité foncière\n\nSuivant demande n° ${d.id} du ${fmtDate(d.createdAt, "long")}, ${d.applicant} a demandé la confirmation de ses droits sur la parcelle NUP ${p.nup} (${p.quartier}, ${p.arrondissement}, ${p.commune}), d'une superficie calculée de ${fmtArea(p.areaM2)}.\n\nToute opposition doit être déposée au BCDF de ${p.commune} dans un délai de quinze jours.`;

  return {
    summary: [
      `${KIND_LABEL[d.kind]} déposée le ${fmtDate(d.createdAt, "long")} par ${d.applicant}.`,
      `Parcelle ${p.nup} : ${fmtArea(p.areaM2)}, ${p.quartier}, ${p.commune}. Verdict cadastre : ${risk.headline.toLowerCase()}.`,
      `${d.documents.length} pièces, complétude ${d.completeness} %, ${anomalies.length} point${anomalies.length > 1 ? "s" : ""} d'attention.`,
    ],
    anomalies: anomalies.sort((a, b) => ["haute", "moyenne", "basse"].indexOf(a.severity) - ["haute", "moyenne", "basse"].indexOf(b.severity)),
    recommendation,
    rationale: {
      valider: "Aucune anomalie bloquante : le dossier peut passer en publicité foncière.",
      complement: "Des pièces manquent ou doivent être corrigées avant la publicité.",
      rejeter: "Une anomalie grave empêche de poursuivre en l'état.",
    }[recommendation],
    draft,
  };
}
