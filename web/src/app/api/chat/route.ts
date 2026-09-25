import { createAgentUIStreamResponse } from "ai";
import { ilemi } from "@/lib/agent/ilemi";

export const maxDuration = 60;

export async function POST(req: Request) {
  const { messages } = await req.json();
  // ponytail: garde-fou minimal ; ajouter une limitation de débit par IP avant la mise en ligne publique
  if (!Array.isArray(messages) || JSON.stringify(messages).length > 200_000) return Response.json({ error: "Requête invalide." }, { status: 400 });
  return createAgentUIStreamResponse({ agent: ilemi, uiMessages: messages });
}
