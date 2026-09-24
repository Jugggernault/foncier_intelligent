import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BellPlusIcon, FileWarningIcon } from "lucide-react";
import { ParcelRow } from "@/components/parcel/parcel-row";
import { LinkedMap } from "@/components/map/linked-map";
import { PageHeader } from "@/components/site/page-header";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { buttonVariants } from "@/components/ui/button";
import { ItemGroup } from "@/components/ui/item";
import { getParcel, isPublicityOpen, neighbours } from "@/lib/data/parcels";
import { fmtArea, fmtDate, procedureLabel } from "@/lib/labels";
import { cn } from "@/lib/utils";

export async function generateMetadata({ params }: PageProps<"/publicite/[nup]">): Promise<Metadata> {
  return { title: `Avis de publicité ${(await params).nup} · Foncier Intelligent` };
}

export default async function NoticePage({ params }: PageProps<"/publicite/[nup]">) {
  const p = getParcel((await params).nup);
  if (!p?.procedure) notFound();
  const open = isPublicityOpen(p);
  const near = neighbours(p, 800);
  const pr = p.procedure;
  const requester = p.owner.kind === "state" ? "le Chef du Bureau communal du Domaine et du Foncier, au nom de l'État béninois" : `un particulier (${p.owner.initials})`;

  return (
    <>
      <PageHeader
        title={`Avis n° ${pr.requestNumber}`}
        lead={`${procedureLabel(pr)} sur la parcelle ${p.nup}, ${p.quartier}, ${p.commune}.`}
        crumbs={[["Publicité foncière", "/publicite"], [p.nup]]}
      />
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-10 sm:px-6 lg:grid-cols-12 lg:px-8">
        <div className="space-y-8 lg:col-span-7">
          {open ? (
            <Alert className="border-caution/30 bg-caution-soft text-caution">
              <FileWarningIcon />
              <AlertTitle>Opposition possible jusqu&apos;au {fmtDate(pr.publicity.end, "long")}</AlertTitle>
              <AlertDescription className="text-caution">
                Si cette demande touche votre terrain, déposez une opposition avant la fin du délai.
              </AlertDescription>
            </Alert>
          ) : (
            <Alert>
              <AlertTitle>Délai d&apos;opposition clos le {fmtDate(pr.publicity.end, "long")}</AlertTitle>
              <AlertDescription>En cas de contestation, il faut désormais saisir la Commission de gestion des plaintes ou le tribunal.</AlertDescription>
            </Alert>
          )}

          <section>
            <h2 className="text-lg font-bold text-navy">Texte de l&apos;avis</h2>
            <blockquote className="mt-3 rounded-lg bg-sky px-5 py-4 leading-relaxed">
              Suivant demande n° {pr.requestNumber} du {fmtDate(pr.requestDate, "long")}, {requester} a demandé la{" "}
              {pr.kind === "titre" ? "délivrance d'un titre foncier" : "confirmation cadastrale de droits fonciers"} sur l&apos;immeuble
              objet du NUP {p.nup} : commune de {p.commune}, arrondissement {p.arrondissement}, quartier {p.quartier}, superficie calculée{" "}
              {fmtArea(p.areaM2)}.
            </blockquote>
            <p className="mt-2 text-xs text-muted-foreground">Nom et téléphone du demandeur masqués conformément à la protection des données personnelles.</p>
          </section>

          <div className="flex flex-wrap gap-2">
            {open && (
              <Link href={`/espace/oppositions/nouvelle?nup=${p.nup}`} className={cn(buttonVariants({ size: "lg" }), "h-11 bg-signal px-4 font-bold text-signal-ink hover:bg-[#ffe033]")}>
                Faire opposition
              </Link>
            )}
            <Link href={`/espace/surveillance?nup=${p.nup}`} className={cn(buttonVariants({ variant: "outline", size: "lg" }), "h-11 px-4")}>
              <BellPlusIcon data-icon="inline-start" />
              Être prévenu des avis voisins
            </Link>
            <Link href={`/parcelle/${p.nup}`} className={cn(buttonVariants({ variant: "ghost", size: "lg" }), "h-11 px-4")}>
              Fiche de la parcelle
            </Link>
          </div>

          <section>
            <h2 className="text-lg font-bold text-navy">Parcelles riveraines</h2>
            <p className="mt-1 text-sm text-muted-foreground">Leurs propriétaires abonnés sont prévenus automatiquement.</p>
            <ItemGroup className="mt-4 gap-2">
              {near.map((n) => (
                <ParcelRow key={n.nup} parcel={n} />
              ))}
            </ItemGroup>
            {!near.length && <p className="mt-3 text-sm text-muted-foreground">Aucune parcelle connue dans un rayon de 800 m.</p>}
          </section>
        </div>
        <aside className="lg:col-span-5">
          <div className="aspect-square overflow-hidden rounded-lg border">
            <LinkedMap
              parcels={[...near.map((n) => ({ nup: n.nup, polygon: n.polygon })), { nup: p.nup, polygon: p.polygon, level: "caution" as const }]}
              selected={p.nup}
            hrefBase="/publicite" label="Carte des avis de publicité foncière" />
          </div>
        </aside>
      </div>
    </>
  );
}
