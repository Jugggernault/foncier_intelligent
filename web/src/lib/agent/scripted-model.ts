import "server-only";
import { simulateReadableStream } from "ai";
import { MockLanguageModelV4 } from "ai/test";
import type { LanguageModelV4StreamPart } from "@ai-sdk/provider";

// Modèle scripté pour la démo sans clé OpenRouter : il route la demande vers le bon outil par mots-clés,
// puis résume la sortie de l'outil. Toute l'UI générative (outils, cartes, validations) reste réelle.
// ponytail: routage par règles ; remplacé automatiquement par le vrai modèle dès que OPENROUTER_* est défini.

type Json = Record<string, unknown>;
type Msg = { role: string; content: unknown };

const usage = {
  inputTokens: { total: 0, noCache: 0, cacheRead: undefined, cacheWrite: undefined },
  outputTokens: { total: 0, text: 0, reasoning: undefined },
};

function textChunks(text: string): LanguageModelV4StreamPart[] {
  const words = text.split(/(?<= )/);
  return [
    { type: "text-start" as const, id: "t" },
    ...words.map((delta) => ({ type: "text-delta" as const, id: "t", delta })),
    { type: "text-end" as const, id: "t" },
    { type: "finish" as const, finishReason: { unified: "stop" as const, raw: undefined }, usage },
  ];
}

function toolChunks(toolName: string, input: Json): LanguageModelV4StreamPart[] {
  return [
    { type: "tool-call" as const, toolCallId: `call-${Date.now()}`, toolName, input: JSON.stringify(input) },
    { type: "finish" as const, finishReason: { unified: "tool-calls" as const, raw: undefined }, usage },
  ];
}

function route(text: string): { tool: string; input: Json } | undefined {
  const t = text.toLowerCase();
  const nup = text.match(/\b\d{9}\b/)?.[0];
  const pdf = text.match(/[\w-]+\.pdf/i)?.[0];
  if (pdf && /lev[ée]/.test(t) && !t.includes("résultat de l'analyse")) return { tool: "analyserLeve", input: { document: pdf } };
  if (nup && /surveill/.test(t)) return { tool: "surveillerParcelle", input: { nup } };
  if (nup && /opposition|opposer/.test(t)) return { tool: "redigerOpposition", input: { nup, motif: "la demande empiète sur ma parcelle voisine" } };
  if (nup && /dossier|titre foncier pour|certificat/.test(t)) return { tool: "preparerDossier", input: { type: /certificat/.test(t) ? "appartenance" : "titre", nup } };
  if (nup && /publicit|voisin|avis/.test(t)) return { tool: "publiciteProche", input: { nup } };
  if (nup) return { tool: "verifierParcelle", input: { nup } };
  const price = t.match(/(\d[\d\s.]*)\s*(millions?|m\b)/);
  if (/frais|mutation|combien/.test(t) && price) return { tool: "calculerFrais", input: { prix: Number(price[1].replace(/[\s.]/g, "")) * 1_000_000 } };
  if (/togolais|nigérian|nigerian|étranger|etranger|nationalit|français/.test(t))
    return { tool: "verifierEligibilite", input: { nationalite: "reciprocite", milieu: /rural|campagne/.test(t) ? "rural" : "urbain", surface: "lt2" } };
  if (t.includes("résultat de l'analyse")) return undefined;
  return { tool: "chercherTextes", input: { question: text } };
}

