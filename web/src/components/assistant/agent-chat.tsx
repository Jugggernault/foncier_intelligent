"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, lastAssistantMessageIsCompleteWithApprovalResponses } from "ai";
import { ArrowRightIcon, ArrowUpIcon, CheckCircle2Icon, InfoIcon, MicIcon, PaperclipIcon, ScaleIcon, Volume2Icon, XCircleIcon } from "lucide-react";
import { ParcelMap } from "@/components/map/parcel-map";
import { LEVEL } from "@/components/parcel/verdict";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupTextarea } from "@/components/ui/input-group";
import { Spinner } from "@/components/ui/spinner";
import type { IlemiMessage } from "@/lib/agent/ilemi";
import { LAYER_COLOR } from "@/lib/geo/palette";
import { fmtArea, fmtFcfa } from "@/lib/labels";
import type { RiskLevel } from "@/lib/risk";
import { cn } from "@/lib/utils";

type Part = IlemiMessage["parts"][number];
type Couche = { id: string; label: string; severity: string; part: number };

const STARTERS = [
  "Vérifie la parcelle 101236198",
  "Analyse le levé leve-calavi-tankpe.pdf",
  "Je suis Togolais, puis-je acheter à Cotonou ?",
  "Combien coûte la mutation d'un terrain à 25 millions ?",
];

const LOADING: Record<string, string> = {
  verifierParcelle: "Ilèmi croise la parcelle avec les couches de l'ANDF…",
  analyserLeve: "Ilèmi lit le levé et le place sur la carte…",
  publiciteProche: "Ilèmi consulte la publicité foncière…",
  calculerFrais: "Ilèmi applique le barème de l'ANDF…",
  verifierEligibilite: "Ilèmi applique le Code foncier…",
  chercherTextes: "Ilèmi consulte les textes…",
  preparerDossier: "Ilèmi prépare le dossier…",
  redigerOpposition: "Ilèmi rédige la lettre…",
  surveillerParcelle: "Ilèmi active la surveillance…",
};

/** Mise en forme minimale du texte du modèle : paragraphes et **gras**. */
function RichText({ text }: { text: string }) {
  return (
    <div className="space-y-2 leading-relaxed">
      {text.split(/\n{2,}/).map((para, i) => (
        <p key={i} className="whitespace-pre-wrap">
          {para.split(/(\*\*[^*]+\*\*)/g).map((s, j) => (s.startsWith("**") ? <strong key={j}>{s.slice(2, -2)}</strong> : s))}
        </p>
      ))}
    </div>
  );
}

function VerdictMini({ level, headline, reasons }: { level: RiskLevel; headline: string; reasons: { text: string }[] }) {
  const Icon = LEVEL[level].icon;
  return (
    <div className={cn("rounded-md p-3", LEVEL[level].band)}>
      <p className="flex items-center gap-2 font-bold"><Icon className="size-5" />{headline}</p>
      <ul className="mt-2 space-y-1 text-sm">{reasons.slice(0, 4).map((r) => <li key={r.text}>{r.text}</li>)}</ul>
    </div>
  );
}

function Couches({ couches }: { couches: Couche[] }) {
  if (!couches.length) return <p className="text-sm text-muted-foreground">Aucune couche ANDF ne touche cette emprise.</p>;
  return (
    <div className="flex flex-wrap gap-1.5">
      {couches.map((c) => (
        <Badge key={c.id} variant="outline" className="gap-1.5 rounded-sm bg-card">
          <span className="size-2.5 rounded-sm" style={{ backgroundColor: LAYER_COLOR[c.id] }} />
          {c.label} · {Math.max(1, Math.round(c.part * 100))} %
        </Badge>
      ))}
    </div>
  );
}

function MiniMap({ id, polygon, level, couches }: { id: string; polygon: [number, number][]; level: RiskLevel; couches: Couche[] }) {
  return (
    <div className="aspect-[16/9] overflow-hidden rounded-md border">
      <ParcelMap parcels={[{ nup: id, polygon, level }]} selected={id} layers={couches.map((c) => c.id)} padding={60} maxZoom={16} label={`Carte de ${id}`} />
    </div>
  );
}

