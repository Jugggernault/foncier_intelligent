"use client";

import { useState } from "react";
import Link from "next/link";
import { PlusIcon, Trash2Icon } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@/components/ui/input-group";
import { Item, ItemActions, ItemContent, ItemDescription, ItemGroup, ItemTitle } from "@/components/ui/item";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export type Watched = { nup: string; place: string; reason: "proprietaire" | "voisine" | "achat" | "ajout" };

const REASON = { proprietaire: "Ma parcelle", voisine: "Voisine", achat: "Projet d'achat", ajout: "Ajoutée" };

export function WatchList({ initial, known, preset }: { initial: Watched[]; known: Record<string, string>; preset?: string }) {
  const [items, setItems] = useState(initial);
  const [nup, setNup] = useState(preset && !initial.some((w) => w.nup === preset) ? preset : "");
  const [channels, setChannels] = useState({ sms: true, whatsapp: true, email: false });

  function add() {
    if (!/^\d{9}$/.test(nup)) return toast.error("Un NUP compte 9 chiffres.");
    if (items.some((i) => i.nup === nup)) return toast("Cette parcelle est déjà surveillée.");
    setItems([{ nup, place: known[nup] ?? "Parcelle hors démonstration", reason: "ajout" }, ...items]);
    setNup("");
    toast.success(`Parcelle ${nup} ajoutée à la surveillance.`);
  }

  return (
    <div className="grid gap-8 lg:grid-cols-12">
      <div className="lg:col-span-8">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            add();
          }}
        >
          <Field>
            <FieldLabel htmlFor="watch-nup">Surveiller une nouvelle parcelle</FieldLabel>
            <InputGroup className="h-11 bg-card">
              <InputGroupInput id="watch-nup" inputMode="numeric" maxLength={9} placeholder="NUP à 9 chiffres" value={nup} onChange={(e) => setNup(e.target.value.replace(/\D/g, ""))} className="tabular" />
              <InputGroupAddon align="inline-end">
                <InputGroupButton type="submit" variant="default" size="sm" className="rounded-md">
                  <PlusIcon /> Ajouter
                </InputGroupButton>
              </InputGroupAddon>
            </InputGroup>
          </Field>
        </form>
        <ItemGroup className="mt-6 gap-2">
          {items.map((w) => (
            <Item key={w.nup} variant="outline" className="bg-card">
              <ItemContent>
                <ItemTitle className="tabular font-display font-bold text-navy">
                  <Link href={`/parcelle/${w.nup}`} className="hover:underline">{w.nup}</Link>
                </ItemTitle>
                <ItemDescription>{w.place}</ItemDescription>
              </ItemContent>
              <ItemActions>
                <Badge variant="secondary" className="rounded-sm">{REASON[w.reason]}</Badge>
                {w.reason !== "proprietaire" && (
                  <Button variant="ghost" size="icon-sm" aria-label={`Ne plus surveiller ${w.nup}`} onClick={() => setItems(items.filter((i) => i.nup !== w.nup))}>
                    <Trash2Icon />
                  </Button>
                )}
              </ItemActions>
            </Item>
          ))}
        </ItemGroup>
      </div>
      <aside className="space-y-4 rounded-lg border bg-card p-5 lg:col-span-4">
        <h2 className="font-bold text-navy">Me prévenir par</h2>
        {(["sms", "whatsapp", "email"] as const).map((c) => (
          <div key={c} className="flex items-center justify-between">
            <Label htmlFor={`ch-${c}`} className="font-normal">{{ sms: "SMS", whatsapp: "WhatsApp", email: "E-mail" }[c]}</Label>
            <Switch id={`ch-${c}`} checked={channels[c]} onCheckedChange={(v) => setChannels({ ...channels, [c]: v })} />
          </div>
        ))}
        <p className="border-t pt-4 text-sm text-muted-foreground">
          Vous êtes prévenue en cas de construction ou défrichement détecté par satellite, de demande de titre publiée à proximité, ou de litige déclaré.
        </p>
      </aside>
    </div>
  );
}
