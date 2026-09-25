import type { Metadata } from "next";
import Link from "next/link";
import { ParcelRow } from "@/components/parcel/parcel-row";
import { LinkedMap } from "@/components/map/linked-map";
import { PageHeader } from "@/components/site/page-header";
import { NoticeBadge, NoticeFlags } from "@/components/parcel/notice-flags";
import { Badge } from "@/components/ui/badge";
import { ItemGroup } from "@/components/ui/item";
import { isPublicityOpen, listPublicityNotices } from "@/lib/data/parcels";
import { noticeChecks } from "@/lib/geo/notice-check";
import { daysUntil, fmtDate } from "@/lib/labels";

// Les fenêtres de publicité dépendent du jour : régénération horaire.
export const revalidate = 3600;

export const metadata: Metadata = { title: "Publicité foncière · Foncier Intelligent" };

export default async function PublicityPage() {
  const checks = await noticeChecks();
  const flagsOf = (nup: string) => checks.get(nup) ?? [];
  const notices = listPublicityNotices();
  const flagged = notices.filter((n) => flagsOf(n.nup).length);
  const open = notices.filter((n) => isPublicityOpen(n));
  const closed = notices.filter((n) => !isPublicityOpen(n)).slice(0, 20);

  return (
    <>
      <PageHeader
        title="Publicité foncière"
        lead="Chaque demande de titre ou de confirmation de droits est publiée pendant 15 jours. Pendant ce délai, toute personne concernée peut s'opposer. Vérifiez qu'aucune demande ne touche votre terrain."
        crumbs={[["Publicité foncière"]]}
      />
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-10 sm:px-6 lg:grid-cols-12 lg:px-8">
        <div className="lg:col-span-7">
          <h2 className="text-xl font-bold text-navy">
            Opposition possible <span className="tabular text-muted-foreground">({open.length})</span>
          </h2>
          <ItemGroup className="mt-4 gap-2">
            {open.map((n) => {
              const days = daysUntil(n.procedure!.publicity.end);
              return (
                <ParcelRow
                  key={n.nup}
                  parcel={n}
                  href={`/publicite/${n.nup}`}
                  aside={
                    <span className="flex flex-col items-end gap-1">
                      <NoticeBadge flags={flagsOf(n.nup)} />
                      <Badge className="rounded-sm">{days <= 1 ? "Dernier jour" : `${days} jours restants`}</Badge>
                      <span className="text-xs text-muted-foreground">jusqu&apos;au {fmtDate(n.procedure!.publicity.end)}</span>
                    </span>
                  }
                />
              );
            })}
          </ItemGroup>
          {!open.length && <p className="mt-3 text-muted-foreground">Aucun avis ouvert en ce moment.</p>}

          <h2 className="mt-12 text-xl font-bold text-navy">
            Signalés par le contrôle automatique <span className="tabular text-muted-foreground">({flagged.length} sur {notices.length})</span>
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Chaque avis est croisé avec les couches de l&apos;ANDF (litiges, zones réservées, domaine public, titres existants) et avec les autres avis.
          </p>
          <ul className="mt-4 space-y-2">
            {flagged.map((n) => (
              <li key={n.nup} className="rounded-lg border bg-card p-4">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <Link href={`/publicite/${n.nup}`} className="tabular font-semibold text-navy hover:underline">{n.nup}</Link>
                  <span className="text-xs text-muted-foreground">{n.quartier}, {n.commune} · {isPublicityOpen(n) ? "opposition ouverte jusqu'au" : "clos le"} {fmtDate(n.procedure!.publicity.end)}</span>
                </div>
                <NoticeFlags flags={flagsOf(n.nup)} className="mt-2" />
              </li>
            ))}
          </ul>

          <h2 className="mt-12 text-xl font-bold text-navy">Avis clos récents</h2>
          <ItemGroup className="mt-4 gap-2">
            {closed.map((n) => (
              <ParcelRow
                key={n.nup}
                parcel={n}
                href={`/publicite/${n.nup}`}
                aside={<span className="flex flex-col items-end gap-1"><NoticeBadge flags={flagsOf(n.nup)} /><span className="text-xs text-muted-foreground">clos le {fmtDate(n.procedure!.publicity.end)}</span></span>}
              />
            ))}
          </ItemGroup>
        </div>
        <aside className="lg:col-span-5">
          <div className="sticky top-6">
            <div className="aspect-square overflow-hidden rounded-lg border lg:aspect-[4/5]">
              <LinkedMap
                parcels={[...new Set([...open, ...flagged])].map((n) => ({
                  nup: n.nup,
                  polygon: n.polygon,
                  level: flagsOf(n.nup).some((f) => f.level === "danger") ? ("danger" as const) : ("caution" as const),
                }))} hrefBase="/publicite" label="Carte des avis de publicité foncière" />
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              Avis ouverts et avis signalés (rouge : zone bloquante). Source : avis de publicité foncière publiés sur andf.bj, polygones du cadastre de l&apos;ANDF.
            </p>
          </div>
        </aside>
      </div>
    </>
  );
}
