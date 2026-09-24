import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getPersona, type Persona, type Space } from "./personas";

export const PERSONA_COOKIE = "fi_persona";

export async function currentPersona(): Promise<Persona | undefined> {
  return getPersona((await cookies()).get(PERSONA_COOKIE)?.value);
}

/** Exige une persona du bon espace ; sinon renvoie vers le choix du rôle. */
export async function requirePersona(space: Space): Promise<Persona> {
  const p = await currentPersona();
  if (!p || p.space !== space) redirect(`/connexion/role?espace=${space}`);
  return p;
}
