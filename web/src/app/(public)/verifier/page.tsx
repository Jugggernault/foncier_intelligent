import type { Metadata } from "next";
import { PageHeader } from "@/components/site/page-header";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export const metadata: Metadata = { title: "Vérifier un rapport · Foncier Intelligent" };

export default function VerifyReport() {
  return (
    <>
      <PageHeader
        title="Vérifier un rapport"
        lead="Un vendeur vous montre un rapport de vérification Foncier Intelligent ? Contrôlez qu'il n'a pas été modifié : saisissez sa référence et son code, ou scannez le QR code imprimé dessus."
        crumbs={[["Vérifier un rapport"]]}
      />
      {/* Formulaire GET natif : la page de résultat vit à /verifier/{référence}?c={code} */}
      <form action="/verifier/_" method="get" className="mx-auto max-w-xl space-y-5 px-4 py-12 sm:px-6">
        <Field>
          <FieldLabel htmlFor="ref">Référence du rapport</FieldLabel>
          <Input id="ref" name="ref" required placeholder="FI-101236198-20260925" className="tabular h-11" autoComplete="off" />
        </Field>
        <Field>
          <FieldLabel htmlFor="c">Code de vérification</FieldLabel>
          <Input id="c" name="c" required placeholder="3F2A-9C01-B7DE" className="tabular h-11 uppercase" autoComplete="off" />
          <FieldDescription>Imprimé en bas du rapport, à côté du QR code.</FieldDescription>
        </Field>
        <Button type="submit" size="lg" className="h-11 px-5">Vérifier</Button>
      </form>
    </>
  );
}
