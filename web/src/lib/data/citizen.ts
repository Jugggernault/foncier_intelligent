// Données de la citoyenne de démonstration (persona « citoyen », Afi Houngbédji).
import { getParcel, isPublicityOpen, listParcels, neighbours } from "./parcels";
import type { Parcel } from "./types";
import { dossiersOf, LITIGES } from "./workflow";

export const ME = { initials: "AH", name: "Afi Houngbédji", npi: "1083421907", phone: "+229 01 97 00 00 00", email: "afi.h@example.bj" };

const privates = listParcels().filter((p) => p.owner.kind === "private" && !p.real);

/** Parcelles dont elle est titulaire : une titrée à Cotonou, une présumée à Calavi, une en litige. */
export const OWNED: Parcel[] = [
  privates.find((p) => p.commune === "Cotonou" && p.right === "titre" && !p.dispute)!,
  privates.find((p) => p.commune === "Abomey-Calavi" && p.right === "presume")!,
  privates.find((p) => p.dispute && p.landUse === "urbain")!,
].filter(Boolean);

/** Parcelles surveillées : les siennes, des voisines, et une parcelle qu'elle envisage d'acheter. */
export const WATCHED: { parcel: Parcel; reason: "proprietaire" | "voisine" | "achat" }[] = [
  ...OWNED.map((parcel) => ({ parcel, reason: "proprietaire" as const })),
  ...OWNED.slice(0, 2).flatMap((p) => neighbours(p, 2500).slice(0, 1)).map((parcel) => ({ parcel, reason: "voisine" as const })),
  { parcel: getParcel("100666667")!, reason: "achat" as const },
];

export type CitizenAlert = { id: string; date: string; kind: "satellite" | "publicite" | "dossier" | "litige"; title: string; text: string; href: string; unread: boolean };

export function citizenAlerts(): CitizenAlert[] {
  const out: CitizenAlert[] = [];
  for (const { parcel } of WATCHED) {
    for (const a of parcel.alerts) {
      out.push({ id: a.id, date: a.date, kind: "satellite", title: `Changement détecté sur ${parcel.nup}`, text: a.text, href: `/espace/alertes/${a.id}`, unread: true });
    }
    for (const n of neighbours(parcel, 2500).filter((n) => isPublicityOpen(n))) {
      out.push({
        id: `pub-${n.nup}`,
        date: n.procedure!.publicity.start,
        kind: "publicite",
        title: `Demande de titre publiée près de ${parcel.nup}`,
        text: `Parcelle ${n.nup} (${n.quartier}). Opposition possible jusqu'au ${n.procedure!.publicity.end}.`,
        href: `/publicite/${n.nup}`,
        unread: true,
      });
    }
  }
  for (const d of dossiersOf(ME.initials)) {
    const last = d.messages.at(-1)!;
    out.push({ id: `dos-${d.id}`, date: last.date, kind: "dossier", title: `Dossier ${d.id}`, text: last.text, href: `/espace/dossiers/${d.id}`, unread: d.status === "complement" });
  }
  for (const l of LITIGES.filter((l) => OWNED.some((p) => p.nup === l.nup))) {
    out.push({ id: `lit-${l.id}`, date: l.opened, kind: "litige", title: `Litige ${l.id}`, text: l.nextStep ? `${l.nextStep.label} prévue le ${l.nextStep.date}.` : l.summary, href: `/espace/litiges/${l.id}`, unread: false });
  }
  const unique = [...new Map(out.map((a) => [a.id, a])).values()];
  return unique.sort((a, b) => b.date.localeCompare(a.date));
}

export const myLitiges = () => LITIGES.filter((l) => OWNED.some((p) => p.nup === l.nup));

export const VERIFICATIONS = [
  { id: "V-0192", nup: "100666667", date: "2026-09-12", note: "Avant achat : parcelle proposée par un vendeur à Ouèdo" },
  { id: "V-0171", nup: OWNED[0]?.nup ?? "101236198", date: "2026-08-03", note: "Pour un dossier de crédit" },
];
