import { redirect } from "next/navigation";

// Le contenu vit désormais dans la documentation (src/content/docs/api.md).
export default function DevelopersPage() {
  redirect("/docs/api");
}
