// Barème ANDF de la mutation de titre foncier (catalogue e-services) : une règle, pas un modèle.
export const REGIE_FCFA = 500;

export type MutationFee = { rule: string; base: number; regie: number; total: number };

export function mutationFee(amount: number): MutationFee {
  if (!Number.isFinite(amount) || amount <= 0) return { rule: "", base: 0, regie: 0, total: 0 };
  let base: number;
  let rule: string;
  if (amount <= 10_000_000) {
    base = Math.round(amount * 0.003);
    rule = "0,3 % du montant (jusqu'à 10 millions)";
  } else if (amount <= 50_000_000) {
    base = 30_000;
    rule = "Forfait de 30 000 F (de 10 à 50 millions)";
  } else {
    base = Math.round(amount * 0.005);
    rule = "0,5 % du montant (au-delà de 50 millions)";
  }
  return { rule, base, regie: REGIE_FCFA, total: base + REGIE_FCFA };
}

export const formatFcfa = (n: number) =>
  new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 }).format(n) + " F";