function ToolCard({ part, onApprove }: { part: Part; onApprove: (id: string, approved: boolean) => void }) {
  if (!part.type.startsWith("tool-")) return null;
  const name = part.type.slice(5);
  const p = part as Extract<Part, { type: `tool-${string}` }>;
  const card = "space-y-3 rounded-lg border bg-card p-4";

  if (p.state === "input-streaming" || p.state === "input-available")
    return <p className="flex items-center gap-2 text-sm text-muted-foreground"><Spinner />{LOADING[name] ?? "Ilèmi travaille…"}</p>;
  if (p.state === "output-error") return <p className="text-sm text-danger">L&apos;outil a échoué : {p.errorText}</p>;
  if (p.state === "output-denied") return <p className="flex items-center gap-2 text-sm text-muted-foreground"><XCircleIcon className="size-4" />Action annulée.</p>;

  if (p.state === "approval-requested") {
    const input = p.input as Record<string, string>;
    const what = { preparerDossier: `Préparer un dossier « ${input.type} » pour la parcelle ${input.nup}`, redigerOpposition: `Rédiger une opposition sur la parcelle ${input.nup}`, surveillerParcelle: `Surveiller la parcelle ${input.nup} (SMS, WhatsApp)` }[name] ?? "Exécuter cette action";
    return (
      <div className={cn(card, "border-navy/30")}>
        <p className="font-semibold">Ilèmi vous demande votre accord</p>
        <p className="text-sm">{what}{name === "redigerOpposition" && input.motif ? ` : ${input.motif}` : ""}.</p>
        <div className="flex gap-2">
          <Button size="sm" onClick={() => onApprove(p.approval.id, true)}>Confirmer</Button>
          <Button size="sm" variant="outline" onClick={() => onApprove(p.approval.id, false)}>Annuler</Button>
        </div>
      </div>
    );
  }
  if (p.state !== "output-available") return null;
  const out = p.output as unknown;

  switch (name) {
    case "verifierParcelle": {
      const o = out as unknown as { trouve: boolean; nup: string; lieu: string; superficieM2: number; situation: string; polygone: [number, number][]; verdict: { level: RiskLevel; headline: string; reasons: { text: string }[] }; couches: Couche[] };
      if (!o.trouve) return <p className={card}>Parcelle {o.nup} introuvable dans la démonstration.</p>;
      return (
        <div className={card}>
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <p className="tabular font-display text-lg font-extrabold text-navy">{o.nup}</p>
            <p className="text-sm text-muted-foreground">{o.lieu} · {fmtArea(o.superficieM2)} · {o.situation}</p>
          </div>
          <MiniMap id={o.nup} polygon={o.polygone} level={o.verdict.level} couches={o.couches} />
          <VerdictMini {...o.verdict} />
          <Couches couches={o.couches} />
          <Link href={`/parcelle/${o.nup}`} className={cn(buttonVariants({ variant: "link" }), "h-auto px-0")}>Fiche complète <ArrowRightIcon data-icon="inline-end" /></Link>
        </div>
      );
    }
    case "analyserLeve": {
      const o = out as unknown as { trouve: boolean; titre: string; lieu: string; polygone: [number, number][]; superficieCalculee: number; superficieDeclaree: number; raisons: { level: RiskLevel; text: string }[]; couches: Couche[]; disponibles?: string[] };
      if (!o.trouve) return <p className={card}>Levé introuvable. Documents disponibles : {o.disponibles?.join(", ")}</p>;
      const level: RiskLevel = o.raisons.some((r) => r.level === "danger") ? "danger" : o.raisons.some((r) => r.level === "caution") ? "caution" : "clear";
      return (
        <div className={card}>
          <p className="font-semibold">{o.titre} <span className="font-normal text-muted-foreground">· {o.lieu}</span></p>
          <MiniMap id="leve" polygon={o.polygone} level={level} couches={o.couches} />
          <VerdictMini level={level} headline={level === "danger" ? "N'achetez pas ce terrain" : level === "caution" ? "Prudence avant de payer" : "Aucun signal dans les couches ANDF"} reasons={o.raisons} />
          <p className="text-sm">Superficie calculée <strong className="tabular">{o.superficieCalculee} m²</strong>, déclarée <strong className="tabular">{o.superficieDeclaree} m²</strong>.</p>
          <Couches couches={o.couches} />
        </div>
      );
    }
    case "publiciteProche": {
      const o = out as unknown as { avis: { nup: string; lieu: string; fin: string; ouvert: boolean }[] };
      return (
        <div className={card}>
          <p className="font-semibold">Publicité foncière à proximité</p>
          {o.avis.length ? (
            <ul className="space-y-1 text-sm">
              {o.avis.map((a) => (
                <li key={a.nup} className="flex justify-between gap-3">
                  <Link href={`/publicite/${a.nup}`} className="tabular text-navy hover:underline">{a.nup}</Link>
                  <span className="text-muted-foreground">{a.lieu} · {a.ouvert ? `opposition jusqu'au ${a.fin}` : "clos"}</span>
                </li>
              ))}
            </ul>
          ) : <p className="text-sm text-muted-foreground">Aucun avis à proximité.</p>}
        </div>
      );
    }
    case "calculerFrais": {
      const o = out as unknown as { prix: number; total: number; rule: string };
      return (
        <div className={card}>
          <p className="text-sm text-muted-foreground">Frais ANDF pour {fmtFcfa(o.prix)}</p>
          <p className="tabular font-display text-2xl font-extrabold text-navy">{fmtFcfa(o.total)}</p>
          <p className="text-sm text-muted-foreground">{o.rule} + 500 F de régie</p>
        </div>
      );
    }
    case "verifierEligibilite": {
      const o = out as unknown as { reponses: { tone: "ok" | "no" | "info"; text: string }[] };
      return (
        <ul className={cn(card, "space-y-2")}>
          {o.reponses.map((r) => (
            <li key={r.text} className="flex gap-2 text-sm">
              {r.tone === "ok" ? <CheckCircle2Icon className="size-4 shrink-0 text-clear" /> : r.tone === "no" ? <XCircleIcon className="size-4 shrink-0 text-danger" /> : <InfoIcon className="size-4 shrink-0 text-navy" />}
              {r.text}
            </li>
          ))}
        </ul>
      );
    }
    case "chercherTextes": {
      const o = out as unknown as { sources: string[]; guides: { titre: string; lien: string }[] };
      if (!o.sources.length && !o.guides.length) return null;
      return (
        <div className="space-y-1 text-xs text-muted-foreground">
          {o.sources.map((s) => <p key={s} className="flex items-center gap-1.5"><ScaleIcon className="size-3.5" />{s}</p>)}
          {o.guides.map((g) => <Link key={g.lien} href={g.lien} className="block text-navy hover:underline">Guide : {g.titre}</Link>)}
        </div>
      );
    }
    case "preparerDossier": {
      const o = out as unknown as { type: string; nup: string; pieces: string[]; lien: string };
      return (
        <div className={card}>
          <p className="font-semibold">Dossier prêt à compléter</p>
          <ul className="list-disc pl-5 text-sm">{o.pieces.map((x) => <li key={x}>{x}</li>)}</ul>
          <Link href={o.lien} className={buttonVariants({ size: "sm" })}>Ouvrir le dossier pré-rempli</Link>
        </div>
      );
    }
    case "redigerOpposition": {
      const o = out as unknown as { lettre: string; lien: string };
      return (
        <div className={card}>
          <pre className="font-sans text-sm whitespace-pre-wrap">{o.lettre}</pre>
          <Link href={o.lien} className={buttonVariants({ size: "sm" })}>Relire et transmettre</Link>
        </div>
      );
    }
    case "surveillerParcelle": {
      const o = out as unknown as { nup: string; canaux: string[]; lien: string };
      return (
        <p className={cn(card, "flex items-center gap-2 text-sm")}>
          <CheckCircle2Icon className="size-4 text-clear" /> Parcelle {o.nup} surveillée ({o.canaux.join(", ")}). <Link href={o.lien} className="text-navy hover:underline">Gérer</Link>
        </p>
      );
    }
  }
  return null;
}

