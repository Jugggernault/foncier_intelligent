import { expect, test } from "bun:test";
import { createHmac } from "node:crypto";
import { validSignature } from "./signature";

test("signature Twilio : URL + paramètres triés, HMAC-SHA1 base64", () => {
  const url = "https://foncier-intelligent.vercel.app/api/whatsapp";
  const params = { From: "whatsapp:+22901000000", Body: "Vérifie 101236198", NumMedia: "0" };
  const good = createHmac("sha1", "12345").update(url + "Body" + params.Body + "From" + params.From + "NumMedia0").digest("base64");
  expect(validSignature("12345", url, params, good)).toBe(true);
  expect(validSignature("12345", url, { ...params, Body: "autre" }, good)).toBe(false);
  expect(validSignature("12345", url, params, null)).toBe(false);
});
