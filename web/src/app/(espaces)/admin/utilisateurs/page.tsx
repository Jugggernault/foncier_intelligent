import type { Metadata } from "next";
import { SpaceBody, SpaceHeader } from "@/components/app/space-header";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { USERS } from "@/lib/data/admin";

export const metadata: Metadata = { title: "Utilisateurs · Administration" };

export default function Users() {
  return (
    <>
      <SpaceHeader title="Utilisateurs" lead="Comptes de démonstration. En production, l'identité vient du NPI via le portail national." />
      <SpaceBody>
        <div className="overflow-x-auto rounded-lg border bg-card">
          <Table>
            <TableHeader><TableRow><TableHead className="pl-4">Nom</TableHead><TableHead>Rôle</TableHead><TableHead>Espace</TableHead><TableHead>2FA</TableHead><TableHead className="pr-4">Dernière connexion</TableHead></TableRow></TableHeader>
            <TableBody>
              {USERS.map((u) => (
                <TableRow key={u.name}>
                  <TableCell className="pl-4 font-medium">{u.name}</TableCell>
                  <TableCell>{u.role}</TableCell>
                  <TableCell>{u.space}</TableCell>
                  <TableCell>{u.twoFactor ? <Badge className="rounded-sm bg-clear-soft text-clear">Activée</Badge> : <Badge variant="outline" className="rounded-sm">—</Badge>}</TableCell>
                  <TableCell className="pr-4 text-muted-foreground">{u.lastSeen}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </SpaceBody>
    </>
  );
}
