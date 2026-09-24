import type { Metadata } from "next";
import { SpaceBody, SpaceHeader } from "@/components/app/space-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ME } from "@/lib/data/citizen";
import { Preferences } from "./preferences";

export const metadata: Metadata = { title: "Profil · Foncier Intelligent" };

export default function Profile() {
  return (
    <>
      <SpaceHeader title="Profil et notifications" />
      <SpaceBody>
        <div className="grid max-w-5xl gap-6 lg:grid-cols-2">
          <Card className="rounded-lg">
            <CardHeader><CardTitle className="text-base">Identité (NPI)</CardTitle></CardHeader>
            <CardContent>
              <dl className="space-y-3 text-sm">
                {[["Nom", ME.name], ["NPI", ME.npi], ["Téléphone", ME.phone], ["E-mail", ME.email]].map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-4">
                    <dt className="text-muted-foreground">{k}</dt>
                    <dd className="tabular font-medium">{v}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-4 text-xs text-muted-foreground">Ces informations proviennent de l&apos;ANIP et ne se modifient pas ici.</p>
            </CardContent>
          </Card>
          <Preferences />
        </div>
      </SpaceBody>
    </>
  );
}
