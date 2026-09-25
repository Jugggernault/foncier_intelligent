import type { LayerHit } from "@/lib/geo/layers";
import { LAYER_COLOR } from "@/lib/geo/palette";
import { cn } from "@/lib/utils";

const TONE = { danger: "text-danger", caution: "text-caution", info: "text-muted-foreground" };

function detail(h: LayerHit) {
  const p = h.props;
  const bits = [p.designation, p.type !== p.designation ? p.type : undefined, p.tribunal, p.role && `rôle ${p.role}`, p.motif && `motif : ${p.motif}`, p.validation && `plan validé : ${p.validation}`, p.tf && `réf. ${p.tf}`, p.nup && `NUP ${p.nup}`];
  return bits.filter(Boolean).join(" · ");
}

/** Couches géographiques ANDF traversées par la parcelle. */
export function LayerFindings({ hits, empty = "Aucune des couches ANDF (litiges, restrictions, domaine public, titres, zones inondables) ne touche cette parcelle." }: { hits: LayerHit[]; empty?: string }) {
  if (!hits.length) return <p className="text-sm text-muted-foreground">{empty}</p>;
  return (
    <ul className="divide-y rounded-lg border bg-card">
      {hits.map((h) => (
        <li key={h.layerId} className="flex gap-3 px-4 py-3">
          <span className="mt-1.5 size-3 shrink-0 rounded-sm" style={{ backgroundColor: LAYER_COLOR[h.layerId] }} aria-hidden="true" />
          <div className="min-w-0 flex-1">
            <p className="flex flex-wrap items-baseline justify-between gap-x-3">
              <span className={cn("font-semibold", TONE[h.severity])}>{h.label}</span>
              <span className="tabular text-xs text-muted-foreground">
                {h.share >= 0.99 ? "toute la parcelle" : `${Math.max(1, Math.round(h.share * 100))} % de la parcelle`}
                {h.count > 1 && ` · ${h.count} objets`}
              </span>
            </p>
            {detail(h) && <p className="mt-0.5 text-sm">{detail(h)}</p>}
            <p className="mt-0.5 text-xs text-muted-foreground">{h.description}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}
