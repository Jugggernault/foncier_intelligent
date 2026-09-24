"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/site/logo";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { NAV, SPACE_HOME, SPACE_LABEL, type Persona } from "@/lib/personas";

export function AppSidebar({ persona }: { persona: Persona }) {
  const path = usePathname();
  const home = SPACE_HOME[persona.space];
  const groups = NAV[persona.space]
    .map((g) => ({ ...g, items: g.items.filter((i) => !i.roles || (persona.proRole && i.roles.includes(persona.proRole))) }))
    .filter((g) => g.items.length);

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="bg-navy text-white">
        <div className="tricolor -mx-2 -mt-2 mb-2 h-1" />
        <Logo className="px-1 group-data-[collapsible=icon]:[&>span]:hidden" />
        <p className="px-1 text-xs text-white/60 group-data-[collapsible=icon]:hidden">{SPACE_LABEL[persona.space]}</p>
      </SidebarHeader>
      <SidebarContent>
        {groups.map((g) => (
          <SidebarGroup key={g.label}>
            <SidebarGroupLabel>{g.label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {g.items.map((item) => {
                  const active = item.href === home ? path === home : path.startsWith(item.href);
                  return (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton isActive={active} tooltip={item.label} render={<Link href={item.href} />}>
                        <item.icon />
                        <span>{item.label}</span>
                      </SidebarMenuButton>
                      {item.soon && <SidebarMenuBadge className="text-[0.65rem]">Bientôt</SidebarMenuBadge>}
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter className="text-xs text-muted-foreground group-data-[collapsible=icon]:hidden">
        <Link href="/" className="px-2 py-1 hover:text-foreground">Retour au site public</Link>
      </SidebarFooter>
    </Sidebar>
  );
}
