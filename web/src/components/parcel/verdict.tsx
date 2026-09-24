import { ShieldAlertIcon, ShieldCheckIcon, ShieldQuestionIcon } from "lucide-react";
import type { Assessment, RiskLevel } from "@/lib/risk";
import { cn } from "@/lib/utils";

export const LEVEL = {
  danger: { band: "bg-danger text-white", soft: "bg-danger-soft text-danger", icon: ShieldAlertIcon, label: "Rouge" },
  caution: { band: "bg-caution-soft text-caution", soft: "bg-caution-soft text-caution", icon: ShieldQuestionIcon, label: "Orange" },
  clear: { band: "bg-clear-soft text-clear", soft: "bg-clear-soft text-clear", icon: ShieldCheckIcon, label: "Vert" },
} satisfies Record<RiskLevel, unknown>;

/** Verdict complet, raisons dépliées : utilisé sur la fiche et dans les rapports. */
export function Verdict({ result, className }: { result: Assessment; className?: string }) {
  const s = LEVEL[result.level];
  const Icon = s.icon;
  return (
    <section aria-label="Verdict" className={cn("overflow-hidden rounded-lg", s.band, className)}>
      <div className="flex items-start gap-3 px-5 pt-5">
        <Icon className="mt-0.5 size-7 shrink-0" />
        <div>
          <p className="text-xs font-semibold uppercase opacity-80">Verdict {s.label.toLowerCase()}</p>
          <h2 className="mt-1 text-xl leading-snug font-extrabold tracking-[-0.01em]">{result.headline}</h2>
        </div>
      </div>
      <ul className="mt-4 space-y-3 px-5 pb-5">
        {result.reasons.map((r) => (
          <li key={r.text} className="border-t border-current/15 pt-3 text-sm leading-relaxed">
            <p>{r.text}</p>
            {r.action && <p className="mt-0.5 font-semibold">{r.action}</p>}
          </li>
        ))}
      </ul>
    </section>
  );
}
