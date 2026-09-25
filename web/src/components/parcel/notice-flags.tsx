import { ShieldAlertIcon, ShieldCheckIcon, ShieldQuestionIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { NoticeFlag } from "@/lib/geo/notice-check";
import { cn } from "@/lib/utils";

/** Signalements du contrôle automatique d'un avis de publicité. */
export function NoticeFlags({ flags, className }: { flags: NoticeFlag[]; className?: string }) {
  if (!flags.length)
    return (
      <p className={cn("flex items-center gap-2 text-sm text-clear", className)}>
        <ShieldCheckIcon className="size-4" /> Rien à signaler dans les couches de l&apos;ANDF.
      </p>
    );
  return (
    <ul className={cn("space-y-1.5", className)}>
      {flags.map((f) => (
        <li key={f.text} className={cn("flex gap-2 text-sm", f.level === "danger" ? "text-danger" : "text-caution")}>
          {f.level === "danger" ? <ShieldAlertIcon className="mt-0.5 size-4 shrink-0" /> : <ShieldQuestionIcon className="mt-0.5 size-4 shrink-0" />}
          <span className="text-foreground">{f.text}</span>
        </li>
      ))}
    </ul>
  );
}

export function NoticeBadge({ flags }: { flags: NoticeFlag[] }) {
  if (!flags.length) return null;
  const danger = flags.some((f) => f.level === "danger");
  return <Badge className={cn("rounded-sm", danger ? "bg-danger text-white" : "bg-caution-soft text-caution")}>{danger ? "Zone bloquante" : "À vérifier"}</Badge>;
}
