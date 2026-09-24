// Assistant foncier (IA-09), version démonstration : réponses rédigées à partir des textes ANDF, choisies par mots-clés,
// plus deux outils déterministes (fiche NUP, calcul des frais). ponytail: remplacer `answer` par un RAG Claude + pgvector
// (DATA_SOURCES.md § 7, priorité 5) en gardant la même forme de réponse.
import { getParcel } from "./data/parcels";
import { mutationFee } from "./fees";
import { fmtFcfa } from "./labels";
import { assess } from "./risk";

export type Answer = {
  text: string[];
  sources: string[];
  nup?: string;
  followUps?: string[];
};

type Entry = { keys: string[]; answer: Answer };

const KB: Entry[] = [
  {
    keys: ["etranger", "togolais", "nigerian", "français", "reciprocite", "nationalite", "pas beninois"],
    answer: {
      text: [
        "En ville, un étranger peut acheter si son pays applique la réciprocité avec le Bénin.",
        "À la campagne, non : les terres rurales sont réservées aux personnes de nationalité béninoise.",
        "Dans tous les cas, un bail de 50 ans maximum, non renouvelable, est possible.",
      ],
      sources: ["Code foncier et domanial · conditions d'accès au foncier (ANDF)"],
      followUps: ["Quelles pièces pour un titre foncier ?", "Comment acheter en ville ?"],
    },
  },
  {
    keys: ["titre foncier", "obtenir un titre", "pieces", "documents", "dossier"],
    answer: {
      text: [
        "La demande de titre foncier se fait en ligne sur le Portail national des e-services avec votre NPI. Délai indicatif : 120 jours.",
        "Pièces : pièce d'identité, un acte de présomption de propriété (attestation de détention coutumière, certificat administratif, certificat foncier rural, décision de justice…), une preuve de la transaction et un levé topographique ou extrait de plan cadastral.",
        "La demande est ensuite publiée 15 jours : chacun peut s'y opposer.",
      ],
      sources: ["Fiche « Demande de titre foncier » (service-public.bj, PS00124)", "Décret 2025-176 (NUP)"],
      followUps: ["Combien de temps dure la publicité ?", "Puis-je vendre avant d'avoir le titre ?"],
    },
  },
  {
    keys: ["publicite", "opposition", "opposer", "15 jours", "avis"],
    answer: {
      text: [
        "Chaque demande de titre ou de confirmation de droits est publiée pendant environ 15 jours.",
        "Pendant ce délai, toute personne concernée peut déposer une opposition au bureau communal de l'ANDF. Passé ce délai, il faut saisir la Commission de gestion des plaintes ou le tribunal.",
      ],
      sources: ["Code foncier et domanial (procédure contradictoire)", "Avis de publicité foncière (andf.bj)"],
      followUps: ["Comment porter plainte ?"],
    },
  },
  {
    keys: ["vendre avant", "certificat d'appartenance", "appartenance", "titre en cours"],
    answer: {
      text: [
        "Oui, avec un certificat d'appartenance : il permet de céder une parcelle dont la confirmation de droits est en cours.",
        "Il coûte 50 500 F, est délivré en 10 jours environ, et n'est valable qu'un an, sans renouvellement.",
      ],
      sources: ["Code foncier et domanial, art. 17", "Fiche « Certificat d'appartenance » (ANDF)"],
    },
  },
  {
    keys: ["rural", "hectare", "ha", "campagne", "agricole", "preemption"],
    answer: {
      text: [
        "Les terres rurales sont réservées aux Béninois.",
        "À partir de 2 ha, l'ANDF dispose d'un droit de préemption et vise la vente. De 20 à 500 ha, le projet de mise en valeur doit être approuvé et l'origine des fonds justifiée. Au-delà de 500 ha, le Conseil des ministres se prononce.",
      ],
      sources: ["Code foncier et domanial, art. 361", "Décision ANDF du 27 décembre 2024 (origine des fonds)"],
    },
  },
  {
    keys: ["plainte", "litige", "conflit", "arnaque", "escroquerie", "double vente"],
    answer: {
      text: [
        "Pour un transfert de propriété contesté, déposez une plainte auprès de la Commission de gestion des plaintes (CGP).",
        "Pour un conflit de limites ou de voisinage, la Commission de gestion foncière (CoGeF) de votre commune peut organiser une médiation.",
        "Si quelqu'un vous vend une parcelle de l'État ou une parcelle déjà vendue, ne payez pas et signalez-le au bureau communal de l'ANDF.",
      ],
      sources: ["Arrêtés 2019 n° 1908 et 2021 n° 940 (CGP)", "Décret 2015-017 (CoGeF, SVGF)"],
    },
  },
  {
    keys: ["notaire", "acheter", "achat", "acte", "vente"],
    answer: {
      text: [
        "Depuis la fin de la période transitoire, une vente se fait par acte notarié, ou par acte sous seing privé déposé au rang des minutes d'un notaire.",
        "Avant de signer, vérifiez la parcelle par son NUP et demandez un état descriptif (5 500 F, 24 h) pour connaître le titulaire exact.",
      ],
      sources: ["Code foncier et domanial, art. 17, 18 et 516"],
      followUps: ["Combien coûte une mutation pour 25 millions ?"],
    },
  },
];

