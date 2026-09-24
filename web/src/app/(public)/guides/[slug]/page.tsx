import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRightIcon, ScaleIcon } from "lucide-react";
import { PageHeader } from "@/components/site/page-header";
import { buttonVariants } from "@/components/ui/button";
import { GUIDES, getGuide } from "@/content/guides";
import { cn } from "@/lib/utils";

export function generateStaticParams() {
  return GUIDES.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: PageProps<"/guides/[slug]">): Promise<Metadata> {
  const g = getGuide((await params).slug);
  return { title: `${g?.title ?? "Démarche"} · Foncier Intelligent` };
}

export default async function GuidePage({ params }: PageProps<"/guides/[slug]">) {
  const g = getGuide((await params).slug);
  if (!g) notFound();
  const others = GUIDES.filter((o) => o.slug !== g.slug).slice(0, 3);

  return (
    <>
      <PageHeader title={g.title} lead={g.summary} crumbs={[["Démarches", "/guides"], [g.title]]} />
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-12 sm:px-6 lg:grid-cols-12 lg:px-8">
        <article className="lg:col-span-7">
          <h2 className="text-xl font-bold text-navy">Étapes</h2>
          <ol className="mt-6 space-y-6">
            {g.steps.map((s, i) => (
              <li key={s} className="flex gap-4">
                <span className="tabular grid size-8 shrink-0 place-items-center rounded-full bg-navy font-display text-sm font-bold text-white">
                  {i + 1}
                </span>
                <p className="pt-1 leading-relaxed">{s}</p>
              </li>
            ))}
          </ol>

          {g.documents && (
            <>
              <h2 className="mt-12 text-xl font-bold text-navy">Pièces à fournir</h2>
              <ul className="mt-4 list-disc space-y-2 pl-5 leading-relaxed marker:text-navy">
                {g.documents.map((d) => (
                  <li key={d}>{d}</li>
                ))}
              </ul>
            </>
          )}

          <p className="mt-12 flex items-start gap-2 border-t pt-4 text-sm text-muted-foreground">
            <ScaleIcon className="mt-0.5 size-4 shrink-0" />
            <span>
              <span className="font-semibold text-navy">Base légale :</span> {g.legal}
            </span>
          </p>
        </article>

        <aside className="space-y-6 lg:col-span-4 lg:col-start-9">
          <dl className="divide-y rounded-lg border">
            <Row label="Pour qui" value={g.audience} />
            {g.delay && <Row label="Délai" value={g.delay} />}
            {g.cost && <Row label="Coût" value={g.cost} />}
          </dl>
          {g.cta && (
            <Link href={g.cta.href} className={cn(buttonVariants({ size: "lg" }), "h-12 w-full bg-signal text-base font-bold text-signal-ink hover:bg-[#ffe033]")}>
              {g.cta.label}
              <ArrowRightIcon data-icon="inline-end" />
            </Link>
          )}
          <Link href="/assistant" className={cn(buttonVariants({ variant: "outline", size: "lg" }), "h-12 w-full")}>
            Poser une question à l&apos;assistant
          </Link>
          <div>
            <h2 className="text-sm font-semibold text-muted-foreground">Autres démarches</h2>
            <ul className="mt-3 space-y-2">
              {others.map((o) => (
                <li key={o.slug}>
                  <Link href={`/guides/${o.slug}`} className="font-medium text-navy underline-offset-4 hover:underline">
                    {o.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="px-5 py-4">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="mt-0.5 font-medium">{value}</dd>
    </div>
  );
}
