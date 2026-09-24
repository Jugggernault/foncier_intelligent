"use client";

import { useState } from "react";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from "@/components/ui/input-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { fmtFcfa } from "@/lib/labels";
import type { PriceRef } from "@/lib/valuation";

export function Estimator({ refs }: { refs: PriceRef[] }) {
  const communes = [...new Set(refs.map((r) => r.commune))];
  const [commune, setCommune] = useState(communes[0]);
  const [zone, setZone] = useState<"loti" | "non-loti">("loti");
  const [area, setArea] = useState("500");
  const ref = refs.find((r) => r.commune === commune && r.zone === zone) ?? refs.find((r) => r.commune === commune);
  const m2 = Number(area) || 0;

  return (
    <div className="grid gap-8 rounded-lg bg-white p-6 shadow-[0_18px_40px_-24px_rgba(9,62,115,0.45)] sm:p-8 md:grid-cols-2 md:gap-10">
      <div className="space-y-6">
        <Field>
          <FieldLabel>Commune</FieldLabel>
          <Select value={commune} onValueChange={(v) => setCommune(String(v))} items={communes.map((c) => ({ value: c, label: c }))}>
            <SelectTrigger className="h-11 w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {communes.map((c) => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        <Field>
          <FieldLabel>Type de zone</FieldLabel>
          <ToggleGroup value={[zone]} onValueChange={(v) => v[0] && setZone(v[0] as "loti" | "non-loti")} variant="outline" spacing={0} className="w-full">
            <ToggleGroupItem value="loti" className="h-10 flex-1 data-pressed:bg-navy data-pressed:text-white">Lotie</ToggleGroupItem>
            <ToggleGroupItem value="non-loti" className="h-10 flex-1 data-pressed:bg-navy data-pressed:text-white">Non lotie</ToggleGroupItem>
          </ToggleGroup>
        </Field>
        <Field>
          <FieldLabel htmlFor="area">Superficie</FieldLabel>
          <InputGroup className="h-11">
            <InputGroupInput id="area" inputMode="numeric" value={area} onChange={(e) => setArea(e.target.value.replace(/\D/g, "").slice(0, 7))} className="tabular" />
            <InputGroupAddon align="inline-end"><InputGroupText>m²</InputGroupText></InputGroupAddon>
          </InputGroup>
        </Field>
      </div>
      <div aria-live="polite" className="flex flex-col justify-center border-t pt-6 md:border-t-0 md:border-l md:pt-0 md:pl-10">
        <p className="text-sm font-semibold text-muted-foreground">Fourchette estimée</p>
        {ref && m2 > 0 ? (
          <>
            <p className="tabular font-display text-[clamp(1.8rem,4vw,2.6rem)] leading-tight font-extrabold text-navy">
              {fmtFcfa(ref.low * m2)} – {fmtFcfa(ref.high * m2)}
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              {fmtFcfa(ref.low)} à {fmtFcfa(ref.high)} le m², médiane de {ref.count} parcelle{ref.count > 1 ? "s" : ""} comparable{ref.count > 1 ? "s" : ""}.
            </p>
          </>
        ) : (
          <p className="mt-2 text-muted-foreground">Indiquez une superficie.</p>
        )}
        <FieldDescription className="mt-4">Estimation de démonstration. La valeur réelle dépend de l&apos;accès, de la viabilisation et de la situation juridique.</FieldDescription>
      </div>
    </div>
  );
}
