import type { Metadata } from "next";
import Link from "next/link";
import { ImpactCalculator } from "@/components/app/impact-calculator";
import { PageHeader } from "@/components/site/page-header";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { listPublicityNotices } from "@/lib/data/parcels";
import { DETECTABLE, impactStats } from "@/lib/geo/impact";
import { noticeChecks } from "@/lib/geo/notice-check";
import { titleCase as title } from "@/lib/labels";
import { cn } from "@/lib/utils";

export const revalidate = 86400;
export const metadata: Metadata = { title: "Impact · Foncier Intelligent", description: "Ce que le pré-contrôle et le contrôle des avis changeraient, chiffré sur les décisions réelles de l'ANDF." };

const n = (v: number) => new Intl.NumberFormat("fr-FR").format(v);
const pct = (a: number, b: number) => `${Math.round((a / b) * 100)} %`;

export default async function ImpactPage() {
  const [stats, checks] = await Promise.all([impactStats(), noticeChecks()]);
  const notices = listPublicityNotices();
  const flagged = notices.filter((p) => checks.get(p.nup)?.length);
  const blocking = notices.filter((p) => checks.get(p.nup)?.some((f) => f.level === "danger"));

  if (!stats)
    return (
      <PageHeader title="Impact" lead="Les statistiques s'affichent quand la base géographique est connectée." crumbs={[["Impact"]]} />
    );

  const avoidable = stats.byMotif.filter((m) => DETECTABLE.includes(m.code)).reduce((s, m) => s + m.n, 0);
  const max = stats.byMotif[0]?.n ?? 1;

  return (
    <>
      <PageHeader
        title="Impact"
        lead="Ce que le pré-contrôle des plans et le contrôle des avis changeraient, chiffré sur les décisions réelles de l'ANDF."
        crumbs={[["Impact"]]}
      />
      <div className="mx-auto max-w-7xl space-y-16 px-4 py-12 sm:px-6 lg:px-8">
        <dl className="grid gap-px overflow-hidden rounded-lg border bg-border sm:grid-cols-2 lg:grid-cols-4">
          {[
            [n(stats.plans), "plans de bornage déposés et instruits (TF en cours)"],
            [pct(stats.rejected, stats.plans), `rejetés ou renvoyés, soit ${n(stats.rejected)} dossiers`],
            [pct(avoidable, stats.rejected), `des rejets avaient une cause détectable avant le dépôt (${n(avoidable)} dossiers)`],
            [`${blocking.length} sur ${notices.length}`, "avis de publicité publiés sur une zone où le droit ne peut pas être confirmé"],
          ].map(([v, l]) => (
            <div key={l} className="bg-card p-6">
              <dd className="tabular font-display text-4xl font-extrabold text-navy">{v}</dd>
              <dt className="mt-2 text-sm leading-snug text-muted-foreground">{l}</dt>
            </div>
          ))}
        </dl>

        <section className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <h2 className="text-2xl font-bold text-navy">Pourquoi les plans sont rejetés</h2>
            <p className="mt-3 leading-relaxed text-muted-foreground">
              Motifs relevés par l&apos;ANDF sur {n(stats.rejected)} plans non validés. En jaune, ceux que le{" "}
              <Link href="/pro/leves/nouveau" className="font-medium text-navy underline underline-offset-4">pré-contrôle</Link> détecte avant le dépôt :
              plan mal calé ou qui chevauche un plan voisin, zone en procédure judiciaire, zone réservée à un projet public.
            </p>
          </div>
          <ul className="space-y-3 lg:col-span-7">
            {stats.byMotif.map((m) => {
              const hit = DETECTABLE.includes(m.code);
              return (
                <li key={m.code + m.label}>
                  <div className="flex justify-between gap-3 text-sm">
                    <span className={cn(hit && "font-semibold")}>{m.label}</span>
                    <span className="tabular text-muted-foreground">{n(m.n)}</span>
                  </div>
                  <div className="mt-1 h-2.5 rounded-full bg-muted">
                    <div className={cn("h-full rounded-full", hit ? "bg-signal" : "bg-navy/30")} style={{ width: `${(m.n / max) * 100}%` }} />
                  </div>
                </li>
              );
            })}
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-navy">Ce que le pré-contrôle ferait gagner</h2>
          <p className="mt-3 max-w-3xl leading-relaxed text-muted-foreground">
            Chaque rejet renvoie le dossier au géomètre : nouveau levé, nouveau dépôt, nouvelle attente. Réglez les hypothèses.
          </p>
          <div className="mt-6"><ImpactCalculator avoidable={avoidable} /></div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-navy">Où ça se joue</h2>
          <p className="mt-3 max-w-3xl leading-relaxed text-muted-foreground">Les dix communes qui déposent le plus de plans.</p>
          <div className="mt-6 overflow-x-auto rounded-lg border bg-card">
            <Table>
              <TableHeader>
                <TableRow><TableHead className="pl-4">Commune</TableHead><TableHead className="text-right">Plans</TableHead><TableHead className="text-right">Rejetés</TableHead><TableHead className="pr-4">Premier motif identifié</TableHead></TableRow>
              </TableHeader>
              <TableBody>
                {stats.byCommune.map((c) => (
                  <TableRow key={c.commune}>
                    <TableCell className="pl-4 font-medium">{title(c.commune)}</TableCell>
                    <TableCell className="tabular text-right">{n(c.plans)}</TableCell>
                    <TableCell className="tabular text-right">{pct(c.rejected, c.plans)}</TableCell>
                    <TableCell className="pr-4 text-muted-foreground">{c.topMotif ?? "—"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </section>

        <section className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <h2 className="text-2xl font-bold text-navy">Les avis de publicité, contrôlés avant la fin du délai</h2>
            <p className="mt-3 leading-relaxed text-muted-foreground">
              Chaque avis publié sur andf.bj est croisé avec les couches de l&apos;ANDF et avec les autres avis. Aujourd&apos;hui, {flagged.length} avis sur{" "}
              {notices.length} méritent un examen, dont {blocking.length} situés dans une zone bloquante.
            </p>
            <Link href="/publicite" className="mt-4 inline-block font-medium text-navy underline underline-offset-4">Voir les avis signalés</Link>
          </div>
          <ul className="space-y-2 lg:col-span-7">
            {blocking.slice(0, 6).map((p) => (
              <li key={p.nup} className="rounded-lg border bg-card px-4 py-3 text-sm">
                <Link href={`/publicite/${p.nup}`} className="tabular font-semibold text-navy hover:underline">{p.nup}</Link>
                <span className="text-muted-foreground"> · {p.quartier}, {p.commune} · </span>
                {checks.get(p.nup)![0].text}
              </li>
            ))}
          </ul>
        </section>

        <p className="border-t pt-6 text-xs text-muted-foreground">
          Sources : couche « TF en cours » fournie par l&apos;ANDF au Hackathon IA 2025 ({n(stats.plans)} plans, décision et motif de chacun), avis de publicité
          foncière publiés sur andf.bj, couches géographiques de l&apos;ANDF. Rejeté = non validé (« non », « manque d&apos;éléments physiques », « hors
          orthophotographie »). Les motifs « autre » ne sont pas comptés comme évitables.
        </p>
      </div>
    </>
  );
}
