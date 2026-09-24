"use client";

import { useState } from "react";
import { SparklesIcon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { triage, type Triage } from "@/lib/triage";

export function ComplaintForm({ defaultNup }: { defaultNup?: string }) {
  const [text, setText] = useState("");
  const [result, setResult] = useState<Triage>();

  return (
    <form
      className="grid max-w-5xl gap-8 lg:grid-cols-12"
      onSubmit={(e) => {
        e.preventDefault();
        toast.success("Plainte enregistrée (démonstration). Vous recevrez un accusé de réception par SMS.");
      }}
    >
      <FieldGroup className="lg:col-span-7">
        <Field>
          <FieldLabel htmlFor="c-nup">Parcelle concernée (NUP)</FieldLabel>
          <Input id="c-nup" defaultValue={defaultNup} inputMode="numeric" maxLength={9} className="tabular h-11 bg-card" />
        </Field>
        <Field>
          <FieldLabel htmlFor="c-other">Autre partie (si connue)</FieldLabel>
          <Input id="c-other" className="h-11 bg-card" />
        </Field>
        <Field>
          <FieldLabel htmlFor="c-text">Que s&apos;est-il passé ?</FieldLabel>
          <Textarea id="c-text" rows={6} value={text} onChange={(e) => setText(e.target.value)} onBlur={() => text.length > 20 && setResult(triage(text))} className="bg-card" placeholder="Décrivez les faits, les dates, les documents en votre possession." />
          <FieldDescription>Votre récit est analysé pour vous orienter vers la bonne instance.</FieldDescription>
        </Field>
        <div className="flex gap-2">
          <Button type="button" variant="outline" size="lg" className="h-11" disabled={text.length < 10} onClick={() => setResult(triage(text))}>
            <SparklesIcon data-icon="inline-start" /> Analyser
          </Button>
          <Button type="submit" size="lg" className="h-11 px-5" disabled={!text.trim()}>Déposer la plainte</Button>
        </div>
      </FieldGroup>
      <aside className="lg:col-span-5">
        {result ? (
          <div className="rounded-lg bg-sky p-5">
            <p className="text-xs font-semibold text-muted-foreground">Analyse de votre récit</p>
            <p className="mt-1 text-xl font-extrabold text-navy">{result.label}</p>
            <p className="tabular text-sm text-muted-foreground">Confiance {Math.round(result.confidence * 100)} %</p>
            <p className="mt-4 font-semibold">Orientation : {result.route === "CoGeF" ? "Médiation CoGeF" : result.route === "CGP" ? "Commission de gestion des plaintes" : "Tribunal"}</p>
            <p className="mt-1 text-sm">{result.advice}</p>
            <p className="mt-4 border-t border-sky-line pt-3 text-xs text-muted-foreground">Suggestion automatique : un agent confirme l&apos;orientation.</p>
          </div>
        ) : (
          <p className="rounded-lg border border-dashed p-5 text-sm text-muted-foreground">Décrivez les faits : l&apos;analyse de votre récit apparaîtra ici.</p>
        )}
      </aside>
    </form>
  );
}
