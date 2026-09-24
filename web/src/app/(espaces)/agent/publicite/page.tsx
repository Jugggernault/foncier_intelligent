import type { Metadata } from "next";
import Link from "next/link";
import { SpaceBody, SpaceHeader } from "@/components/app/space-header";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { isPublicityOpen, listPublicityNotices, neighbours } from "@/lib/data/parcels";
import { listDossiers } from "@/lib/data/workflow";
import { daysUntil, fmtDate } from "@/lib/labels";

export const metadata: Metadata = { title: "Publicité foncière · Espace agent" };

export default function AgentPublicity() {
  const toPublish = listDossiers().filter((d) => d.status === "instruction" && d.anomalyScore < 0.3).slice(0, 5);
  const notices = listPublicityNotices().slice(0, 25);
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
        <h2 className="mt-10 font-bold text-navy">Avis</h2>
        <div className="mt-3 overflow-x-auto rounded-lg border bg-card">
          <Table>
            <TableHeader><TableRow><TableHead className="pl-4">Parcelle</TableHead><TableHead>Commune</TableHead><TableHead>Période</TableHead><TableHead>Riverains prévenus</TableHead><TableHead className="pr-4">État</TableHead></TableRow></TableHeader>
            <TableBody>
              {notices.map((p) => {
                const open = isPublicityOpen(p);
                return (
                  <TableRow key={p.nup}>
                    <TableCell className="pl-4"><Link href={`/agent/publicite/${p.nup}`} className="tabular font-semibold text-navy hover:underline">{p.nup}</Link></TableCell>
                    <TableCell>{p.quartier}, {p.commune}</TableCell>
                    <TableCell className="tabular">{fmtDate(p.procedure!.publicity.start)} → {fmtDate(p.procedure!.publicity.end)}</TableCell>
                    <TableCell className="tabular">{neighbours(p, 800).length}</TableCell>
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
