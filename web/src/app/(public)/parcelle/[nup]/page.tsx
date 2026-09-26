import type { Metadata } from "next";
import { TerrainVisit } from "@/components/parcel/terrain-visit";
import { STREET_VIEWS } from "@/content/street-views";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BellPlusIcon, ExternalLinkIcon, FileDownIcon } from "lucide-react";
import { ParcelExplorer } from "@/components/parcel/parcel-explorer";
import { LEVEL, Verdict } from "@/components/parcel/verdict";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { buttonVariants } from "@/components/ui/button";
import { Item, ItemActions, ItemContent, ItemDescription, ItemGroup, ItemTitle } from "@/components/ui/item";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { climate, type Level } from "@/lib/climate";
import { cadastreUrl, findParcel, isPublicityOpen, neighbours } from "@/lib/data/parcels";
import { alertLabel, disputeLabel, fmtArea, fmtDate, fmtFcfa, ownerLabel, procedureLabel, rightLabel } from "@/lib/labels";
import { assessFull, verdictFn } from "@/lib/geo/verdict";
import { LayerFindings } from "@/components/parcel/layer-findings";
import { cn } from "@/lib/utils";

export async function generateMetadata({ params }: PageProps<"/parcelle/[nup]">): Promise<Metadata> {
  const { nup } = await params;
  return { title: `Parcelle ${nup} · Foncier Intelligent` };
}

const CLIMATE_TONE: Record<Level, string> = {
  faible: "bg-clear-soft text-clear",
  moyen: "bg-caution-soft text-caution",
  élevé: "bg-danger-soft text-danger",
};

