"use client";

import { useState } from "react";
import { AlertTriangleIcon, CheckCircle2Icon, XCircleIcon } from "lucide-react";
import { toast } from "sonner";
import { ParcelMap } from "@/components/map/parcel-map";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from "@/components/ui/input-group";
import { Progress } from "@/components/ui/progress";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import type { Precheck } from "@/lib/geo/precheck";
import { cn } from "@/lib/utils";

const EXAMPLE = "B1 427453.18 711291.12\nB2 427473.10 711292.86\nB3 427471.01 711316.77\nB4 427451.09 711315.03";
const ICON = { ok: CheckCircle2Icon, warn: AlertTriangleIcon, fail: XCircleIcon };
const TONE = { ok: "text-clear", warn: "text-caution", fail: "text-danger" };

type Parsed = { ring?: [number, number][]; error?: string };

export function SurveyImport() {
  const [text, setText] = useState("");
  const [declared, setDeclared] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Precheck & { ring: [number, number][] }>();
  const [parsed, setParsed] = useState<Parsed>({});

  async function run(src = text, decl = declared) {
    setLoading(true);
    setResult(undefined);
    // Bornes : « X Y » par ligne (UTM 31N), libellés de bornes tolérés
    const bornes = src
      .split(/\r?\n/)
      .map((l) => (l.match(/\d{6,7}(?:[.,]\d+)?/g) ?? []).map((n) => Number(n.replace(",", "."))))
      .filter((r) => r.length >= 2)
      .map((r) => [r[0], r[1]] as [number, number]);
    if (bornes.length < 3) {
      setLoading(false);
      return setParsed({ error: "Il faut au moins 3 bornes « X Y » en UTM 31N." });
    }
    const res = await fetch("/api/precheck", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ bornes, declaredM2: Number(decl) || undefined }) });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) return setParsed({ error: data.error });
    const { utmToLonLat } = await import("@/lib/survey");
    const ring = bornes.map(([x, y]) => utmToLonLat(x, y));
    ring.push(ring[0]);
    setParsed({ ring });
    setResult({ ...data, ring });
  }

  async function fromPdf(file: File) {
    const form = new FormData();
    form.append("file", file);
    const d = await (await fetch("/api/documents/extract", { method: "POST", body: form })).json();
    if (!d.bornes?.length) return toast.error("Aucun tableau de bornes trouvé dans ce document.");
    const src = d.bornes.map(([x, y]: number[], i: number) => `B${i + 1} ${x.toFixed(2)} ${y.toFixed(2)}`).join("\n");
    setText(src);
    setDeclared(d.declaredM2 ? String(d.declaredM2) : "");
    run(src, d.declaredM2 ? String(d.declaredM2) : "");
  }

  const blocking = result?.checks.some((c) => c.status === "fail");

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="space-y-5">
        <Field>
          <FieldLabel htmlFor="survey">Bornes du levé (UTM 31N)</FieldLabel>
          <Textarea id="survey" rows={7} value={text} onChange={(e) => setText(e.target.value)} className="tabular bg-card font-mono text-sm" placeholder={"B1 427453.18 711291.12\nB2 …"} />
          <FieldDescription>Une borne par ligne. Vous pouvez aussi charger le PDF du plan : ses bornes sont lues automatiquement.</FieldDescription>
        </Field>
        <Field>
          <FieldLabel htmlFor="declared">Superficie portée sur le plan</FieldLabel>
          <InputGroup className="h-10 max-w-56 bg-card">
            <InputGroupInput id="declared" inputMode="numeric" value={declared} onChange={(e) => setDeclared(e.target.value.replace(/\D/g, ""))} className="tabular" />
            <InputGroupAddon align="inline-end"><InputGroupText>m²</InputGroupText></InputGroupAddon>
          </InputGroup>
        </Field>
        <div className="flex flex-wrap gap-2">
          <Button onClick={() => run()} disabled={loading || !text.trim()}>{loading && <Spinner />} Pré-contrôler le plan</Button>
          <label className="inline-flex h-8 cursor-pointer items-center rounded-lg border bg-card px-3 text-sm font-medium hover:bg-muted">
            Charger le PDF du plan
            <input type="file" accept="application/pdf" className="sr-only" onChange={(e) => { const f = e.target.files?.[0]; e.target.value = ""; if (f) fromPdf(f); }} />
          </label>
          <Button variant="ghost" onClick={() => { setText(EXAMPLE); setDeclared("480"); run(EXAMPLE, "480"); }}>Exemple</Button>
        </div>
        {parsed.error && <p className="rounded-md bg-danger-soft px-3 py-2 text-sm text-danger">{parsed.error}</p>}

        {result && (
          <section className="space-y-4 rounded-lg border bg-card p-5">
            <div>
              <div className="flex items-baseline justify-between gap-3">
                <h2 className="font-bold text-navy">Pré-contrôle ANDF</h2>
                <span className={cn("tabular text-sm font-semibold", result.rejectRisk > 0.6 ? "text-danger" : result.rejectRisk > 0.3 ? "text-caution" : "text-clear")}>
                  Risque de rejet : {Math.round(result.rejectRisk * 100)} %
                </span>
              </div>
              <Progress value={result.rejectRisk * 100} className="mt-2" aria-label="Risque de rejet" />
            </div>
            <ul className="space-y-3">
              {result.checks.map((c) => {
                const Icon = ICON[c.status];
                return (
                  <li key={c.id} className="flex gap-3 text-sm">
                    <Icon className={cn("mt-0.5 size-4 shrink-0", TONE[c.status])} />
                    <div>
                      <p className="font-semibold">{c.label}</p>
                      <p className="text-muted-foreground">{c.detail}</p>
                      {c.fix && c.status !== "ok" && <p className="mt-0.5 font-medium">{c.fix}</p>}
                    </div>
                  </li>
                );
              })}
            </ul>
            {result.context && (
              <p className="border-t pt-3 text-xs text-muted-foreground">
                Appris sur {new Intl.NumberFormat("fr-FR").format(result.context.plans)} plans déposés à {result.context.commune} : {Math.round(result.context.rejectRate * 100)} % rejetés.
                Premiers motifs : {result.context.topReasons.map((r) => `${r.label.toLowerCase()} (${Math.round(r.share * 100)} %)`).join(", ")}.
              </p>
            )}
            <Button disabled={blocking} onClick={() => toast.success("Plan transmis au cadastre avec son rapport de pré-contrôle (démonstration).")}>
              {blocking ? "À corriger avant transmission" : "Transmettre au cadastre"}
            </Button>
          </section>
        )}
      </div>
      <div className="aspect-square overflow-hidden rounded-lg border lg:sticky lg:top-20">
        {parsed.ring ? (
          <ParcelMap
            key={parsed.ring.flat().join()}
            parcels={[{ nup: "levé", polygon: parsed.ring, level: blocking ? "danger" : result && result.rejectRisk > 0.3 ? "caution" : "clear" }]}
            selected="levé"
            layers={result?.hits.map((h) => h.layerId) ?? []}
            padding={80}
            label="Levé importé sur imagerie satellite"
          />
        ) : (
          <div className="grid size-full place-items-center bg-sky p-8 text-center text-sm text-muted-foreground">Le levé s&apos;affichera ici avec les couches de l&apos;ANDF qu&apos;il touche.</div>
        )}
      </div>
    </div>
  );
}
