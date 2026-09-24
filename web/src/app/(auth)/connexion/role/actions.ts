"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getPersona, SPACE_HOME } from "@/lib/personas";
import { PERSONA_COOKIE } from "@/lib/session";

export async function choosePersona(formData: FormData) {
  const persona = getPersona(String(formData.get("persona")));
  if (!persona) return;
  (await cookies()).set(PERSONA_COOKIE, persona.id, { path: "/", sameSite: "lax", maxAge: 60 * 60 * 24 * 30 });
  redirect(SPACE_HOME[persona.space]);
}