// Voix : API natives du navigateur (dictée et lecture à voix haute), rien à héberger.
// ponytail: français seulement ; fon/yoruba demanderont un modèle dédié (ex. Whisper affiné) côté serveur.
type Recognition = { lang: string; interimResults: boolean; start(): void; onresult: (e: { results: { 0: { transcript: string } }[] }) => void; onend: () => void };
const recognitionCtor = () =>
  typeof window === "undefined" ? undefined : ((window as unknown as { SpeechRecognition?: new () => Recognition; webkitSpeechRecognition?: new () => Recognition }).SpeechRecognition ?? (window as unknown as { webkitSpeechRecognition?: new () => Recognition }).webkitSpeechRecognition);

const noop = () => () => {};

function speak(text: string) {
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text.replace(/[*#_`]/g, ""));
  u.lang = "fr-FR";
  speechSynthesis.speak(u);
}

export function AgentChat({ initial }: { initial?: string }) {
  const { messages, sendMessage, status, error, addToolApprovalResponse } = useChat<IlemiMessage>({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
    sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithApprovalResponses,
  });
  const [draft, setDraft] = useState("");
  const [uploading, setUploading] = useState(false);
  const [listening, setListening] = useState(false);
  const canDictate = useSyncExternalStore(noop, () => !!recognitionCtor(), () => false);

  function dictate() {
    const Ctor = recognitionCtor();
    if (!Ctor) return;
    const r = new Ctor();
    r.lang = "fr-FR";
    r.interimResults = false;
    r.onresult = (e) => send(e.results[0][0].transcript);
    r.onend = () => setListening(false);
    setListening(true);
    r.start();
  }
  const end = useRef<HTMLDivElement>(null);
  const started = useRef(false);
  const busy = status === "submitted" || status === "streaming" || uploading;

  // Question venue de l'accueil (?q=). Différée : le double montage de StrictMode annule le premier envoi.
  useEffect(() => {
    if (!initial || started.current) return;
    const t = setTimeout(() => {
      started.current = true;
      sendMessage({ text: initial });
    });
    return () => clearTimeout(t);
  }, [initial, sendMessage]);

  useEffect(() => {
    end.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, status]);

  function send(text: string) {
    if (!text.trim() || busy) return;
    sendMessage({ text: text.trim() });
    setDraft("");
  }

  // Un fichier déposé est lu par l'API de lecture de pièces ; l'agent reçoit le résultat et l'explique.
  async function upload(file: File) {
    setUploading(true);
    const form = new FormData();
    form.append("file", file);
    const res = await fetch("/api/documents/extract", { method: "POST", body: form });
    const d = await res.json();
    setUploading(false);
    if (!res.ok) return send(`Je voulais déposer « ${file.name} », mais la lecture a échoué : ${d.error}`);
    if (d.kind !== "leve") return send(`J'ai déposé « ${file.name} » (${d.title}). Informations lues : ${d.fields.map((f: string[]) => f.join(" : ")).join(" ; ") || "aucune"}. Qu'en penses-tu ?`);
    send(
      `J'ai déposé le levé « ${file.name} ». Résultat de l'analyse automatique : ${d.bornes.length} bornes, superficie calculée ${d.computedM2} m² pour ${d.declaredM2 ?? "?"} m² déclarés. ` +
        `Constats : ${d.reasons.map((r: { text: string }) => r.text).join(" ") || "aucune couche ANDF touchée."} Explique-moi ce que cela signifie et ce que je dois faire. ` +
        `(Pour l'afficher sur la carte, utilise analyserLeve avec « ${file.name} » s'il fait partie des documents de démonstration.)`
    );
  }

  return (
    <div className="flex min-h-[calc(100dvh-4.25rem)] flex-col">
      <div className="mx-auto w-full max-w-3xl flex-1 px-4 py-8 sm:px-6">
        {!messages.length && (
          <div className="py-10">
            <p className="text-sm font-semibold text-navy">Ilèmi · agent foncier</p>
            <h1 className="mt-2 text-[clamp(2rem,4.6vw,3rem)] leading-[1.04] font-extrabold text-navy">Confiez-moi la vérification.</h1>
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground">
              Donnez un NUP, déposez le levé du vendeur ou posez une question. Je croise les couches de l&apos;ANDF, j&apos;explique, et je peux préparer votre dossier ou votre opposition avec votre accord.
            </p>
            <ul className="mt-8 grid gap-2 sm:grid-cols-2">
              {STARTERS.map((s) => (
                <li key={s}>
                  <button type="button" onClick={() => send(s)} className="h-full w-full rounded-lg border bg-card px-4 py-3 text-left text-sm font-medium transition-colors hover:border-navy/40 hover:bg-sky">
                    {s}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        <ol className="space-y-6" aria-live="polite">
          {messages.map((m) => (
            <li key={m.id} className={m.role === "user" ? "ml-auto w-fit max-w-[85%]" : "max-w-[95%] space-y-3"}>
              {m.parts.map((part, i) =>
                part.type === "text" ? (
                  m.role === "user" ? (
                    <p key={i} className="rounded-lg rounded-br-sm bg-navy px-4 py-3 text-white">{part.text.length > 280 ? `${part.text.slice(0, 180)}…` : part.text}</p>
                  ) : (
                    <div key={i} className="group relative rounded-lg rounded-bl-sm bg-sky px-5 py-4">
                      <RichText text={part.text} />
                      <Button type="button" size="icon-xs" variant="ghost" onClick={() => speak(part.text)} aria-label="Écouter la réponse" className="absolute top-2 right-2 text-muted-foreground opacity-60 group-hover:opacity-100">
                        <Volume2Icon />
                      </Button>
                    </div>
                  )
                ) : (
                  <ToolCard key={i} part={part} onApprove={(id, approved) => addToolApprovalResponse({ id, approved })} />
                )
              )}
            </li>
          ))}
          {(status === "submitted" || uploading) && (
            <li className="flex items-center gap-2 text-sm text-muted-foreground"><Spinner />{uploading ? "Lecture du document…" : "Ilèmi réfléchit…"}</li>
          )}
          {error && <li className="text-sm text-danger">Erreur : {error.message}</li>}
        </ol>
        <div ref={end} />
      </div>

      <div className="sticky bottom-0 border-t bg-background/95 backdrop-blur">
        <form className="mx-auto w-full max-w-3xl px-4 py-4 sm:px-6" onSubmit={(e) => { e.preventDefault(); send(draft); }}>
          <InputGroup className="rounded-lg bg-card">
            <InputGroupTextarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send(draft);
                }
              }}
              placeholder="Un NUP, une question, ou déposez un levé"
              aria-label="Votre message"
              rows={2}
              className="min-h-14 text-base"
            />
            <InputGroupAddon align="block-end" className="justify-between">
              <label className="flex cursor-pointer items-center gap-1.5 rounded-md px-2 py-1 text-sm text-muted-foreground hover:bg-muted">
                <PaperclipIcon className="size-4" /> Déposer un document
                <input type="file" accept="application/pdf,image/*" className="sr-only" onChange={(e) => { const f = e.target.files?.[0]; e.target.value = ""; if (f) upload(f); }} />
              </label>
              <div className="flex items-center gap-1">
              {canDictate && (
                <InputGroupButton type="button" size="icon-sm" variant={listening ? "secondary" : "ghost"} onClick={dictate} disabled={busy || listening} aria-label="Dicter votre question" className="rounded-md">
                  <MicIcon className={cn(listening && "animate-pulse text-danger")} />
                </InputGroupButton>
              )}
              <InputGroupButton type="submit" size="icon-sm" variant="default" disabled={!draft.trim() || busy} aria-label="Envoyer" className="rounded-md">
                <ArrowUpIcon />
              </InputGroupButton>
              </div>
            </InputGroupAddon>
          </InputGroup>
        </form>
      </div>
    </div>
  );
}
