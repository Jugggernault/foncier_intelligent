import type { Metadata } from "next";
import Link from "next/link";
import { SpaceBody, SpaceHeader } from "@/components/app/space-header";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MUTATIONS } from "@/lib/data/pro";
import { fmtDate, fmtFcfa } from "@/lib/labels";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Mutations · Espace professionnel" };

const MUT_LABEL = { preparation: "En préparation", transmise: "Transmise", enregistree: "Enregistrée" };

export default function Mutations() {
  return (
    <>
      <SpaceHeader title="Mutations" lead="Transferts de titres fonciers après une vente, transmis à l'ANDF via E-Notaire.">
        <Link href="/pro/mutations/nouvelle" className={cn(buttonVariants({ size: "lg" }), "h-10 px-4")}>Préparer une mutation</Link>
      </SpaceHeader>
      <SpaceBody>
        <div className="overflow-x-auto rounded-lg border bg-card">
          <Table>
            <TableHeader><TableRow><TableHead className="pl-4">Mutation</TableHead><TableHead>Parcelle</TableHead><TableHead>Vendeur → acquéreur</TableHead><TableHead>Prix</TableHead><TableHead>Date</TableHead><TableHead className="pr-4">État</TableHead></TableRow></TableHeader>
            <TableBody>
              {MUTATIONS.map((m) => (
                <TableRow key={m.id}>
                  <TableCell className="pl-4"><Link href={`/pro/mutations/${m.id}`} className="tabular font-semibold text-navy hover:underline">{m.id}</Link></TableCell>
                  <TableCell className="tabular">{m.nup}</TableCell>
                  <TableCell>{m.seller} → {m.buyer}</TableCell>
                  <TableCell className="tabular">{fmtFcfa(m.price)}</TableCell>
                  <TableCell>{fmtDate(m.date)}</TableCell>
                  <TableCell className="pr-4"><Badge variant={m.status === "enregistree" ? "outline" : "secondary"} className="rounded-sm">{MUT_LABEL[m.status]}</Badge></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </SpaceBody>
    </>
  );
}
