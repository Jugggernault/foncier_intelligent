"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2Icon, SmartphoneIcon } from "lucide-react";
import { DocumentAnalyzer, type DocResult } from "@/components/app/document-analyzer";
import { Button, buttonVariants } from "@/components/ui/button";
import { Field, FieldDescription, FieldLabel, FieldLegend, FieldSet } from "@/components/ui/field";
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from "@/components/ui/input-group";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Spinner } from "@/components/ui/spinner";
import { mockAnalyze } from "@/lib/doc-mock";
import { fmtFcfa } from "@/lib/labels";
import { cn } from "@/lib/utils";

type Kind = "titre" | "appartenance" | "etat-descriptif";

const KINDS: Record<Kind, { label: string; hint: string; fee: number; delay: string; docs: string[] }> = {
  titre: {
    label: "Demande de titre foncier",
    hint: "Faire confirmer votre propriété.",
    fee: 100000,
    delay: "120 jours",
    docs: ["Pièce d'identité", "Acte de présomption de propriété (attestation de détention coutumière…)", "Convention de vente", "Levé topographique"],
  },
  appartenance: {
    label: "Certificat d'appartenance",
    hint: "Vendre pendant que le titre est en cours.",
    fee: 50500,
    delay: "10 jours",
    docs: ["Pièce d'identité", "Acte de présomption de propriété", "Levé topographique géoréférencé", "Promesse de vente notariée"],
  },
  "etat-descriptif": { label: "État descriptif", hint: "Connaître le titulaire et les charges d'un titre.", fee: 5500, delay: "24 heures", docs: ["Pièce d'identité"] },
};

const STEPS = ["Démarche", "Pièces", "Récapitulatif", "Paiement", "Envoyé"];

