import type { Metadata } from "next";
import { Chat } from "@/components/assistant/chat";

export const metadata: Metadata = { title: "Assistant foncier · Foncier Intelligent" };

export default async function AssistantPage({ searchParams }: PageProps<"/assistant">) {
  const q = (await searchParams).q;
  return <Chat initial={typeof q === "string" ? q : undefined} />;
}
