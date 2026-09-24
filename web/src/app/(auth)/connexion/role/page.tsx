import type { Metadata } from "next";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { PERSONAS, SPACE_LABEL } from "@/lib/personas";
import { cn } from "@/lib/utils";
import { choosePersona } from "./actions";

export const metadata: Metadata = { title: "Choisir un rôle · Foncier Intelligent" };

export default async function RolePage({ searchParams }: PageProps<"/connexion/role">) {
  const wanted = (await searchParams).espace;
  return (
    <div className="w-full max-w-3xl">
      <h1 className="text-3xl font-extrabold text-navy">Qui êtes-vous ?</h1>
      <p className="mt-2 text-muted-foreground">Choisissez un profil pour explorer la démonstration. Vous pourrez en changer à tout moment.</p>
      <form action={choosePersona} className="mt-8 grid gap-3 sm:grid-cols-2">
        {PERSONAS.map((p) => (
          <button
            key={p.id}
            type="submit"
            name="persona"
            value={p.id}
            className={cn(
              "flex items-start gap-3 rounded-lg border bg-card p-4 text-left transition-colors hover:border-navy/40 hover:bg-sky focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none",
              wanted === p.space && "border-navy ring-2 ring-navy/20"
            )}
          >
            <Avatar className="size-10">
              <AvatarFallback className="bg-navy font-display text-sm font-bold text-white">{p.initials}</AvatarFallback>
            </Avatar>
            <span>
              <span className="block font-semibold">{p.name}</span>
              <span className="block text-sm text-muted-foreground">{p.title}</span>
              <span className="mt-1 block text-xs text-navy">{SPACE_LABEL[p.space]}</span>
            </span>
          </button>
        ))}
      </form>
    </div>
  );
}
