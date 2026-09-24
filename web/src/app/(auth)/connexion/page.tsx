import type { Metadata } from "next";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { Field, FieldDescription, FieldGroup, FieldLabel, FieldSeparator } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Connexion · Foncier Intelligent" };

export default function LoginPage() {
  return (
    <div className="w-full max-w-sm">
      <h1 className="text-3xl font-extrabold text-navy">Connexion</h1>
      <p className="mt-2 text-muted-foreground">Accédez à votre espace avec votre NPI.</p>
      {/* ponytail: formulaire factice ; la fédération NPI / PNS remplacera cette étape */}
      <form action="/verification" className="mt-8">
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="npi">Numéro personnel d&apos;identification (NPI)</FieldLabel>
            <Input id="npi" name="npi" inputMode="numeric" autoComplete="username" placeholder="10 chiffres" className="tabular h-11" />
          </Field>
          <Field>
            <FieldLabel htmlFor="password">Mot de passe</FieldLabel>
            <Input id="password" name="password" type="password" autoComplete="current-password" className="h-11" />
            <FieldDescription>Le même que sur service-public.bj.</FieldDescription>
          </Field>
          <Button type="submit" size="lg" className="h-11">Se connecter</Button>
          <FieldSeparator>ou</FieldSeparator>
          <Link href="/connexion/role" className={cn(buttonVariants({ size: "lg" }), "h-11 bg-signal font-bold text-signal-ink hover:bg-[#ffe033]")}>
            Entrer en démonstration
          </Link>
        </FieldGroup>
      </form>
    </div>
  );
}
