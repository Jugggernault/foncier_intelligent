import { extractDocument } from "@/lib/documents/extract";
import { layersAt } from "@/lib/geo/layers";
import { layerReasons } from "@/lib/risk";

const MAX = 10 * 1024 * 1024;

// Lecture d'une pièce (PDF ou image) puis, si c'est un levé, croisement avec les couches ANDF.
export async function POST(req: Request) {
  const form = await req.formData().catch(() => null);
  const file = form?.get("file");
  if (!(file instanceof File)) return Response.json({ error: "Fichier manquant (champ « file »)." }, { status: 400 });
  if (file.size > MAX) return Response.json({ error: "Fichier trop lourd (10 Mo maximum)." }, { status: 413 });
  const doc = await extractDocument(file);
  const hits = doc.ring ? await layersAt(doc.ring) : [];
  return Response.json({ ...doc, demo: undefined, hits, reasons: layerReasons(hits) });
}