const FALLBACK: Answer = {
  text: [
    "Je réponds aux questions sur l'achat de terrain, le titre foncier, la publicité foncière, les frais et les litiges.",
    "Vous pouvez aussi me donner un NUP à 9 chiffres pour que je vérifie la parcelle.",
    "Pour un conseil qui vous engage, adressez-vous à un notaire ou au bureau communal de l'ANDF.",
  ],
  sources: [],
  followUps: ["Je suis Togolais, puis-je acheter à Cotonou ?", "Quelles pièces pour un titre foncier ?", "Vérifie la parcelle 101236198"],
};

const norm = (s: string) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

function parseAmount(q: string): number | undefined {
  const m = norm(q).match(/(\d[\d\s.]*)\s*(millions?|m\b|fcfa|f\b)?/);
  if (!m) return;
  const n = Number(m[1].replace(/[\s.]/g, ""));
  if (!n) return;
  return /million|m\b/.test(m[2] ?? "") ? n * 1_000_000 : n;
}

export function answer(question: string): Answer {
  const q = norm(question);

  const nup = question.match(/\b\d{9}\b/)?.[0];
  if (nup) {
    const p = getParcel(nup);
    if (!p) return { text: [`Je ne trouve pas la parcelle ${nup} dans la démonstration. Vérifiez les 9 chiffres ou consultez le cadastre de l'ANDF.`], sources: [] };
    const r = assess(p);
    return {
      text: [`Parcelle ${nup}, ${p.quartier}, ${p.commune}.`, r.headline + ".", ...r.reasons.slice(0, 2).map((x) => x.text)],
      sources: ["Cadastre ANDF (données de démonstration)", "Score de risque Foncier Intelligent"],
      nup,
    };
  }

  if (/(frais|cout|combien).*(mutation|vente|transfert)|(mutation|transfert).*(frais|cout|combien)/.test(q)) {
    const amount = parseAmount(q);
    if (amount) {
      const f = mutationFee(amount);
      return {
        text: [
          `Pour une vente de ${fmtFcfa(amount)}, les frais de mutation de l'ANDF sont de ${fmtFcfa(f.total)} : ${f.rule}, plus ${fmtFcfa(f.regie)} de frais de régie.`,
          "Les honoraires du notaire ne sont pas inclus.",
        ],
        sources: ["Barème de la mutation de titre foncier (service-public.bj, PS01427)"],
      };
    }
    return {
      text: ["Les frais de mutation dépendent du prix : 0,3 % jusqu'à 10 millions, 30 000 F de 10 à 50 millions, 0,5 % au-delà, plus 500 F de régie. Donnez-moi le prix de vente et je fais le calcul."],
      sources: ["Barème de la mutation de titre foncier (service-public.bj, PS01427)"],
    };
  }

  const scored = KB.map((e) => ({ e, score: e.keys.filter((k) => q.includes(norm(k))).length })).sort((a, b) => b.score - a.score);
  return scored[0].score > 0 ? scored[0].e.answer : FALLBACK;
}