export function DossierWizard({ ownedNups }: { ownedNups: string[] }) {
  const [step, setStep] = useState(0);
  const [kind, setKind] = useState<Kind>("titre");
  const [nup, setNup] = useState(ownedNups[1] ?? "");
  const [docs, setDocs] = useState<(DocResult | undefined)[]>([]);
  const [phone, setPhone] = useState("97 00 00 00");
  const [paying, setPaying] = useState(false);
  const [ref, setRef] = useState("");
  const k = KINDS[kind];
  const ready = docs.filter(Boolean).length === k.docs.length;
  const blocking = docs.some((d) => d?.status === "error");

  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <div className="mb-2 flex justify-between text-xs text-muted-foreground">
          {STEPS.map((s, i) => (
            <span key={s} className={cn(i === step && "font-semibold text-navy")}>{s}</span>
          ))}
        </div>
        <Progress value={((step + 1) / STEPS.length) * 100} aria-label={`Étape ${step + 1} sur ${STEPS.length}`} />
      </div>

      {step === 0 && (
        <div className="space-y-6">
          <FieldSet>
            <FieldLegend className="text-base font-semibold">Quelle démarche ?</FieldLegend>
            <RadioGroup value={kind} onValueChange={(v) => setKind(v as Kind)}>
              {(Object.keys(KINDS) as Kind[]).map((key) => (
                <Field key={key} orientation="horizontal" className="rounded-lg border bg-card p-4">
                  <RadioGroupItem value={key} id={`k-${key}`} />
                  <FieldLabel htmlFor={`k-${key}`} className="flex-1 flex-col items-start gap-0.5 font-normal">
                    <span className="font-semibold">{KINDS[key].label}</span>
                    <span className="text-sm text-muted-foreground">{KINDS[key].hint} · {KINDS[key].delay} · {fmtFcfa(KINDS[key].fee)}</span>
                  </FieldLabel>
                </Field>
              ))}
            </RadioGroup>
            <FieldDescription>La mutation après une vente est déposée par votre notaire.</FieldDescription>
          </FieldSet>
          <Field>
            <FieldLabel htmlFor="d-nup">Parcelle concernée (NUP)</FieldLabel>
            <InputGroup className="h-11 bg-card">
              <InputGroupInput id="d-nup" inputMode="numeric" maxLength={9} value={nup} onChange={(e) => setNup(e.target.value.replace(/\D/g, ""))} className="tabular" />
            </InputGroup>
          </Field>
          <Button size="lg" className="h-11 px-5" disabled={nup.length !== 9} onClick={() => setStep(1)}>Continuer</Button>
        </div>
      )}

      {step === 1 && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-navy">Pièces à fournir</h2>
          <DocumentAnalyzer key={kind} documents={k.docs} analyze={(name, i) => mockAnalyze(name, i)} onChange={setDocs} />
          {blocking && <p className="rounded-md bg-danger-soft px-4 py-3 text-sm text-danger">Une pièce bloque le dépôt. Remplacez-la avant de continuer.</p>}
          <div className="flex gap-2">
            <Button variant="outline" size="lg" className="h-11" onClick={() => setStep(0)}>Retour</Button>
            <Button size="lg" className="h-11 px-5" disabled={!ready || blocking} onClick={() => setStep(2)}>Continuer</Button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-navy">Récapitulatif</h2>
          <dl className="divide-y rounded-lg border bg-card">
            {[
              ["Démarche", k.label],
              ["Parcelle", nup],
              ["Pièces", `${k.docs.length} lues et contrôlées${docs.some((d) => d?.status === "warning") ? " (avec remarques)" : ""}`],
              ["Délai indicatif", k.delay],
              ["Frais ANDF", fmtFcfa(k.fee)],
            ].map(([a, b]) => (
              <div key={a} className="flex justify-between gap-4 px-5 py-3 text-sm">
                <dt className="text-muted-foreground">{a}</dt>
                <dd className="tabular font-semibold">{b}</dd>
              </div>
            ))}
          </dl>
          <p className="text-sm text-muted-foreground">Le dossier sera transmis au portail national des e-services avec votre NPI.</p>
          <div className="flex gap-2">
            <Button variant="outline" size="lg" className="h-11" onClick={() => setStep(1)}>Retour</Button>
            <Button size="lg" className="h-11 px-5" onClick={() => setStep(3)}>Payer {fmtFcfa(k.fee)}</Button>
          </div>
        </div>
      )}

      {step === 3 && (
        <form
          className="space-y-6"
          onSubmit={(e) => {
            e.preventDefault();
            setPaying(true);
            // ponytail: paiement simulé ; sandbox FedaPay / Kkiapay prévue (DATA_SOURCES.md § 3.3)
            setTimeout(() => {
              setPaying(false);
              setRef(`D-2026-0${4200 + Math.floor(Math.random() * 800)}`);
              setStep(4);
            }, 1600);
          }}
        >
          <h2 className="text-xl font-bold text-navy">Paiement Mobile Money</h2>
          <Field>
            <FieldLabel htmlFor="phone">Numéro MTN MoMo ou Moov Money</FieldLabel>
            <InputGroup className="h-11 bg-card">
              <InputGroupAddon><InputGroupText>+229 01</InputGroupText></InputGroupAddon>
              <InputGroupInput id="phone" inputMode="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="tabular" />
            </InputGroup>
            <FieldDescription>Vous recevrez une demande de confirmation sur votre téléphone.</FieldDescription>
          </Field>
          <Button type="submit" size="lg" className="h-11 bg-signal px-5 font-bold text-signal-ink hover:bg-[#ffe033]" disabled={paying}>
            {paying ? <Spinner /> : <SmartphoneIcon data-icon="inline-start" />}
            {paying ? "En attente de confirmation…" : `Payer ${fmtFcfa(k.fee)}`}
          </Button>
        </form>
      )}

      {step === 4 && (
        <div className="rounded-lg bg-clear-soft p-6 text-clear">
          <CheckCircle2Icon className="size-8" />
          <h2 className="mt-3 text-2xl font-extrabold">Dossier transmis</h2>
          <p className="mt-2">Numéro de dossier <span className="tabular font-semibold">{ref}</span>. Vous serez prévenue par SMS à chaque étape.</p>
          <Link href="/espace/dossiers" className={cn(buttonVariants({ size: "lg" }), "mt-5 h-11 px-5")}>Voir mes dossiers</Link>
        </div>
      )}
    </div>
  );
}
