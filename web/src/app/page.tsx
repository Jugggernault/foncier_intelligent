import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon, ScaleIcon, ShieldAlertIcon, ShieldCheckIcon, ShieldQuestionIcon } from "lucide-react";
import { FeeCalculator } from "@/components/landing/fee-calculator";
import { ParcelVerifier, VerifyAgain } from "@/components/landing/parcel-verifier";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Item, ItemActions, ItemContent, ItemDescription, ItemGroup, ItemTitle } from "@/components/ui/item";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { fr } from "@/i18n/fr";
import { getImagery, listPublicityNotices } from "@/lib/data/parcels";
import { cn } from "@/lib/utils";

const TIMELINE_NUP = "101236198";
const LEVEL_ICON = {
  danger: { Icon: ShieldAlertIcon, className: "bg-danger text-white" },
  caution: { Icon: ShieldQuestionIcon, className: "bg-caution-soft text-caution" },
  clear: { Icon: ShieldCheckIcon, className: "bg-clear-soft text-clear" },
} as const;

const fmtDate = (iso: string) =>
  new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "long", year: "numeric" }).format(new Date(iso));
const fmtArea = (m2?: number) =>
  m2 ? `${new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 1 }).format(m2 / 10_000)} ha` : null;

export default function Home() {
  const years = getImagery(TIMELINE_NUP)?.years ?? [];
  const notices = listPublicityNotices();
  const today = new Date().toISOString().slice(0, 10);

  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        {/* Premier écran : la vérification elle-même */}
        <section id="top" className="bg-navy" aria-label="Vérifier une parcelle">
          <ParcelVerifier />
        </section>

        {/* Le terrain dans le temps */}
        <section className="bg-navy-deep py-20 text-white lg:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
              <h2 className="text-[clamp(2rem,4.4vw,3.4rem)] leading-[1.02] font-extrabold lg:col-span-5">
                {fr.timeline.title}
              </h2>
              <p className="max-w-2xl text-lg leading-relaxed text-white/75 lg:col-span-6 lg:col-start-7">
                {fr.timeline.lead}
              </p>
            </div>
            <ol className="-mx-4 mt-12 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-5 sm:overflow-visible sm:px-0">
              {years.map((y, i) => (
                <li key={y} className="w-[58vw] shrink-0 snap-start sm:w-auto">
                  <figure>
                    <div className="relative aspect-square overflow-hidden rounded-md">
                      <Image
                        src={`/imagery/${TIMELINE_NUP}/${y}.jpg`}
                        alt={`Côte de Togbin vue par Sentinel-2 en ${y}`}
                        fill
                        sizes="(min-width: 640px) 20vw, 70vw"
                        className="scale-[1.12] object-cover"
                      />
                      {i === years.length - 2 && (
                        <span className="absolute right-2 bottom-2 rounded-sm bg-white px-1.5 py-0.5 text-[0.7rem] font-bold text-navy">
                          Aménagement visible
                        </span>
                      )}
                    </div>
                    <figcaption className="tabular mt-2 font-display text-lg font-bold">{y}</figcaption>
                  </figure>
                </li>
              ))}
            </ol>
            <p className="mt-4 text-xs text-white/50">{fr.timeline.caption}</p>
          </div>
        </section>

        {/* Lire le verdict */}
        <section className="py-20 lg:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <h2 className="text-[clamp(2rem,4.4vw,3.4rem)] leading-[1.02] font-extrabold text-navy">{fr.reading.title}</h2>
              <p className="mt-5 text-lg leading-relaxed text-muted-foreground">{fr.reading.lead}</p>
            </div>
            <div className="mt-14 grid gap-14 lg:grid-cols-2 lg:gap-20">
              <div>
                <h3 className="font-display text-base font-bold tracking-normal text-navy">Le parcours d&apos;une parcelle</h3>
                <ol className="relative mt-6 space-y-8 border-l-2 border-sky-line pl-8">
                  {fr.reading.steps.map((s, i) => (
                    <li key={s.title} className="relative">
                      <span
                        className={cn(
                          "tabular absolute top-0 -left-[2.6rem] grid size-7 place-items-center rounded-full font-display text-sm font-bold",
                          i === 2 ? "bg-navy text-white" : "bg-sky text-navy ring-2 ring-sky-line"
                        )}
                      >
                        {i + 1}
                      </span>
                      <p className="font-display text-lg font-bold">{s.title}</p>
                      <p className="mt-1 text-muted-foreground">{s.text}</p>
                    </li>
                  ))}
                </ol>
              </div>
              <div>
                <h3 className="font-display text-base font-bold tracking-normal text-navy">Les trois verdicts</h3>
                <ul className="mt-6 divide-y border-y">
                  {fr.reading.levels.map((l) => {
                    const { Icon, className } = LEVEL_ICON[l.level];
                    return (
                    <li key={l.level} className="flex gap-5 py-5">
                      <span className={cn("grid size-10 shrink-0 place-items-center rounded-md", className)} aria-hidden="true">
                        <Icon className="size-5" />
                      </span>
                      <div>
                        <p className="font-display text-lg font-bold">{l.title}</p>
                        <p className="mt-1 text-muted-foreground">{l.text}</p>
                      </div>
                    </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Publicité foncière */}
        <section className="bg-sky py-20 lg:py-28">
          <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-12 lg:px-8">
            <div className="lg:col-span-5">
              <h2 className="text-[clamp(2rem,4vw,3rem)] leading-[1.04] font-extrabold text-navy">{fr.publicity.title}</h2>
              <p className="mt-5 text-lg leading-relaxed text-muted-foreground">{fr.publicity.lead}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/espace/surveillance" className={cn(buttonVariants({ size: "lg" }), "h-12 px-5 text-base")}>
                  {fr.publicity.watch}
                  <Badge className="ml-1 rounded-sm bg-white/15 text-white">{fr.publicity.soon}</Badge>
                </Link>
                <Link href="/publicite" className={cn(buttonVariants({ variant: "outline", size: "lg" }), "h-12 bg-transparent px-5 text-base")}>
                  {fr.publicity.all}
                </Link>
              </div>
            </div>
            <div className="lg:col-span-7">
              <h3 className="font-display text-base font-bold tracking-normal text-navy">{fr.publicity.listTitle}</h3>
              <ItemGroup className="mt-4 gap-2">
                {notices.map((n) => {
                  const open = today <= n.procedure.publicity.end;
                  const place = [n.quartier, n.commune].filter(Boolean).join(", ") || fr.publicity.unknownPlace;
                  return (
                    <Item key={n.nup} className="bg-white" render={<Link href={`/publicite/${n.nup}`} />}>
                      <ItemContent>
                        <ItemTitle className="tabular font-display text-base font-bold tracking-[0.03em] text-navy">
                          {n.nup}
                        </ItemTitle>
                        <ItemDescription>
                          {place}
                          {fmtArea(n.areaM2) && <> · {fmtArea(n.areaM2)}</>}
                        </ItemDescription>
                      </ItemContent>
                      <ItemActions className="flex-col items-end gap-1 text-right">
                        <Badge variant={open ? "default" : "outline"} className="rounded-sm">
                          {open ? fr.publicity.open : fr.publicity.closed}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {fr.publicity.until} {fmtDate(n.procedure.publicity.end)}
                        </span>
                      </ItemActions>
                    </Item>
                  );
                })}
              </ItemGroup>
            </div>
          </div>
        </section>

        {/* Assistant */}
        <section className="py-20 lg:py-28">
          <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-12 lg:px-8">
            <div className="lg:col-span-5">
              <h2 className="text-[clamp(2rem,4vw,3rem)] leading-[1.04] font-extrabold text-navy">{fr.assistant.title}</h2>
              <p className="mt-5 text-lg leading-relaxed text-muted-foreground">{fr.assistant.lead}</p>
              <Link href="/assistant" className={cn(buttonVariants({ size: "lg" }), "mt-8 h-12 bg-signal px-5 text-base font-bold text-signal-ink hover:bg-[#ffe033]")}>
                {fr.assistant.cta}
                <ArrowRightIcon data-icon="inline-end" />
              </Link>
            </div>
            <figure className="lg:col-span-6 lg:col-start-7" aria-label={fr.assistant.sampleLabel}>
              <p className="text-xs font-medium text-muted-foreground">{fr.assistant.sampleLabel}</p>
              <div className="mt-3 space-y-4">
                <p className="ml-auto w-fit max-w-[85%] rounded-lg rounded-br-sm bg-navy px-4 py-3 text-white">
                  {fr.assistant.question}
                </p>
                <div className="max-w-[92%] rounded-lg rounded-bl-sm bg-sky px-5 py-4">
                  <div className="space-y-2.5 leading-relaxed">
                    {fr.assistant.answer.map((line) => (
                      <p key={line}>{line}</p>
                    ))}
                  </div>
                  <p className="mt-4 flex items-center gap-2 border-t border-sky-line pt-3 text-xs text-muted-foreground">
                    <ScaleIcon className="size-3.5 shrink-0" aria-hidden="true" />
                    <span>
                      <span className="font-semibold text-navy">{fr.assistant.sourceLabel}&nbsp;:</span> {fr.assistant.source}
                    </span>
                  </p>
                </div>
              </div>
            </figure>
          </div>
        </section>

        {/* Frais */}
        <section className="bg-sky py-20 lg:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
              <h2 className="text-[clamp(2rem,4vw,3rem)] leading-[1.04] font-extrabold text-navy lg:col-span-5">{fr.fees.title}</h2>
              <p className="max-w-2xl text-lg leading-relaxed text-muted-foreground lg:col-span-6 lg:col-start-7">{fr.fees.lead}</p>
            </div>
            <div className="mt-10">
              <FeeCalculator />
            </div>
            <dl className="mt-6 grid gap-x-8 gap-y-2 text-sm sm:grid-cols-3">
              {fr.fees.rules.map((r) => (
                <div key={r.range} className="flex justify-between gap-4 border-b border-sky-line py-2 sm:block">
                  <dt className="text-muted-foreground">{r.range}</dt>
                  <dd className="font-semibold text-navy">{r.rule}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* Démarches */}
        <section className="py-20 lg:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <div className="max-w-2xl">
                <h2 className="text-[clamp(2rem,4vw,3rem)] leading-[1.04] font-extrabold text-navy">{fr.services.title}</h2>
                <p className="mt-4 text-lg leading-relaxed text-muted-foreground">{fr.services.lead}</p>
              </div>
              <Link href="/guides" className={cn(buttonVariants({ variant: "outline", size: "lg" }), "h-11 px-4")}>
                {fr.services.all}
                <ArrowRightIcon data-icon="inline-end" />
              </Link>
            </div>
            <ItemGroup className="mt-10 gap-2 md:hidden">
              {fr.services.items.map((s) => (
                <Item key={s.name} variant="outline" className="items-start">
                  <ItemContent>
                    <ItemTitle className="font-semibold">{s.name}</ItemTitle>
                    <ItemDescription>{s.what}</ItemDescription>
                    <p className="mt-2 text-sm">
                      <span className="tabular font-display font-bold text-navy">{s.delay}</span>
                      <span className="text-muted-foreground"> · {s.cost} · {s.who}</span>
                    </p>
                  </ItemContent>
                </Item>
              ))}
            </ItemGroup>
            <div className="mt-10 hidden overflow-hidden rounded-lg border md:block">
              <Table>
                <TableHeader className="bg-sky">
                  <TableRow>
                    <TableHead className="h-11 pl-5 text-navy">Démarche</TableHead>
                    <TableHead className="text-navy">Délai</TableHead>
                    <TableHead className="text-navy">Coût</TableHead>
                    <TableHead className="pr-5 text-navy">Qui peut la faire</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {fr.services.items.map((s) => (
                    <TableRow key={s.name}>
                      <TableCell className="py-4 pl-5 whitespace-normal">
                        <p className="font-semibold">{s.name}</p>
                        <p className="text-sm text-muted-foreground">{s.what}</p>
                      </TableCell>
                      <TableCell className="tabular font-display font-bold text-navy">{s.delay}</TableCell>
                      <TableCell className="tabular">{s.cost}</TableCell>
                      <TableCell className="pr-5 whitespace-normal text-muted-foreground">{s.who}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </section>

        {/* Clôture */}
        <section className="bg-navy py-20 text-white">
          <div className="mx-auto flex max-w-7xl flex-col items-start gap-8 px-4 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
            <h2 className="max-w-2xl text-[clamp(1.9rem,4vw,3rem)] leading-[1.04] font-extrabold">{fr.close.title}</h2>
            <VerifyAgain />
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
