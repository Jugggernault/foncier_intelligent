import "server-only";
import { validSignature as check } from "./signature";

// WhatsApp via Twilio (bac à sable pour la démo, numéro WhatsApp Business ensuite).
const SID = process.env.TWILIO_ACCOUNT_SID;
const TOKEN = process.env.TWILIO_AUTH_TOKEN;
const FROM = process.env.TWILIO_WHATSAPP_FROM; // ex. whatsapp:+14155238886 (bac à sable)

export const whatsappEnabled = () => !!(SID && TOKEN && FROM);

export const validSignature = (url: string, params: Record<string, string>, signature: string | null) => !!TOKEN && check(TOKEN, url, params, signature);

const auth = () => `Basic ${Buffer.from(`${SID}:${TOKEN}`).toString("base64")}`;

export async function sendWhatsApp(to: string, body: string) {
  // WhatsApp limite un message à 1 600 caractères
  const res = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${SID}/Messages.json`, {
    method: "POST",
    headers: { authorization: auth(), "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ From: FROM!, To: to, Body: body.slice(0, 1600) }),
  });
  if (!res.ok) console.error("sendWhatsApp", res.status, await res.text());
}

/** Pièce jointe reçue (hébergée par Twilio, accès authentifié). */
export async function fetchMedia(url: string, name: string, type: string): Promise<File> {
  const res = await fetch(url, { headers: { authorization: auth() } });
  return new File([await res.arrayBuffer()], name, { type });
}
