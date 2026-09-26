import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import React from "react";
import Markdoc from "@markdoc/markdoc";
import { PageHeader } from "@/components/site/page-header";
import { Prose } from "@/components/site/prose";
import { getDoc, listDocs } from "@/lib/docs";
import { cn } from "@/lib/utils";

export const dynamicParams = false;

export function generateStaticParams() {
  return listDocs().map((d) => ({ slug: d.slug ? [d.slug] : [] }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug?: string[] }> }): Promise<Metadata> {
  const doc = getDoc((await params).slug?.[0]);
  return { title: `${doc?.title ?? "Documentation"} · Foncier Intelligent`, description: doc?.description };
}

export default async function DocPage({ params }: { params: Promise<{ slug?: string[] }> }) {
  const slug = (await params).slug?.[0] ?? "";
  const doc = getDoc(slug);
  if (!doc) notFound();
  const docs = listDocs();

  return (
    <>
      <PageHeader
        title={doc.title}
        lead={doc.description}
        crumbs={slug ? [["Documentation", "/docs"], [doc.title]] : [["Documentation"]]}
      />
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-12 lg:gap-12 lg:px-8 lg:py-14">
        <nav aria-label="Documentation" className="lg:col-span-3">
          <ul className="-mx-4 flex gap-1 overflow-x-auto px-4 [scrollbar-width:none] lg:sticky lg:top-8 lg:mx-0 lg:flex-col lg:px-0">
            {docs.map((d) => (
              <li key={d.slug} className="shrink-0">
                <Link
                  href={`/docs${d.slug ? `/${d.slug}` : ""}`}
                  aria-current={d.slug === slug ? "page" : undefined}
                  className={cn(
                    "block rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    d.slug === slug ? "bg-sky text-navy" : "text-muted-foreground hover:bg-sky/60 hover:text-navy"
                  )}
                >
                  {d.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <Prose className="mx-0 max-w-3xl px-0 py-0 sm:px-0 lg:col-span-9 [&_h2]:scroll-mt-8 [&_pre]:mt-4 [&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:bg-navy-deep [&_pre]:p-4 [&_pre]:text-sm [&_pre]:text-white [&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_table]:mt-6 [&_table]:w-full [&_table]:text-left [&_table]:text-sm [&_td]:border-b [&_td]:border-sky-line [&_td]:py-3 [&_td]:pr-4 [&_td]:align-top [&_th]:border-b-2 [&_th]:border-sky-line [&_th]:pb-2 [&_th]:font-semibold [&_th]:text-navy">
          {Markdoc.renderers.react(doc.content, React)}
        </Prose>
      </div>
    </>
  );
}
