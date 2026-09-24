import Link from "next/link";
import { fr } from "@/i18n/fr";
import { Logo } from "./logo";

export function SiteFooter() {
  return (
    <footer className="bg-navy-deep text-white/70">
      <div className="tricolor h-1" />
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.4fr_repeat(3,1fr)] lg:px-8">
        <div className="max-w-sm space-y-4">
          <Logo />
          <p className="text-sm leading-relaxed">{fr.footer.about}</p>
        </div>
        {fr.footer.columns.map((col) => (
          <div key={col.title}>
            <h2 className="font-display text-sm font-bold tracking-normal text-white">{col.title}</h2>
            <ul className="mt-4 space-y-2.5 text-sm">
              {col.links.map(([label, href]) => (
                <li key={href}>
                  <Link href={href} className="transition-colors hover:text-signal">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-6 text-xs sm:px-6 lg:px-8">
          <p>UDI-AFRICA · 2026</p>
          <ul className="flex gap-5">
            {fr.footer.legal.map(([label, href]) => (
              <li key={href}>
                <Link href={href} className="hover:text-white">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
