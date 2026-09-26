import Link from "next/link";
import {
  ArrowUpRightIcon,
  BellIcon,
  CalculatorIcon,
  FileTextIcon,
  MapIcon,
  MessageCircleQuestionIcon,
  RulerIcon,
  SearchIcon,
  UserCheckIcon,
} from "lucide-react";
import { HowItWorks } from "@/components/landing/how-it-works";
import { ParcelVerifier, VerifyAgain } from "@/components/landing/parcel-verifier";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Item, ItemActions, ItemContent, ItemDescription, ItemGroup, ItemTitle } from "@/components/ui/item";
import { fr } from "@/i18n/fr";
import { listPublicityNotices } from "@/lib/data/parcels";
import { cn } from "@/lib/utils";

// Les fenêtres de publicité dépendent du jour : régénération horaire.
export const revalidate = 3600;

const TOOL_ICON = {
  search: SearchIcon,
  ruler: RulerIcon,
  map: MapIcon,
  bell: BellIcon,
  message: MessageCircleQuestionIcon,
  calculator: CalculatorIcon,
  user: UserCheckIcon,
  file: FileTextIcon,
} as const;

const fmtDate = (iso: string) =>
  new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "long", year: "numeric" }).format(new Date(iso));
const fmtArea = (m2?: number) =>
  m2 ? `${new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 1 }).format(m2 / 10_000)} ha` : null;

export default function Home() {
  const notices = listPublicityNotices().slice(0, 5);
  const today = new Date().toISOString().slice(0, 10);

  return (
    <>
        {/* Premier écran : la vérification elle-même */}
        <section id="top" className="bg-navy" aria-label="Vérifier une parcelle">
          <ParcelVerifier />
        </section>

        {/* Comment ça marche : trois cartes empilées */}
        <section className="bg-navy-deep pt-20 pb-24 text-white lg:pt-28 lg:pb-32">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
              <h2 className="text-[clamp(2rem,4.4vw,3.4rem)] leading-[1.02] font-extrabold text-balance lg:col-span-5">
                {fr.how.title}
              </h2>
              <p className="max-w-2xl text-lg leading-relaxed text-white/75 lg:col-span-6 lg:col-start-7">{fr.how.lead}</p>
            </div>
            <HowItWorks />
          </div>
        </section>

        {/* Les outils */}
        <section className="py-20 lg:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
              <h2 className="text-[clamp(2rem,4.4vw,3.4rem)] leading-[1.02] font-extrabold text-balance text-navy lg:col-span-5">
                {fr.tools.title}
              </h2>
              <p className="max-w-2xl text-lg leading-relaxed text-muted-foreground lg:col-span-6 lg:col-start-7">{fr.tools.lead}</p>
            </div>
            <ul className="mt-12 grid sm:grid-cols-2 lg:mt-16 lg:grid-cols-4">
              {fr.tools.items.map((tool, i) => {
                const Icon = TOOL_ICON[tool.icon];
                return (
                  <li
                    key={tool.href}
                    className={cn(
                      "border-sky-line max-sm:border-t max-sm:first:border-t-0 sm:border-l",
                      i % 2 === 1 && "sm:border-r lg:border-r-0",
                      i % 4 === 3 && "lg:border-r",
                      i >= 2 && "sm:border-t",
                      i >= 4 && "lg:border-t",
                      i < 4 && "lg:border-t-0"
                    )}
                  >
                    <Link
                      href={tool.href}
                      className="group relative flex h-full flex-col px-6 py-6 sm:py-8 transition-colors hover:bg-sky focus-visible:bg-sky focus-visible:outline-none lg:px-8 lg:py-10"
                    >
                      <span
                        aria-hidden="true"
                        className="absolute top-[5.875rem] max-sm:hidden -left-px h-6 -translate-y-1/2 w-1 rounded-r-sm bg-sky-line transition-all duration-300 ease-out group-hover:h-9 group-hover:bg-navy group-focus-visible:h-9 group-focus-visible:bg-navy lg:top-[6.375rem]"
                      />
                      <span className="flex items-start justify-between">
                        <Icon className="size-6 text-navy" aria-hidden="true" />
                        <ArrowUpRightIcon
                          className="size-4 -translate-x-1 translate-y-1 text-navy opacity-0 transition duration-300 ease-out group-hover:translate-0 group-hover:opacity-100 group-focus-visible:translate-0 group-focus-visible:opacity-100"
                          aria-hidden="true"
                        />
                      </span>
                      <span className="mt-6 font-display text-lg font-bold text-navy transition-transform duration-300 ease-out group-hover:translate-x-1.5 group-focus-visible:translate-x-1.5">
                        {tool.title}
                      </span>
                      <span className="mt-2 text-sm leading-relaxed text-muted-foreground">{tool.text}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
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
                  const open = today <= n.procedure!.publicity.end;
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
                          {fr.publicity.until} {fmtDate(n.procedure!.publicity.end)}
                        </span>
                      </ItemActions>
                    </Item>
                  );
                })}
              </ItemGroup>
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
    </>
  );
}
