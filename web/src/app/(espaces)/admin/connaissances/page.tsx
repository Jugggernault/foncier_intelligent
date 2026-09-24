import type { Metadata } from "next";
import { SpaceBody, SpaceHeader } from "@/components/app/space-header";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CORPUS } from "@/lib/data/admin";

export const metadata: Metadata = { title: "Textes de l'assistant · Administration" };

export default function Knowledge() {
  return (
    <>
      <SpaceHeader title="Textes de l'assistant" lead="Corpus juridique sur lequel l'assistant appuie ses réponses. Chaque réponse cite le texte et l'article." />
      <SpaceBody>
        <div className="max-w-5xl overflow-x-auto rounded-lg border bg-card">
          <Table>
            <TableHeader><TableRow><TableHead className="pl-4">Texte</TableHead><TableHead>Source</TableHead><TableHead>Passages</TableHead><TableHead className="pr-4">Indexation</TableHead></TableRow></TableHeader>
            <TableBody>
              {CORPUS.map((c) => (
                <TableRow key={c.title}>
                  <TableCell className="pl-4 font-medium whitespace-normal">{c.title}</TableCell>
                  <TableCell className="text-muted-foreground">{c.source}</TableCell>
                  <TableCell className="tabular">{c.chunks}</TableCell>
                  <TableCell className="pr-4">{c.indexed ? <Badge className="rounded-sm bg-clear-soft text-clear">Indexé</Badge> : <Badge className="rounded-sm bg-caution-soft text-caution">OCR à faire</Badge>}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </SpaceBody>
    </>
  );
}
