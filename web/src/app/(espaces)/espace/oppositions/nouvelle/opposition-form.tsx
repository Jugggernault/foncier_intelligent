"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel, FieldLegend, FieldSet } from "@/components/ui/field";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { ME } from "@/lib/data/citizen";

const GROUNDS = {
  proprietaire: "Je suis propriétaire de tout ou partie de cette parcelle",
  limites: "La demande empiète sur ma parcelle voisine",
  heritier: "Je suis ayant droit (succession) et n'ai pas consenti",
};

export function OppositionForm({ nup, requestNumber, deadline }: { nup: string; requestNumber: string; deadline: string }) {
  const [ground, setGround] = useState<keyof typeof GROUNDS>("limites");
  const [facts, setFacts] = useState("");
  const letter = `À Monsieur le Chef du Bureau communal du Domaine et du Foncier,

Je soussignée ${ME.name}, NPI ${ME.npi}, déclare former opposition à la demande n° ${requestNumber} portant sur la parcelle NUP ${nup}, au motif suivant : ${GROUNDS[ground].toLowerCase()}.

${facts || "[Exposé des faits]"}

Je joins à la présente les pièces justifiant mes droits et reste à votre disposition.

Fait pour valoir ce que de droit.`;

  return (
    <div className="grid max-w-6xl gap-8 lg:grid-cols-2">
      <FieldGroup>
        <FieldSet>
          <FieldLegend className="text-base font-semibold">Motif</FieldLegend>
          <RadioGroup value={ground} onValueChange={(v) => setGround(v as keyof typeof GROUNDS)}>
            {Object.entries(GROUNDS).map(([k, label]) => (
              <Field key={k} orientation="horizontal">
                <RadioGroupItem value={k} id={`g-${k}`} />
                <FieldLabel htmlFor={`g-${k}`} className="font-normal">{label}</FieldLabel>
              </Field>
            ))}
          </RadioGroup>
        </FieldSet>
        <Field>
          <FieldLabel htmlFor="facts">Exposé des faits</FieldLabel>
          <Textarea id="facts" rows={5} value={facts} onChange={(e) => setFacts(e.target.value)} className="bg-card" />
        </Field>
        <Button size="lg" className="h-11 w-fit bg-signal px-5 font-bold text-signal-ink hover:bg-[#ffe033]" onClick={() => toast.success(`Opposition transmise au BCDF avant le ${deadline} (démonstration).`)}>
          Transmettre l&apos;opposition
        </Button>
      </FieldGroup>
      <div>
        <p className="text-sm font-semibold text-muted-foreground">Lettre générée</p>
        <pre className="mt-2 rounded-lg border bg-card p-5 font-sans text-sm leading-relaxed whitespace-pre-wrap">{letter}</pre>
      </div>
    </div>
  );
}
