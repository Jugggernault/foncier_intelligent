import type { Metadata } from "next";
import { SpaceBody, SpaceHeader } from "@/components/app/space-header";
import { SimpleBarChart } from "@/components/app/bar-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { OFFICES } from "@/lib/data/pilotage";

export const metadata: Metadata = { title: "Délais et charge · Pilotage" };

export default function Delays() {
  return (
    <>
      <SpaceHeader title="Délais et charge" lead="Délai moyen d'un titre foncier par bureau et prévision de la file à 30 jours (modèle de séries temporelles, démonstration)." />
      <SpaceBody>
        <div className="grid gap-6 xl:grid-cols-2">
          <Card className="rounded-lg">
            <CardHeader><CardTitle className="text-base">Délai moyen (jours)</CardTitle></CardHeader>
            <CardContent><SimpleBarChart data={OFFICES.map((o) => ({ name: o.name, value: o.delay }))} label="Jours" /></CardContent>
          </Card>
          <div className="overflow-x-auto rounded-lg border bg-card">
            <Table>
              <TableHeader><TableRow><TableHead className="pl-4">Bureau</TableHead><TableHead>File actuelle</TableHead><TableHead>Prévision J+30</TableHead><TableHead className="pr-4">Recommandation</TableHead></TableRow></TableHeader>
              <TableBody>
                {OFFICES.map((o) => {
                  const growth = (o.forecast - o.backlog) / o.backlog;
                  return (
                    <TableRow key={o.name}>
                      <TableCell className="pl-4 font-medium">{o.name}</TableCell>
                      <TableCell className="tabular">{o.backlog}</TableCell>
                      <TableCell className="tabular">{o.forecast} <span className="text-xs text-muted-foreground">(+{Math.round(growth * 100)} %)</span></TableCell>
                      <TableCell className="pr-4 whitespace-normal">{growth > 0.08 ? "Renforcer d'un agent instructeur" : "Charge stable"}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </div>
      </SpaceBody>
    </>
  );
}
