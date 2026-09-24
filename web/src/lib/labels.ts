// Libellés métier partagés entre écrans.
import type { Dispute, Parcel, Procedure, TerrainAlert } from "./data/types";

export const procedureLabel = (p: Procedure) =>
  `${p.kind === "titre" ? "Demande de titre foncier" : "Confirmation cadastrale"} n° ${p.requestNumber}`;

export const rightLabel = (p: Parcel) =>
  p.right === "titre" ? `Titre foncier n° ${p.titleNumber}` : p.right === "etat" ? "Domaine de l'État" : "Droit présumé";

export const ownerLabel = (p: Parcel) => (p.owner.kind === "state" ? "État béninois" : "Particulier (identité masquée)");

export const disputeLabel: Record<Dispute["kind"], string> = {
  limites: "Conflit de limites",
  "double-vente": "Double vente",
  succession: "Succession",
  contestation: "Contestation de propriété",
};

export const alertLabel: Record<TerrainAlert["kind"], string> = {
  construction: "Nouvelle construction",
  defrichement: "Défrichement",
  inondation: "Inondation",
  empietement: "Empiètement",
};

export const fmtDate = (iso: string, month: "short" | "long" = "short") =>
  new Intl.DateTimeFormat("fr-FR", { day: "numeric", month, year: "numeric" }).format(new Date(iso));

export const fmtArea = (m2: number) =>
  m2 >= 10_000
    ? `${new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 2 }).format(m2 / 10_000)} ha`
    : `${new Intl.NumberFormat("fr-FR").format(m2)} m²`;

export const fmtFcfa = (n: number) => new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 }).format(n) + " F";

/** Jours restants jusqu'à une date (0 si passée). */
export const daysUntil = (iso: string) => Math.max(0, Math.ceil((new Date(iso).getTime() - Date.now()) / 86_400_000));
