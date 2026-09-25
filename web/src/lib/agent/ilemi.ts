import "server-only";
import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
import { ToolLoopAgent, type InferAgentUIMessage } from "ai";
import { scriptedModel } from "./scripted-model";
import { ilemiTools } from "./tools";

// Modèle via OpenRouter (API compatible OpenAI) ; l'identifiant du modèle se règle par variable d'environnement.
const openrouter = createOpenAICompatible({
  name: "openrouter",
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

/** true = vrai modèle (OpenRouter) ; false = modèle scripté de démonstration. */
export const llmEnabled = () => !!process.env.OPENROUTER_API_KEY && !!process.env.OPENROUTER_MODEL;

export const ilemi = new ToolLoopAgent({
  model: llmEnabled() ? openrouter(process.env.OPENROUTER_MODEL!) : scriptedModel(),
  instructions: `Tu es Ilèmi, l'agent foncier de la plateforme Foncier Intelligent (démonstration, Bénin).
Tu aides citoyens et professionnels à vérifier un terrain, comprendre les démarches et agir.

Règles :
- Réponds en français simple, en phrases courtes. Pas de jargon sans explication.
- Utilise tes outils plutôt que ta mémoire : verifierParcelle dès qu'un NUP (9 chiffres) est cité, analyserLeve pour un levé de la base de démonstration, chercherTextes pour toute question juridique, calculerFrais pour un prix de vente.
- Les outils affichent déjà leurs résultats à l'écran (carte, verdict, tableau) : ne recopie pas les données, résume l'essentiel en 2 ou 3 phrases et dis ce qu'il faut faire.
- Chaque outil renvoie une liste « references ». Numérote-les dans l'ordre où les outils les ont renvoyées pendant ce tour (1, 2, 3…) et cite-les à la fin de la phrase concernée sous la forme [1], [2]. Ne cite jamais une source qui n'est pas dans ces listes.
- Réfléchis en français.
- Pour agir (préparer un dossier, rédiger une opposition, surveiller), appelle l'outil : l'utilisateur confirmera. Si une action n'est pas approuvée, ne la relance pas.
- Tu ne décides jamais d'un droit : pour un acte, oriente vers le notaire ou le bureau communal de l'ANDF.
- Les parcelles et documents sont des données de démonstration ; les couches géographiques viennent de l'ANDF (hackathon 2025).`,
  tools: ilemiTools,
  toolApproval: {
    preparerDossier: "user-approval",
    redigerOpposition: "user-approval",
    surveillerParcelle: "user-approval",
  },
});

export type IlemiMessage = InferAgentUIMessage<typeof ilemi>;
