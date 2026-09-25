import "server-only";
import { extractText, getDocumentProxy } from "unpdf";
import { getDemoDoc, type DemoDoc } from "@/content/demo-documents";
import { areaM2, bornesFromText, ringFromUtm, type Ring } from "@/lib/survey";

export type Extraction = {
  source: "demo" | "pdf-text" | "inconnu";
  kind: DemoDoc["kind"] | "inconnu";
  title: string;
  fields: [string, string][];
  bornes: [number, number][];
  ring?: Ring;
  computedM2?: number;
  declaredM2?: number;
  demo?: DemoDoc;
};

const fcfa = (n: number) => `${new Intl.NumberFormat("fr-FR").format(n)} F`;

function fieldsOf(d: DemoDoc): [string, string][] {
  if (d.kind === "leve") return [["Géomètre", d.surveyor], ["Client", d.client], ["Localisation", `${d.quartier}, ${d.commune}`], ["Superficie déclarée", `${d.declaredM2} m²`], ["Date", d.date]];
  if (d.kind === "adc") return [["Détenteur", d.holder], ["Localisation", `${d.quartier}, ${d.commune}`], ["Superficie déclarée", `${d.declaredM2} m²`], ["Signataire", d.signatory], ["Date", d.date]];
  return [["Vendeur", d.seller], ["Acquéreur", d.buyer], ["Prix", fcfa(d.price)], ["Superficie déclarée", `${d.declaredM2} m²`], ["Date", d.date]];
}

/**
 * Lecture d'une pièce : 1) document de la base de démonstration (contenu connu), 2) couche texte d'un PDF
 * numérique (bornes UTM détectées), 3) sinon, document non reconnu. ponytail: pas d'OCR pour la démo.
 */
export async function extractDocument(file: File): Promise<Extraction> {
  const demo = getDemoDoc(file.name);
  if (demo) {
    const bornes = demo.kind === "leve" ? demo.bornes.map((b) => [b.x, b.y] as [number, number]) : [];
    const ring = bornes.length >= 3 ? ringFromUtm(bornes) : undefined;
    return { source: "demo", kind: demo.kind, title: demo.title, fields: fieldsOf(demo), bornes, ring, computedM2: ring && areaM2(ring), declaredM2: demo.declaredM2, demo };
  }
  if (file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf")) {
    try {
      const pdf = await getDocumentProxy(new Uint8Array(await file.arrayBuffer()));
      const { text } = await extractText(pdf, { mergePages: true });
      const bornes = bornesFromText(text);
      const declared = text.match(/(\d[\d\s.]{1,8})\s*m\s*²|(\d[\d\s.]{1,8})\s*m2\b/i);
      const ring = bornes.length >= 3 ? ringFromUtm(bornes) : undefined;
      return {
        source: "pdf-text",
        kind: bornes.length >= 3 ? "leve" : "inconnu",
        title: file.name,
        fields: [["Texte lu", `${text.length} caractères`]],
        bornes,
        ring,
        computedM2: ring && areaM2(ring),
        declaredM2: declared ? Number((declared[1] ?? declared[2]).replace(/[\s.]/g, "")) : undefined,
      };
    } catch {
      /* PDF illisible : traité comme inconnu */
    }
  }
  return { source: "inconnu", kind: "inconnu", title: file.name, fields: [], bornes: [] };
}
