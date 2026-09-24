import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SpaceBody, SpaceHeader } from "@/components/app/space-header";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { copilot } from "@/lib/copilot";
import { getParcel } from "@/lib/data/parcels";
import { getDossier } from "@/lib/data/workflow";
import { fmtDate } from "@/lib/labels";

export const metadata: Metadata = { title: "Historique du dossier · Espace agent" };

export default async function DossierHistory({ params }: PageProps<"/agent/dossiers/[id]/historique">) {
  const d = getDossier((await params).id);
  if (!d) notFound();
  const ai = copilot(d, getParcel(d.nup)!);
  type Entry = [string, string, string, string];
  const log: Entry[] = [
    [d.createdAt, "Système", "Dépôt", "Dossier reçu depuis le portail des e-services"] as Entry,
    [d.createdAt, "IA · lecture des pièces", "Extraction", `${d.documents.length} pièces lues, complétude ${d.completeness} %`] as Entry,
    [d.createdAt, "IA · copilote", "Suggestion", `Recommandation : ${ai.recommendation} (${ai.anomalies.length} points d'attention)`] as Entry,
    ...d.messages.filter((m) => m.from === "agent").map((m) => [m.date, "Sènami Adjovi", "Message", m.text] as [string, string, string, string]),
    ...d.steps.filter((s) => s.state === "done" && s.date).map((s) => [s.date!, "Sènami Adjovi", "Étape", s.label] as [string, string, string, string]),
  ].sort((a, b) => a[0].localeCompare(b[0]));
  return (
    <>
      <SpaceHeader title={`Historique · ${d.id}`} lead="Journal immuable : chaque action humaine et chaque suggestion de l'IA, acceptée ou non." />
      <SpaceBody>
        <div className="max-w-5xl overflow-x-auto rounded-lg border bg-card">
          <Table>
            <TableHeader><TableRow><TableHead className="pl-4">Date</TableHead><TableHead>Auteur</TableHead><TableHead>Action</TableHead><TableHead className="pr-4">Détail</TableHead></TableRow></TableHeader>
            <TableBody>
              {log.map(([date, who, what, detail], i) => (
                <TableRow key={i}>
                  <TableCell className="tabular pl-4">{fmtDate(date)}</TableCell>
                  <TableCell>{who}</TableCell>
                  <TableCell>{what}</TableCell>
                  <TableCell className="pr-4 whitespace-normal">{detail}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </SpaceBody>
    </>
  );
}
