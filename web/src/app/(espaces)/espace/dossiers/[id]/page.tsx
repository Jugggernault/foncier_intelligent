import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AlertTriangleIcon, CheckCircle2Icon, FileQuestionIcon, XCircleIcon } from "lucide-react";
import { SpaceBody, SpaceHeader } from "@/components/app/space-header";
import { StatusBadge, Steps } from "@/components/app/workflow-bits";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Item, ItemContent, ItemDescription, ItemGroup, ItemMedia, ItemTitle } from "@/components/ui/item";
import { ME } from "@/lib/data/citizen";
import { dossiersOf, KIND_LABEL } from "@/lib/data/workflow";
import { fmtDate } from "@/lib/labels";
import { ReplyBox } from "./reply-box";

export const metadata: Metadata = { title: "Dossier · Foncier Intelligent" };

const DOC_ICON = { ok: CheckCircle2Icon, missing: FileQuestionIcon, suspect: AlertTriangleIcon, unreadable: XCircleIcon };
const DOC_LABEL = { ok: "Conforme", missing: "Manquante", suspect: "À vérifier", unreadable: "Illisible" };
const DOC_TONE = { ok: "text-clear", missing: "text-caution", suspect: "text-danger", unreadable: "text-caution" };

export default async function MyDossier({ params }: PageProps<"/espace/dossiers/[id]">) {
  const { id } = await params;
  const d = dossiersOf(ME.initials).find((x) => x.id === id);
  if (!d) notFound();
  return (
    <>
      <SpaceHeader title={KIND_LABEL[d.kind]} lead={`Dossier ${d.id} · parcelle ${d.nup} · déposé le ${fmtDate(d.createdAt, "long")}`}>
        <StatusBadge status={d.status} />
      </SpaceHeader>
      <SpaceBody>
        <div className="grid gap-6 lg:grid-cols-12">
          <div className="space-y-6 lg:col-span-7">
            <Card className="rounded-lg">
              <CardHeader><CardTitle className="text-base">Pièces</CardTitle></CardHeader>
              <CardContent>
                <ItemGroup className="gap-2">
                  {d.documents.map((doc) => {
                    const Icon = DOC_ICON[doc.status];
                    return (
                      <Item key={doc.name} variant="outline">
                        <ItemMedia variant="icon" className={DOC_TONE[doc.status]}><Icon /></ItemMedia>
                        <ItemContent>
                          <ItemTitle>{doc.name}</ItemTitle>
                          <ItemDescription>{doc.note ?? DOC_LABEL[doc.status]}</ItemDescription>
                        </ItemContent>
                      </Item>
                    );
                  })}
                </ItemGroup>
              </CardContent>
            </Card>
            <Card className="rounded-lg">
              <CardHeader><CardTitle className="text-base">Échanges avec le bureau communal</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                {d.messages.map((m, i) => (
                  <div key={i} className={m.from === "usager" ? "ml-auto max-w-[85%] rounded-lg bg-navy px-4 py-3 text-white" : "max-w-[85%] rounded-lg bg-sky px-4 py-3"}>
                    <p className="text-xs opacity-70">{{ agent: "Agent BCDF", usager: "Vous", systeme: "Système" }[m.from]} · {fmtDate(m.date)}</p>
                    <p className="mt-1">{m.text}</p>
                  </div>
                ))}
                <ReplyBox needsDocument={d.status === "complement"} />
              </CardContent>
            </Card>
          </div>
          <Card className="h-fit rounded-lg lg:col-span-5">
            <CardHeader><CardTitle className="text-base">Avancement</CardTitle></CardHeader>
            <CardContent>
              <Steps steps={d.steps} />
              <p className="mt-6 text-sm text-muted-foreground">Échéance indicative : {fmtDate(d.dueAt, "long")}.</p>
            </CardContent>
          </Card>
        </div>
      </SpaceBody>
    </>
  );
}
