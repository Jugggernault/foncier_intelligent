"use client";

import { useState } from "react";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from "@/components/ui/input-group";

const fmt = (n: number) => new Intl.NumberFormat("fr-FR").format(Math.round(n));

/** Gains estimés du pré-contrôle, à partir des rejets évitables réels et d'hypothèses réglables. */
export function ImpactCalculator({ avoidable }: { avoidable: number }) {
  const [weeks, setWeeks] = useState(6);
  const [cost, setCost] = useState(75000);
  const [catch_, setCatch] = useState(70);
  const avoided = (avoidable * catch_) / 100;
  const num = (v: string) => Number(v.replace(/\D/g, "")) || 0;

  return (
    <div className="grid gap-8 rounded-lg border bg-card p-6 lg:grid-cols-2">
      <div className="space-y-5">
        <Field>
          <FieldLabel htmlFor="catch">Part des rejets évitables réellement interceptés</FieldLabel>
          <InputGroup className="max-w-40"><InputGroupInput id="catch" inputMode="numeric" value={catch_} onChange={(e) => setCatch(Math.min(100, num(e.target.value)))} className="tabular" /><InputGroupAddon align="inline-end"><InputGroupText>%</InputGroupText></InputGroupAddon></InputGroup>
          <FieldDescription>Hypothèse prudente : le calage n&apos;est détectable qu&apos;en partie.</FieldDescription>
        </Field>
        <Field>
          <FieldLabel htmlFor="weeks">Délai perdu par rejet (aller-retour géomètre, nouveau dépôt)</FieldLabel>
          <InputGroup className="max-w-40"><InputGroupInput id="weeks" inputMode="numeric" value={weeks} onChange={(e) => setWeeks(num(e.target.value))} className="tabular" /><InputGroupAddon align="inline-end"><InputGroupText>semaines</InputGroupText></InputGroupAddon></InputGroup>
        </Field>
        <Field>
          <FieldLabel htmlFor="cost">Coût d&apos;un rejet pour l&apos;usager (reprise du levé, déplacements)</FieldLabel>
          <InputGroup className="max-w-48"><InputGroupInput id="cost" inputMode="numeric" value={fmt(cost)} onChange={(e) => setCost(num(e.target.value))} className="tabular" /><InputGroupAddon align="inline-end"><InputGroupText>F CFA</InputGroupText></InputGroupAddon></InputGroup>
        </Field>
        <p className="text-xs text-muted-foreground">Délai et coût sont des hypothèses à confirmer avec l&apos;ANDF et l&apos;Ordre des géomètres. Le nombre de rejets évitables est réel.</p>
      </div>
      <dl className="grid content-start gap-6 sm:grid-cols-2 lg:grid-cols-1" aria-live="polite">
        <div><dt className="text-sm text-muted-foreground">Dossiers rejetés évités</dt><dd className="tabular font-display text-4xl font-extrabold text-navy">{fmt(avoided)}</dd></div>
        <div><dt className="text-sm text-muted-foreground">Semaines d&apos;attente épargnées aux usagers</dt><dd className="tabular font-display text-4xl font-extrabold text-navy">{fmt(avoided * weeks)}</dd></div>
        <div><dt className="text-sm text-muted-foreground">Économisés par les usagers</dt><dd className="tabular font-display text-4xl font-extrabold text-navy">{fmt((avoided * cost) / 1_000_000)} M F CFA</dd></div>
      </dl>
    </div>
  );
}
