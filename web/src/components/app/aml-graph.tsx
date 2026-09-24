"use client";

import { Background, Controls, ReactFlow, type Edge, type Node } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import type { GraphEdge, GraphNode } from "@/lib/data/pilotage";

const STYLE: Record<GraphNode["kind"], React.CSSProperties> = {
  personne: { background: "var(--navy)", color: "white", border: "none", borderRadius: 999, fontWeight: 600 },
  societe: { background: "var(--sky)", color: "var(--navy)", border: "1px solid var(--sky-line)", borderRadius: 6, fontWeight: 600 },
  parcelle: { background: "var(--risk-caution-soft)", color: "var(--risk-caution)", border: "none", borderRadius: 6 },
};
const ROW: Record<GraphNode["kind"], number> = { personne: 0, societe: 140, parcelle: 280 };

/** Graphe personnes → sociétés → parcelles, disposé en trois rangées. */
export function AmlGraph({ nodes, edges }: { nodes: GraphNode[]; edges: GraphEdge[] }) {
  const counters: Record<string, number> = {};
  const byKind = (k: string) => nodes.filter((n) => n.kind === k).length;
  const rfNodes: Node[] = nodes.map((n) => {
    const i = (counters[n.kind] = (counters[n.kind] ?? -1) + 1);
    const width = byKind(n.kind) * 190;
    return { id: n.id, position: { x: i * 190 - width / 2, y: ROW[n.kind] }, data: { label: n.label }, style: { ...STYLE[n.kind], fontSize: 12, width: 170 } };
  });
  const rfEdges: Edge[] = edges.map((e) => ({ id: e.from + e.to, source: e.from, target: e.to, label: e.label, animated: e.label.startsWith("revente"), style: { stroke: "var(--navy)" } }));
  return (
    <ReactFlow nodes={rfNodes} edges={rfEdges} fitView proOptions={{ hideAttribution: false }} nodesConnectable={false}>
      <Background />
      <Controls showInteractive={false} />
    </ReactFlow>
  );
}
