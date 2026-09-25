import type { Metadata } from "next";
import Link from "next/link";
import { SpaceBody, SpaceHeader } from "@/components/app/space-header";
import { NoticeBadge, NoticeFlags } from "@/components/parcel/notice-flags";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { isPublicityOpen, listPublicityNotices, neighbours } from "@/lib/data/parcels";
import { listDossiers } from "@/lib/data/workflow";
import { noticeChecks } from "@/lib/geo/notice-check";
import { daysUntil, fmtDate } from "@/lib/labels";

export const metadata: Metadata = { title: "Publicité foncière · Espace agent" };

export default async function AgentPublicity() {
  const toPublish = listDossiers().filter((d) => d.status === "instruction" && d.anomalyScore < 0.3).slice(0, 5);
  const checks = await noticeChecks();
  const flagsOf = (nup: string) => checks.get(nup) ?? [];
  const rank = (nup: string) => (flagsOf(nup).some((f) => f.level === "danger") ? 0 : flagsOf(nup).length ? 1 : 2);
  const notices = listPublicityNotices().sort((a, b) => rank(a.nup) - rank(b.nup));
  const flagged = notices.filter((n) => flagsOf(n.nup).length);
  return (
    <>
      <SpaceHeader title="Publicité foncière" lead="Avis à préparer (projet rédigé par le copilote), avis en cours et oppositions reçues." />
      <SpaceBody>
        <h2 className="font-bold text-navy">Prêts pour publication</h2>
        <ul className="mt-3 flex flex-wrap gap-2">
          {toPublish.map((d) => (
            <li key={d.id}>
              <Link href={`/agent/dossiers/${d.id}`} className="block rounded-lg border bg-card px-4 py-3 text-sm hover:bg-sky">
                <span className="tabular font-semibold text-navy">{d.id}</span> · parcelle <span className="tabular">{d.nup}</span>
              </Link>
            </li>
          ))}
        </ul>
        <h2 className="mt-10 font-bold text-navy">Signalés par le contrôle automatique <span className="tabular text-muted-foreground">({flagged.length} sur {notices.length})</span></h2>
        <p className="mt-1 text-sm text-muted-foreground">Chaque avis publié est croisé avec les couches de l&apos;ANDF et avec les autres avis. À examiner avant la fin du délai d&apos;opposition.</p>
        <ul className="mt-3 grid gap-2 lg:grid-cols-2">
          {flagged.map((n) => (
            <li key={n.nup} className="rounded-lg border bg-card p-4">
              <div className="flex items-baseline justify-between gap-2">
                <Link href={`/agent/publicite/${n.nup}`} className="tabular font-semibold text-navy hover:underline">{n.nup}</Link>
                <span className="text-xs text-muted-foreground">{n.quartier}, {n.commune}{n.owner.kind === "state" ? " · demande de l'État" : ""}</span>
              </div>
              <NoticeFlags flags={flagsOf(n.nup)} className="mt-2" />
            </li>
          ))}
        </ul>
        <h2 className="mt-10 font-bold text-navy">Tous les avis</h2>
        <div className="mt-3 overflow-x-auto rounded-lg border bg-card">
          <Table>
            <TableHeader><TableRow><TableHead className="pl-4">Parcelle</TableHead><TableHead>Commune</TableHead><TableHead>Période</TableHead><TableHead>Riverains prévenus</TableHead><TableHead>Contrôle</TableHead><TableHead className="pr-4">État</TableHead></TableRow></TableHeader>
            <TableBody>
              {notices.map((p) => {
                const open = isPublicityOpen(p);
                return (
                  <TableRow key={p.nup}>
                    <TableCell className="pl-4"><Link href={`/agent/publicite/${p.nup}`} className="tabular font-semibold text-navy hover:underline">{p.nup}</Link></TableCell>
                    <TableCell>{p.quartier}, {p.commune}</TableCell>
                    <TableCell className="tabular">{fmtDate(p.procedure!.publicity.start)} → {fmtDate(p.procedure!.publicity.end)}</TableCell>
                    <TableCell className="tabular">{neighbours(p, 800).length}</TableCell>
                    <TableCell><NoticeBadge flags={flagsOf(p.nup)} /></TableCell>
                    <TableCell className="pr-4">{open ? <Badge className="rounded-sm bg-caution-soft text-caution">{daysUntil(p.procedure!.publicity.end)} j restants</Badge> : <Badge variant="outline" className="rounded-sm">Clos</Badge>}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </SpaceBody>
    </>
  );
}
