"use client";

import Link from "next/link";
import { LogOutIcon, RepeatIcon } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Persona } from "@/lib/personas";

export function UserMenu({ persona }: { persona: Persona }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-2 rounded-md p-1 pr-2 text-left transition-colors hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none">
        <Avatar className="size-8">
          <AvatarFallback className="bg-navy font-display text-xs font-bold text-white">{persona.initials}</AvatarFallback>
        </Avatar>
        <span className="hidden text-sm leading-tight sm:block">
          <span className="block font-semibold">{persona.name}</span>
          <span className="block text-xs text-muted-foreground">{persona.title}</span>
        </span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-60">
        <DropdownMenuGroup>
          <DropdownMenuLabel>{persona.name}</DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem render={<Link href="/connexion/role" />}>
          <RepeatIcon />
          Changer de profil (démo)
        </DropdownMenuItem>
        <DropdownMenuItem render={<a href="/deconnexion" />}>
          <LogOutIcon />
          Se déconnecter
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
