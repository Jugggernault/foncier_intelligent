import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";
import { PageHeader } from "@/components/site/page-header";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { GUIDES } from "@/content/guides";
import { fr } from "@/i18n/fr";

export const metadata: Metadata = { title: "Démarches foncières · Foncier Intelligent" };

export default function GuidesPage() {
  return (
    <>
      <PageHeader
        title="Démarches foncières"
        lead="Acheter, faire établir un titre, vendre, contester : chaque démarche expliquée étape par étape, avec ses pièces, ses délais et ses coûts."
        crumbs={[["Démarches"]]}
      />
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <ul className="grid gap-x-10 divide-y border-y md:grid-cols-2 md:divide-y-0">
          {GUIDES.map((g) => (
            <li key={g.slug} className="md:border-b">
              <Link href={`/guides/${g.slug}`} className="group flex items-start justify-between gap-6 py-6">
                <div>
                  <h2 className="text-xl font-bold text-navy group-hover:underline group-hover:underline-offset-4">{g.title}</h2>
                  <p className="mt-2 text-muted-foreground">{g.summary}</p>
                  {(g.delay || g.cost) && (
                    <p className="tabular mt-3 text-sm font-semibold text-navy">{[g.delay, g.cost].filter(Boolean).join(" · ")}</p>
                  )}
                </div>
                <ArrowRightIcon className="mt-1.5 size-5 shrink-0 text-navy transition-transform group-hover:translate-x-1" />
              </Link>
            </li>
          ))}
        </ul>

        <h2 className="mt-16 text-2xl font-extrabold text-navy">{fr.services.title}</h2>
        <p className="mt-2 text-muted-foreground">{fr.services.lead}</p>
        <div className="mt-6 overflow-x-auto rounded-lg border">
          <Table>
            <TableHeader className="bg-sky">
              <TableRow>
                <TableHead className="pl-5 text-navy">Démarche</TableHead>
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
    </>
  );
}
