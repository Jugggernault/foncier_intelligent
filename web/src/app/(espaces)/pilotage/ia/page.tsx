import type { Metadata } from "next";
import { SpaceBody, SpaceHeader } from "@/components/app/space-header";
import { SimpleBarChart } from "@/components/app/bar-chart";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FAIRNESS, MODELS } from "@/lib/data/pilotage";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Qualité de l'IA · Pilotage" };

export default function AiQuality() {
  return (
    <>
      <SpaceHeader title="Qualité de l'IA" lead="Chaque modèle est mesuré contre une cible, son taux d'acceptation par les agents est suivi, et ses performances sont comparées entre groupes pour détecter les biais." />
      <SpaceBody>
        <div className="grid gap-6 xl:grid-cols-12">
          <div className="overflow-x-auto rounded-lg border bg-card xl:col-span-7">
            <Table>
              <TableHeader><TableRow><TableHead className="pl-4">Modèle</TableHead><TableHead>Mesure</TableHead><TableHead>Valeur</TableHead><TableHead>Cible</TableHead><TableHead className="pr-4">Acceptation</TableHead></TableRow></TableHeader>
              <TableBody>
                {MODELS.map((m) => {
                  const ok = m.metric.startsWith("Erreur") ? m.value <= m.target : m.value >= m.target;
                  return (
                    <TableRow key={m.name}>
                      <TableCell className="pl-4 font-medium whitespace-normal">{m.name}</TableCell>
                      <TableCell className="whitespace-normal text-muted-foreground">{m.metric}</TableCell>
                      <TableCell><Badge className={cn("tabular rounded-sm", ok ? "bg-clear-soft text-clear" : "bg-caution-soft text-caution")}>{Math.round(m.value * 100)} %</Badge></TableCell>
                      <TableCell className="tabular">{Math.round(m.target * 100)} %</TableCell>
                      <TableCell className="tabular pr-4">{Math.round(m.acceptance * 100)} %</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
          <Card className="rounded-lg xl:col-span-5">
            <CardHeader><CardTitle className="text-base">Équité : exactitude de la lecture des pièces par groupe</CardTitle></CardHeader>
            <CardContent>
              <SimpleBarChart data={FAIRNESS.map((f) => ({ name: f.group, value: Math.round(f.accuracy * 100) }))} label="Exactitude (%)" className="aspect-[4/3] w-full" />
              <p className="mt-2 text-xs text-muted-foreground">Écart de 7 points entre droits coutumiers et titres fonciers : réentraînement prévu avec plus d&apos;attestations coutumières.</p>
            </CardContent>
          </Card>
        </div>
      </SpaceBody>
    </>
  );
}