export default async function ParcelPage({ params }: PageProps<"/parcelle/[nup]">) {
  const judge = await verdictFn();
  const { nup } = await params;
  const p = await findParcel(nup);
  if (!p) notFound();

  const { result, hits } = await assessFull(p);
  const near = neighbours(p, 2500).slice(0, 12);
  const clim = climate(p);
  if (hits.some((h) => h.layerId === "zone_inondable")) clim.flood = "élevé";
  const place = [...new Set([p.quartier, p.arrondissement, p.commune])].join(" · ");
  const comparables = near.filter((n) => n.zone === p.zone && n.landUse === p.landUse).slice(0, 4);
  const mid = (p.pricePerM2.low + p.pricePerM2.high) / 2;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink render={<Link href="/" />}>Accueil</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink render={<Link href="/recherche" />}>Parcelles</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="tabular">{p.nup}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <header className="mt-6 flex flex-wrap items-end justify-between gap-6">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary" className="rounded-sm">{rightLabel(p)}</Badge>
            <Badge variant="outline" className="rounded-sm">
              {p.live ? "ANDF, consulté en direct" : p.real ? "Données publiées par l'ANDF" : "Parcelle de démonstration"}
            </Badge>
          </div>
          <h1 className="tabular mt-3 text-[clamp(2.2rem,5vw,3.6rem)] leading-none font-extrabold tracking-[0.02em] text-navy">
            {p.nup}
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">{place}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href={`/parcelle/${p.nup}/rapport`} className={cn(buttonVariants({ size: "lg" }), "h-11 px-4")}>
            <FileDownIcon data-icon="inline-start" />
            Rapport de vérification
          </Link>
          <Link href={`/espace/surveillance?nup=${p.nup}`} className={cn(buttonVariants({ variant: "outline", size: "lg" }), "h-11 px-4")}>
            <BellPlusIcon data-icon="inline-start" />
            Surveiller
          </Link>
          <a href={cadastreUrl(p.nup)} target="_blank" rel="noreferrer" className={cn(buttonVariants({ variant: "ghost", size: "lg" }), "h-11 px-3")}>
            Cadastre ANDF
            <ExternalLinkIcon data-icon="inline-end" />
          </a>
        </div>
      </header>

      <div className="mt-8 grid gap-6 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <ParcelExplorer
            parcel={{ nup: p.nup, polygon: p.polygon, level: result.level }}
            layers={hits.map((h) => h.layerId)}
            neighbours={near.map((n) => ({ nup: n.nup, polygon: n.polygon, level: judge(n).level }))}
          />
          <p className="mt-2 text-xs text-muted-foreground">
            Emprise {p.real ? "publiée par l'ANDF (cadastre numérique)" : "de démonstration"}. Cliquez une parcelle voisine pour l&apos;ouvrir.
          </p>
        </div>
        <div className="space-y-6 lg:col-span-5">
          <Verdict result={result} />
          <TerrainVisit nup={p.nup} view={STREET_VIEWS[p.nup]} center={p.center} />
        </div>
      </div>

      <section className="mt-10">
        <h2 className="text-xl font-bold text-navy">Ce que disent les couches de l&apos;ANDF</h2>
        <p className="mt-1 text-sm text-muted-foreground">Croisement automatique de l&apos;emprise avec 12 couches : litiges, restrictions (ZDUP, PAG), domaine public, aires protégées, titres, zones inondables.</p>
        <div className="mt-4 max-w-4xl">
          <LayerFindings hits={hits} />
        </div>
      </section>

      <Tabs defaultValue="apercu" className="mt-12">
        <TabsList variant="line" className="w-full justify-start overflow-x-auto border-b">
          <TabsTrigger value="apercu">Aperçu</TabsTrigger>
          <TabsTrigger value="terrain">Terrain</TabsTrigger>
          <TabsTrigger value="valeur">Valeur</TabsTrigger>
          <TabsTrigger value="climat">Climat</TabsTrigger>
          <TabsTrigger value="voisinage">Voisinage</TabsTrigger>
        </TabsList>

        <TabsContent value="apercu" className="pt-8">
          <div className="grid gap-10 lg:grid-cols-2">
            <dl className="grid grid-cols-2 gap-x-8 gap-y-5 text-sm">
              <Fact label="Propriétaire" value={ownerLabel(p)} />
              <Fact label="Superficie" value={fmtArea(p.areaM2)} />
              <Fact label="Nature" value={p.nature} />
              <Fact label="Situation juridique" value={rightLabel(p)} />
              <Fact label="Milieu" value={`${p.landUse === "urbain" ? "Urbain" : "Rural"}, ${p.zone === "loti" ? "zone lotie" : "zone non lotie"}`} />
              <Fact label="Département" value={p.department} />
              <Fact label="Litige" value={p.dispute ? `${disputeLabel[p.dispute.kind]} (${p.dispute.body}, depuis ${fmtDate(p.dispute.since)})` : "Aucun déclaré"} />
              <Fact label="Coordonnées" value={`${p.center.lat.toFixed(5)}, ${p.center.lon.toFixed(5)}`} />
            </dl>
            <div>
              <h2 className="text-lg font-bold text-navy">Procédure</h2>
              {p.procedure ? (
                <ol className="mt-4 space-y-4 border-l-2 border-sky-line pl-6 text-sm">
                  <Step done label="Demande déposée" detail={`${procedureLabel(p.procedure)} · ${fmtDate(p.procedure.requestDate)}`} />
                  <Step
                    done={!isPublicityOpen(p) && p.procedure.publicity.end < new Date().toISOString().slice(0, 10)}
                    current={isPublicityOpen(p)}
                    label="Publicité foncière"
                    detail={`${fmtDate(p.procedure.publicity.start)} → ${fmtDate(p.procedure.publicity.end)}`}
                  />
                  <Step label="Décision et titre foncier" detail="En attente" />
                </ol>
              ) : (
                <p className="mt-3 text-sm text-muted-foreground">
                  {p.right === "titre" ? "Titre foncier délivré, aucune procédure en cours." : "Aucune procédure en cours."}
                </p>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="terrain" className="pt-8">
          <h2 className="text-lg font-bold text-navy">Alertes détectées par satellite</h2>
          {p.alerts.length ? (
            <ItemGroup className="mt-4 max-w-2xl gap-2">
              {p.alerts.map((a) => (
                <Item key={a.id} variant="outline">
                  <ItemContent>
                    <ItemTitle>{alertLabel[a.kind]}</ItemTitle>
                    <ItemDescription>{a.text}</ItemDescription>
                  </ItemContent>
                  <ItemActions className="flex-col items-end gap-1 text-right text-xs text-muted-foreground">
                    <span>{fmtDate(a.date)}</span>
                    <span className="tabular">Confiance {Math.round(a.confidence * 100)} %</span>
                  </ItemActions>
                </Item>
              ))}
            </ItemGroup>
          ) : (
            <p className="mt-3 text-sm text-muted-foreground">Aucun changement notable détecté sur l&apos;emprise depuis 2017.</p>
          )}
          <p className="mt-6 max-w-2xl text-sm text-muted-foreground">
            Utilisez le curseur d&apos;années sous la carte pour comparer l&apos;état du terrain de 2017 à 2025 (Sentinel-2, 10 m par pixel).
          </p>
        </TabsContent>

        <TabsContent value="valeur" className="pt-8">
          <div className="grid gap-10 lg:grid-cols-2">
            <div>
              <p className="text-sm text-muted-foreground">Valeur estimée du terrain</p>
              <p className="tabular mt-1 text-[clamp(1.8rem,4vw,2.6rem)] leading-tight font-extrabold text-navy">
                {fmtFcfa(p.pricePerM2.low * p.areaM2)} – {fmtFcfa(p.pricePerM2.high * p.areaM2)}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                Soit {fmtFcfa(p.pricePerM2.low)} à {fmtFcfa(p.pricePerM2.high)} le m², d&apos;après les annonces et ventes du secteur.
              </p>
              <p className="mt-4 rounded-md bg-sky px-4 py-3 text-sm">
                Estimation de démonstration. Un prix déclaré très inférieur à cette fourchette sera signalé lors de la mutation.
              </p>
            </div>
            <div>
              <h2 className="text-lg font-bold text-navy">Comparables proches</h2>
              {comparables.length ? (
                <ItemGroup className="mt-4 gap-2">
                  {comparables.map((c) => (
                    <Item key={c.nup} variant="outline" render={<Link href={`/parcelle/${c.nup}`} />}>
                      <ItemContent>
                        <ItemTitle className="tabular">{c.nup}</ItemTitle>
                        <ItemDescription>{c.quartier} · {fmtArea(c.areaM2)}</ItemDescription>
                      </ItemContent>
                      <ItemActions className="tabular text-sm font-semibold text-navy">
                        {fmtFcfa((c.pricePerM2.low + c.pricePerM2.high) / 2)}/m²
                        <span className={cn("ml-2 text-xs font-normal", (c.pricePerM2.low + c.pricePerM2.high) / 2 > mid ? "text-danger" : "text-clear")}>
                          {(c.pricePerM2.low + c.pricePerM2.high) / 2 > mid ? "plus cher" : "moins cher"}
                        </span>
                      </ItemActions>
                    </Item>
                  ))}
                </ItemGroup>
              ) : (
                <p className="mt-3 text-sm text-muted-foreground">Pas assez de ventes comparables dans le secteur.</p>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="climat" className="pt-8">
          <div className="grid max-w-3xl gap-4 sm:grid-cols-2">
            <ClimateTile label="Inondation" level={clim.flood} />
            <ClimateTile label="Érosion côtière" level={clim.erosion} />
          </div>
          <p className="mt-4 text-sm text-muted-foreground">{clim.note} Inondation : couche « zone inondable » de l&apos;ANDF ; érosion : indicateur de démonstration (Digital Earth Africa Coastlines prévu).</p>
        </TabsContent>

        <TabsContent value="voisinage" className="pt-8">
          <h2 className="text-lg font-bold text-navy">Parcelles voisines</h2>
          <ItemGroup className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {near.map((n) => {
              const r = judge(n);
              const Icon = LEVEL[r.level].icon;
              return (
                <Item key={n.nup} variant="outline" render={<Link href={`/parcelle/${n.nup}`} />}>
                  <span className={cn("grid size-9 shrink-0 place-items-center rounded-md", LEVEL[r.level].soft)}>
                    <Icon className="size-4" />
                  </span>
                  <ItemContent>
                    <ItemTitle className="tabular">{n.nup}</ItemTitle>
                    <ItemDescription>{n.quartier} · {fmtArea(n.areaM2)}</ItemDescription>
                  </ItemContent>
                </Item>
              );
            })}
          </ItemGroup>
          {!near.length && <p className="text-sm text-muted-foreground">Aucune parcelle connue à proximité.</p>}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="mt-0.5 font-medium">{value}</dd>
    </div>
  );
}

function Step({ label, detail, done, current }: { label: string; detail: string; done?: boolean; current?: boolean }) {
  return (
    <li className="relative">
      <span
        className={cn(
          "absolute top-1 -left-[1.95rem] size-3.5 rounded-full ring-4 ring-background",
          done ? "bg-navy" : current ? "bg-signal" : "bg-sky-line"
        )}
      />
      <p className="font-semibold">{label}{current && <span className="ml-2 text-xs font-medium text-caution">en cours</span>}</p>
      <p className="text-muted-foreground">{detail}</p>
    </li>
  );
}

function ClimateTile({ label, level }: { label: string; level: Level }) {
  return (
    <div className={cn("rounded-lg px-5 py-4", CLIMATE_TONE[level])}>
      <p className="text-sm font-semibold">{label}</p>
      <p className="mt-1 text-2xl font-extrabold capitalize">{level}</p>
    </div>
  );
}
