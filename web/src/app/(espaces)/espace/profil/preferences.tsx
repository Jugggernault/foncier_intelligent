"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

const LANGS = [
  { value: "fr", label: "Français" },
  { value: "fon", label: "Fɔngbè (bientôt)" },
  { value: "yo", label: "Yorùbá (bientôt)" },
];

export function Preferences() {
  const [prefs, setPrefs] = useState({ sms: true, whatsapp: true, email: false, weekly: true });
  const [lang, setLang] = useState("fr");
  return (
    <Card className="rounded-lg">
      <CardHeader><CardTitle className="text-base">Préférences</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        {([["sms", "Alertes par SMS"], ["whatsapp", "Alertes par WhatsApp"], ["email", "Alertes par e-mail"], ["weekly", "Résumé hebdomadaire"]] as const).map(([k, label]) => (
          <div key={k} className="flex items-center justify-between">
            <Label htmlFor={`p-${k}`} className="font-normal">{label}</Label>
            <Switch id={`p-${k}`} checked={prefs[k]} onCheckedChange={(v) => setPrefs({ ...prefs, [k]: v })} />
          </div>
        ))}
        <div className="flex items-center justify-between gap-4 border-t pt-4">
          <Label className="font-normal">Langue</Label>
          <Select value={lang} onValueChange={(v) => setLang(String(v))} items={LANGS}>
            <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
            <SelectContent>
              {LANGS.map((l) => (
                <SelectItem key={l.value} value={l.value} disabled={l.value !== "fr"}>{l.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}
