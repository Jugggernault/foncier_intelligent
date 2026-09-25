import "server-only";
import { tool } from "ai";
import { z } from "zod";
import { rules } from "@/lib/eligibility";
import { GUIDES } from "@/content/guides";
import { getDemoDoc, DEMO_DOCS } from "@/content/demo-documents";
import { answer } from "@/lib/assistant";
import { getParcel, isPublicityOpen, neighbours, NUP_PATTERN } from "@/lib/data/parcels";
import { mutationFee } from "@/lib/fees";
import { layersAt } from "@/lib/geo/layers";
import { assessFull } from "@/lib/geo/verdict";
import { rightLabel } from "@/lib/labels";
import { layerReasons } from "@/lib/risk";
import { areaM2, ringFromUtm } from "@/lib/survey";

const nup = z.string().regex(NUP_PATTERN).describe("Numéro unique de parcelle (NUP), 9 chiffres");

/** Outils de l'agent Ilèmi. Chaque sortie est rendue par un composant dans le chat (UI générative). */
export const ilemiTools = {
  verifierParcelle: tool({
    description: "Vérifie une parcelle par son NUP : situation juridique, verdict de risque expliqué et couches ANDF traversées (litiges, ZDUP/PAG, domaine public, titres, zones inondables).",
    inputSchema: z.object({ nup }),
    execute: async ({ nup }) => {
      const p = getParcel(nup);
      if (!p) return { trouve: false as const, nup };
      const { result, hits } = await assessFull(p);
      return {
        trouve: true as const,
        nup,
        lieu: `${p.quartier}, ${p.commune}`,
        superficieM2: p.areaM2,
        situation: rightLabel(p),
        polygone: p.polygon,
        verdict: result,
        couches: hits.map((h) => ({ id: h.layerId, label: h.label, severity: h.severity, part: h.share })),
      };
    },
  }),

  analyserLeve: tool({
    description: "Analyse un levé topographique de la base de documents de démonstration (par nom de fichier ou identifiant) : bornes, surface, couches ANDF traversées et verdict. Pour un fichier déposé par l'utilisateur, l'analyse est faite par l'interface et son résultat t'est transmis dans le message.",
    inputSchema: z.object({ document: z.string().describe("Nom du fichier ou identifiant, ex. leve-togbin-godomey.pdf") }),
    execute: async ({ document }) => {
      const d = getDemoDoc(document);
      if (!d || d.kind !== "leve") return { trouve: false as const, disponibles: DEMO_DOCS.filter((x) => x.kind === "leve").map((x) => x.file) };
      const ring = ringFromUtm(d.bornes.map((b) => [b.x, b.y]));
      const hits = await layersAt(ring);
      const reasons = layerReasons(hits);
      return { trouve: true as const, titre: d.title, lieu: `${d.quartier}, ${d.commune}`, polygone: ring, superficieCalculee: areaM2(ring), superficieDeclaree: d.declaredM2, raisons: reasons, couches: hits.map((h) => ({ id: h.layerId, label: h.label, severity: h.severity, part: h.share })) };
    },
  }),

  publiciteProche: tool({
    description: "Liste les demandes de titre publiées (publicité foncière) près d'une parcelle, avec le délai d'opposition.",
    inputSchema: z.object({ nup }),
    execute: async ({ nup }) => {
      const p = getParcel(nup);
      if (!p) return { avis: [] };
      return {
        avis: neighbours(p, 2500)
          .filter((n) => n.procedure)
          .slice(0, 6)
          .map((n) => ({ nup: n.nup, lieu: `${n.quartier}, ${n.commune}`, fin: n.procedure!.publicity.end, ouvert: isPublicityOpen(n) })),
      };
    },
  }),

  calculerFrais: tool({
    description: "Calcule les frais ANDF de mutation d'un titre foncier pour un prix de vente en FCFA (barème officiel).",
    inputSchema: z.object({ prix: z.number().positive().describe("Prix de vente en FCFA") }),
    execute: async ({ prix }) => ({ prix, ...mutationFee(prix) }),
  }),

  verifierEligibilite: tool({
    description: "Indique si une personne peut acheter un terrain selon sa nationalité, le milieu (urbain/rural) et la surface.",
    inputSchema: z.object({
      nationalite: z.enum(["beninois", "reciprocite", "sans-reciprocite"]),
      milieu: z.enum(["urbain", "rural"]),
      surface: z.enum(["lt2", "2-20", "20-500", "gt500"]).default("lt2"),
    }),
    execute: async ({ nationalite, milieu, surface }) => ({ reponses: rules(nationalite, milieu, surface) }),
  }),

  chercherTextes: tool({
    description: "Cherche dans les textes fonciers (Code foncier, décrets, démarches ANDF) la réponse sourcée à une question juridique ou pratique.",
    inputSchema: z.object({ question: z.string() }),
    execute: async ({ question }) => {
      const kb = answer(question);
      const q = question.toLowerCase();
      const guides = GUIDES.filter((g) => [g.title, g.summary, ...g.steps].join(" ").toLowerCase().split(/\W+/).some((w) => w.length > 5 && q.includes(w))).slice(0, 2);
      return { extraits: kb.text, sources: kb.sources, guides: guides.map((g) => ({ titre: g.title, lien: `/guides/${g.slug}`, etapes: g.steps })) };
    },
  }),

  preparerDossier: tool({
    description: "Prépare un dossier auprès de l'ANDF pour l'utilisateur (titre foncier, certificat d'appartenance, état descriptif) avec la liste des pièces. Action : demande l'accord de l'utilisateur.",
    inputSchema: z.object({ type: z.enum(["titre", "appartenance", "etat-descriptif"]), nup }),
    execute: async ({ type, nup }) => {
      const pieces = {
        titre: ["Pièce d'identité", "Acte de présomption de propriété", "Convention de vente", "Levé topographique"],
        appartenance: ["Pièce d'identité", "Acte de présomption de propriété", "Levé géoréférencé", "Promesse de vente notariée"],
        "etat-descriptif": ["Pièce d'identité"],
      }[type];
      return { type, nup, pieces, lien: `/espace/dossiers/nouveau?type=${type}&nup=${nup}` };
    },
  }),

  redigerOpposition: tool({
    description: "Rédige une lettre d'opposition à une demande de titre publiée sur une parcelle. Action : demande l'accord de l'utilisateur.",
    inputSchema: z.object({ nup, motif: z.string().describe("Motif de l'opposition, en une phrase") }),
    execute: async ({ nup, motif }) => {
      const p = getParcel(nup);
      return {
        nup,
        lettre: `À Monsieur le Chef du Bureau communal du Domaine et du Foncier${p ? ` de ${p.commune}` : ""},\n\nJe forme opposition à la demande${p?.procedure ? ` n° ${p.procedure.requestNumber}` : ""} portant sur la parcelle NUP ${nup}, au motif suivant : ${motif}.\n\nJe tiens à votre disposition les pièces justifiant mes droits.\n\nFait pour valoir ce que de droit.`,
        lien: `/espace/oppositions/nouvelle?nup=${nup}`,
      };
    },
  }),

  surveillerParcelle: tool({
    description: "Active la surveillance d'une parcelle (alertes satellite, publicité foncière voisine, litiges) par SMS et WhatsApp. Action : demande l'accord de l'utilisateur.",
    inputSchema: z.object({ nup }),
    execute: async ({ nup }) => ({ nup, canaux: ["SMS", "WhatsApp"], lien: `/espace/surveillance?nup=${nup}` }),
  }),
};
