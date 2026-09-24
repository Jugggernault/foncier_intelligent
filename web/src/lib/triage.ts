// Triage des plaintes (IA-12), démonstration : classement par mots-clés et orientation.
// ponytail: remplacer par une classification LLM avec les mêmes catégories.
export type Category = "limites" | "double-vente" | "succession" | "contestation" | "empietement";
export type Triage = { category: Category; label: string; confidence: number; route: "CoGeF" | "CGP" | "Tribunal"; advice: string };

const RULES: [Category, string[], string][] = [
  ["double-vente", ["vendu deux", "double vente", "deux acheteurs", "déjà vendu", "revendu"], "Double vente"],
  ["succession", ["héritier", "succession", "décès", "famille", "collatéraux"], "Succession"],
  ["empietement", ["construit sur", "empiète", "empiétement", "occupe mon", "clôture chez"], "Empiètement"],
  ["limites", ["limite", "borne", "clôture", "mur mitoyen", "bornage"], "Conflit de limites"],
  ["contestation", ["revendique", "conteste", "faux", "propriétaire légitime", "attestation"], "Contestation de propriété"],
];

export function triage(text: string): Triage {
  const t = text.toLowerCase();
  const scored = RULES.map(([c, keys, label]) => ({ c, label, hits: keys.filter((k) => t.includes(k)).length })).sort((a, b) => b.hits - a.hits);
  const best = scored[0].hits ? scored[0] : { c: "contestation" as Category, label: "Contestation de propriété", hits: 0 };
  const route = best.c === "double-vente" || best.c === "contestation" ? "CGP" : best.c === "succession" ? "Tribunal" : "CoGeF";
  return {
    category: best.c,
    label: best.label,
    confidence: best.hits ? Math.min(0.95, 0.7 + best.hits * 0.1) : 0.45,
    route,
    advice: {
      CoGeF: "Une médiation par la Commission de gestion foncière de votre commune est le plus rapide.",
      CGP: "La Commission de gestion des plaintes en matière de transfert de propriété est compétente.",
      Tribunal: "Les conflits de succession relèvent en général du tribunal ; une médiation familiale peut précéder.",
    }[route],
  };
}
