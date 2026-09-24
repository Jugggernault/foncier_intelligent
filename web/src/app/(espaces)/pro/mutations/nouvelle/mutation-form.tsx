"use client";

import { useState } from "react";
import { AlertTriangleIcon, CheckCircle2Icon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from "@/components/ui/input-group";
import { mutationFee } from "@/lib/fees";
import { fmtFcfa } from "@/lib/labels";

type Api = { nup: string; commune: string; quartier: string; areaM2: number; pricePerM2: { low: number; high: number }; risk: { level: string; headline: string } };

export function MutationForm() {
  const [nup, setNup] = useState("");
  const [parcel, setParcel] = useState<Api>();
  const [price, setPrice] = useState("");
  const amount = Number(price) || 0;
  const fee = mutationFee(amount);
  const low = parcel ? parcel.pricePerM2.low * parcel.areaM2 : 0;

  async function load(v: string) {
    setNup(v);
    setParcel(undefined);
    if (v.length === 9) {
      const r = await fetch(`/api/parcels/${v}`);
      if (r.ok) setParcel(await r.json());
      else toast.error("Parcelle introuvable.");
    }
  }

  return (
    <form
      className="grid max-w-5xl gap-8 lg:grid-cols-2"
      onSubmit={(e) => {
        e.preventDefault();
        toast.success("Mutation transmise à l'ANDF via E-Notaire (démonstration). Délai : 72 h.");
      }}
    >
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="m-nup">Parcelle (NUP)</FieldLabel>
          <Input id="m-nup" inputMode="numeric" maxLength={9} value={nup} onChange={(e) => load(e.target.value.replace(/\D/g, ""))} className="tabular h-11 bg-card" />
          {parcel && <FieldDescription>{parcel.quartier}, {parcel.commune} · {parcel.risk.headline}</FieldDescription>}
        </Field>
        <Field>
          <FieldLabel htmlFor="m-seller">Vendeur (titulaire du TF)</FieldLabel>
          <Input id="m-seller" className="h-11 bg-card" />
        </Field>
        <Field>
          <FieldLabel htmlFor="m-buyer">Acquéreur</FieldLabel>
          <Input id="m-buyer" className="h-11 bg-card" />
        </Field>
        <Field>
          <FieldLabel htmlFor="m-price">Prix de vente</FieldLabel>
          <InputGroup className="h-11 bg-card">
            <InputGroupInput id="m-price" inputMode="numeric" value={price} onChange={(e) => setPrice(e.target.value.replace(/\D/g, ""))} className="tabular" />
            <InputGroupAddon align="inline-end"><InputGroupText>FCFA</InputGroupText></InputGroupAddon>
          </InputGroup>
        </Field>
        <Button type="submit" size="lg" className="h-11 w-fit px-5" disabled={!parcel || !amount || parcel.risk.level === "danger"}>Transmettre à l&apos;ANDF</Button>
        {parcel?.risk.level === "danger" && <p className="text-sm text-danger">Mutation impossible : {parcel.risk.headline.toLowerCase()}.</p>}
      </FieldGroup>
      <aside className="space-y-4">
        <div className="rounded-lg border bg-card p-5">
          <p className="text-sm text-muted-foreground">Frais ANDF</p>
          <p className="tabular text-3xl font-extrabold text-navy">{fmtFcfa(fee.total)}</p>
          {amount > 0 && <p className="mt-1 text-sm text-muted-foreground">{fee.rule} + 500 F de régie</p>}
        </div>
        {parcel && amount > 0 && (
          <div className={amount < low * 0.7 ? "flex gap-2 rounded-lg bg-caution-soft p-4 text-caution" : "flex gap-2 rounded-lg bg-clear-soft p-4 text-clear"}>
            {amount < low * 0.7 ? <AlertTriangleIcon className="mt-0.5 size-4 shrink-0" /> : <CheckCircle2Icon className="mt-0.5 size-4 shrink-0" />}
            <p className="text-sm">
              Estimation du secteur : {fmtFcfa(low)} – {fmtFcfa(parcel.pricePerM2.high * parcel.areaM2)}.{" "}
              {amount < low * 0.7 ? "Le prix déclaré paraît sous-évalué ; il sera signalé." : "Prix cohérent."}
            </p>
          </div>
        )}
      </aside>
    </form>
  );
}
