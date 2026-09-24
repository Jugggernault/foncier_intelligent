"use client";

import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export function AlertActions() {
  return (
    <div className="flex flex-wrap gap-2">
      <Button onClick={() => toast.success("Mission de vérification créée et affectée (démonstration).")}>Créer une mission terrain</Button>
      <Button variant="outline" onClick={() => toast("Alerte confirmée : dossier contentieux ouvert (démonstration).")}>Confirmer l&apos;empiètement</Button>
      <Button variant="ghost" onClick={() => toast("Classée en faux positif. Le modèle en tiendra compte au prochain réentraînement.")}>Faux positif</Button>
    </div>
  );
}
