"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2Icon, InfoIcon, XCircleIcon } from "lucide-react";
import { Field, FieldLabel, FieldLegend, FieldSet } from "@/components/ui/field";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";

type Nationality = "beninois" | "reciprocite" | "sans-reciprocite";
type Area = "urbain" | "rural";
type Size = "lt2" | "2-20" | "20-500" | "gt500";

type Line = { tone: "ok" | "no" | "info"; text: string; href?: string };

/** Règles du Code foncier : qui peut acheter quoi (TR-06). */
export function rules(n: Nationality, a: Area, s: Size): Line[] {
  if (a === "urbain") {
    if (n === "sans-reciprocite")
      return [
        { tone: "no", text: "Achat impossible : votre pays n'applique pas la réciprocité avec le Bénin." },
        { tone: "info", text: "Vous pouvez prendre un bail de 50 ans maximum, non renouvelable." },
      ];
    return [
      { tone: "ok", text: "Vous pouvez acheter cette parcelle, par acte notarié." },
      { tone: "info", text: "Vérifiez d'abord la parcelle et demandez un état descriptif.", href: "/recherche" },
    ];
  }
  if (n !== "beninois")
    return [
      { tone: "no", text: "Achat impossible : les terres rurales sont réservées aux personnes de nationalité béninoise." },
      { tone: "info", text: "Un bail de 50 ans maximum, non renouvelable, reste possible." },
    ];
  const out: Line[] = [{ tone: "ok", text: "Vous pouvez acheter cette terre rurale." }];
  if (s !== "lt2") out.push({ tone: "info", text: "À partir de 2 ha, l'ANDF peut exercer son droit de préemption et doit viser la vente." });
  if (s === "20-500")
    out.push({ tone: "info", text: "Au-delà de 20 ha, faites approuver votre projet de mise en valeur par l'ANDF et prouvez l'origine des fonds." });
  if (s === "gt500") out.push({ tone: "info", text: "Au-delà de 500 ha, le projet est soumis au Conseil des ministres sur avis de l'ANDF." });
  out.push({ tone: "info", text: "Consultez le guide de l'achat en milieu rural.", href: "/guides/acheter-a-la-campagne" });
  return out;
}

const ICON = { ok: CheckCircle2Icon, no: XCircleIcon, info: InfoIcon };
const TONE = { ok: "text-clear", no: "text-danger", info: "text-navy" };

export function Eligibility() {
  const [n, setN] = useState<Nationality>("beninois");
  const [a, setA] = useState<Area>("urbain");
  const [s, setS] = useState<Size>("lt2");

  return (
    <div className="grid gap-10 lg:grid-cols-2">
      <div className="space-y-8">
        <Question legend="Votre nationalité" value={n} onChange={(v) => setN(v as Nationality)} options={[
          ["beninois", "Béninoise"],
          ["reciprocite", "Étrangère, pays qui applique la réciprocité"],
          ["sans-reciprocite", "Étrangère, pays sans réciprocité"],
        ]} />
        <Question legend="Où se trouve le terrain ?" value={a} onChange={(v) => setA(v as Area)} options={[
          ["urbain", "En ville (milieu urbain)"],
          ["rural", "À la campagne (milieu rural)"],
        ]} />
        {a === "rural" && (
          <Question legend="Surface" value={s} onChange={(v) => setS(v as Size)} options={[
            ["lt2", "Moins de 2 ha"],
            ["2-20", "De 2 à 20 ha"],
            ["20-500", "De 20 à 500 ha"],
            ["gt500", "Plus de 500 ha"],
          ]} />
        )}
      </div>
      <div aria-live="polite" className="rounded-lg bg-sky p-6 sm:p-8">
        <h2 className="text-xl font-bold text-navy">Réponse</h2>
        <ul className="mt-5 space-y-4">
          {rules(n, a, s).map((l) => {
            const Icon = ICON[l.tone];
            return (
              <li key={l.text} className="flex gap-3">
                <Icon className={cn("mt-0.5 size-5 shrink-0", TONE[l.tone])} />
                <p className={cn("leading-relaxed", l.tone !== "info" && "font-semibold")}>
                  {l.href ? (
                    <Link href={l.href} className="underline underline-offset-4">
                      {l.text}
                    </Link>
                  ) : (
                    l.text
                  )}
                </p>
              </li>
            );
          })}
        </ul>
        <p className="mt-6 border-t border-sky-line pt-4 text-xs text-muted-foreground">
          Source : Code foncier et domanial (conditions d&apos;accès au foncier) et décision ANDF du 27 décembre 2024. Information générale, pas un conseil juridique.
        </p>
      </div>
    </div>
  );
}

function Question({ legend, value, onChange, options }: { legend: string; value: string; onChange: (v: string) => void; options: [string, string][] }) {
  return (
    <FieldSet>
      <FieldLegend className="text-base font-semibold">{legend}</FieldLegend>
      <RadioGroup value={value} onValueChange={(v) => onChange(String(v))}>
        {options.map(([v, label]) => (
          <Field key={v} orientation="horizontal">
            <RadioGroupItem value={v} id={`q-${v}`} />
            <FieldLabel htmlFor={`q-${v}`} className="font-normal">
              {label}
            </FieldLabel>
          </Field>
        ))}
      </RadioGroup>
    </FieldSet>
  );
}
