import type { Metadata } from "next";
import { SpaceBody, SpaceHeader } from "@/components/app/space-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ApiKeys } from "./api-keys";

export const metadata: Metadata = { title: "Clés API · Espace professionnel" };

export default function ApiPage() {
  return (
    <>
      <SpaceHeader title="Clés API" lead="Interrogez les fiches parcelles et les scores de risque depuis vos systèmes de crédit." />
      <SpaceBody>
        <div className="grid max-w-5xl gap-6 lg:grid-cols-2">
          <ApiKeys />
          <Card className="rounded-lg">
            <CardHeader><CardTitle className="text-base">Exemple</CardTitle></CardHeader>
            <CardContent>
              <pre className="overflow-x-auto rounded-md bg-navy-deep p-4 text-xs text-white">{`curl -H "Authorization: Bearer fi_live_…" \\
  https://…/api/parcels/101236198`}</pre>
              <p className="mt-3 text-sm text-muted-foreground">Réponse : parcelle, superficie, situation juridique, verdict et raisons. Identité des propriétaires jamais exposée.</p>
            </CardContent>
          </Card>
        </div>
      </SpaceBody>
    </>
  );
}
