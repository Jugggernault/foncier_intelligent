import { AlertTriangleIcon, CheckCircle2Icon, XCircleIcon } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import type { Precheck } from "@/lib/geo/precheck";
import { cn } from "@/lib/utils";

const ICON = { ok: CheckCircle2Icon, warn: AlertTriangleIcon, fail: XCircleIcon };
const TONE = { ok: "text-clear", warn: "text-caution", fail: "text-danger" };

/** Rapport de pré-contrôle d'un plan : vu par le géomètre avant l'envoi, puis par l'agent qui le reçoit. */
export function PrecheckReport({ report, title = "Pré-contrôle ANDF" }: { report: Pick<Precheck, "checks" | "rejectRisk" | "context">; title?: string }) {
  return (
    <div className="space-y-4">
      <div>
        <div className="flex items-baseline justify-between gap-3">
          <h2 className="font-bold text-navy">{title}</h2>
          <span className={cn("tabular text-sm font-semibold", report.rejectRisk > 0.6 ? "text-danger" : report.rejectRisk > 0.3 ? "text-caution" : "text-clear")}>
            Risque de rejet : {Math.round(report.rejectRisk * 100)} %
          </span>
        </div>
        <Progress value={report.rejectRisk * 100} className="mt-2" aria-label="Risque de rejet" />
      </div>
      <ul className="space-y-3">
        {report.checks.map((c) => {
          const Icon = ICON[c.status];
          return (
            <li key={c.id} className="flex gap-3 text-sm">
              <Icon className={cn("mt-0.5 size-4 shrink-0", TONE[c.status])} />
              <div>
                <p className="font-semibold">{c.label}</p>
                <p className="text-muted-foreground">{c.detail}</p>
                {c.fix && c.status !== "ok" && <p className="mt-0.5 font-medium">{c.fix}</p>}
              </div>
            </li>
          );
        })}
      </ul>
      {report.context && (
        <p className="border-t pt-3 text-xs text-muted-foreground">
          Appris sur {new Intl.NumberFormat("fr-FR").format(report.context.plans)} plans déposés à {report.context.commune} : {Math.round(report.context.rejectRate * 100)} % rejetés.
          Premiers motifs : {report.context.topReasons.map((r) => `${r.label.toLowerCase()} (${Math.round(r.share * 100)} %)`).join(", ")}.
        </p>
      )}
    </div>
  );
}
