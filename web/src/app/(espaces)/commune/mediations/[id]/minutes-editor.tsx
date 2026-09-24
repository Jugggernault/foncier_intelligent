"use client";

import { useState } from "react";
import { SparklesIcon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel, FieldLegend, FieldSet } from "@/components/ui/field";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";

type Props = { parties: string[]; summary: string; date: string; place: string; mediator: string; nup: string };

export function MinutesEditor({ parties, summary, date, place, mediator, nup }: Props) {
  const [notes, setNotes] = useState("");
  const [outcome, setOutcome] = useState("accord");
  const [pv, setPv] = useState("");

  function generate() {
    // ponytail: gabarit ; un LLM rédigera le PV à partir des notes brutes
    setPv(`PROCÈS-VERBAL DE MÉDIATION FONCIÈRE

L'an deux mille vingt-six, le ${date}, à ${place}, s'est tenue une séance de médiation présidée par le ${mediator.toLowerCase()}, au sujet de la parcelle NUP ${nup}.

Parties présentes : ${parties.join(" et ")}.

Objet : ${summary}

Déroulement : ${notes || "[notes de séance]"}

Issue : ${outcome === "accord" ? "les parties sont parvenues à un accord, dont les termes sont consignés ci-dessus. Le présent procès-verbal vaut engagement." : "aucun accord n'a pu être trouvé. Les parties sont orientées vers la Commission de gestion des plaintes ou le tribunal compétent."}

Fait en trois exemplaires. Signatures des parties et du médiateur.`);
  }

  return (
    <div className="grid max-w-6xl gap-8 lg:grid-cols-2">
      <div className="space-y-5">
        <Field>
          <FieldLabel htmlFor="notes">Notes de séance</FieldLabel>
          <Textarea id="notes" rows={8} value={notes} onChange={(e) => setNotes(e.target.value)} className="bg-card" placeholder="Positions des parties, propositions, points d'accord…" />
        </Field>
        <FieldSet>
          <FieldLegend className="text-base font-semibold">Issue</FieldLegend>
          <RadioGroup value={outcome} onValueChange={(v) => setOutcome(String(v))}>
            <Field orientation="horizontal"><RadioGroupItem value="accord" id="o-a" /><FieldLabel htmlFor="o-a" className="font-normal">Accord trouvé</FieldLabel></Field>
            <Field orientation="horizontal"><RadioGroupItem value="echec" id="o-e" /><FieldLabel htmlFor="o-e" className="font-normal">Sans accord</FieldLabel></Field>
          </RadioGroup>
        </FieldSet>
        <Button onClick={generate}><SparklesIcon data-icon="inline-start" /> Rédiger le procès-verbal</Button>
      </div>
      <div className="space-y-3">
        <Textarea value={pv} onChange={(e) => setPv(e.target.value)} rows={18} className="bg-card text-sm" aria-label="Procès-verbal" placeholder="Le procès-verbal apparaîtra ici." />
        <Button variant="outline" disabled={!pv} onClick={() => toast.success("PV enregistré et transmis aux parties (démonstration).")}>Enregistrer et transmettre</Button>
      </div>
    </div>
  );
}
