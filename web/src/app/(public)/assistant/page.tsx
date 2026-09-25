import type { Metadata } from "next";
import { AgentChat } from "@/components/assistant/agent-chat";

export const metadata: Metadata = { title: "Ilèmi, l'agent foncier · Foncier Intelligent" };

export default async function AssistantPage({ searchParams }: PageProps<"/assistant">) {
  const q = (await searchParams).q;
  return <AgentChat initial={typeof q === "string" ? q : undefined} />;
}
