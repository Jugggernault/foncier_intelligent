import type { Metadata } from "next";
import { SpaceBody, SpaceHeader } from "@/components/app/space-header";
import { WATCHED } from "@/lib/data/citizen";
import { allParcels } from "@/lib/data/parcels";
import { WatchList } from "./watch-list";

export const metadata: Metadata = { title: "Surveillance · Foncier Intelligent" };

export default async function SurveillancePage({ searchParams }: PageProps<"/espace/surveillance">) {
  const preset = (await searchParams).nup;
  const known = Object.fromEntries(allParcels().map((p) => [p.nup, `${p.quartier}, ${p.commune}`]));
  return (
    <>
      <SpaceHeader title="Surveillance" lead="Les parcelles que la plateforme surveille pour vous : image satellite, publicité foncière, litiges." />
      <SpaceBody>
        <WatchList
          initial={WATCHED.map((w) => ({ nup: w.parcel.nup, place: `${w.parcel.quartier}, ${w.parcel.commune}`, reason: w.reason }))}
          known={known}
          preset={typeof preset === "string" ? preset : undefined}
        />
      </SpaceBody>
    </>
  );
}
