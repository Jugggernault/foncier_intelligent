import { AlertTriangleIcon, CheckCircle2Icon } from "lucide-react";
import { fmtFcfa } from "@/lib/labels";

/** Contrôle du prix déclaré contre l'estimation (IA-13, FI-02). */
export function PriceCheck({ price, low, high }: { price: number; low: number; high: number }) {
  const under = price < low * 0.7;
  return (
    <div className={under ? "flex gap-2 rounded-md bg-caution-soft p-3 text-caution" : "flex gap-2 rounded-md bg-clear-soft p-3 text-clear"}>
      {under ? <AlertTriangleIcon className="mt-0.5 size-4 shrink-0" /> : <CheckCircle2Icon className="mt-0.5 size-4 shrink-0" />}
      <p>
        {under ? "Prix nettement inférieur à l'estimation du secteur" : "Prix cohérent avec l'estimation du secteur"} ({fmtFcfa(low)} – {fmtFcfa(high)}).
        {under && " Une justification pourra être demandée."}
      </p>
    </div>
  );
}
