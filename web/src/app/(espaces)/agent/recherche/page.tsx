import type { Metadata } from "next";
import { SearchIcon } from "lucide-react";
import { SpaceBody, SpaceHeader } from "@/components/app/space-header";
import { ParcelRow } from "@/components/parcel/parcel-row";
import { Button } from "@/components/ui/button";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { ItemGroup } from "@/components/ui/item";
import { searchParcels } from "@/lib/data/parcels";
import { listDossiers } from "@/lib/data/workflow";

export const metadata: Metadata = { title: "Recherche · Espace agent" };

export default async function AgentSearch({ searchParams }: PageProps<"/agent/recherche">) {
  const q = String((await searchParams).q ?? "").trim();
  const parcels = q ? searchParcels(q, 30) : [];
  const people = q ? listDossiers().filter((d) => d.applicant.toLowerCase().includes(q.toLowerCase()) || d.id.includes(q)) : [];
  return (
    <>
      <SpaceHeader title="Recherche interne" lead="Parcelles, titres, demandeurs et dossiers." />
      <SpaceBody>
        <form className="flex max-w-2xl gap-2">
          <InputGroup className="h-11 bg-card">
            <InputGroupAddon><SearchIcon /></InputGroupAddon>
            <InputGroupInput name="q" defaultValue={q} placeholder="NUP, n° TF, nom, dossier, quartier" aria-label="Recherche" />
          </InputGroup>
          <Button type="submit" size="lg" className="h-11">Chercher</Button>
        </form>
        {q && (
          <div className="mt-8 grid max-w-5xl gap-8 lg:grid-cols-2">
            <section>
              <h2 className="font-bold text-navy">Parcelles ({parcels.length})</h2>
              <ItemGroup className="mt-3 gap-2">
                {parcels.map((p) => <ParcelRow key={p.nup} parcel={p} href={`/agent/parcelles/${p.nup}`} />)}
              </ItemGroup>
            </section>
            <section>
              <h2 className="font-bold text-navy">Dossiers ({people.length})</h2>
              <ul className="mt-3 space-y-2">
                {people.map((d) => (
                  <li key={d.id}><a href={`/agent/dossiers/${d.id}`} className="tabular font-semibold text-navy hover:underline">{d.id}</a> · {d.applicant} · {d.nup}</li>
                ))}
              </ul>
            </section>
          </div>
        )}
      </SpaceBody>
    </>
  );
}
