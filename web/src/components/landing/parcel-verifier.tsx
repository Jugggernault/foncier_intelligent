"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRightIcon,
  ExternalLinkIcon,
  SearchIcon,
  ShieldAlertIcon,
  ShieldCheckIcon,
  ShieldQuestionIcon,
} from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { fr } from "@/i18n/fr";
import { NUP_PATTERN, cadastreUrl, getImagery, getParcel, type Parcel } from "@/lib/data/parcels";
import { assess, type Assessment, type RiskLevel } from "@/lib/risk";
import { ParcelMap } from "@/components/map/parcel-map";
import { procedureLabel, rightLabel } from "@/lib/labels";
import { cn } from "@/lib/utils";

export const VERIFY_EVENT = "fi:verify-nup";
const SAMPLES = ["101236198", "101232574", "101236307", "100666667"];
const t = fr.hero;
const v = fr.verdict;

const LEVEL_STYLE: Record<RiskLevel, { band: string; icon: typeof ShieldAlertIcon }> = {
  danger: { band: "bg-danger text-white", icon: ShieldAlertIcon },
  caution: { band: "bg-caution-soft text-caution", icon: ShieldQuestionIcon },
  clear: { band: "bg-clear-soft text-clear", icon: ShieldCheckIcon },
};

const fmtDate = (iso: string) =>
  new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "short", year: "numeric" }).format(new Date(iso));
const fmtArea = (m2: number) =>
  m2 >= 10_000
    ? `${new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 2 }).format(m2 / 10_000)} ha`
    : `${new Intl.NumberFormat("fr-FR").format(m2)} m²`;

export function ParcelVerifier() {
  const [active, setActive] = useState<string>(SAMPLES[0]);
  const [missing, setMissing] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [error, setError] = useState<string | null>(null);

  function show(nup: string) {
    setError(null);
    if (!NUP_PATTERN.test(nup)) return setError(t.invalid);
    if (getParcel(nup)) {
      setMissing(null);
      setActive(nup);
    } else {
      setMissing(nup);
    }
  }

  // La bande de clôture envoie son NUP ici (voir VerifyAgain).
  useEffect(() => {
    const onVerify = (e: Event) => {
      const nup = (e as CustomEvent<string>).detail;
      setQuery(nup);
      show(nup);
    };
    window.addEventListener(VERIFY_EVENT, onVerify);
    return () => window.removeEventListener(VERIFY_EVENT, onVerify);
  });

  return (
    <div className="mx-auto grid max-w-7xl gap-8 px-4 pt-8 pb-16 sm:px-6 lg:grid-cols-12 lg:gap-x-10 lg:gap-y-8 lg:px-8 lg:pt-16 lg:pb-24">
      <div className="lg:col-span-6 lg:self-end xl:col-span-5">
        <h1 className="text-[clamp(2.6rem,6.2vw,4.75rem)] leading-[0.98] font-extrabold text-white">
          {t.title}
        </h1>
        <p className="mt-4 max-w-[34rem] text-base leading-relaxed text-white/80 sm:mt-6 sm:text-lg">{t.lead}</p>

        <form
          className="mt-6 max-w-xl sm:mt-10"
          onSubmit={(e) => {
            e.preventDefault();
            show(query.trim());
          }}
          noValidate
        >
          <Field data-invalid={!!error || undefined}>
            <FieldLabel htmlFor="nup" className="text-sm font-medium text-white/75">
              {t.label}
            </FieldLabel>
            <div className="flex flex-col gap-2 sm:flex-row">
              <InputGroup className="h-14 rounded-md sm:flex-1 border-white/15 bg-white text-foreground has-[[data-slot=input-group-control]:focus-visible]:ring-signal/60">
                <InputGroupAddon className="pl-4">
                  <SearchIcon className="size-5 text-navy/60" />
                </InputGroupAddon>
                <InputGroupInput
                  id="nup"
                  inputMode="numeric"
                  autoComplete="off"
                  maxLength={9}
                  placeholder={t.placeholder}
                  value={query}
                  onChange={(e) => setQuery(e.target.value.replace(/\D/g, ""))}
                  aria-invalid={!!error || undefined}
                  aria-describedby={error ? "nup-error" : undefined}
                  className="tabular font-display text-lg tracking-[0.06em] placeholder:tracking-normal placeholder:font-sans placeholder:text-base"
                />
              </InputGroup>
              <Button type="submit" className="h-14 rounded-md bg-signal px-7 text-base font-bold text-signal-ink hover:bg-[#ffe033]">
                {t.submit}
                <ArrowRightIcon data-icon="inline-end" />
              </Button>
            </div>
            {error && (
              <FieldError id="nup-error" className="font-medium text-signal">
                {error}
              </FieldError>
            )}
          </Field>
        </form>
      </div>

      <div className="-mx-4 -mt-4 flex items-center gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:mt-0 sm:block sm:overflow-visible sm:px-0 lg:col-span-6 lg:row-start-2 lg:self-start xl:col-span-5">
          <p className="shrink-0 text-sm text-white/65">
            <span className="sm:hidden">Essayez :</span>
            <span className="hidden sm:inline">{t.tryLabel}</span>
          </p>
          <ul className="flex gap-2 sm:mt-3 sm:flex-wrap">
            {SAMPLES.map((nup) => {
              const p = getParcel(nup)!;
              const on = nup === active && !missing;
              return (
                <li key={nup} className="shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      setQuery(nup);
                      show(nup);
                    }}
                    aria-pressed={on}
                    className={cn(
                      "rounded-md border px-3 py-2 text-left text-sm transition-colors focus-visible:ring-3 focus-visible:ring-signal/60 focus-visible:outline-none",
                      on ? "border-white bg-white/10 text-white" : "border-white/20 text-white/80 hover:border-white/50 hover:text-white"
                    )}
                  >
                    <span className="tabular block font-display font-bold tracking-[0.04em]">{nup}</span>
                    <span className="block text-xs text-white/60">{p.arrondissement ?? "Sans localisation"}</span>
                  </button>
                </li>
              );
            })}
          </ul>
      </div>

      <div className="lg:col-span-6 lg:col-start-7 lg:row-span-2 lg:row-start-1 lg:self-center">
        {missing ? <MissingPanel nup={missing} /> : <VerdictPanel key={active} parcel={getParcel(active)!} />}
      </div>
    </div>
  );
}

