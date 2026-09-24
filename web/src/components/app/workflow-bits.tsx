import { Badge } from "@/components/ui/badge";
import type { Dossier, DossierStatus, Litige } from "@/lib/data/workflow";
import { LITIGE_STATUS, STATUS_LABEL } from "@/lib/data/workflow";
import { fmtDate } from "@/lib/labels";
import { cn } from "@/lib/utils";

const STATUS_TONE: Record<DossierStatus, string> = {
  brouillon: "bg-muted text-muted-foreground",
  depose: "bg-sky text-navy",
  instruction: "bg-sky text-navy",
  complement: "bg-caution-soft text-caution",
  publicite: "bg-caution-soft text-caution",
  valide: "bg-clear-soft text-clear",
  rejete: "bg-danger-soft text-danger",
};

export function StatusBadge({ status }: { status: DossierStatus }) {
  return <Badge className={cn("rounded-sm", STATUS_TONE[status])}>{STATUS_LABEL[status]}</Badge>;
}

export function LitigeBadge({ status }: { status: Litige["status"] }) {
  return (
    <Badge className={cn("rounded-sm", status === "clos" ? "bg-clear-soft text-clear" : status === "tribunal" ? "bg-danger-soft text-danger" : "bg-caution-soft text-caution")}>
      {LITIGE_STATUS[status]}
    </Badge>
  );
}

/** Frise verticale des étapes d'un dossier. */
export function Steps({ steps }: { steps: Dossier["steps"] }) {
  return (
    <ol className="space-y-5 border-l-2 border-sky-line pl-6">
      {steps.map((s) => (
        <li key={s.label} className="relative">
          <span
            className={cn(
              "absolute top-1 -left-[1.95rem] size-3.5 rounded-full ring-4 ring-background",
              s.state === "done" ? "bg-navy" : s.state === "current" ? "bg-signal" : "bg-sky-line"
            )}
          />
          <p className={cn("font-semibold", s.state === "todo" && "text-muted-foreground")}>
            {s.label}
            {s.state === "current" && <span className="ml-2 text-xs font-medium text-caution">en cours</span>}
          </p>
          {s.date && <p className="text-sm text-muted-foreground">{fmtDate(s.date)}</p>}
        </li>
      ))}
    </ol>
  );
}
