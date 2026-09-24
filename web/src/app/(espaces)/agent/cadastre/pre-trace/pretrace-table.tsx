"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { PretraceLot } from "@/lib/data/agent";

const LABEL = { "a-valider": "À valider", valide: "Validé", rejete: "Rejeté" };

export function PretraceTable({ lots }: { lots: PretraceLot[] }) {
  const [rows, setRows] = useState(lots);
  const set = (id: string, status: PretraceLot["status"]) => {
    setRows(rows.map((r) => (r.id === id ? { ...r, status } : r)));
    toast.success(`Lot ${id} ${status === "valide" ? "validé" : "rejeté"}.`);
  };
  return (
    <div className="overflow-x-auto rounded-lg border bg-card">
      <Table>
        <TableHeader><TableRow><TableHead className="pl-4">Lot</TableHead><TableHead>Zone</TableHead><TableHead>Polygones</TableHead><TableHead>IoU moyen</TableHead><TableHead>Produit le</TableHead><TableHead>État</TableHead><TableHead className="pr-4" /></TableRow></TableHeader>
        <TableBody>
          {rows.map((l) => (
            <TableRow key={l.id}>
              <TableCell className="tabular pl-4 font-semibold">{l.id}</TableCell>
              <TableCell>{l.zone}, {l.commune}</TableCell>
              <TableCell className="tabular">{l.polygons}</TableCell>
              <TableCell className="tabular">{l.iou.toFixed(2)}</TableCell>
              <TableCell className="tabular">{l.produced}</TableCell>
              <TableCell><Badge variant={l.status === "a-valider" ? "secondary" : "outline"} className="rounded-sm">{LABEL[l.status]}</Badge></TableCell>
              <TableCell className="pr-4 text-right">
                {l.status === "a-valider" && (
                  <span className="flex justify-end gap-2">
                    <Button size="sm" onClick={() => set(l.id, "valide")}>Valider</Button>
                    <Button size="sm" variant="outline" onClick={() => set(l.id, "rejete")}>Rejeter</Button>
                  </span>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
