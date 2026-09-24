"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRightIcon, FileDownIcon } from "lucide-react";
import { DocumentAnalyzer, type DocResult } from "@/components/app/document-analyzer";
import { LEVEL } from "@/components/parcel/verdict";
import { Button, buttonVariants } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { InputGroup, InputGroupInput } from "@/components/ui/input-group";
import { Progress } from "@/components/ui/progress";
import { Spinner } from "@/components/ui/spinner";
import { mockAnalyze, type ParcelFacts } from "@/lib/doc-mock";
import type { Assessment } from "@/lib/risk";
import { cn } from "@/lib/utils";

type ApiParcel = ParcelFacts & { quartier: string; risk: Assessment };

const DOCS = ["Pièce d'identité du vendeur", "Attestation de détention coutumière ou titre", "Convention de vente (projet)"];

export function VerificationWizard() {
  const [step, setStep] = useState(0);
  const [nup, setNup] = useState("");
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [parcel, setParcel] = useState<ApiParcel>();
  const [docs, setDocs] = useState<(DocResult | undefined)[]>([]);

  async function lookup() {
    setError(undefined);
    setLoading(true);
    const res = await fetch(`/api/parcels/${nup}`);
    setLoading(false);
    if (!res.ok) return setError((await res.json()).error);
    setParcel(await res.json());
    setStep(1);
  }

  const docIssues = docs.filter((d) => d && d.status !== "ok").length;
  const level = parcel ? (docs.some((d) => d?.status === "error") ? "danger" : parcel.risk.level === "clear" && docIssues ? "caution" : parcel.risk.level) : "clear";
  const Icon = LEVEL[level].icon;

  return (
    <div className="max-w-3xl">
      <Progress value={((step + 1) / 3) * 100} className="mb-8" aria-label={`Étape ${step + 1} sur 3`} />

      {step === 0 && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            lookup();
          }}
          className="space-y-4"
        >
          <h2 className="text-xl font-bold text-navy">1. Quelle parcelle vous propose-t-on ?</h2>
          <Field data-invalid={!!error || undefined}>
            <FieldLabel htmlFor="v-nup">NUP communiqué par le vendeur</FieldLabel>
            <InputGroup className="h-12 bg-card">
              <InputGroupInput id="v-nup" inputMode="numeric" maxLength={9} value={nup} onChange={(e) => setNup(e.target.value.replace(/\D/g, ""))} className="tabular text-lg" placeholder="9 chiffres" aria-invalid={!!error || undefined} />
            </InputGroup>
            {error && <FieldError>{error}</FieldError>}
          </Field>
          <div className="flex gap-2">
            <Button type="submit" size="lg" className="h-11 px-5" disabled={nup.length !== 9 || loading}>
              {loading && <Spinner />} Continuer
            </Button>
            <Button type="button" variant="ghost" size="lg" className="h-11" onClick={() => setNup("100666667")}>Exemple</Button>
          </div>
        </form>
      )}

      {step === 1 && parcel && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-navy">2. Les pièces du vendeur</h2>
          <p className="text-muted-foreground">Parcelle {parcel.nup}, {parcel.quartier}, {parcel.commune}.</p>
          <DocumentAnalyzer documents={DOCS} analyze={(name, i) => mockAnalyze(name, i, parcel)} onChange={setDocs} />
          <div className="flex gap-2">
            <Button variant="outline" size="lg" className="h-11" onClick={() => setStep(0)}>Retour</Button>
            <Button size="lg" className="h-11 px-5" disabled={docs.filter(Boolean).length < DOCS.length} onClick={() => setStep(2)}>
              Voir le résultat <ArrowRightIcon data-icon="inline-end" />
            </Button>
          </div>
        </div>
      )}

      {step === 2 && parcel && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-navy">3. Résultat</h2>
          <section className={cn("rounded-lg p-5", LEVEL[level].band)}>
            <div className="flex items-start gap-3">
              <Icon className="mt-0.5 size-7 shrink-0" />
              <div>
                <p className="text-xl font-extrabold">
                  {level === "danger" ? "N'achetez pas" : level === "caution" ? "Prudence avant de payer" : "Aucun signal d'alerte"}
                </p>
                <ul className="mt-3 space-y-2 text-sm leading-relaxed">
                  {parcel.risk.reasons.map((r) => <li key={r.text}>{r.text}</li>)}
                  {docs.filter((d) => d?.note).map((d) => <li key={d!.note}>{d!.note}</li>)}
                </ul>
              </div>
            </div>
          </section>
          <div className="flex flex-wrap gap-2">
            <Link href={`/parcelle/${parcel.nup}/rapport`} className={cn(buttonVariants({ size: "lg" }), "h-11 px-5")}>
              <FileDownIcon data-icon="inline-start" /> Rapport complet
            </Link>
            <Link href={`/assistant?q=${encodeURIComponent("Comment acheter en sécurité ?")}`} className={cn(buttonVariants({ variant: "outline", size: "lg" }), "h-11 px-5")}>
              Demander conseil
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
