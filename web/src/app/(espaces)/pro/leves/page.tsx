import type { Metadata } from "next";
import Link from "next/link";
import { SpaceBody, SpaceHeader } from "@/components/app/space-header";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { SURVEYS } from "@/lib/data/pro";
import { fmtDate } from "@/lib/labels";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Mes levés · Espace professionnel" };

const LABEL = { brouillon: "Brouillon", controle: "Contrôlé", transmis: "Transmis" };

export default function Surveys() {
  return (
    <>
      <SpaceHeader title="Mes levés" lead="Import, contrôle topologique automatique et transmission au cadastre.">
        <Link href="/pro/leves/nouveau" className={cn(buttonVariants({ size: "lg" }), "h-10 px-4")}>Importer un levé</Link>
      </SpaceHeader>
      <SpaceBody>
        <div className="max-w-5xl overflow-x-auto rounded-lg border bg-card">
          <Table>
            <TableHeader><TableRow><TableHead className="pl-4">Levé</TableHead><TableHead>Parcelle</TableHead><TableHead>Client</TableHead><TableHead>Sommets</TableHead><TableHead>Contrôle</TableHead><TableHead className="pr-4">État</TableHead></TableRow></TableHeader>
            <TableBody>
              {SURVEYS.map((s) => (
                <TableRow key={s.id}>
                  <TableCell className="pl-4"><Link href={`/pro/leves/${s.id}`} className="tabular font-semibold text-navy hover:underline">{s.id}</Link></TableCell>
                  <TableCell className="tabular">{s.nup}</TableCell>
                  <TableCell>{s.client}</TableCell>
                  <TableCell className="tabular">{s.points}</TableCell>
                  <TableCell>{s.issues ? <Badge className="rounded-sm bg-caution-soft text-caution">1 chevauchement</Badge> : <Badge className="rounded-sm bg-clear-soft text-clear">Conforme</Badge>}</TableCell>
                  <TableCell className="pr-4">{LABEL[s.status]} · {fmtDate(s.date)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </SpaceBody>
    </>
  );
}
