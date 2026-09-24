"use client";

import { useState } from "react";
import Link from "next/link";
import { AlertTriangleIcon, BotIcon, CheckCircle2Icon, CheckIcon, FileQuestionIcon, HistoryIcon, SendIcon, XCircleIcon, XIcon } from "lucide-react";
import { toast } from "sonner";
import { StatusBadge } from "@/components/app/workflow-bits";
import { ParcelExplorer } from "@/components/parcel/parcel-explorer";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { useIsMobile } from "@/hooks/use-mobile";
import type { CopilotOutput } from "@/lib/copilot";
import type { MapParcel } from "@/components/map/parcel-map";
import { KIND_LABEL, type Dossier, type DossierStatus } from "@/lib/data/workflow";
import { cn } from "@/lib/utils";

type Facts = [string, string][];

const DOC_ICON = { ok: CheckCircle2Icon, missing: FileQuestionIcon, suspect: AlertTriangleIcon, unreadable: XCircleIcon };
const DOC_TONE = { ok: "text-clear", missing: "text-caution", suspect: "text-danger", unreadable: "text-caution" };
const SEV = { haute: "bg-danger-soft text-danger", moyenne: "bg-caution-soft text-caution", basse: "bg-sky text-navy" };
const REC = {
  valider: { label: "Valider et publier", tone: "bg-clear-soft text-clear" },
  complement: { label: "Demander un complément", tone: "bg-caution-soft text-caution" },
  rejeter: { label: "Rejeter", tone: "bg-danger-soft text-danger" },
};

