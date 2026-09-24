// Score de risque v1 (IA-14) : des règles explicables. Chaque raison dit comment lever le doute.
import type { Parcel } from "./data/types";

export type RiskLevel = "danger" | "caution" | "clear";
export type Reason = { level: RiskLevel; text: string; action?: string };
export type Assessment = { level: RiskLevel; headline: string; reasons: Reason[] };

const RANK: Record<RiskLevel, number> = { clear: 0, caution: 1, danger: 2 };

const DISPUTE_LABEL = {
  limites: "un conflit de limites",
  "double-vente": "une double vente",
  succession: "un conflit de succession",
  contestation: "une contestation de propriété",
} as const;

export function assess(p: Parcel, today = new Date()): Assessment {
  const reasons: Reason[] = [];
  const iso = today.toISOString().slice(0, 10);
  const publicityOpen = !!p.procedure && p.procedure.publicity.start <= iso && iso <= p.procedure.publicity.end;

  if (p.owner.kind === "state") {
    reasons.push({
      level: "danger",
      text: "La parcelle appartient à l'État béninois. Un particulier ne peut pas vous la vendre.",
      action: "Refusez toute offre de vente et signalez-la au bureau communal de l'ANDF.",
    });
  }
  if (p.dispute) {
    reasons.push({
      level: "danger",
      text: `Un litige est déclaré : ${DISPUTE_LABEL[p.dispute.kind]}, suivi par ${p.dispute.body === "Tribunal" ? "le tribunal" : `la ${p.dispute.body}`}.`,
      action: "N'achetez pas avant la décision définitive.",
    });
  }
  if (p.right === "presume") {
    reasons.push({
      level: "caution",
      text: "Le droit de propriété est seulement présumé : aucun titre foncier n'est encore délivré.",
      action: "N'achetez qu'avec un certificat d'appartenance valide, par acte notarié.",
    });
  }
  if (p.procedure?.kind === "titre") {
    reasons.push({
      level: "caution",
      text: `Une demande de titre foncier est en cours (n° ${p.procedure.requestNumber}).`,
      action: "Demandez l'état d'avancement au bureau communal de l'ANDF.",
    });
  }
  if (publicityOpen) {
    reasons.push({
      level: "caution",
      text: "La publicité foncière est ouverte : des oppositions peuvent encore être déposées.",
      action: "Attendez la fin du délai d'opposition.",
    });
  }
  for (const a of p.alerts.filter((a) => a.kind === "empietement" || a.kind === "inondation")) {
    reasons.push({ level: "caution", text: a.text, action: "Faites vérifier le terrain avant de payer." });
  }
  if (p.landUse === "rural" && p.areaM2 >= 20_000) {
    reasons.push({
      level: "caution",
      text: "Terre rurale de 2 ha ou plus : l'ANDF dispose d'un droit de préemption et doit viser la vente.",
      action: p.areaM2 > 200_000 ? "Au-delà de 20 ha, préparez aussi la preuve de l'origine des fonds." : undefined,
    });
  }
  if (p.right === "titre") {
    reasons.push({ level: "clear", text: `Titre foncier n° ${p.titleNumber} délivré.` });
  }

  const level = reasons.reduce<RiskLevel>((acc, r) => (RANK[r.level] > RANK[acc] ? r.level : acc), "clear");
  const headline =
    level === "danger"
      ? p.owner.kind === "state"
        ? "Terrain de l'État : il ne peut pas vous être vendu"
        : "Litige en cours : n'achetez pas maintenant"
      : level === "caution"
        ? "Prudence : vérifiez avant de payer"
        : "Aucun signal d'alerte dans les données disponibles";
  return { level, headline, reasons: reasons.sort((a, b) => RANK[b.level] - RANK[a.level]) };
}
