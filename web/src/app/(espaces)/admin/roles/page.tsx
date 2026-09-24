import type { Metadata } from "next";
import { SpaceBody, SpaceHeader } from "@/components/app/space-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ROLES } from "@/lib/data/admin";

export const metadata: Metadata = { title: "Rôles · Administration" };

export default function Roles() {
  return (
    <>
      <SpaceHeader title="Rôles et permissions" lead="Principe du moindre privilège : l'identité des titulaires n'est visible que des agents habilités." />
      <SpaceBody>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {ROLES.map((r) => (
            <Card key={r.role} className="rounded-lg">
              <CardHeader><CardTitle className="text-base">{r.role}</CardTitle></CardHeader>
              <CardContent><ul className="list-disc space-y-1 pl-5 text-sm">{r.rights.map((x) => <li key={x}>{x}</li>)}</ul></CardContent>
            </Card>
          ))}
        </div>
      </SpaceBody>
    </>
  );
}
