import { AppShell } from "@/components/app/app-shell";
import { requirePersona } from "@/lib/session";

export default async function Layout({ children }: { children: React.ReactNode }) {
  return <AppShell persona={await requirePersona("pilotage")}>{children}</AppShell>;
}