function VerdictPanel({ parcel }: { parcel: Parcel }) {
  const imagery = getImagery(parcel.nup);
  const years = imagery?.years ?? [2016, 2018, 2020, 2022, 2024];
  const [year, setYear] = useState(years.at(-1)!);
  // Verdict immédiat sur les données locales, puis enrichi par les couches ANDF (PostGIS) via l'API.
  const [full, setFull] = useState<{ result: Assessment; layers: string[] }>();
  useEffect(() => {
    let alive = true;
    fetch(`/api/parcels/${parcel.nup}`)
      .then((r) => (r.ok ? r.json() : undefined))
      .then((d) => alive && d && setFull({ result: d.risk, layers: (d.layers ?? []).map((h: { layerId: string }) => h.layerId) }))
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, [parcel.nup]);
  const result = full?.result ?? assess(parcel);
  const style = LEVEL_STYLE[result.level];
  const Icon = style.icon;
  const place = [...new Set([parcel.quartier, parcel.arrondissement, parcel.commune])].join(" · ");
  const side = imagery && parcel.areaM2 ? Math.sqrt(parcel.areaM2) / imagery.metersPerPixel : 0;

  return (
    <article className="flex flex-col overflow-hidden rounded-lg bg-card text-card-foreground shadow-[0_24px_60px_-20px_rgba(2,12,27,0.65)]">
      <header className="flex flex-wrap items-start justify-between gap-3 px-5 pt-5 pb-4 sm:px-6">
        <div>
          <p className="text-xs font-medium text-muted-foreground">NUP</p>
          <p className="tabular font-display text-2xl font-extrabold tracking-[0.04em] text-navy">{parcel.nup}</p>
          <p className="mt-0.5 text-sm text-muted-foreground">{place || "Commune non précisée"}</p>
        </div>
        <Badge variant="secondary" className="rounded-sm">{v.sample}</Badge>
      </header>

      <figure className="relative max-lg:order-2">
        <div className="relative aspect-[16/10] overflow-hidden bg-navy-ink">
          {imagery ? (
            <svg
              key={year}
              viewBox="96 204 576 360"
              preserveAspectRatio="xMidYMid slice"
              className="absolute inset-0 size-full animate-[develop_700ms_cubic-bezier(0.16,1,0.3,1)_both]"
              role="img"
              aria-label={`Image satellite ${year} de la parcelle ${parcel.nup}`}
            >
              <image href={`/imagery/${parcel.nup}/${year}.jpg`} width="768" height="768" />
              <rect
                x={384 - side / 2}
                y={384 - side / 2}
                width={side}
                height={side}
                fill="rgba(255,212,0,0.12)"
                stroke="var(--signal)"
                strokeWidth="3"
                strokeDasharray="10 7"
              />
              <circle cx="384" cy="384" r="5" fill="var(--signal)" stroke="#06111f" strokeWidth="2" />
            </svg>
          ) : (
            <ParcelMap
              parcels={[{ nup: parcel.nup, polygon: parcel.polygon, level: result.level }]}
              layers={full?.layers ?? []}
              selected={parcel.nup}
              year={year}
              padding={80}
              label={`Image satellite ${year} de la parcelle ${parcel.nup}`}
            />
          )}
            <div
              key={`scan-${parcel.nup}`}
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 top-0 h-[9%] animate-[scan_1.1s_cubic-bezier(0.22,1,0.36,1)_both] bg-gradient-to-b from-transparent via-signal/30 to-signal/70 [box-shadow:0_2px_0_var(--signal)]"
            />
            <span className="tabular absolute top-3 left-3 rounded-sm bg-navy-deep/80 px-2 py-1 font-display text-sm font-bold text-white">
              {year}
            </span>
          </div>
          <figcaption className="flex flex-wrap items-center justify-between gap-3 border-b px-5 py-3 sm:px-6">
            <span className="max-w-[18rem] text-xs text-muted-foreground">{imagery ? v.footprint : v.footprintLive}</span>
            <ToggleGroup
              value={[String(year)]}
              onValueChange={(val) => val[0] && setYear(Number(val[0]))}
              size="sm"
              spacing={0}
              variant="outline"
              aria-label="Année de l'image"
            >
              {years.map((y) => (
                <ToggleGroupItem key={y} value={String(y)} className="tabular px-2.5 data-pressed:bg-navy data-pressed:text-white">
                  {y}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </figcaption>
      </figure>

      <dl className="grid grid-cols-2 max-lg:order-3 gap-x-6 gap-y-3 px-5 py-4 text-sm sm:px-6">
        <Fact label={v.facts.owner} value={parcel.owner.kind === "state" ? v.ownerState : v.ownerPrivate} />
        <Fact label={v.facts.area} value={parcel.areaM2 ? fmtArea(parcel.areaM2) : "—"} />
        <Fact label={v.facts.procedure} value={parcel.procedure ? procedureLabel(parcel.procedure) : rightLabel(parcel)} />
        <Fact
          label={v.facts.publicity}
          value={parcel.procedure ? `${fmtDate(parcel.procedure.publicity.start)} → ${fmtDate(parcel.procedure.publicity.end)}` : v.noPublicity}
        />
      </dl>

      <div className={cn("px-5 sm:px-6 max-lg:order-1", style.band)}>
        <div className="flex items-start gap-3 pt-4">
          <Icon className="mt-0.5 size-6 shrink-0" />
          <p className="font-display text-lg leading-snug font-extrabold">{result.headline}</p>
        </div>
        <Accordion className="-mx-1">
          <AccordionItem value="why" className="border-0">
            <AccordionTrigger className="px-1 py-3 text-sm font-semibold underline-offset-4 hover:underline [&_svg]:text-current!">{v.why}</AccordionTrigger>
            <AccordionContent className="px-1">
              <ul className="space-y-3 pb-2">
                {result.reasons.map((r) => (
                  <li key={r.text} className="text-sm leading-relaxed">
                    <p>{r.text}</p>
                    {r.action && <p className="mt-0.5 font-semibold">{r.action}</p>}
                  </li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      <footer className="flex flex-wrap max-lg:order-4 items-center justify-between gap-3 px-5 py-4 sm:px-6">
        <Link href={`/parcelle/${parcel.nup}`} className={cn(buttonVariants({ variant: "link" }), "h-auto px-0 font-semibold text-navy")}>
          {v.open}
          <ArrowRightIcon data-icon="inline-end" />
        </Link>
        <p className="w-full text-[0.7rem] leading-snug text-muted-foreground">{v.source}</p>
      </footer>
    </article>
  );
}

function MissingPanel({ nup }: { nup: string }) {
  return (
    <article className="flex min-h-[26rem] flex-col items-start justify-center gap-4 rounded-lg bg-card p-8 shadow-[0_24px_60px_-20px_rgba(2,12,27,0.65)]">
      <p className="tabular font-display text-2xl font-extrabold tracking-[0.04em] text-navy">{nup}</p>
      <p className="max-w-sm text-lg">{t.notFound}</p>
      <a
        href={cadastreUrl(nup)}
        target="_blank"
        rel="noreferrer"
        className={cn(buttonVariants({ variant: "outline", size: "lg" }), "px-4")}
      >
        {t.notFoundAction}
        <ExternalLinkIcon data-icon="inline-end" />
      </a>
    </article>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="tabular mt-0.5 font-medium">{value}</dd>
    </div>
  );
}

/** Champ NUP de la bande de clôture : remonte au premier écran et lance la vérification. */
export function VerifyAgain() {
  const [nup, setNup] = useState("");
  return (
    <form
      className="flex w-full max-w-md flex-col gap-2 sm:flex-row"
      onSubmit={(e) => {
        e.preventDefault();
        window.dispatchEvent(new CustomEvent(VERIFY_EVENT, { detail: nup.trim() }));
        document.getElementById("top")?.scrollIntoView({ behavior: "smooth" });
      }}
    >
      <InputGroup className="h-14 rounded-md border-white/15 bg-white text-foreground sm:flex-1">
        <InputGroupAddon className="pl-4">
          <SearchIcon className="size-5 text-navy/60" />
        </InputGroupAddon>
        <InputGroupInput
          aria-label={t.label}
          inputMode="numeric"
          autoComplete="off"
          maxLength={9}
          placeholder={t.placeholder}
          value={nup}
          onChange={(e) => setNup(e.target.value.replace(/\D/g, ""))}
          className="tabular font-display text-lg tracking-[0.06em] placeholder:font-sans placeholder:text-base placeholder:tracking-normal"
        />
      </InputGroup>
      <Button type="submit" className="h-14 rounded-md bg-signal px-7 text-base font-bold text-signal-ink hover:bg-[#ffe033]">
        {t.submit}
        <ArrowRightIcon data-icon="inline-end" />
      </Button>
    </form>
  );
}
