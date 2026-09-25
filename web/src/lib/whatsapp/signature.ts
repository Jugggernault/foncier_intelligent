import { createHmac, timingSafeEqual } from "node:crypto";

/** Signature X-Twilio-Signature : HMAC-SHA1(URL publique + paramètres triés concaténés), en base64. */
export function validSignature(token: string, url: string, params: Record<string, string>, signature: string | null) {
  if (!signature) return false;
  const data = url + Object.keys(params).sort().map((k) => k + params[k]).join("");
  const a = Buffer.from(createHmac("sha1", token).update(data).digest("base64"));
  const b = Buffer.from(signature);
  return a.length === b.length && timingSafeEqual(a, b);
}
