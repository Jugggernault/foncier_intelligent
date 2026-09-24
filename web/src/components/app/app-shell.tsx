import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { listParcels } from "@/lib/data/parcels";
import type { Persona } from "@/lib/personas";
import { AppSidebar } from "./app-sidebar";
import { CommandMenu } from "./command-menu";
import { UserMenu } from "./user-menu";

/** Coquille commune des espaces connectés : barre latérale, recherche ⌘K, profil. */
export function AppShell({ persona, children }: { persona: Persona; children: React.ReactNode }) {
  const parcels = listParcels().map((p) => ({ nup: p.nup, place: `${p.quartier}, ${p.commune}` }));
  return (
    <SidebarProvider>
      <AppSidebar persona={persona} />
      <SidebarInset className="bg-sky/40">
        <header className="sticky top-0 z-10 flex h-14 items-center gap-3 border-b bg-background/95 px-3 backdrop-blur sm:px-4">
          <SidebarTrigger />
          <Separator orientation="vertical" className="h-5" />
          <CommandMenu space={persona.space} parcels={parcels} />
          <div className="ml-auto">
            <UserMenu persona={persona} />
          </div>
        </header>
        <div className="flex-1">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
