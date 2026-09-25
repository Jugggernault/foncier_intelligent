import type { Metadata } from "next";
import Link from "next/link";
import { ShieldCheckIcon, ShieldXIcon } from "lucide-react";
import { PageHeader } from "@/components/site/page-header";
import { Verdict } from "@/components/parcel/verdict";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { findParcel } from "@/lib/data/parcels";
import { assessFull } from "@/lib/geo/verdict";
import { fmtDate } from "@/lib/labels";
import { parseRef, sealMatches } from "@/lib/report-seal";

export const metadata: Metadata = { title: "Vérification d'un rapport · Foncier Intelligent", robots: { index: false } };

export default async function VerifyResult({ params, searchParams }: PageProps<"/verifier/[ref]">) {
  const q = await searchParams;
  // Le formulaire de /verifier arrive sur /verifier/_?ref=…&c=…
  const raw = (await params).ref === "_" ? String(q.ref ?? "") : (await params).ref;
  const ref = raw.trim().toUpperCase();
  const code = String(q.c ?? "");
  const parsed = parseRef(ref);
  const p = parsed && (await findParcel(parsed.nup));
  const full = p && parsed ? await assessFull(p, parsed.date) : undefined;
  const ok = !!full && sealMatches(code, ref, full.result, full.hits);

  return (
    <>
      <PageHeader title="Vérification d'un rapport" lead={`Référence ${ref || "manquante"}`} crumbs={[["Vérifier un rapport", "/verifier"], [ref || "—"]]} />
      <div className="mx-auto max-w-3xl space-y-8 px-4 py-12 sm:px-6">
        {ok && p && parsed && full ? (
          <>
            <Alert className="border-clear/30 bg-clear-soft text-clear">
              <ShieldCheckIcon />
              <AlertTitle>Rapport authentique</AlertTitle>
              <AlertDescription className="text-clear">
                Émis par Foncier Intelligent le {fmtDate(parsed.day, "long")} pour la parcelle {p.nup} ({p.quartier}, {p.commune}). Comparez le verdict ci-dessous avec celui du document qu&apos;on vous présente : ils doivent être identiques.
              </AlertDescription>
            </Alert>
            <Verdict result={full.result} />
            <p className="text-sm text-muted-foreground">
              Ce verdict reflète les données disponibles le jour de l&apos;émission. Pour la situation d&apos;aujourd&apos;hui, <Link href={`/parcelle/${p.nup}`} className="font-medium text-navy underline underline-offset-4">consultez la fiche à jour</Link>.
            </p>
          </>
        ) : (
          <Alert className="border-danger/30 bg-danger-soft text-danger">
            <ShieldXIcon />
            <AlertTitle>Rapport non reconnu</AlertTitle>
            <AlertDescription className="text-danger">
              {!parsed ? "La référence n'a pas le bon format (FI-NUP-AAAAMMJJ)." : !p ? "Aucune parcelle ne correspond à cette référence." : "Le code ne correspond pas au contenu de ce rapport : il a peut-être été modifié."} Ne vous fiez pas à ce document ;
              vérifiez directement la parcelle sur <Link href="/" className="underline underline-offset-4">Foncier Intelligent</Link> ou auprès de l&apos;ANDF.
            </AlertDescription>
          </Alert>
        )}
      </div>
    </>
  );
}
