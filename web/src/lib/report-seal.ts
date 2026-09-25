import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import QRCode from "qrcode";
import type { LayerHit } from "./geo/layers";
import type { Assessment } from "./risk";

// Sceau d'un rapport de vérification : HMAC du contenu (parcelle, date, verdict, couches), vérifiable en ligne.
// ponytail: sans état ; le rapport est recalculé à sa date d'émission pour être vérifié. Si les données de référence
// changent (nouvelles couches), stocker les rapports émis (table report_issues) pour garder la preuve.
const SECRET = process.env.REPORT_SECRET ?? "demo-foncier-intelligent-non-secret";
const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://foncier-intelligent.vercel.app";

export const reportRef = (nup: string, day: string) => `FI-${nup}-${day.replaceAll("-", "")}`;

/** « FI-101236198-20260925 » → { nup, day: "2026-09-25", date à midi UTC } */
export function parseRef(ref: string) {
  const m = ref.match(/^FI-(\d{9})-(\d{4})(\d{2})(\d{2})$/);
  if (!m) return;
  const day = `${m[2]}-${m[3]}-${m[4]}`;
  return { nup: m[1], day, date: new Date(`${day}T12:00:00Z`) };
}

function digest(ref: string, result: Assessment, hits: LayerHit[]) {
  const content = JSON.stringify({
    ref,
    level: result.level,
    headline: result.headline,
    reasons: result.reasons.map((r) => r.text),
    layers: hits.map((h) => [h.layerId, Math.round(h.share * 100)]),
  });
  return createHmac("sha256", SECRET).update(content).digest("hex").slice(0, 12).toUpperCase();
}

/** Code de vérification lisible : « 3F2A-9C01-B7DE ». */
export function sealCode(ref: string, result: Assessment, hits: LayerHit[]) {
  return digest(ref, result, hits).match(/.{4}/g)!.join("-");
}

export function sealMatches(code: string, ref: string, result: Assessment, hits: LayerHit[]) {
  const a = Buffer.from(code.replace(/[^0-9A-F]/gi, "").toUpperCase());
  const b = Buffer.from(digest(ref, result, hits));
  return a.length === b.length && timingSafeEqual(a, b);
}

export const verifyUrl = (ref: string, code: string) => `${SITE}/verifier/${ref}?c=${code}`;

export const qrSvg = (url: string) => QRCode.toString(url, { type: "svg", margin: 0, errorCorrectionLevel: "M", color: { dark: "#0b3a6e", light: "#0000" } });
