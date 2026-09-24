import Link from "next/link";
import { MenuIcon, UserRoundIcon } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { fr } from "@/i18n/fr";
import { cn } from "@/lib/utils";
import { Logo } from "./logo";

export function SiteHeader() {
  return (
    <header className="relative z-20 bg-navy text-white">
      <div className="tricolor h-1" />
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-6 px-4 sm:px-6 lg:px-8">
        <Logo />
        <nav aria-label="Navigation principale" className="ml-auto hidden lg:block">
          <ul className="flex items-center gap-1">
            {fr.nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="rounded-md px-3 py-2 text-[0.95rem] font-medium text-white/80 transition-colors hover:bg-white/10 hover:text-white"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <Link
          href="/connexion"
          className={cn(
            buttonVariants({ variant: "outline", size: "lg" }),
            "ml-auto hidden border-white/30 bg-transparent px-3.5 text-white hover:bg-white hover:text-navy sm:inline-flex lg:ml-2"
          )}
        >
          <UserRoundIcon data-icon="inline-start" />
          {fr.account}
        </Link>
        <Sheet>
          <SheetTrigger
            className={cn(buttonVariants({ variant: "ghost", size: "icon-lg" }), "ml-auto text-white hover:bg-white/10 hover:text-white sm:ml-0 lg:hidden")}
            aria-label={fr.menu}
          >
            <MenuIcon />
          </SheetTrigger>
          <SheetContent side="right" className="w-[min(20rem,85vw)] bg-navy text-white">
            <SheetHeader>
              <SheetTitle className="text-white">{fr.menu}</SheetTitle>
            </SheetHeader>
            <nav aria-label="Navigation mobile" className="flex flex-col gap-1 px-4">
              {fr.nav.map((item) => (
                <Link key={item.href} href={item.href} className="rounded-md px-3 py-3 text-lg font-medium hover:bg-white/10">
                  {item.label}
                </Link>
              ))}
              <Link
                href="/connexion"
                className={cn(buttonVariants({ size: "lg" }), "mt-4 h-12 bg-signal text-signal-ink hover:bg-[#ffe033]")}
              >
                {fr.account}
              </Link>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
