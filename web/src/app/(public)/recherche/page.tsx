import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { SearchIcon, SearchXIcon } from "lucide-react";
import { ParcelRow } from "@/components/parcel/parcel-row";
import { PageHeader } from "@/components/site/page-header";
import { Button } from "@/components/ui/button";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { ItemGroup } from "@/components/ui/item";
import { getParcel, NUP_PATTERN, searchParcels } from "@/lib/data/parcels";

export const metadata: Metadata = { title: "Rechercher une parcelle · Foncier Intelligent" };

const EXAMPLES = ["101236198", "Fidjrossè", "Godomey", "Porto-Novo", "Parakou"];

export default async function SearchPage({ searchParams }: PageProps<"/recherche">) {
  const q = String((await searchParams).q ?? "").trim();
  if (NUP_PATTERN.test(q) && getParcel(q)) redirect(`/parcelle/${q}`);
  const results = q ? searchParcels(q, 40) : [];

  return (
    <>
      <PageHeader
        title="Rechercher une parcelle"
        lead="Par numéro unique de parcelle (NUP), numéro de titre foncier, commune, arrondissement ou quartier."
        crumbs={[["Rechercher"]]}
      />
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <form action="/recherche" className="flex flex-col gap-2 sm:flex-row" role="search">
          <InputGroup className="h-14 rounded-md sm:flex-1">
            <InputGroupAddon className="pl-4">
              <SearchIcon className="size-5" />
            </InputGroupAddon>
            <InputGroupInput name="q" defaultValue={q} placeholder="NUP, titre foncier ou lieu" aria-label="Recherche" className="text-lg" />
          </InputGroup>
          <Button type="submit" className="h-14 rounded-md bg-signal px-7 text-base font-bold text-signal-ink hover:bg-[#ffe033]">
            Rechercher
          </Button>
        </form>
        <p className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
          Exemples :
          {EXAMPLES.map((e) => (
            <a key={e} href={`/recherche?q=${encodeURIComponent(e)}`} className="font-medium text-navy underline-offset-4 hover:underline">
              {e}
            </a>
          ))}
        </p>

        {q && (
          <section className="mt-10" aria-live="polite">
            <h2 className="text-sm font-semibold text-muted-foreground">
              {results.length ? `${results.length} parcelle${results.length > 1 ? "s" : ""} pour « ${q} »` : null}
            </h2>
            {results.length ? (
              <ItemGroup className="mt-3 gap-2">
                {results.map((p) => (
                  <ParcelRow key={p.nup} parcel={p} />
                ))}
              </ItemGroup>
            ) : (
              <Empty className="mt-6 border">
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <SearchXIcon />
                  </EmptyMedia>
                  <EmptyTitle>Aucun résultat pour « {q} »</EmptyTitle>
                  <EmptyDescription>
                    {NUP_PATTERN.test(q) ? (
                      <>
                        Ce NUP n&apos;est pas dans la démonstration.{" "}
                        <a href={`https://cadastre.andf.bj/nup/${q}`} target="_blank" rel="noreferrer">
                          Voir sur le cadastre ANDF
                        </a>
                      </>
                    ) : (
                      "Essayez un nom de commune ou de quartier, ou un NUP à 9 chiffres."
                    )}
                  </EmptyDescription>
                </EmptyHeader>
              </Empty>
            )}
          </section>
        )}
      </div>
    </>
  );
}
