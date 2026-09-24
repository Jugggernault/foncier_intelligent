import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { PERSONA_COOKIE } from "@/lib/session";

export async function GET() {
  (await cookies()).delete(PERSONA_COOKIE);
  redirect("/");
}
