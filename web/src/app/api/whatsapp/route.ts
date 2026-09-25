import { after } from "next/server";
import { ilemiWhatsApp } from "@/lib/agent/ilemi";
import { extractDocument } from "@/lib/documents/extract";
import { layersAt } from "@/lib/geo/layers";
import { limited } from "@/lib/rate-limit";
import { layerReasons } from "@/lib/risk";
import { fetchMedia, sendWhatsApp, validSignature, whatsappEnabled } from "@/lib/whatsapp/twilio";

export const maxDuration = 60;

// Réponse TwiML vide : le vrai message part ensuite par l'API (une Response ne se lit qu'une fois, d'où la fonction)
const empty = () => new Response("<Response/>", { headers: { "content-type": "text/xml" } });

// Webhook Twilio : on répond tout de suite (délai de 15 s côté Twilio), l'agent travaille ensuite et répond par l'API.
// ponytail: sans mémoire de conversation (chaque message est traité seul) ; stocker l'historique par numéro si besoin.
export async function POST(req: Request) {
  if (!whatsappEnabled()) return new Response("WhatsApp non configuré", { status: 503 });
  const params = Object.fromEntries(new URLSearchParams(await req.text())) as Record<string, string>;
  const host = req.headers.get("x-forwarded-host") ?? new URL(req.url).host;
  const proto = req.headers.get("x-forwarded-proto") ?? "https";
  if (!validSignature(`${proto}://${host}/api/whatsapp`, params, req.headers.get("x-twilio-signature"))) return new Response("Signature invalide", { status: 403 });

  const from = params.From;
  if (!from) return empty();
  if (limited(`whatsapp:${from}`, 8)) {
    after(() => sendWhatsApp(from, "Trop de messages en une minute. Réessayez dans un instant."));
    return empty();
  }

  after(async () => {
    try {
      let prompt = (params.Body ?? "").trim();
      if (Number(params.NumMedia) > 0) {
        const type = params.MediaContentType0 ?? "";
        if (type !== "application/pdf") {
          await sendWhatsApp(from, "Envoyez le levé en *PDF* : la lecture des photos arrive bientôt. Vous pouvez aussi taper le NUP (9 chiffres).");
          return;
        }
        const doc = await extractDocument(await fetchMedia(params.MediaUrl0, "leve.pdf", type));
        if (doc.kind !== "leve" || !doc.ring) {
          await sendWhatsApp(from, "Je n'ai pas trouvé de tableau de bornes dans ce document. Est-ce bien un levé topographique ?");
          return;
        }
        const reasons = layerReasons(await layersAt(doc.ring));
        prompt = `L'utilisateur a envoyé un levé : ${doc.bornes.length} bornes, ${doc.computedM2} m² calculés${doc.declaredM2 ? ` pour ${doc.declaredM2} m² déclarés` : ""}. Constats des couches ANDF : ${reasons.map((r) => r.text).join(" ") || "aucune couche touchée"}. Explique le verdict et quoi faire. ${prompt}`;
      }
      if (!prompt) prompt = "Bonjour";
      const { text } = await ilemiWhatsApp.generate({ prompt });
      await sendWhatsApp(from, text || "Je n'ai pas pu répondre. Réessayez ou consultez https://foncier-intelligent.vercel.app");
    } catch (e) {
      console.error("whatsapp", e);
      await sendWhatsApp(from, "Un problème est survenu. Réessayez dans un instant.");
    }
  });
  return empty();
}
