// Base de documents fictifs de la démo : levés, attestations et conventions dont le contenu est connu.
// Les levés sont placés sur les vraies couches ANDF du hackathon pour déclencher chaque cas (ZDUP, litige,
// domaine public, forêt classée, plan rejeté pour calage, terrain sans alerte). Les PDF correspondants sont
// générés par `bun scripts/generate-demo-docs.tsx` dans public/demo-docs/. Personnes et numéros : fictifs.

export type Borne = { borne: string; x: number; y: number };

type Base = { id: string; file: string; title: string; scenario: string; date: string };

export type SurveyDoc = Base & {
  kind: "leve";
  commune: string;
  quartier: string;
  client: string;
  surveyor: string;
  declaredM2: number;
  bornes: Borne[];
};
export type AdcDoc = Base & { kind: "adc"; holder: string; commune: string; quartier: string; declaredM2: number; signatory: string };
export type SaleDoc = Base & { kind: "convention"; seller: string; buyer: string; price: number; commune: string; quartier: string; declaredM2: number };
export type DemoDoc = SurveyDoc | AdcDoc | SaleDoc;

/** Rectangle orienté en UTM 31N autour d'un centre : bornes B1 à B4 arrondies au centimètre. */
function rect(cx: number, cy: number, w: number, h: number, angleDeg = 8): Borne[] {
  const a = (angleDeg * Math.PI) / 180;
  return [
    [-w / 2, -h / 2],
    [w / 2, -h / 2],
    [w / 2, h / 2],
    [-w / 2, h / 2],
  ].map(([dx, dy], i) => ({
    borne: `B${i + 1}`,
    x: Math.round((cx + dx * Math.cos(a) - dy * Math.sin(a)) * 100) / 100,
    y: Math.round((cy + dx * Math.sin(a) + dy * Math.cos(a)) * 100) / 100,
  }));
}

const SURVEYOR = "Cabinet Géo-Précision (géomètre-expert agréé, démo)";

export const DEMO_DOCS: DemoDoc[] = [
  {
    id: "leve-togbin", kind: "leve", file: "leve-togbin-godomey.pdf", title: "Levé topographique · Togbin-Daho",
    scenario: "Terrain proposé à la vente dans la zone déclarée d'utilité publique de la Route des Pêches.",
    date: "2026-08-14", commune: "Abomey-Calavi", quartier: "Togbin-Daho (Godomey)", client: "M. Rodolphe Kpadonou",
    surveyor: SURVEYOR, declaredM2: 500, bornes: rect(422960, 701880, 20, 25),
  },
  {
    id: "convention-togbin", kind: "convention", file: "convention-vente-togbin.pdf", title: "Convention de vente · Togbin-Daho",
    scenario: "Vente sous seing privé d'un terrain situé en zone déclarée d'utilité publique.",
    date: "2026-08-20", seller: "M. Rodolphe Kpadonou", buyer: "Mme Afi Houngbédji", price: 9_500_000,
    commune: "Abomey-Calavi", quartier: "Togbin-Daho", declaredM2: 500,
  },
  {
    id: "leve-calavi-litige", kind: "leve", file: "leve-calavi-tankpe.pdf", title: "Levé topographique · Abomey-Calavi",
    scenario: "Parcelle située dans une zone en litige devant le tribunal d'Abomey-Calavi.",
    date: "2026-07-02", commune: "Abomey-Calavi", quartier: "Tankpè", client: "Mme Colette Assogba",
    surveyor: SURVEYOR, declaredM2: 600, bornes: rect(425513, 708882, 20, 25, 3),
  },
  {
    id: "adc-calavi-litige", kind: "adc", file: "attestation-detention-coutumiere-tankpe.pdf", title: "Attestation de détention coutumière · Tankpè",
    scenario: "Attestation dont la superficie déclarée dépasse de 20 % celle du levé.",
    date: "2019-03-11", holder: "Mme Colette Assogba", commune: "Abomey-Calavi", quartier: "Tankpè", declaredM2: 600,
    signatory: "Chef d'arrondissement d'Abomey-Calavi (fictif)",
  },
  {
    id: "leve-calavi-sain", kind: "leve", file: "leve-calavi-zoca.pdf", title: "Levé topographique · Zoca",
    scenario: "Terrain sans signal d'alerte dans les couches disponibles.",
    date: "2026-09-01", commune: "Abomey-Calavi", quartier: "Zoca", client: "M. Josué Agbodjan",
    surveyor: SURVEYOR, declaredM2: 500, bornes: rect(425500, 713000, 20, 25, 12),
  },
  {
    id: "adc-calavi-sain", kind: "adc", file: "attestation-detention-coutumiere-zoca.pdf", title: "Attestation de détention coutumière · Zoca",
    scenario: "Attestation cohérente avec le levé.",
    date: "2021-06-24", holder: "M. Josué Agbodjan", commune: "Abomey-Calavi", quartier: "Zoca", declaredM2: 500,
    signatory: "Chef d'arrondissement d'Abomey-Calavi (fictif)",
  },
  {
    id: "leve-ouidah-plage", kind: "leve", file: "leve-ouidah-plage.pdf", title: "Levé topographique · Ouidah, bord de mer",
    scenario: "Parcelle dans la bande de 100 m du domaine public maritime.",
    date: "2026-05-19", commune: "Ouidah", quartier: "Djègbadji", client: "M. Serge Houénou",
    surveyor: SURVEYOR, declaredM2: 450, bornes: rect(398910, 699110, 18, 25, 0),
  },
  {
    id: "leve-calavi-calage", kind: "leve", file: "leve-calavi-calage.pdf", title: "Levé topographique · Abomey-Calavi (plan à reprendre)",
    scenario: "Plan qui recoupe un titre en cours déjà rejeté pour défaut de calage : cas du pré-contrôle.",
    date: "2026-09-10", commune: "Abomey-Calavi", quartier: "Ouèga", client: "Mme Béatrice Dossou",
    surveyor: SURVEYOR, declaredM2: 480, bornes: rect(427463, 711305, 20, 24, 5),
  },
  {
    id: "leve-seme-foret", kind: "leve", file: "leve-seme-foret.pdf", title: "Levé topographique · Sèmè-Podji",
    scenario: "Parcelle qui empiète sur la forêt classée de Sèmè.",
    date: "2026-04-03", commune: "Sèmè-Podji", quartier: "Ekpè", client: "M. Ulrich Sossou",
    surveyor: SURVEYOR, declaredM2: 500, bornes: rect(461334, 706689, 20, 25, 20),
  },
];

export const getDemoDoc = (fileOrId: string) => {
  const key = fileOrId.toLowerCase().replace(/^.*[\\/]/, "");
  return DEMO_DOCS.find((d) => d.file === key || d.id === key || key.startsWith(d.id));
};