export function Workstation({ dossier, parcel, neighbours, facts, ai }: { dossier: Dossier; parcel: MapParcel; neighbours: MapParcel[]; facts: Facts; ai: CopilotOutput }) {
  const isMobile = useIsMobile();
  const [status, setStatus] = useState<DossierStatus>(dossier.status);
  const [docIndex, setDocIndex] = useState(0);
  const [draft, setDraft] = useState(ai.draft);
  const [feedback, setFeedback] = useState<Record<number, "ok" | "ko">>({});
  const doc = dossier.documents[docIndex];

  function decide(kind: keyof typeof REC) {
    const next: DossierStatus = kind === "valider" ? "publicite" : kind === "complement" ? "complement" : "rejete";
    setStatus(next);
    toast.success(
      `${REC[kind].label} : décision enregistrée${kind === ai.recommendation ? " (suggestion du copilote suivie)" : " (suggestion du copilote écartée)"}.`
    );
  }

  const documents = (
    <section className="flex h-full flex-col">
      <h2 className="border-b px-4 py-3 text-sm font-bold text-navy">Pièces</h2>
      <div className="flex gap-1 overflow-x-auto border-b p-2">
        {dossier.documents.map((d, i) => {
          const Icon = DOC_ICON[d.status];
          return (
            <button
              key={d.name}
              type="button"
              onClick={() => setDocIndex(i)}
              className={cn("flex shrink-0 items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium", i === docIndex ? "bg-navy text-white" : "hover:bg-muted")}
            >
              <Icon className={cn("size-3.5", i !== docIndex && DOC_TONE[d.status])} />
              {d.name}
            </button>
          );
        })}
      </div>
      <ScrollArea className="min-h-0 flex-1">
        <div className="p-4">
          {doc.status === "missing" ? (
            <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">Pièce non fournie par le demandeur.</div>
          ) : (
            <article className="rounded-md bg-white p-6 font-serif text-[13px] leading-relaxed text-neutral-800 shadow-[0_8px_24px_-12px_rgba(0,0,0,0.25)]">
              <p className="text-center text-xs tracking-widest uppercase">République du Bénin</p>
              <p className="mt-3 text-center font-bold">{doc.name}</p>
              <p className="mt-4">Parcelle NUP {dossier.nup}. Demandeur : {dossier.applicant}.</p>
              {doc.extracted &&
                Object.entries(doc.extracted).map(([k, v]) => (
                  <p key={k} className="mt-2">
                    {k} : <mark className="rounded-sm bg-signal/40 px-1">{v}</mark>
                  </p>
                ))}
              <p className="mt-6 text-right italic">Signature et cachet</p>
            </article>
          )}
          <div className="mt-4 space-y-2 text-sm">
            <p className="font-semibold">Lecture automatique</p>
            {doc.extracted ? (
              <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1">
                {Object.entries(doc.extracted).map(([k, v]) => (
                  <div key={k} className="contents">
                    <dt className="text-muted-foreground">{k}</dt>
                    <dd className="font-medium">{v}</dd>
                  </div>
                ))}
              </dl>
            ) : (
              <p className="text-muted-foreground">Aucun champ extrait.</p>
            )}
            {doc.note && <p className="rounded-md bg-danger-soft px-3 py-2 text-danger">{doc.note}</p>}
          </div>
        </div>
      </ScrollArea>
    </section>
  );

  const terrain = (
    <section className="flex h-full flex-col">
      <h2 className="border-b px-4 py-3 text-sm font-bold text-navy">Parcelle et terrain</h2>
      <ScrollArea className="min-h-0 flex-1">
        <div className="space-y-4 p-4">
          <ParcelExplorer parcel={parcel} neighbours={neighbours} />
          <dl className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
            {facts.map(([k, v]) => (
              <div key={k}>
                <dt className="text-xs text-muted-foreground">{k}</dt>
                <dd className="font-medium">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </ScrollArea>
    </section>
  );

  const copilotPanel = (
    <section className="flex h-full flex-col bg-sky/50">
      <h2 className="flex items-center gap-2 border-b px-4 py-3 text-sm font-bold text-navy">
        <BotIcon className="size-4" /> Copilote
      </h2>
      <ScrollArea className="min-h-0 flex-1">
        <div className="space-y-6 p-4">
          <div className="space-y-1.5 text-sm leading-relaxed">
            {ai.summary.map((s) => <p key={s}>{s}</p>)}
          </div>
          <div>
            <p className="text-sm font-semibold">Points d&apos;attention</p>
            <ul className="mt-2 space-y-2">
              {ai.anomalies.map((a, i) => (
                <li key={a.text} className="rounded-md border bg-card p-3 text-sm">
                  <div className="flex items-start justify-between gap-2">
                    <Badge className={cn("rounded-sm capitalize", SEV[a.severity])}>{a.severity}</Badge>
                    <span className="flex gap-1">
                      <Button variant={feedback[i] === "ok" ? "default" : "ghost"} size="icon-xs" aria-label="Pertinent" onClick={() => setFeedback({ ...feedback, [i]: "ok" })}><CheckIcon /></Button>
                      <Button variant={feedback[i] === "ko" ? "default" : "ghost"} size="icon-xs" aria-label="Non pertinent" onClick={() => setFeedback({ ...feedback, [i]: "ko" })}><XIcon /></Button>
                    </span>
                  </div>
                  <p className="mt-2">{a.text}</p>
                  <p className="mt-1 text-xs text-muted-foreground">Source : {a.source}</p>
                </li>
              ))}
              {!ai.anomalies.length && <li className="text-sm text-muted-foreground">Aucune anomalie détectée.</li>}
            </ul>
          </div>
          <div className={cn("rounded-md p-3 text-sm", REC[ai.recommendation].tone)}>
            <p className="font-semibold">Suggestion : {REC[ai.recommendation].label.toLowerCase()}</p>
            <p className="mt-1">{ai.rationale}</p>
          </div>
          <div>
            <p className="text-sm font-semibold">Projet de {ai.recommendation === "valider" ? "avis de publicité" : "lettre"}</p>
            <Textarea value={draft} onChange={(e) => setDraft(e.target.value)} rows={10} className="mt-2 bg-card text-sm" aria-label="Projet de document" />
            <p className="mt-1 text-xs text-muted-foreground">Généré à partir du dossier. Relisez et modifiez avant de signer.</p>
          </div>
        </div>
      </ScrollArea>
    </section>
  );

  return (
    <div className="flex h-[calc(100dvh-3.5rem)] flex-col">
      <div className="flex flex-wrap items-center gap-3 border-b bg-background px-4 py-3">
        <div className="mr-auto">
          <p className="tabular text-lg font-extrabold text-navy">{dossier.id} · {KIND_LABEL[dossier.kind]}</p>
          <p className="text-sm text-muted-foreground">{dossier.applicant} · parcelle {dossier.nup} · échéance {dossier.dueAt}</p>
        </div>
        <StatusBadge status={status} />
        <Link href={`/agent/dossiers/${dossier.id}/historique`} className={buttonVariants({ variant: "ghost", size: "sm" })}>
          <HistoryIcon /> Historique
        </Link>
        {(["complement", "rejeter", "valider"] as const).map((k) => (
          <AlertDialog key={k}>
            <AlertDialogTrigger
              render={
                <Button variant={k === "valider" ? "default" : k === "rejeter" ? "destructive" : "outline"} size="sm" className={cn(k === ai.recommendation && "ring-2 ring-signal")}>
                  {k === "valider" ? <SendIcon /> : null}
                  {REC[k].label}
                </Button>
              }
            />
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>{REC[k].label} ?</AlertDialogTitle>
                <AlertDialogDescription>
                  {k === "valider"
                    ? "L'avis de publicité sera publié pour 15 jours et les riverains abonnés seront prévenus."
                    : k === "complement"
                      ? "Le projet de lettre sera envoyé au demandeur dans son espace et par SMS."
                      : "Le demandeur sera informé du motif et des voies de recours."}{" "}
                  Votre décision et la suggestion du copilote sont journalisées.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Annuler</AlertDialogCancel>
                <AlertDialogAction onClick={() => decide(k)}>Confirmer</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        ))}
      </div>
      {isMobile ? (
        <div className="flex-1 space-y-2 overflow-y-auto">
          <div className="min-h-[70dvh]">{copilotPanel}</div>
          <div className="min-h-[70dvh]">{terrain}</div>
          <div className="min-h-[70dvh]">{documents}</div>
        </div>
      ) : (
        <ResizablePanelGroup orientation="horizontal" className="min-h-0 flex-1">
          <ResizablePanel defaultSize="30%" minSize="20%">{documents}</ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize="36%" minSize="25%">{terrain}</ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize="34%" minSize="22%">{copilotPanel}</ResizablePanel>
        </ResizablePanelGroup>
      )}
    </div>
  );
}
