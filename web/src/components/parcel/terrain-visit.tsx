import Image from "next/image";
import { ExternalLinkIcon, FootprintsIcon } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { mapillaryUrl, satelliteUrl, type StreetView } from "@/content/street-views";
import { fmtDate } from "@/lib/labels";
import { cn } from "@/lib/utils";

/** Visite du terrain avant l'achat : photo de rue la plus proche (Mapillary), puis visite interactive. */
export function TerrainVisit({ nup, view, center }: { nup: string; view?: StreetView; center: { lat: number; lon: number } }) {
  return (
    <section id="visite" className="rounded-lg border bg-card p-5">
      <h2 className="flex items-center gap-2 text-lg font-bold text-navy"><FootprintsIcon className="size-5" /> Visiter le terrain</h2>
      {view ? (
        <>
          <p className="mt-1 text-sm text-muted-foreground">Vue de rue du {fmtDate(view.date, "long")} : {view.note}.</p>
          <a href={mapillaryUrl(view.key)} target="_blank" rel="noreferrer" className="group relative mt-4 block overflow-hidden rounded-md border">
            <Image src={`/visits/${nup}.jpg`} alt={`Vue de rue près de la parcelle ${nup}`} width={1200} height={631} className="aspect-[1200/631] w-full object-cover transition-transform group-hover:scale-[1.02]" />
            <span className="absolute right-3 bottom-3 inline-flex items-center gap-1.5 rounded-md bg-navy px-3 py-1.5 text-sm font-semibold text-white">
              <FootprintsIcon className="size-4" /> Marcher dans la rue <ExternalLinkIcon className="size-3.5" />
            </span>
          </a>
          <p className="mt-3 text-xs text-muted-foreground">
            Photo de {view.by} sur Mapillary (CC BY-SA 4.0). Une photo peut dater : comparez avec l&apos;image satellite la plus récente.
          </p>
        </>
      ) : (
        <p className="mt-1 text-sm text-muted-foreground">Pas encore de vue de rue à proximité de cette parcelle. La frise satellite montre son évolution depuis 2017.</p>
      )}
      <a href={satelliteUrl(center.lat, center.lon)} target="_blank" rel="noreferrer" className={cn(buttonVariants({ variant: "link" }), "mt-2 h-auto px-0")}>
        Vue satellite haute résolution (Google Maps) <ExternalLinkIcon data-icon="inline-end" />
      </a>
    </section>
  );
}
