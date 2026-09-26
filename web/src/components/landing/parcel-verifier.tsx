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
import { Button, buttonVariants } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { fr } from "@/i18n/fr";
import { NUP_PATTERN, cadastreUrl, getImagery, getParcel, type Parcel } from "@/lib/data/parcels";
import { assess, type Assessment, type RiskLevel } from "@/lib/risk";
import { ParcelMap } from "@/components/map/parcel-map";
import { cn } from "@/lib/utils";

export const VERIFY_EVENT = "fi:verify-nup";
const SAMPLES = ["101236198", "101232574", "101236307"];
const t = fr.hero;
const v = fr.verdict;

const LEVEL_STYLE: Record<RiskLevel, { band: string; icon: typeof ShieldAlertIcon }> = {
  danger: { band: "bg-danger text-white", icon: ShieldAlertIcon },
  caution: { band: "bg-caution-soft text-caution", icon: ShieldQuestionIcon },
  clear: { band: "bg-clear-soft text-clear", icon: ShieldCheckIcon },
};

export function ParcelVerifier() {
  const [active, setActive] = useState<string>(SAMPLES[0]);
  const [missing, setMissing] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [error, setError] = useState<string | null>(null);
  // Parcelles hors démonstration, lues sur l'ANDF en direct par l'API (ANDF_LIVE)
  const [remote, setRemote] = useState<Record<string, Parcel>>({});
  const lookup = (nup: string) => getParcel(nup) ?? remote[nup];

  async function show(nup: string) {
    setError(null);
    if (!NUP_PATTERN.test(nup)) return setError(t.invalid);
    if (!lookup(nup)) {
      const d = await fetch(`/api/parcels/${nup}`).then((r) => (r.ok ? r.json() : undefined)).catch(() => undefined);
      if (!d) return setMissing(nup);
      setRemote((m) => ({ ...m, [nup]: { ...d, owner: { kind: d.owner, initials: "—" } } }));
    }
    setMissing(null);
    setActive(nup);
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
    <div className="mx-auto grid max-w-7xl gap-10 px-4 pt-8 pb-16 sm:px-6 lg:grid-cols-12 lg:items-center lg:gap-x-16 lg:px-8 lg:pt-12 lg:pb-20">
      <div className="min-w-0 lg:col-span-6">
        <h1 className="text-[clamp(2.6rem,5.6vw,4.5rem)] leading-[0.98] font-extrabold text-balance text-white">{t.title}</h1>
        <p className="mt-5 max-w-[34rem] text-base leading-relaxed text-white/80 sm:mt-6 sm:text-lg">{t.lead}</p>

        <form
          className="mt-8 sm:mt-10"
          onSubmit={(e) => {
            e.preventDefault();
            show(query.trim());
          }}
          noValidate
        >
          <Field data-invalid={!!error || undefined}>
            <FieldLabel htmlFor="nup" className="sr-only">
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

        {/* Les parcelles d'essai prolongent le champ : un clic remplit le NUP et met la fiche à jour. */}
        <div className="-mx-4 mt-4 flex items-center gap-3 overflow-x-auto [scrollbar-width:none] px-4 pb-1 sm:mx-0 sm:px-0">
          <p className="shrink-0 text-sm text-white/65">{t.tryLabel}</p>
          <ul className="flex gap-2">
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
                    title={p.arrondissement ?? "Sans localisation"}
                    className={cn(
                      "tabular rounded-sm border px-2.5 py-1.5 font-display text-sm font-bold tracking-[0.04em] transition-colors focus-visible:ring-3 focus-visible:ring-signal/60 focus-visible:outline-none",
                      on ? "border-white bg-white/10 text-white" : "border-white/20 text-white/75 hover:border-white/50 hover:text-white"
                    )}
                  >
                    {nup}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        <Link
          href="/leve"
          className="mt-8 inline-flex items-center gap-1.5 text-sm font-medium text-white/75 underline decoration-white/30 underline-offset-4 transition-colors hover:text-white hover:decoration-white"
        >
          {t.noNup}
          <ArrowRightIcon className="size-3.5" aria-hidden="true" />
        </Link>
      </div>

      <div className="min-w-0 lg:col-span-6">
        {missing ? <MissingPanel nup={missing} /> : <VerdictPanel key={active} parcel={lookup(active)!} />}
      </div>
    </div>
  );
}

function VerdictPanel({ parcel }: { parcel: Parcel }) {
  const imagery = getImagery(parcel.nup);
  const year = imagery?.years.at(-1) ?? 2025;
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
  // Polygone réel projeté dans la vignette (768 px centrés sur imagery.lat/lon, metersPerPixel au sol)
  const outline = imagery
    ? parcel.polygon
        .map(([lon, lat]) => {
          const x = 384 + ((lon - imagery.lon) * 111_320 * Math.cos((imagery.lat * Math.PI) / 180)) / imagery.metersPerPixel;
          const y = 384 - ((lat - imagery.lat) * 110_574) / imagery.metersPerPixel;
          return `${x.toFixed(1)},${y.toFixed(1)}`;
        })
        .join(" ")
    : "";

  return (
    <article className="overflow-hidden rounded-lg bg-card text-card-foreground shadow-[0_24px_60px_-20px_rgba(2,12,27,0.65)]">
      <header className="px-5 pt-5 pb-4 sm:px-6">
        <p className="tabular font-display text-2xl font-extrabold tracking-[0.04em] text-navy">{parcel.nup}</p>
        <p className="mt-0.5 text-sm text-muted-foreground">{place || "Commune non précisée"}</p>
      </header>

      <div className={cn("px-5 sm:px-6", style.band)}>
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

      <div className="relative aspect-[16/10] overflow-hidden bg-navy-ink">
        {imagery ? (
          <svg
            viewBox="96 204 576 360"
            preserveAspectRatio="xMidYMid slice"
            className="absolute inset-0 size-full animate-[develop_700ms_cubic-bezier(0.16,1,0.3,1)_both]"
            role="img"
            aria-label={`Image satellite ${year} de la parcelle ${parcel.nup}`}
          >
            <image href={`/imagery/${parcel.nup}/${year}.jpg`} width="768" height="768" />
            <polygon points={outline} fill="rgba(255,212,0,0.12)" stroke="var(--signal)" strokeWidth="3" />
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
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-[9%] animate-[scan_1.1s_cubic-bezier(0.22,1,0.36,1)_both] bg-gradient-to-b from-transparent via-signal/30 to-signal/70 [box-shadow:0_2px_0_var(--signal)]"
        />
        <span className="tabular absolute top-3 left-3 rounded-sm bg-navy-deep/80 px-2 py-1 font-display text-sm font-bold text-white">
          {year}
        </span>
      </div>

      <footer className="px-5 py-4 sm:px-6">
        <Link href={`/parcelle/${parcel.nup}`} className={cn(buttonVariants({ variant: "link" }), "h-auto px-0 font-semibold text-navy")}>
          {v.open}
          <ArrowRightIcon data-icon="inline-end" />
        </Link>
        <p className="mt-2 text-[0.7rem] leading-snug text-muted-foreground">{v.source}</p>
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
