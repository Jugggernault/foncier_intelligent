import Link from "next/link";
import { fr } from "@/i18n/fr";
import { cn } from "@/lib/utils";

/** Marque : une parcelle vue du ciel, un sommet borné en jaune. */
export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn("group inline-flex items-center gap-2.5 text-white", className)}>
      <svg viewBox="0 0 32 32" className="size-8 shrink-0" aria-hidden="true">
        <path d="M5 9.5 21 5l6 16-15 6z" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round" />
        <path d="M12 27 16.5 7.5" stroke="currentColor" strokeOpacity=".45" strokeWidth="1.6" />
        <circle cx="21" cy="5" r="3.4" fill="var(--signal)" />
      </svg>
      <span className="font-display text-[1.05rem] leading-none font-extrabold tracking-[-0.01em]">
        {fr.brand}
      </span>
    </Link>
  );
}
