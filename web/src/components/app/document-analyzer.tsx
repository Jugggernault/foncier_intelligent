"use client";

import { useEffect, useRef, useState } from "react";
import { AlertTriangleIcon, CheckCircle2Icon, FileUpIcon, ScanTextIcon, XCircleIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Item, ItemActions, ItemContent, ItemDescription, ItemGroup, ItemMedia, ItemTitle } from "@/components/ui/item";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";

export type DocResult = {
  status: "ok" | "warning" | "error";
  fields: [string, string][];
  note?: string;
};

type Slot = { name: string; file?: string; state: "empty" | "reading" | "done"; result?: DocResult };

/**
 * Lecture de pièces (IA-07/IA-08), simulée : chaque pièce déposée est « lue » puis contrôlée.
 * ponytail: `analyze` sera remplacé par POST /api/documents/extract (OCR + LLM multimodal).
 */
export function DocumentAnalyzer({
  documents,
  analyze,
  onChange,
}: {
  documents: string[];
  analyze: (name: string, index: number) => DocResult;
  onChange?: (results: (DocResult | undefined)[]) => void;
}) {
  const [slots, setSlots] = useState<Slot[]>(documents.map((name) => ({ name, state: "empty" })));
  const onChangeRef = useRef(onChange);
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);
  useEffect(() => {
    onChangeRef.current?.(slots.map((x) => x.result));
  }, [slots]);

  function read(i: number, file: string) {
    setSlots((s) => s.map((x, j) => (j === i ? { ...x, file, state: "reading" } : x)));
    setTimeout(() => {
      setSlots((s) => s.map((x, j) => (j === i ? { ...x, state: "done" as const, result: analyze(x.name, j) } : x)));
    }, 900 + i * 250);
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">Photographiez ou déposez chaque pièce. Elle est lue automatiquement.</p>
        <Button variant="outline" size="sm" onClick={() => slots.forEach((s, i) => s.state === "empty" && read(i, `exemple-${i + 1}.jpg`))}>
          Utiliser des pièces d&apos;exemple
        </Button>
      </div>
      <ItemGroup className="mt-4 gap-2">
        {slots.map((s, i) => (
          <Item key={s.name} variant="outline" className="items-start bg-card">
            <ItemMedia variant="icon" className={cn(s.result && TONE[s.result.status])}>
              {s.state === "reading" ? <Spinner /> : s.result ? ICON[s.result.status] : <FileUpIcon />}
            </ItemMedia>
            <ItemContent>
              <ItemTitle>{s.name}</ItemTitle>
              <ItemDescription>
                {s.state === "empty" && "À déposer"}
                {s.state === "reading" && `Lecture de ${s.file}…`}
                {s.state === "done" && s.file}
              </ItemDescription>
              {s.result && (
                <div className="mt-2 space-y-2">
                  {s.result.fields.length > 0 && (
                    <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-sm">
                      {s.result.fields.map(([k, v]) => (
                        <div key={k} className="contents">
                          <dt className="text-muted-foreground">{k}</dt>
                          <dd className="font-medium">{v}</dd>
                        </div>
                      ))}
                    </dl>
                  )}
                  {s.result.note && <p className={cn("rounded-md px-3 py-2 text-sm", BG[s.result.status])}>{s.result.note}</p>}
                </div>
              )}
            </ItemContent>
            <ItemActions>
              <label className="cursor-pointer rounded-md border px-3 py-1.5 text-sm font-medium transition-colors hover:bg-muted">
                <ScanTextIcon className="mr-1.5 inline size-4" />
                {s.state === "empty" ? "Déposer" : "Remplacer"}
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  capture="environment"
                  className="sr-only"
                  onChange={(e) => e.target.files?.[0] && read(i, e.target.files[0].name)}
                />
              </label>
            </ItemActions>
          </Item>
        ))}
      </ItemGroup>
    </div>
  );
}

const ICON = { ok: <CheckCircle2Icon />, warning: <AlertTriangleIcon />, error: <XCircleIcon /> };
const TONE = { ok: "text-clear", warning: "text-caution", error: "text-danger" };
const BG = { ok: "bg-clear-soft text-clear", warning: "bg-caution-soft text-caution", error: "bg-danger-soft text-danger" };
