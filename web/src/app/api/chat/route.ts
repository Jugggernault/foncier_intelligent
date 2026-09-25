import { guard } from "@/lib/rate-limit";
import { createAgentUIStreamResponse } from "ai";
import { ilemi } from "@/lib/agent/ilemi";

export const maxDuration = 60;

export async function POST(req: Request) {
  const tooMany = guard(req, "chat", 12);
  if (tooMany) return tooMany;
  const { messages } = await req.json();
  if (!Array.isArray(messages) || JSON.stringify(messages).length > 200_000) return Response.json({ error: "Requête invalide." }, { status: 400 });
  return createAgentUIStreamResponse({ agent: ilemi, uiMessages: messages });
}
