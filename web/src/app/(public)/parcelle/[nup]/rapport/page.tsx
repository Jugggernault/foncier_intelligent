import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ParcelMap } from "@/components/map/parcel-map";
import { PrintButton } from "@/components/parcel/print-button";
import { Verdict } from "@/components/parcel/verdict";
import { climate } from "@/lib/climate";
import { findParcel } from "@/lib/data/parcels";
import { alertLabel, disputeLabel, fmtArea, fmtDate, fmtFcfa, ownerLabel, procedureLabel, rightLabel } from "@/lib/labels";
import { assessFull } from "@/lib/geo/verdict";
import { LayerFindings } from "@/components/parcel/layer-findings";

export async function generateMetadata({ params }: PageProps<"/parcelle/[nup]/rapport">): Promise<Metadata> {
  return { title: `Rapport de vérification ${(await params).nup} · Foncier Intelligent` };
}

export default async function ReportPage({ params }: PageProps<"/parcelle/[nup]/rapport">) {
  const p = await findParcel((await params).nup);
  if (!p) notFound();
  const { result, hits } = await assessFull(p);
  const clim = climate(p);
  const now = new Date();
  const ref = `FI-${p.nup}-${now.toISOString().slice(0, 10).replaceAll("-", "")}`;

  const rows: [string, string][] = [
    ["NUP", p.nup],
    ["Localisation", `${p.quartier}, ${p.arrondissement}, ${p.commune} (${p.department})`],
    ["Superficie", fmtArea(p.areaM2)],
    ["Situation juridique", rightLabel(p)],
    ["Propriétaire", ownerLabel(p)],
    ["Procédure en cours", p.procedure ? `${procedureLabel(p.procedure)}, publicité du ${fmtDate(p.procedure.publicity.start)} au ${fmtDate(p.procedure.publicity.end)}` : "Aucune"],
    ["Litige", p.dispute ? `${disputeLabel[p.dispute.kind]} (${p.dispute.body}, depuis ${fmtDate(p.dispute.since)})` : "Aucun déclaré"],
    ["Alertes satellite", p.alerts.length ? p.alerts.map((a) => `${alertLabel[a.kind]} (${fmtDate(a.date)})`).join(", ") : "Aucune"],
    ["Valeur estimée", `${fmtFcfa(p.pricePerM2.low * p.areaM2)} – ${fmtFcfa(p.pricePerM2.high * p.areaM2)}`],
    ["Risque climatique", `Inondation ${clim.flood}, érosion ${clim.erosion}`],
  ];

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 print:max-w-none print:p-0">
      <div className="flex flex-wrap items-center justify-between gap-4 print:hidden">
        <p className="text-sm text-muted-foreground">Aperçu du rapport. Utilisez « Enregistrer en PDF » dans la fenêtre d&apos;impression.</p>
        <PrintButton />
      </div>

      <article className="mt-6 rounded-lg border p-6 sm:p-10 print:mt-0 print:border-0 print:p-0">
        <header className="flex flex-wrap items-start justify-between gap-4 border-b pb-6">
          <div>
            <p className="text-sm font-semibold text-muted-foreground">Rapport de vérification foncière</p>
            <h1 className="tabular mt-1 text-4xl font-extrabold tracking-[0.02em] text-navy">{p.nup}</h1>
          </div>
          <dl className="text-right text-sm">
            <dt className="text-muted-foreground">Référence</dt>
            <dd className="tabular font-semibold">{ref}</dd>
            <dt className="mt-2 text-muted-foreground">Établi le</dt>
            <dd className="font-semibold">{fmtDate(now.toISOString(), "long")}</dd>
          </dl>
        </header>

        <Verdict result={result} className="mt-6 print:[print-color-adjust:exact]" />

        <div className="mt-6 aspect-[16/9] overflow-hidden rounded-lg border print:hidden">
          <ParcelMap parcels={[{ nup: p.nup, polygon: p.polygon, level: result.level }]} layers={hits.map((h) => h.layerId)} selected={p.nup} padding={90} label={`Image satellite de la parcelle ${p.nup}`} />
        </div>

        <h2 className="mt-8 text-base font-bold text-navy">Couches géographiques de l&apos;ANDF</h2>
        <div className="mt-3"><LayerFindings hits={hits} /></div>

        <table className="mt-8 w-full text-sm">
          <tbody className="divide-y">
            {rows.map(([k, v]) => (
              <tr key={k}>
                <th scope="row" className="w-1/3 py-3 pr-4 text-left align-top font-medium text-muted-foreground">{k}</th>
                <td className="py-3">{v}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <footer className="mt-10 border-t pt-4 text-xs leading-relaxed text-muted-foreground">
          Rapport généré automatiquement par Foncier Intelligent (démonstration UDI-AFRICA) à partir des données disponibles à la date indiquée
          {p.real ? " : attributs publiés par l'ANDF" : " : parcelle fictive de démonstration"}, imagerie Sentinel-2 (Digital Earth Africa, CC BY 4.0). Il ne remplace ni
          l&apos;état descriptif délivré par l&apos;ANDF ni l&apos;avis d&apos;un notaire.
        </footer>
      </article>
    </div>
  );
}
