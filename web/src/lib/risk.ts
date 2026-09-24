// Score de risque v1 (IA-14) : des règles explicables. Chaque raison dit comment lever le doute.
import type { Parcel } from "./data/parcels";

export type RiskLevel = "danger" | "caution" | "clear";
export type Reason = { level: RiskLevel; text: string; action?: string };
export type Assessment = { level: RiskLevel; headline: string; reasons: Reason[] };

const RANK: Record<RiskLevel, number> = { clear: 0, caution: 1, danger: 2 };

export function assess(p: Parcel, today = new Date()): Assessment {
  const reasons: Reason[] = [];
  const iso = today.toISOString().slice(0, 10);
  const publicityOpen = p.procedure.publicity.start <= iso && iso <= p.procedure.publicity.end;

  if (p.owner.kind === "state") {
    reasons.push({
      level: "danger",
      text: "La parcelle appartient à l'État béninois. Un particulier ne peut pas vous la vendre.",
      action: "Refusez toute offre de vente et signalez-la au bureau communal de l'ANDF.",
    });
  }
  if (p.procedure.kind === "titre") {
    reasons.push({
      level: "caution",
      text: `Une demande de titre foncier est en cours (n° ${p.procedure.requestNumber}). Le propriétaire n'est pas encore confirmé.`,
      action: "N'achetez qu'avec un certificat d'appartenance valide, par acte notarié.",
    });
  }
  if (publicityOpen) {
    reasons.push({
      level: "caution",
      text: "La publicité foncière est ouverte : des oppositions peuvent encore être déposées.",
      action: "Attendez la fin du délai d'opposition.",
    });
  }
  if (!p.centroid) {
    reasons.push({
      level: "caution",
      text: "L'avis ne publie pas la localisation : impossible de vérifier le terrain par satellite.",
      action: "Demandez un extrait de plan cadastral à l'ANDF.",
    });
  }
  if (p.titles?.length) {
    reasons.push({ level: "clear", text: `Titres fonciers déjà rattachés : ${p.titles.length}.` });
  }

  const level = reasons.reduce<RiskLevel>((acc, r) => (RANK[r.level] > RANK[acc] ? r.level : acc), "clear");
  const headline = {
    danger: "Terrain de l'État : il ne peut pas vous être vendu",
    caution: "Prudence : la propriété n'est pas encore confirmée",
    clear: "Aucun signal d'alerte dans les données disponibles",
  }[level];
  return { level, headline, reasons: reasons.sort((a, b) => RANK[b.level] - RANK[a.level]) };
}
