"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel, FieldLegend, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export function DeedForm() {
  const [kind, setKind] = useState("etat");
  return (
    <form className="max-w-lg" onSubmit={(e) => { e.preventDefault(); toast.success("Demande transmise à l'ANDF. Délivrance sous 24 h (démonstration)."); }}>
      <FieldGroup>
        <FieldSet>
          <FieldLegend className="text-base font-semibold">Acte</FieldLegend>
          <RadioGroup value={kind} onValueChange={(v) => setKind(String(v))}>
            <Field orientation="horizontal"><RadioGroupItem value="etat" id="k-etat" /><FieldLabel htmlFor="k-etat" className="font-normal">État descriptif · 5 500 F</FieldLabel></Field>
            <Field orientation="horizontal"><RadioGroupItem value="compulsion" id="k-comp" /><FieldLabel htmlFor="k-comp" className="font-normal">Compulsion (huissier) · 10 000 F</FieldLabel></Field>
          </RadioGroup>
        </FieldSet>
        <Field>
          <FieldLabel htmlFor="d-nup">Parcelle (NUP) ou numéro de titre foncier</FieldLabel>
          <Input id="d-nup" className="tabular h-11 bg-card" />
        </Field>
        <Button type="submit" size="lg" className="h-11 w-fit px-5">Demander et payer</Button>
      </FieldGroup>
    </form>
  );
}
