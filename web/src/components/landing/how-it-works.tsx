"use client";

import { useRef, useState, type ReactNode } from "react";
import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "motion/react";
import { ArrowDownIcon, ArrowRightIcon, ShieldAlertIcon, ShieldCheckIcon, ShieldQuestionIcon } from "lucide-react";
import { VERIFY_EVENT } from "@/components/landing/parcel-verifier";
import { Button } from "@/components/ui/button";
import { fr } from "@/i18n/fr";
import { cn } from "@/lib/utils";

const t = fr.how;
const DEMO_NUP = "101236198";
const BEFORE = 2017;
const AFTER = 2025;

const LEVEL_STYLE = {
  danger: { Icon: ShieldAlertIcon, className: "bg-danger text-white", text: "text-white/90" },
  caution: { Icon: ShieldQuestionIcon, className: "bg-caution-soft text-caution", text: "text-caution" },
  clear: { Icon: ShieldCheckIcon, className: "bg-clear-soft text-clear", text: "text-clear" },
} as const;

/** Trois cartes empilées au défilement : chaque étape recouvre la précédente, qui recule. */
export function HowItWorks() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const visuals = [<NupDocument key="nup" />, <TimeSlider key="sat" />, <Verdicts key="verdict" />];

  return (
    <div ref={ref} className="mt-12 flex flex-col gap-[14vh] lg:mt-16">
      {t.steps.map((step, i) => (
        <StepCard
          key={step.title}
          index={i}
          total={t.steps.length}
          progress={scrollYProgress}
          still={!!reduce}
          title={step.title}
          text={step.text}
        >
          {visuals[i]}
        </StepCard>
      ))}
    </div>
  );
}

function StepCard({
  index,
  total,
  progress,
  still,
  title,
  text,
  children,
}: {
  index: number;
  total: number;
  progress: MotionValue<number>;
  still: boolean;
  title: string;
  text: string;
  children: ReactNode;
}) {
  // Les cartes du dessous reculent un peu plus à chaque carte qui les recouvre.
  const scale = useTransform(progress, [index / total, 1], [1, 1 - (total - 1 - index) * 0.05]);
  return (
    <div className="sticky" style={{ top: `calc(5rem + ${index * 1.25}rem)` }}>
      <motion.article
        style={still ? undefined : { scale }}
        className="grid origin-top gap-6 rounded-lg bg-white p-5 text-foreground shadow-[0_24px_60px_-20px_rgba(2,12,27,0.65)] sm:p-8 lg:min-h-[min(32rem,70vh)] lg:grid-cols-12 lg:gap-12 lg:p-12"
      >
        <div className="flex flex-col lg:col-span-5">
          <span className="tabular grid size-9 place-items-center rounded-full bg-navy font-display text-base font-bold text-white">
            {index + 1}
          </span>
          <h3 className="mt-4 text-[clamp(1.6rem,3vw,2.4rem)] leading-[1.05] font-extrabold text-balance text-navy lg:mt-auto">
            {title}
          </h3>
          <p className="mt-3 max-w-md text-base leading-relaxed text-muted-foreground lg:text-lg">{text}</p>
        </div>
        <div className="lg:col-span-7 lg:self-center">{children}</div>
      </motion.article>
    </div>
  );
}

/** Étape 1 : le NUP tel qu'il apparaît sur un document, puis le champ qui le reçoit. */
function NupDocument() {
  const groups = DEMO_NUP.match(/\d{3}/g)!;
  return (
    <div className="rounded-lg bg-sky p-5 sm:p-8">
      <div className="rounded-md border border-sky-line bg-white px-5 py-4">
        <p className="text-xs font-medium text-muted-foreground">{t.docLabel}</p>
        <p className="tabular mt-1 flex gap-[0.4em] font-display text-[clamp(1.9rem,4.4vw,3rem)] font-extrabold tracking-[0.04em] text-navy">
          {groups.map((g, i) => (
            <span key={i} className="border-b-2 border-dashed border-signal pb-0.5">
              {g}
            </span>
          ))}
        </p>
        <p className="mt-2 text-xs text-muted-foreground">{t.docHint}</p>
      </div>
      <ArrowDownIcon className="mx-auto my-3 size-5 text-navy/50" aria-hidden="true" />
      <Button
        type="button"
        onClick={() => {
          window.dispatchEvent(new CustomEvent(VERIFY_EVENT, { detail: DEMO_NUP }));
          document.getElementById("top")?.scrollIntoView({ behavior: "smooth" });
        }}
        className="h-14 w-full rounded-md bg-signal text-base font-bold text-signal-ink hover:bg-[#ffe033]"
      >
        {t.tryCta}
        <ArrowRightIcon data-icon="inline-end" />
      </Button>
    </div>
  );
}

/** Étape 2 : avant / après en glissant ; la ligne jaune est la même que celle du balayage du verdict. */
function TimeSlider() {
  const [pos, setPos] = useState(50);
  return (
    <figure>
      <div className="relative aspect-[16/11] overflow-hidden rounded-md bg-navy-ink">
        <Image
          src={`/imagery/${DEMO_NUP}/${AFTER}.jpg`}
          alt={`Côte de Togbin vue par Sentinel-2 en ${AFTER}`}
          fill
          sizes="(min-width: 1024px) 40vw, 90vw"
          className="scale-[1.12] object-cover"
        />
        <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
          <Image
            src={`/imagery/${DEMO_NUP}/${BEFORE}.jpg`}
            alt={`Côte de Togbin vue par Sentinel-2 en ${BEFORE}`}
            fill
            sizes="(min-width: 1024px) 40vw, 90vw"
            className="scale-[1.12] object-cover"
          />
        </div>
        <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 w-0.5 -translate-x-1/2 bg-signal" style={{ left: `${pos}%` }}>
          <span className="absolute top-1/2 left-1/2 grid h-9 w-6 -translate-1/2 place-items-center rounded-sm bg-signal text-signal-ink shadow-[0_6px_16px_-6px_rgba(2,12,27,0.7)]">
            <span className="h-4 w-px bg-current shadow-[3px_0_0_currentColor,-3px_0_0_currentColor]" />
          </span>
        </div>
        <span className="tabular absolute top-3 left-3 rounded-sm bg-navy-deep/80 px-2 py-1 font-display text-sm font-bold text-white">{BEFORE}</span>
        <span className="tabular absolute top-3 right-3 rounded-sm bg-navy-deep/80 px-2 py-1 font-display text-sm font-bold text-white">{AFTER}</span>
        <input
          type="range"
          min={0}
          max={100}
          value={pos}
          onChange={(e) => setPos(Number(e.target.value))}
          aria-label={t.slider}
          aria-valuetext={pos > 50 ? `Surtout ${BEFORE}` : `Surtout ${AFTER}`}
          className="absolute inset-0 size-full cursor-ew-resize opacity-0"
        />
      </div>
      <figcaption className="mt-2 text-[0.7rem] leading-snug text-muted-foreground">{t.caption}</figcaption>
    </figure>
  );
}

/** Étape 3 : les trois verdicts, dans la langue des bandes de la fiche. */
function Verdicts() {
  return (
    <ul className="space-y-2">
      {t.levels.map((l) => {
        const { Icon, className, text } = LEVEL_STYLE[l.level];
        return (
          <li key={l.level} className={cn("flex gap-4 rounded-md px-4 py-4 sm:px-5", className)}>
            <Icon className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
            <div>
              <p className="font-display text-base font-bold sm:text-lg">{l.title}</p>
              <p className={cn("mt-0.5 text-sm leading-relaxed", text)}>{l.text}</p>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
