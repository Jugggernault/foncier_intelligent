import { KPIS } from "@/lib/data/pilotage";
import { cn } from "@/lib/utils";

/** Indicateurs : départ, actuel, cible, avec progression vers la cible. */
export function KpiTable() {
  return (
    <div className="divide-y rounded-lg border bg-card">
      {KPIS.map((k) => {
        const progress = Math.max(0, Math.min(1, (k.now - k.start) / (k.target - k.start)));
        return (
          <div key={k.label} className="grid gap-3 px-5 py-4 sm:grid-cols-[1fr_auto] sm:items-center">
            <div>
              <p className="font-semibold">{k.label}</p>
              <div className="mt-2 h-1.5 max-w-md overflow-hidden rounded-full bg-sky-line">
                <div className={cn("h-full", progress >= 1 ? "bg-clear" : "bg-navy")} style={{ width: `${progress * 100}%` }} />
              </div>
            </div>
            <dl className="tabular grid grid-cols-3 gap-6 text-right text-sm">
              <div><dt className="text-xs text-muted-foreground">Départ</dt><dd>{k.start}</dd></div>
              <div><dt className="text-xs text-muted-foreground">Actuel</dt><dd className="text-lg font-extrabold text-navy">{k.now}</dd></div>
              <div><dt className="text-xs text-muted-foreground">Cible</dt><dd>{k.target} <span className="text-xs text-muted-foreground">{k.unit}</span></dd></div>
            </dl>
          </div>
        );
      })}
    </div>
  );
}
