"use client";

import { useState } from "react";
import { CopyIcon, KeyRoundIcon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Item, ItemActions, ItemContent, ItemDescription, ItemGroup, ItemMedia, ItemTitle } from "@/components/ui/item";

export function ApiKeys() {
  const [keys, setKeys] = useState([{ name: "Production", value: "fi_live_7Hq2…k91", created: "2026-06-02" }]);
  return (
    <Card className="rounded-lg">
      <CardHeader><CardTitle className="text-base">Vos clés</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        <ItemGroup className="gap-2">
          {keys.map((k) => (
            <Item key={k.value} variant="outline">
              <ItemMedia variant="icon"><KeyRoundIcon /></ItemMedia>
              <ItemContent>
                <ItemTitle>{k.name}</ItemTitle>
                <ItemDescription className="tabular">{k.value} · créée le {k.created}</ItemDescription>
              </ItemContent>
              <ItemActions>
                <Button variant="ghost" size="icon-sm" aria-label="Copier" onClick={() => { navigator.clipboard?.writeText(k.value); toast("Clé copiée."); }}><CopyIcon /></Button>
              </ItemActions>
            </Item>
          ))}
        </ItemGroup>
        <Button variant="outline" onClick={() => setKeys([...keys, { name: "Test", value: `fi_test_${Math.random().toString(36).slice(2, 8)}…`, created: new Date().toISOString().slice(0, 10) }])}>
          Créer une clé de test
        </Button>
      </CardContent>
    </Card>
  );
}
