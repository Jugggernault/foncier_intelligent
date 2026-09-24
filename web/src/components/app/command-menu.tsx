"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MapPinIcon, SearchIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Kbd } from "@/components/ui/kbd";
import type { NavGroup } from "@/lib/personas";

type Hit = { nup: string; place: string };

/** Palette ⌘K : pages de l'espace et parcelles par NUP ou lieu. */
export function CommandMenu({ nav, parcels }: { nav: NavGroup[]; parcels: Hit[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const go = (href: string) => {
    setOpen(false);
    router.push(href);
  };

  return (
    <>
      <Button variant="outline" className="h-9 w-full max-w-sm justify-start gap-2 text-muted-foreground" onClick={() => setOpen(true)}>
        <SearchIcon />
        <span className="flex-1 text-left">Rechercher une parcelle, une page…</span>
        <Kbd className="hidden sm:inline-flex">Ctrl K</Kbd>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen} title="Recherche" description="Pages et parcelles">
        <CommandInput placeholder="NUP, quartier, page…" />
        <CommandList>
          <CommandEmpty>Aucun résultat.</CommandEmpty>
          <CommandGroup heading="Pages">
            {nav.flatMap((g) => g.items).map((i) => (
              <CommandItem key={i.href} value={i.label} onSelect={() => go(i.href)}>
                <i.icon />
                {i.label}
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandGroup heading="Parcelles">
            {parcels.map((p) => (
              <CommandItem key={p.nup} value={`${p.nup} ${p.place}`} onSelect={() => go(`/parcelle/${p.nup}`)}>
                <MapPinIcon />
                <span className="tabular font-semibold">{p.nup}</span>
                <span className="text-muted-foreground">{p.place}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
