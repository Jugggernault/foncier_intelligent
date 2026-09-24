// Résultats simulés de lecture de pièces, cohérents avec la parcelle vérifiée.
// ponytail: remplacé par l'extraction réelle (Claude vision / Mistral OCR), même forme de sortie.
import type { DocResult } from "@/components/app/document-analyzer";

export type ParcelFacts = { nup: string; commune: string; areaM2: number; owner: "state" | "private" };

export function mockAnalyze(name: string, i: number, p?: ParcelFacts): DocResult {
  const n = name.toLowerCase();
  if (n.includes("identité")) return { status: "ok", fields: [["NPI", "10•• ••• 907"], ["Nom", "Correspond au vendeur déclaré"]] };
  if (n.includes("coutumière") || n.includes("présomption") || n.includes("titre") || n.includes("attestation")) {
    if (p?.owner === "state")
      return {
        status: "error",
        fields: [["Parcelle", p.nup], ["Commune", p.commune]],
        note: "Cette pièce attribue à un particulier une parcelle inscrite au nom de l'État. Document probablement frauduleux.",
      };
    const declared = p ? Math.round(p.areaM2 * 1.18) : 620;
    return {
      status: p ? "warning" : "ok",
      fields: [["Superficie déclarée", `${declared} m²`], ["Commune", p?.commune ?? "—"], ["Signataire", "Chef d'arrondissement"]],
      note: p ? `Superficie déclarée (${declared} m²) supérieure de 18 % à la superficie cadastrale (${p.areaM2} m²). À faire vérifier par un géomètre.` : undefined,
    };
  }
  if (n.includes("vente") || n.includes("convention")) {
    return i % 2
      ? { status: "ok", fields: [["Date", "12 mars 2026"], ["Prix déclaré", "8 500 000 F"]] }
      : { status: "warning", fields: [["Date", "Illisible"]], note: "Page 2 floue : reprenez la photo en pleine lumière." };
  }
  if (n.includes("levé") || n.includes("plan")) return { status: "ok", fields: [["Géomètre", "Agréé, Ordre des géomètres"], ["Système", "UTM 31N"]] };
  return { status: "ok", fields: [] };
}
