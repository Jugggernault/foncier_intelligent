// Guides de démarches, rédigés à partir des fiches ANDF et service-public.bj.
// ponytail: contenu statique ; à synchroniser avec l'API service-public.bj (DATA_SOURCES.md § 3.1).

export type Guide = {
  slug: string;
  title: string;
  summary: string;
  audience: string;
  delay?: string;
  cost?: string;
  steps: string[];
  documents?: string[];
  legal: string;
  cta?: { label: string; href: string };
};

export const GUIDES: Guide[] = [
  {
    slug: "acheter-en-ville",
    title: "Acheter une parcelle en ville",
    summary: "Les étapes pour acheter sans risque un terrain en milieu urbain, du premier contact au titre foncier à votre nom.",
    audience: "Béninois, ou étrangers dont le pays applique la réciprocité",
    steps: [
      "Demandez au vendeur le NUP de la parcelle et vérifiez-la sur Foncier Intelligent : statut, litiges, image du terrain.",
      "Demandez un état descriptif à l'ANDF pour connaître le titulaire exact et ce qui pèse sur le titre.",
      "Signez la vente devant un notaire (acte notarié), ou déposez l'acte sous seing privé au rang des minutes d'un notaire.",
      "Le notaire demande la mutation du titre foncier à l'ANDF (72 h).",
      "Récupérez le nouveau titre foncier à votre nom.",
    ],
    documents: ["Pièce d'identité", "NUP de la parcelle", "Titre foncier ou certificat d'appartenance du vendeur"],
    legal: "Code foncier et domanial, art. 17, 18 et 516",
    cta: { label: "Vérifier une parcelle", href: "/recherche" },
  },
  {
    slug: "acheter-a-la-campagne",
    title: "Acheter une terre rurale",
    summary: "Les terres rurales sont réservées aux personnes de nationalité béninoise et soumises à des contrôles selon la surface.",
    audience: "Personnes physiques ou morales de nationalité béninoise",
    steps: [
      "Vérifiez la parcelle et son statut, notamment les droits coutumiers.",
      "À partir de 2 ha : l'ANDF dispose d'un droit de préemption et doit viser la vente.",
      "De 20 à 500 ha : faites approuver votre projet de mise en valeur par l'ANDF et prouvez l'origine des fonds.",
      "Au-delà de 500 ha : le projet est soumis au Conseil des ministres sur avis de l'ANDF.",
      "Signez la vente devant notaire, puis faites enregistrer la mutation.",
    ],
    documents: ["Pièce d'identité ou statuts", "Projet de mise en valeur (au-delà de 20 ha)", "Preuve de l'origine des fonds (au-delà de 20 ha)"],
    legal: "Code foncier et domanial, art. 361 ; décision ANDF du 27 décembre 2024",
    cta: { label: "Qui peut acheter ?", href: "/outils/eligibilite" },
  },
  {
    slug: "etrangers",
    title: "Acheter quand on n'est pas Béninois",
    summary: "Ce qu'un étranger peut acheter ou louer au Bénin.",
    audience: "Ressortissants étrangers",
    steps: [
      "En ville : achat possible si votre pays applique la réciprocité avec le Bénin.",
      "À la campagne : achat impossible, les terres rurales sont réservées aux Béninois.",
      "Alternative : un bail de 50 ans maximum, non renouvelable.",
    ],
    legal: "Code foncier et domanial (conditions d'accès au foncier)",
    cta: { label: "Tester mon éligibilité", href: "/outils/eligibilite" },
  },
  {
    slug: "titre-foncier",
    title: "Obtenir un titre foncier",
    summary: "Le titre foncier est le seul acte de propriété définitif. Il est délivré après une procédure contradictoire.",
    audience: "Béninois, ou étrangers sous réciprocité",
    delay: "120 jours",
    cost: "Selon la superficie",
    steps: [
      "Déposez la demande en ligne sur le Portail national des e-services avec votre NPI.",
      "L'ANDF vérifie les pièces et le plan de la parcelle.",
      "La demande est publiée pendant 15 jours (publicité foncière) : chacun peut s'opposer.",
      "Sans opposition fondée, l'ANDF confirme vos droits et délivre le titre foncier.",
    ],
    documents: [
      "Pièce d'identité (ou IFU pour une personne morale)",
      "Acte de présomption de propriété : attestation de détention coutumière, certificat administratif, certificat foncier rural, décision de justice…",
      "Preuve de la transaction : convention de vente, acte de donation…",
      "Levé topographique ou extrait de plan cadastral",
    ],
    legal: "Code foncier et domanial ; décret 2025-176 (NUP et confirmation cadastrale)",
    cta: { label: "Préparer mon dossier", href: "/espace/dossiers/nouveau" },
  },
  {
    slug: "mutation",
    title: "Transférer un titre foncier après une vente",
    summary: "La mutation inscrit le nouvel acquéreur sur le titre. Elle est faite exclusivement par un notaire.",
    audience: "Notaires, pour le compte de l'acquéreur",
    delay: "72 heures",
    cost: "0,3 % jusqu'à 10 M, 30 000 F de 10 à 50 M, 0,5 % au-delà, + 500 F de régie",
    steps: [
      "Le notaire dépose la demande de mutation sur le Portail national des e-services.",
      "Il joint l'acte de transfert, la copie du titre et les pièces d'identité des acquéreurs.",
      "Le titre est mis à jour au nom de l'acquéreur.",
    ],
    documents: ["Lettre de demande", "Expédition notariale ou décision de justice", "Copie du titre foncier", "Pièces d'identité des acquéreurs"],
    legal: "Arrêté portant nomenclature des frais de l'ANDF",
    cta: { label: "Calculer les frais", href: "/outils/frais" },
  },
  {
    slug: "certificat-appartenance",
    title: "Vendre pendant que le titre est en cours",
    summary: "Le certificat d'appartenance permet de céder une parcelle dont la confirmation de droits est en cours.",
    audience: "Présumés propriétaires",
    delay: "10 jours",
    cost: "50 500 F",
    steps: [
      "Déposez une demande de titre foncier (vous obtenez un numéro de réquisition).",
      "Demandez le certificat d'appartenance en ligne avec une promesse de vente notariée.",
      "Le certificat est valable un an, non renouvelable.",
    ],
    documents: ["Pièce d'identité", "Acte de présomption de propriété", "Levé topographique géoréférencé", "Preuve de dépôt de la demande de titre", "Promesse de vente notariée"],
    legal: "Code foncier et domanial, art. 17",
  },
  {
    slug: "opposition",
    title: "S'opposer à une demande de titre",
    summary: "Si une demande publiée touche votre terrain, vous pouvez vous y opposer pendant les 15 jours de publicité.",
    audience: "Riverains, ayants droit, toute personne concernée",
    delay: "Avant la fin de la publicité",
    steps: [
      "Repérez l'avis sur la page Publicité foncière (ou recevez une alerte si vous surveillez votre parcelle).",
      "Rassemblez vos preuves : titre, acte de vente, attestation, témoignages.",
      "Déposez l'opposition auprès du bureau communal de l'ANDF avant la date limite.",
    ],
    legal: "Code foncier et domanial (procédure contradictoire de confirmation des droits)",
    cta: { label: "Voir les avis ouverts", href: "/publicite" },
  },
  {
    slug: "plainte",
    title: "Porter plainte sur un transfert de propriété",
    summary: "La Commission de gestion des plaintes (CGP) traite les réclamations sur les transferts de propriété.",
    audience: "Toute personne lésée",
    steps: [
      "Remplissez le formulaire de plainte de la CGP.",
      "Joignez les pièces qui prouvent vos droits.",
      "La commission instruit la plainte ; une médiation peut être proposée par la CoGeF de votre commune.",
    ],
    legal: "Arrêtés 2019 n° 1908 et 2021 n° 940 (Commission de gestion des plaintes)",
    cta: { label: "Déposer une plainte", href: "/espace/litiges/nouveau" },
  },
];

export const getGuide = (slug: string) => GUIDES.find((g) => g.slug === slug);
