import type { Metadata } from "next";
import { KpiTable } from "@/components/app/kpi-table";
import { SpaceBody, SpaceHeader } from "@/components/app/space-header";
import { SimpleBarChart } from "@/components/app/bar-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { OFFICES } from "@/lib/data/pilotage";

export const metadata: Metadata = { title: "Vue nationale · Pilotage" };

export default function Pilotage() {
  return (
    <>
      <SpaceHeader title="Vue nationale" lead="Les indicateurs d'engagement du PRD, dans les communes pilotes. Valeurs de démonstration." />
      <SpaceBody>
        <div className="grid gap-6 xl:grid-cols-12">
          <div className="xl:col-span-7"><KpiTable /></div>
          <Card className="rounded-lg xl:col-span-5">
            <CardHeader><CardTitle className="text-base">Dossiers en attente par bureau communal</CardTitle></CardHeader>
            <CardContent><SimpleBarChart data={OFFICES.map((o) => ({ name: o.name, value: o.backlog }))} label="Dossiers" className="aspect-[4/3] w-full" /></CardContent>
          </Card>
        </div>
      </SpaceBody>
    </>
  );
}
