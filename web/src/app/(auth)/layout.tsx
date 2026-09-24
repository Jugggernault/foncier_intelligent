import { Logo } from "@/components/site/logo";

export default function AuthLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="grid min-h-dvh lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
      <aside className="relative hidden flex-col justify-between overflow-hidden bg-navy p-10 text-white lg:flex">
        <div className="tricolor absolute inset-x-0 top-0 h-1" />
        <Logo />
        <div>
          <p className="max-w-md font-display text-4xl leading-[1.05] font-extrabold">Le foncier béninois, vérifiable en 30 secondes.</p>
          <p className="mt-4 max-w-sm text-white/70">Connexion avec votre numéro personnel d&apos;identification (NPI), comme sur le portail des e-services.</p>
        </div>
        <p className="text-xs text-white/50">Démonstration UDI-AFRICA · non officielle</p>
      </aside>
      <main className="flex items-center justify-center px-4 py-12 sm:px-8">{children}</main>
    </div>
  );
}