function summarize(toolName: string, out: Json | undefined, denied: boolean): string {
  if (denied) return "Entendu, je n'ai rien fait. Dites-moi si vous voulez autre chose.";
  if (!out) return "Je n'ai pas pu obtenir de résultat.";
  switch (toolName) {
    case "verifierParcelle": {
      if (!out.trouve) return `Je ne trouve pas la parcelle ${out.nup} dans la démonstration. Vérifiez les 9 chiffres ou déposez le levé du vendeur.`;
      const v = out.verdict as { headline: string; reasons: { text: string; action?: string }[]; level: string };
      const action = v.reasons.find((r) => r.action)?.action;
      return `**${v.headline}.** ${v.reasons[0]?.text ?? ""} ${action ? `\n\n${action}` : ""}\n\nSource : couches géographiques de l'ANDF et cadastre de démonstration. Voulez-vous que je surveille cette parcelle ?`;
    }
    case "analyserLeve": {
      if (!out.trouve) return "Ce levé ne fait pas partie des documents de démonstration.";
      const r = out.raisons as { level: string; text: string; action?: string }[];
      const danger = r.find((x) => x.level === "danger");
      return danger
        ? `**N'achetez pas ce terrain.** ${danger.text} ${danger.action ?? ""}`
        : r.length
          ? `**Prudence.** ${r.map((x) => x.text).join(" ")}`
          : `**Aucun signal d'alerte** dans les couches de l'ANDF pour ce levé (${out.superficieCalculee} m² calculés). Faites tout de même établir la vente par un notaire.`;
    }
    case "calculerFrais":
      return `Pour une vente de ${new Intl.NumberFormat("fr-FR").format(Number(out.prix))} F, les frais de mutation de l'ANDF sont de **${new Intl.NumberFormat("fr-FR").format(Number(out.total))} F** (${out.rule}, plus 500 F de régie). Les honoraires du notaire s'y ajoutent.`;
    case "verifierEligibilite":
      return (out.reponses as { text: string }[]).map((r) => r.text).join(" ") + "\n\nSource : Code foncier et domanial.";
    case "chercherTextes":
      return (out.extraits as string[]).join("\n\n");
    case "publiciteProche": {
      const avis = out.avis as { ouvert: boolean }[];
      const open = avis.filter((a) => a.ouvert).length;
      return avis.length ? `${avis.length} demande${avis.length > 1 ? "s" : ""} publiée${avis.length > 1 ? "s" : ""} à proximité, dont ${open} encore ouverte${open > 1 ? "s" : ""} à l'opposition.` : "Aucune demande de titre publiée à proximité.";
    }
    case "preparerDossier":
      return "Le dossier est pré-rempli. Il vous reste à déposer les pièces : elles seront lues et contrôlées avant l'envoi à l'ANDF.";
    case "redigerOpposition":
      return "Voici le projet de lettre. Relisez-le, ajoutez vos preuves, puis transmettez-le au bureau communal avant la fin du délai.";
    case "surveillerParcelle":
      return "C'est fait : vous serez prévenu par SMS et WhatsApp en cas de construction détectée, de demande de titre voisine ou de litige.";
  }
  return "Voilà.";
}

export function scriptedModel() {
  return new MockLanguageModelV4({
    provider: "demo",
    modelId: "ilemi-scripte",
    doStream: async ({ prompt }) => {
      const msgs = prompt as Msg[];
      const last = msgs.at(-1)!;
      let chunks: LanguageModelV4StreamPart[];
      if (last.role === "tool") {
        const parts = last.content as { type: string; toolName?: string; output?: { type: string; value?: unknown } }[];
        const res = parts.find((p) => p.type === "tool-result");
        const denied = res?.output?.type === "execution-denied" || parts.some((p) => p.type === "tool-approval-response" && !(p as { approved?: boolean }).approved);
        const value = res?.output?.type === "json" ? (res.output.value as Json) : undefined;
        chunks = textChunks(summarize(res?.toolName ?? "", value, denied));
      } else {
        const text = ((last.content as { type: string; text?: string }[]).find((p) => p.type === "text")?.text ?? "").trim();
        const r = route(text);
        chunks = r
          ? toolChunks(r.tool, r.input)
          : textChunks(
              text.includes("résultat de l'analyse")
                ? `Voici ce que montre l'analyse de votre levé : ${text.split("Constats :")[1]?.split("Explique-moi")[0]?.trim() ?? ""}\n\nEn cas de doute, faites vérifier le bornage par un géomètre et consultez un notaire avant de payer.`
                : "Je peux vérifier une parcelle (NUP), analyser un levé, calculer des frais ou répondre sur les démarches."
            );
      }
      return { stream: simulateReadableStream({ chunks, chunkDelayInMs: 12 }) };
    },
  });
}
