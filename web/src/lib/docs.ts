import "server-only";
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import Markdoc, { type RenderableTreeNode } from "@markdoc/markdoc";

const DIR = path.join(process.cwd(), "src/content/docs");

export type Doc = { slug: string; title: string; description: string; order: number; content: RenderableTreeNode };

// ponytail: frontmatter plat « clé: valeur », un parseur YAML si un jour il faut des listes
function frontmatter(raw = "") {
  return Object.fromEntries(raw.split("\n").map((l) => l.split(/:\s*(.*)/, 2).map((s) => s.trim())));
}

function load(file: string): Doc {
  const ast = Markdoc.parse(readFileSync(path.join(DIR, file), "utf8"));
  const fm = frontmatter(ast.attributes.frontmatter);
  return {
    slug: file === "index.md" ? "" : file.replace(/\.md$/, ""),
    title: fm.title,
    description: fm.description ?? "",
    order: Number(fm.order ?? 99),
    content: Markdoc.transform(ast),
  };
}

// Relu à chaque appel : en dev, une modification du .md s'affiche sans redémarrer ; au build, les pages sont statiques.
export const listDocs = (): Doc[] =>
  readdirSync(DIR)
    .filter((f) => f.endsWith(".md"))
    .map(load)
    .sort((a, b) => a.order - b.order);

export const getDoc = (slug = "") => listDocs().find((d) => d.slug === slug);
