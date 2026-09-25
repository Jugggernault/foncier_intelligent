"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";

/** L'agent décide : le pré-contrôle éclaire, il ne tranche pas. */
export function PlanDecision({ id, blocking }: { id: number; blocking: boolean }) {
  const router = useRouter();
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);

  async function decide(status: "accepte" | "renvoye") {
    if (status === "renvoye" && !note.trim()) return toast.error("Indiquez au géomètre ce qu'il doit corriger.");
    setBusy(true);
    const res = await fetch(`/api/plans/${id}`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ status, note }) });
    setBusy(false);
    if (!res.ok) return toast.error((await res.json()).error ?? "Décision impossible.");
    toast.success(status === "accepte" ? "Plan accepté pour instruction." : "Plan renvoyé au géomètre.");
    router.refresh();
  }

  return (
    <section className="space-y-3 rounded-lg border bg-card p-5">
      <h2 className="font-bold text-navy">Décision</h2>
      <Field>
        <FieldLabel htmlFor="note">Message au géomètre</FieldLabel>
        <Textarea id="note" rows={3} value={note} onChange={(e) => setNote(e.target.value)} placeholder={blocking ? "Ex. Plan situé en zone réservée : dépôt impossible en l'état." : "Facultatif si le plan est accepté."} />
      </Field>
      <div className="flex flex-wrap gap-2">
        <Button disabled={busy} onClick={() => decide("accepte")}>Accepter pour instruction</Button>
        <Button disabled={busy} variant="outline" onClick={() => decide("renvoye")}>Renvoyer pour correction</Button>
      </div>
    </section>
  );
}
