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

/** Couche géographique touchée par la parcelle (forme minimale, cf. lib/geo/layers). */
export type LayerFinding = { layerId: string; label: string; severity: "danger" | "caution" | "info"; share: number; props: Record<string, string | number | null> };

const pct = (x: number) => `${Math.round(x * 100)} %`;

/** Raisons issues des couches ANDF du hackathon (litiges, restrictions, domaine public, TF…). */
export function layerReasons(hits: LayerFinding[]): Reason[] {
  const out: Reason[] = [];
  for (const h of hits) {
    const part = h.share >= 0.99 ? "en totalité" : `sur ${pct(h.share)} de sa surface`;
    const p = h.props;
    switch (h.layerId) {
      case "litige":
        out.push({ level: "danger", text: `La parcelle est ${part} dans une zone en litige devant ${p.tribunal ?? "les juridictions"}${p.role ? ` (rôle ${p.role})` : ""}.`, action: "N'achetez pas avant la décision définitive." });
        break;
      case "restriction":
        out.push({
          level: p.type === "Exploitation de Sable" ? "caution" : "danger",
          text: `Restriction ${part} : ${[p.type, p.designation].filter(Boolean).join(", ")}.`,
          action: p.type === "ZDUP" || p.type === "PAG" ? "Terrain réservé à un projet public : risque d'expropriation. N'achetez pas." : "Terrain du domaine public ou réglementé : il ne peut pas être vendu librement.",
        });
        break;
      case "tf_etat":
        out.push({ level: "danger", text: `La parcelle recoupe ${part} un titre foncier de l'État.`, action: "Aucun particulier ne peut vous vendre ce terrain." });
        break;
      case "aire_protegee":
        out.push({ level: "danger", text: `La parcelle empiète ${part} sur une aire protégée : ${p.designation ?? "forêt classée"}.`, action: "Construction et vente interdites. Faites vérifier les limites (contours de fiabilité variable)." });
        break;
      case "dpm":
      case "dpl":
        out.push({ level: "danger", text: `La parcelle est ${part} dans la bande du ${h.label.toLowerCase()}.`, action: "Le domaine public est inaliénable : cette partie ne peut être ni vendue ni titrée." });
        break;
      case "tf_en_cours":
        out.push({
          level: "caution",
          text: `Un titre foncier est en cours ${part}${p.validation === "non" && p.motif ? ` ; le plan a été rejeté : « ${p.motif} »` : ""}.`,
          action: "Vérifiez que le vendeur est bien le demandeur du titre, et attendez sa délivrance.",
        });
        break;
      case "zone_inondable":
        out.push({ level: "caution", text: `La parcelle est ${part} en zone inondable.`, action: "Prévoyez des fondations adaptées et vérifiez l'historique des crues." });
        break;
      case "aif":
        out.push({ level: "caution", text: "La parcelle est dans le périmètre d'une association d'intérêts fonciers.", action: "La vente doit être validée par l'association." });
        break;
      case "tf_demembre":
      case "tf_reconstitue":
        out.push({ level: "clear", text: `Issue d'un ${h.label.toLowerCase()}${p.tf ? ` (réf. ${p.tf})` : ""}.` });
        break;
      case "enregistrement":
        out.push({ level: "clear", text: "Parcelle enregistrée au cadastre (enregistrement individuel)." });
        break;
    }
  }
  return out;
}

export function assess(p: Parcel, today = new Date(), hits: LayerFinding[] = []): Assessment {
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
  reasons.push(...layerReasons(hits));

  const level = reasons.reduce<RiskLevel>((acc, r) => (RANK[r.level] > RANK[acc] ? r.level : acc), "clear");
  const layerDanger = hits.find((h) => h.severity === "danger");
  const headline =
    level === "danger"
      ? p.owner.kind === "state"
        ? "Terrain de l'État : il ne peut pas vous être vendu"
        : p.dispute || layerDanger?.layerId === "litige"
          ? "Litige en cours : n'achetez pas maintenant"
          : layerDanger?.layerId === "restriction" && ["ZDUP", "PAG"].includes(String(layerDanger.props.type))
            ? "Terrain réservé à un projet public : n'achetez pas"
            : "Terrain du domaine public ou protégé : n'achetez pas"
      : level === "caution"
        ? "Prudence : vérifiez avant de payer"
        : "Aucun signal d'alerte dans les données disponibles";
  return { level, headline, reasons: reasons.sort((a, b) => RANK[b.level] - RANK[a.level]) };
}
