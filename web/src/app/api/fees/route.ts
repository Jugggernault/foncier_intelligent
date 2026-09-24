import { mutationFee } from "@/lib/fees";

// Frais de mutation ANDF pour un prix de vente : GET /api/fees?amount=25000000
export function GET(req: Request) {
  const amount = Number(new URL(req.url).searchParams.get("amount"));
  if (!Number.isFinite(amount) || amount <= 0) return Response.json({ error: "Paramètre amount (FCFA) requis." }, { status: 400 });
  return Response.json({ amount, ...mutationFee(amount) });
}
