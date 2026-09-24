"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table";
import { ArrowUpDownIcon, SearchIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { KIND_LABEL, STATUS_LABEL, type Dossier, type DossierStatus } from "@/lib/data/workflow";
import { cn } from "@/lib/utils";
import { StatusBadge } from "./workflow-bits";

export type Row = Pick<Dossier, "id" | "kind" | "nup" | "applicant" | "status" | "createdAt" | "dueAt" | "completeness" | "anomalyScore"> & { commune: string };

const FILTERS: (DossierStatus | "tous")[] = ["tous", "depose", "instruction", "complement", "publicite"];

function sortable(label: string) {
  // eslint-disable-next-line react/display-name -- en-tête de colonne triable
  return ({ column }: { column: { toggleSorting: (desc?: boolean) => void; getIsSorted: () => false | "asc" | "desc" } }) => (
    <Button variant="ghost" size="sm" className="-ml-2" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
      {label} <ArrowUpDownIcon />
    </Button>
  );
}

const columns: ColumnDef<Row>[] = [
  { accessorKey: "id", header: "Dossier", cell: ({ row }) => <span className="tabular font-semibold text-navy">{row.original.id}</span> },
  { accessorKey: "kind", header: "Démarche", cell: ({ row }) => KIND_LABEL[row.original.kind] },
  { accessorKey: "nup", header: "Parcelle", cell: ({ row }) => <span className="tabular">{row.original.nup}</span> },
  { accessorKey: "applicant", header: "Demandeur" },
  { accessorKey: "commune", header: "Commune" },
  {
    accessorKey: "completeness",
    header: sortable("Complétude"),
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <div className="h-1.5 w-16 overflow-hidden rounded-full bg-sky-line">
          <div className={cn("h-full", row.original.completeness === 100 ? "bg-clear" : "bg-caution")} style={{ width: `${row.original.completeness}%` }} />
        </div>
        <span className="tabular text-xs">{row.original.completeness} %</span>
      </div>
    ),
  },
  {
    accessorKey: "anomalyScore",
    header: sortable("Anomalies"),
    cell: ({ row }) => {
      const s = row.original.anomalyScore;
      return (
        <Badge className={cn("tabular rounded-sm", s > 0.6 ? "bg-danger-soft text-danger" : s > 0.3 ? "bg-caution-soft text-caution" : "bg-clear-soft text-clear")}>
          {Math.round(s * 100)}
        </Badge>
      );
    },
  },
  { accessorKey: "dueAt", header: sortable("Échéance"), cell: ({ row }) => <span className="tabular">{row.original.dueAt}</span> },
  { accessorKey: "status", header: "Statut", cell: ({ row }) => <StatusBadge status={row.original.status} /> },
];

export function DossierTable({ rows, hrefBase }: { rows: Row[]; hrefBase: string }) {
  const router = useRouter();
  const [sorting, setSorting] = useState<SortingState>([{ id: "anomalyScore", desc: true }]);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<DossierStatus | "tous">("tous");
  const data = useMemo(() => rows.filter((r) => status === "tous" || r.status === status), [rows, status]);

  // eslint-disable-next-line react-hooks/incompatible-library -- TanStack Table n'est pas mémoïsable par le compilateur
  const table = useReactTable({
    data,
    columns,
    state: { sorting, globalFilter: query },
    onSortingChange: setSorting,
    onGlobalFilterChange: setQuery,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <InputGroup className="h-9 w-full max-w-xs bg-card">
          <InputGroupAddon><SearchIcon /></InputGroupAddon>
          <InputGroupInput placeholder="Dossier, NUP, demandeur…" value={query} onChange={(e) => setQuery(e.target.value)} aria-label="Filtrer" />
        </InputGroup>
        <ToggleGroup value={[status]} onValueChange={(v) => v[0] && setStatus(v[0] as DossierStatus | "tous")} variant="outline" size="sm" spacing={0} className="bg-card">
          {FILTERS.map((f) => (
            <ToggleGroupItem key={f} value={f} className="px-3 data-pressed:bg-navy data-pressed:text-white">
              {f === "tous" ? "Tous" : STATUS_LABEL[f]}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
        <span className="tabular ml-auto text-sm text-muted-foreground">{table.getRowModel().rows.length} dossiers</span>
      </div>
      <div className="overflow-x-auto rounded-lg border bg-card">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((hg) => (
              <TableRow key={hg.id}>
                {hg.headers.map((h) => (
                  <TableHead key={h.id} className="first:pl-4">{h.isPlaceholder ? null : flexRender(h.column.columnDef.header, h.getContext())}</TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow key={row.id} className="cursor-pointer" onClick={() => router.push(`${hrefBase}/${row.original.id}`)}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} className="first:pl-4">{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
