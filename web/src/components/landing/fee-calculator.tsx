"use client";

import { useState } from "react";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from "@/components/ui/input-group";
import { fr } from "@/i18n/fr";
import { formatFcfa, mutationFee } from "@/lib/fees";

const t = fr.fees;
const group = new Intl.NumberFormat("fr-FR");

export function FeeCalculator() {
  const [raw, setRaw] = useState("25000000");
  const amount = Number(raw) || 0;
  const fee = mutationFee(amount);

  return (
    <div className="grid gap-8 rounded-lg bg-white p-6 shadow-[0_18px_40px_-24px_rgba(9,62,115,0.45)] sm:p-8 md:grid-cols-2 md:gap-10">
      <Field>
        <FieldLabel htmlFor="price" className="text-sm font-semibold">
          {t.label}
        </FieldLabel>
        <InputGroup className="h-14 rounded-md">
          <InputGroupInput
            id="price"
            inputMode="numeric"
            autoComplete="off"
            value={raw ? group.format(Number(raw)) : ""}
            onChange={(e) => setRaw(e.target.value.replace(/\D/g, "").slice(0, 12))}
            className="tabular font-display text-xl font-bold"
          />
          <InputGroupAddon align="inline-end" className="pr-4">
            <InputGroupText>{t.suffix}</InputGroupText>
          </InputGroupAddon>
        </InputGroup>
        <FieldDescription>{t.note}</FieldDescription>
      </Field>

      <div aria-live="polite" className="flex flex-col justify-center border-t pt-6 md:border-t-0 md:border-l md:pt-0 md:pl-10">
        <p className="text-sm font-semibold text-muted-foreground">{t.result}</p>
        <p className="tabular font-display text-[clamp(2.2rem,5vw,3.2rem)] leading-none font-extrabold text-navy">
          {formatFcfa(fee.total)}
        </p>
        {fee.total > 0 && (
          <p className="mt-2 text-sm text-muted-foreground">
            {fee.rule} + {formatFcfa(fee.regie)} {t.regie}
          </p>
        )}
      </div>
    </div>
  );
}
