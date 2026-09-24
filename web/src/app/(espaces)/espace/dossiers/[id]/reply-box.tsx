"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export function ReplyBox({ needsDocument }: { needsDocument: boolean }) {
  const [text, setText] = useState("");
  return (
    <form
      className="space-y-3 border-t pt-4"
      onSubmit={(e) => {
        e.preventDefault();
        setText("");
        toast.success("Message envoyé au bureau communal (démonstration).");
      }}
    >
      <Textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Votre message" aria-label="Votre message" />
      <div className="flex flex-wrap gap-2">
        <Button type="submit" disabled={!text.trim()}>Envoyer</Button>
        {needsDocument && (
          <label className="inline-flex h-8 cursor-pointer items-center rounded-lg border bg-signal px-3 text-sm font-bold text-signal-ink">
            Déposer la pièce demandée
            <input type="file" className="sr-only" accept="image/*,application/pdf" onChange={() => toast.success("Pièce transmise. Elle sera lue automatiquement.")} />
          </label>
        )}
      </div>
    </form>
  );
}
