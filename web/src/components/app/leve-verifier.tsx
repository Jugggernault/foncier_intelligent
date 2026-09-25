"use client";

import { useState } from "react";
import { CheckCircle2Icon, FileUpIcon, FileTextIcon } from "lucide-react";
import { ParcelMap } from "@/components/map/parcel-map";
import { LayerFindings } from "@/components/parcel/layer-findings";
import { LEVEL } from "@/components/parcel/verdict";
import { Button } from "@/components/ui/button";
import { Item, ItemActions, ItemContent, ItemDescription, ItemGroup, ItemMedia, ItemTitle } from "@/components/ui/item";
import { Spinner } from "@/components/ui/spinner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { LayerHit } from "@/lib/geo/layers";
import type { Reason, RiskLevel } from "@/lib/risk";
import { cn } from "@/lib/utils";

type Result = {
  source: "demo" | "pdf-text" | "inconnu";
  kind: string;
  title: string;
  fields: [string, string][];
  bornes: [number, number][];
  ring?: [number, number][];
  computedM2?: number;
  declaredM2?: number;
  hits: LayerHit[];
  reasons: Reason[];
};

export type DemoLeve = { file: string; title: string; scenario: string };

const STEPS = ["Lecture du document", "Croisement avec les 12 couches de l'ANDF", "Verdict"];

