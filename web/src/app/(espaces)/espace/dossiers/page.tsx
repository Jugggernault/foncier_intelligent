import type { Metadata } from "next";
import Link from "next/link";
import { PlusIcon } from "lucide-react";
import { SpaceBody, SpaceHeader } from "@/components/app/space-header";
import { StatusBadge } from "@/components/app/workflow-bits";
import { buttonVariants } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ME } from "@/lib/data/citizen";
import { dossiersOf, KIND_LABEL } from "@/lib/data/workflow";
import { fmtDate } from "@/lib/labels";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Mes dossiers · Foncier Intelligent" };

export default function MyDossiers() {
  const dossiers = dossiersOf(ME.initials);
  return (
    <>
      <SpaceHeader title="Mes dossiers" lead="Vos demandes auprès de l'ANDF, préparées ici et transmises au portail des e-services.">
        <Link href="/espace/dossiers/nouveau" className={cn(buttonVariants({ size: "lg" }), "h-10 px-4")}>
          <PlusIcon data-icon="inline-start" /> Nouveau dossier
        </Link>
      </SpaceHeader>
      <SpaceBody>
        <div className="overflow-x-auto rounded-lg border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-4">Dossier</TableHead>
                <TableHead>Démarche</TableHead>
                <TableHead>Parcelle</TableHead>
                <TableHead>Déposé le</TableHead>
                <TableHead className="pr-4">Statut</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dossiers.map((d) => (
                <TableRow key={d.id}>
                  <TableCell className="pl-4">
                    <Link href={`/espace/dossiers/${d.id}`} className="tabular font-semibold text-navy hover:underline">{d.id}</Link>
                  </TableCell>
                  <TableCell>{KIND_LABEL[d.kind]}</TableCell>
                  <TableCell className="tabular">{d.nup}</TableCell>
                  <TableCell>{fmtDate(d.createdAt)}</TableCell>
                  <TableCell className="pr-4"><StatusBadge status={d.status} /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </SpaceBody>
    </>
  );
}
