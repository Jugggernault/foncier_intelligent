"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRightIcon, ArrowUpIcon, ScaleIcon } from "lucide-react";
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupTextarea } from "@/components/ui/input-group";
import { Spinner } from "@/components/ui/spinner";
import { answer, type Answer } from "@/lib/assistant";

type Message = { role: "user"; text: string } | { role: "assistant"; answer: Answer };

const STARTERS = [
  "Je suis Togolais, puis-je acheter un terrain à Cotonou ?",
  "Quelles pièces pour un titre foncier ?",
  "Combien coûte une mutation pour 25 millions ?",
  "Vérifie la parcelle 101236198",
];

export function Chat({ initial }: { initial?: string }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [draft, setDraft] = useState("");
  const [thinking, setThinking] = useState(false);
  const end = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  function send(text: string) {
    const q = text.trim();
    if (!q || thinking) return;
    setMessages((m) => [...m, { role: "user", text: q }]);
    setDraft("");
    setThinking(true);
    // ponytail: latence simulée ; remplacée par le streaming de l'API assistant
    setTimeout(() => {
      setMessages((m) => [...m, { role: "assistant", answer: answer(q) }]);
      setThinking(false);
    }, 700);
  }

  useEffect(() => {
    if (initial && !started.current) {
      started.current = true;
      send(initial);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- question initiale envoyée une seule fois
  }, [initial]);

  useEffect(() => {
    end.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, thinking]);

  return (
    <div className="flex min-h-[calc(100dvh-4.25rem)] flex-col">
      <div className="mx-auto w-full max-w-3xl flex-1 px-4 py-8 sm:px-6">
        {!messages.length && (
          <div className="py-10">
            <h1 className="text-[clamp(2rem,4.6vw,3rem)] leading-[1.04] font-extrabold text-navy">Posez votre question foncière.</h1>
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground">
              Réponses tirées du Code foncier et domanial, des décrets et des démarches de l&apos;ANDF, toujours avec leur source. Donnez un NUP et je vérifie la parcelle.
            </p>
            <ul className="mt-8 grid gap-2 sm:grid-cols-2">
              {STARTERS.map((s) => (
                <li key={s}>
                  <button
                    type="button"
                    onClick={() => send(s)}
                    className="h-full w-full rounded-lg border bg-card px-4 py-3 text-left text-sm font-medium transition-colors hover:border-navy/40 hover:bg-sky"
                  >
                    {s}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        <ol className="space-y-6" aria-live="polite">
          {messages.map((m, i) =>
            m.role === "user" ? (
              <li key={i} className="ml-auto w-fit max-w-[85%] rounded-lg rounded-br-sm bg-navy px-4 py-3 text-white">
                {m.text}
              </li>
            ) : (
              <li key={i} className="max-w-[92%]">
                <div className="rounded-lg rounded-bl-sm bg-sky px-5 py-4">
                  <div className="space-y-2.5 leading-relaxed">
                    {m.answer.text.map((t) => (
                      <p key={t}>{t}</p>
                    ))}
                  </div>
                  {m.answer.nup && (
                    <Link
                      href={`/parcelle/${m.answer.nup}`}
                      className="mt-3 inline-flex items-center gap-1.5 font-semibold text-navy underline-offset-4 hover:underline"
                    >
                      Ouvrir la fiche de la parcelle {m.answer.nup}
                      <ArrowRightIcon className="size-4" />
                    </Link>
                  )}
                  {m.answer.sources.length > 0 && (
                    <ul className="mt-4 space-y-1 border-t border-sky-line pt-3 text-xs text-muted-foreground">
                      {m.answer.sources.map((s) => (
                        <li key={s} className="flex items-start gap-2">
                          <ScaleIcon className="mt-0.5 size-3.5 shrink-0" />
                          {s}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                {m.answer.followUps && i === messages.length - 1 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {m.answer.followUps.map((f) => (
                      <button
                        key={f}
                        type="button"
                        onClick={() => send(f)}
                        className="rounded-md border bg-card px-3 py-1.5 text-sm transition-colors hover:bg-sky"
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                )}
              </li>
            )
          )}
          {thinking && (
            <li className="flex items-center gap-2 text-sm text-muted-foreground">
              <Spinner /> L&apos;assistant consulte les textes…
            </li>
          )}
        </ol>
        <div ref={end} />
      </div>

      <div className="sticky bottom-0 border-t bg-background/95 backdrop-blur">
        <form
          className="mx-auto w-full max-w-3xl px-4 py-4 sm:px-6"
          onSubmit={(e) => {
            e.preventDefault();
            send(draft);
          }}
        >
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
              placeholder="Votre question, ou un NUP à 9 chiffres"
              aria-label="Votre question"
              rows={2}
              className="min-h-14 text-base"
            />
            <InputGroupAddon align="block-end" className="justify-between">
              <span className="text-xs text-muted-foreground">Information générale. Pour un acte, consultez un notaire.</span>
              <InputGroupButton type="submit" size="icon-sm" variant="default" disabled={!draft.trim() || thinking} aria-label="Envoyer" className="rounded-md">
                <ArrowUpIcon />
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
        </form>
      </div>
    </div>
  );
}
