"use client";

import { useState } from "react";
import { toast } from "sonner";
import { ParcelMap, type MapParcel } from "@/components/map/parcel-map";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import type { Parcel } from "@/lib/data/types";
import { fmtArea } from "@/lib/labels";
import { areaM2, conflicts, parseSurvey, type Ring } from "@/lib/survey";

const EXAMPLE = "422880;701830\n423010;701835\n423005;701925\n422875;701920";

export function SurveyImport({ parcels }: { parcels: Parcel[] }) {
  const [text, setText] = useState("");
  const [ring, setRing] = useState<Ring>();
  const [error, setError] = useState<string>();

  function analyse(t: string) {
    setText(t);
    try {
      setRing(parseSurvey(t));
      setError(undefined);
    } catch (e) {
      setRing(undefined);
      setError(e instanceof Error ? e.message : "Fichier illisible");
    }
  }

  const hits = ring ? conflicts(ring, parcels) : [];
  const near: MapParcel[] = ring ? parcels.filter((p) => hits.includes(p.nup)).map((p) => ({ nup: p.nup, polygon: p.polygon, level: "danger" as const })) : [];

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="space-y-4">
        <Field>
          <FieldLabel htmlFor="survey">Sommets du levé</FieldLabel>
          <Textarea id="survey" rows={10} value={text} onChange={(e) => analyse(e.target.value)} className="tabular bg-card font-mono text-sm" placeholder="X;Y en UTM 31N, une ligne par sommet — ou collez un GeoJSON" />
          <FieldDescription>Formats acceptés : CSV (UTM 31N ou longitude/latitude) et GeoJSON. Les DXF arriveront plus tard.</FieldDescription>
        </Field>
        <div className="flex flex-wrap gap-2">
          <label className="inline-flex h-9 cursor-pointer items-center rounded-lg border bg-card px-3 text-sm font-medium hover:bg-muted">
            Choisir un fichier
            <input type="file" accept=".csv,.txt,.geojson,.json" className="sr-only" onChange={async (e) => e.target.files?.[0] && analyse(await e.target.files[0].text())} />
          </label>
          <Button variant="ghost" onClick={() => analyse(EXAMPLE)}>Exemple (Godomey)</Button>
        </div>
        {error && <p className="rounded-md bg-danger-soft px-3 py-2 text-sm text-danger">{error}</p>}
        {ring && (
          <div className="space-y-2 rounded-lg border bg-card p-4 text-sm">
            <p><span className="text-muted-foreground">Sommets :</span> <span className="tabular font-semibold">{ring.length - 1}</span></p>
            <p><span className="text-muted-foreground">Surface calculée :</span> <span className="tabular font-semibold">{fmtArea(areaM2(ring))}</span></p>
            <p className={hits.length ? "text-danger" : "text-clear"}>
              {hits.length ? `Chevauche ${hits.length} parcelle${hits.length > 1 ? "s" : ""} enregistrée${hits.length > 1 ? "s" : ""} : ${hits.join(", ")}.` : "Aucun chevauchement avec les parcelles enregistrées."}
            </p>
            <Button className="mt-2" disabled={hits.length > 0} onClick={() => toast.success("Levé transmis au cadastre pour validation (démonstration).")}>Transmettre au cadastre</Button>
          </div>
        )}
      </div>
      <div className="aspect-square overflow-hidden rounded-lg border">
        {ring ? (
          <ParcelMap key={ring.flat().join()} parcels={[...near, { nup: "levé", polygon: ring, level: hits.length ? "caution" : "clear" }]} selected="levé" padding={80} label="Levé importé sur imagerie satellite" />
        ) : (
          <div className="grid size-full place-items-center bg-sky p-8 text-center text-sm text-muted-foreground">Le levé s&apos;affichera ici sur l&apos;imagerie satellite.</div>
        )}
      </div>
    </div>
  );
}