export function LeveVerifier({ demos }: { demos: DemoLeve[] }) {
  const [step, setStep] = useState(-1);
  const [result, setResult] = useState<Result>();
  const [error, setError] = useState<string>();

  async function analyse(file: File) {
    setError(undefined);
    setResult(undefined);
    setStep(0);
    const form = new FormData();
    form.append("file", file);
    const timer = setTimeout(() => setStep(1), 600);
    const res = await fetch("/api/documents/extract", { method: "POST", body: form });
    clearTimeout(timer);
    const data = await res.json();
    if (!res.ok) {
      setStep(-1);
      return setError(data.error ?? "Analyse impossible.");
    }
    setStep(2);
    setTimeout(() => {
      setResult(data);
      setStep(3);
    }, 400);
  }

  async function tryDemo(file: string) {
    const blob = await (await fetch(`/demo-docs/${file}`)).blob();
    analyse(new File([blob], file, { type: "application/pdf" }));
  }

  const level: RiskLevel = result?.reasons.some((r) => r.level === "danger") ? "danger" : result?.reasons.some((r) => r.level === "caution") ? "caution" : "clear";
  const areaGap = result?.computedM2 && result.declaredM2 ? (result.declaredM2 - result.computedM2) / result.computedM2 : 0;
  const Icon = LEVEL[level].icon;

  return (
    <div className="grid gap-10 lg:grid-cols-12">
      <div className="space-y-6 lg:col-span-5">
        <label className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed border-navy/30 bg-card px-6 py-10 text-center transition-colors hover:border-navy hover:bg-sky">
          <FileUpIcon className="size-8 text-navy" />
          <span className="font-display text-lg font-bold text-navy">Déposer le levé du vendeur</span>
          <span className="text-sm text-muted-foreground">PDF ou photo du plan avec le tableau des bornes. Le document n&apos;est pas conservé.</span>
          <input type="file" accept="application/pdf,image/*" className="sr-only" onChange={(e) => e.target.files?.[0] && analyse(e.target.files[0])} />
        </label>

        {step >= 0 && (
          <ol className="space-y-2" aria-live="polite">
            {STEPS.map((s, i) => (
              <li key={s} className={cn("flex items-center gap-2 text-sm", i > step && "text-muted-foreground")}>
                {i < step || step === 3 ? <CheckCircle2Icon className="size-4 text-clear" /> : i === step ? <Spinner /> : <span className="size-4 rounded-full border" />}
                {s}
              </li>
            ))}
          </ol>
        )}
        {error && <p className="rounded-md bg-danger-soft px-4 py-3 text-sm text-danger">{error}</p>}

        <div>
          <h2 className="text-sm font-semibold text-muted-foreground">Documents de démonstration</h2>
          <ItemGroup className="mt-3 gap-2">
            {demos.map((d) => (
              <Item key={d.file} variant="outline" size="sm" className="bg-card">
                <ItemMedia variant="icon"><FileTextIcon /></ItemMedia>
                <ItemContent>
                  <ItemTitle>{d.title}</ItemTitle>
                  <ItemDescription className="line-clamp-2">{d.scenario}</ItemDescription>
                </ItemContent>
                <ItemActions className="flex-col gap-1">
                  <Button size="sm" onClick={() => tryDemo(d.file)}>Analyser</Button>
                  <a href={`/demo-docs/${d.file}`} download className="text-xs text-navy underline-offset-4 hover:underline">Télécharger</a>
                </ItemActions>
              </Item>
            ))}
          </ItemGroup>
        </div>
      </div>

      <div className="space-y-6 lg:col-span-7">
        {!result && step < 0 && (
          <div className="grid aspect-[4/3] place-items-center rounded-lg bg-sky p-10 text-center text-muted-foreground">
            Le levé s&apos;affichera ici sur l&apos;image satellite, avec les couches de l&apos;ANDF qu&apos;il traverse.
          </div>
        )}
        {result && (
          <>
            {result.kind !== "leve" ? (
              <p className="rounded-lg bg-caution-soft p-5 text-caution">
                Aucun tableau de bornes n&apos;a été trouvé dans ce document. En démonstration, seuls les PDF numériques sont lus (pas encore d&apos;OCR pour les photos).
              </p>
            ) : (
              <>
                <section className={cn("rounded-lg p-5", LEVEL[level].band)}>
                  <div className="flex items-start gap-3">
                    <Icon className="mt-0.5 size-7 shrink-0" />
                    <div>
                      <p className="text-xl font-extrabold">
                        {level === "danger" ? "N'achetez pas ce terrain" : level === "caution" ? "Prudence : vérifiez avant de payer" : "Aucun signal d'alerte dans les couches de l'ANDF"}
                      </p>
                      <ul className="mt-3 space-y-2 text-sm leading-relaxed">
                        {result.reasons.map((r) => (
                          <li key={r.text}>
                            {r.text}
                            {r.action && <span className="block font-semibold">{r.action}</span>}
                          </li>
                        ))}
                        {Math.abs(areaGap) > 0.1 && (
                          <li>
                            Superficie déclarée ({result.declaredM2} m²) différente de la superficie calculée à partir des bornes ({result.computedM2} m²).
                            <span className="block font-semibold">Faites vérifier le bornage par un géomètre.</span>
                          </li>
                        )}
                      </ul>
                    </div>
                  </div>
                </section>
                <div className="aspect-[4/3] overflow-hidden rounded-lg border">
                  <ParcelMap
                    key={result.ring?.flat().join()}
                    parcels={result.ring ? [{ nup: "leve", polygon: result.ring, level }] : []}
                    selected="leve"
                    layers={result.hits.map((h) => h.layerId)}
                    padding={80}
                    label="Levé sur image satellite"
                  />
                </div>
                <LayerFindings hits={result.hits} />
                <div className="grid gap-6 sm:grid-cols-2">
                  <dl className="space-y-2 text-sm">
                    {result.fields.map(([k, v]) => (
                      <div key={k} className="flex justify-between gap-4">
                        <dt className="text-muted-foreground">{k}</dt>
                        <dd className="text-right font-medium">{v}</dd>
                      </div>
                    ))}
                    <div className="flex justify-between gap-4">
                      <dt className="text-muted-foreground">Superficie calculée</dt>
                      <dd className="tabular font-medium">{result.computedM2} m²</dd>
                    </div>
                    <p className="pt-2 text-xs text-muted-foreground">
                      {result.source === "demo" ? "Document de la base de démonstration (contenu connu)." : "Bornes lues dans la couche texte du PDF."}
                    </p>
                  </dl>
                  <div className="overflow-hidden rounded-lg border bg-card">
                    <Table>
                      <TableHeader><TableRow><TableHead className="pl-3">Borne</TableHead><TableHead className="text-right">X</TableHead><TableHead className="pr-3 text-right">Y</TableHead></TableRow></TableHeader>
                      <TableBody>
                        {result.bornes.map(([x, y], i) => (
                          <TableRow key={i}>
                            <TableCell className="pl-3">B{i + 1}</TableCell>
                            <TableCell className="tabular text-right">{x.toFixed(2)}</TableCell>
                            <TableCell className="tabular pr-3 text-right">{y.toFixed(2)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
