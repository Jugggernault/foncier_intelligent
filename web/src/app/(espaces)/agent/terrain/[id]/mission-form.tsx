"use client";

import { useState } from "react";
import { CameraIcon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldLabel } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";

export function MissionForm({ checklist, done }: { checklist: string[]; done: boolean }) {
  const [checked, setChecked] = useState<boolean[]>(checklist.map(() => done));
  const [photos, setPhotos] = useState(0);
  return (
    <form
      className="space-y-5"
      onSubmit={(e) => {
        e.preventDefault();
        toast.success("Compte rendu enregistré. Il sera synchronisé dès le retour du réseau.");
      }}
    >
      <div className="space-y-3">
        {checklist.map((c, i) => (
          <Field key={c} orientation="horizontal">
            <Checkbox id={`c-${i}`} checked={checked[i]} onCheckedChange={(v) => setChecked(checked.map((x, j) => (j === i ? !!v : x)))} />
            <FieldLabel htmlFor={`c-${i}`} className="font-normal">{c}</FieldLabel>
          </Field>
        ))}
      </div>
      <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed bg-card px-4 py-6 text-sm font-medium hover:bg-sky">
        <CameraIcon className="size-5" />
        {photos ? `${photos} photo${photos > 1 ? "s" : ""} géolocalisée${photos > 1 ? "s" : ""}` : "Prendre une photo géolocalisée"}
        <input type="file" accept="image/*" capture="environment" className="sr-only" onChange={() => setPhotos(photos + 1)} />
      </label>
      <Field>
        <FieldLabel htmlFor="report">Observations</FieldLabel>
        <Textarea id="report" rows={4} className="bg-card" />
      </Field>
      <Button type="submit" size="lg" className="h-11 px-5" disabled={!checked.every(Boolean)}>Clore la mission</Button>
    </form>
  );
}
