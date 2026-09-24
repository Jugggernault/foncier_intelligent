// Textes de l'interface publique. Ajouter en.ts / fon.ts avec la même forme.
export const fr = {
  brand: "Foncier Intelligent",
  nav: [
    { href: "/recherche", label: "Vérifier" },
    { href: "/carte", label: "Carte" },
    { href: "/publicite", label: "Publicité foncière" },
    { href: "/guides", label: "Démarches" },
    { href: "/assistant", label: "Assistant" },
  ],
  account: "Mon espace",
  menu: "Menu",

  hero: {
    title: "Avant de payer un terrain, vérifiez-le.",
    lead: "Saisissez le numéro unique de parcelle (NUP) inscrit sur les documents du vendeur. Statut juridique, image satellite et risques, en 30 secondes.",
    label: "Numéro unique de parcelle",
    placeholder: "Ex. 101236198",
    submit: "Vérifier",
    tryLabel: "Essayez avec une parcelle réelle :",
    invalid: "Un NUP compte 9 chiffres.",
    notFound: "Cette parcelle n'est pas encore dans la démonstration.",
    notFoundAction: "Consulter la fiche sur le cadastre ANDF",
  },

  verdict: {
    sample: "Parcelle publiée par l'ANDF",
    footprint: "Emprise approximative, déduite du centroïde et de la superficie publiés",
    noImagery: "Localisation non publiée dans l'avis",
    noImageryHint: "Sans coordonnées, le terrain ne peut pas être observé par satellite.",
    why: "Pourquoi ce verdict ?",
    facts: { area: "Superficie", owner: "Propriétaire", procedure: "Procédure", publicity: "Publicité" },
    ownerState: "État béninois",
    ownerPrivate: "Particulier (identité masquée)",
    procedureConfirmation: "Confirmation cadastrale",
    procedureTitre: "Demande de titre foncier",
    open: "Voir la fiche complète",
    source: "Sources : avis de publicité foncière ANDF · Sentinel-2 cloudless © EOX IT Services (CC BY-NC-SA 4.0), données Copernicus modifiées",
  },

  timeline: {
    title: "Le terrain ne ment pas.",
    lead: "Un vendeur peut produire un faux papier, pas une fausse image satellite. Chaque fiche montre l'évolution réelle du terrain depuis 2016. Ici, la côte de Togbin : l'aménagement littoral apparaît en 2022.",
    caption: "Togbin-Daho, Godomey · NUP 101236198 · Sentinel-2 cloudless © EOX IT Services (CC BY-NC-SA 4.0), données Copernicus modifiées, 10 m par pixel",
  },

  reading: {
    title: "Un verdict que vous pouvez comprendre.",
    lead: "Pas de note mystérieuse : chaque signal est expliqué, avec ce qu'il faut faire pour lever le doute.",
    steps: [
      { title: "Confirmation des droits", text: "Le demandeur dépose ses pièces à l'ANDF." },
      { title: "Publicité foncière", text: "15 jours pendant lesquels chacun peut s'opposer." },
      { title: "Titre foncier", text: "Le seul acte de propriété définitif (Code foncier, 2013)." },
    ],
    levels: [
      { level: "danger", title: "Rouge", text: "N'achetez pas. Terrain de l'État, litige déclaré, ou vendeur qui n'est pas le titulaire." },
      { level: "caution", title: "Orange", text: "Propriété pas encore confirmée ou information manquante : vérifiez avant de payer." },
      { level: "clear", title: "Vert", text: "Titre foncier au nom du vendeur, aucun litige ni alerte connus." },
    ],
  },

  publicity: {
    title: "Un voisin demande un titre ? Soyez prévenu.",
    lead: "Chaque demande de titre est publiée pendant 15 jours. Passé ce délai, il est trop tard pour s'opposer. La plateforme lira chaque avis de l'ANDF et préviendra les riverains par SMS.",
    listTitle: "Derniers avis publiés",
    closed: "Clos",
    open: "Opposition possible",
    until: "jusqu'au",
    watch: "Surveiller ma parcelle",
    soon: "Bientôt",
    all: "Tous les avis",
    unknownPlace: "Localisation non publiée",
  },

  assistant: {
    title: "Une question ? Demandez simplement.",
    lead: "L'assistant répond à partir du Code foncier et domanial, des décrets et des démarches de l'ANDF. Chaque réponse cite sa source. Pour un conseil qui vous engage, il vous oriente vers un notaire.",
    cta: "Poser une question",
    sampleLabel: "Exemple de réponse",
    question: "Je suis Togolais. Puis-je acheter un terrain à Cotonou ?",
    answer: [
      "En ville, oui, si votre pays applique la réciprocité avec le Bénin : un Béninois doit pouvoir acheter chez vous dans les mêmes conditions.",
      "À la campagne, non : les terres rurales sont réservées aux personnes de nationalité béninoise.",
      "Autre option : un bail de 50 ans maximum, non renouvelable.",
    ],
    sourceLabel: "Source",
    source: "Code foncier et domanial · conditions d'accès au foncier (ANDF)",
  },

  fees: {
    title: "Combien coûte une mutation ?",
    lead: "Le transfert d'un titre foncier est fait par votre notaire. Voici les frais de l'ANDF, calculés selon le barème officiel.",
    label: "Prix de vente du terrain",
    suffix: "FCFA",
    result: "Frais ANDF",
    regie: "de frais de régie",
    rules: [
      { range: "Jusqu'à 10 millions", rule: "0,3 % du prix" },
      { range: "De 10 à 50 millions", rule: "30 000 F" },
      { range: "Au-delà de 50 millions", rule: "0,5 % du prix" },
    ],
    note: "Les honoraires du notaire et les autres frais ne sont pas inclus.",
  },

  services: {
    title: "Les démarches, sans détour.",
    lead: "Délais et coûts publiés par l'ANDF. La plupart se font en ligne avec votre NPI.",
    all: "Toutes les démarches",
    items: [
      { name: "État descriptif", what: "Qui est propriétaire, ce qui pèse sur le titre", delay: "24 h", cost: "5 500 F", who: "Propriétaire, notaire, requérant" },
      { name: "Attestation de demande de confirmation", what: "Prouve qu'un titre est en cours", delay: "48 h", cost: "10 500 F", who: "Tout usager" },
      { name: "Mutation de titre foncier", what: "Transfert de propriété après une vente", delay: "72 h", cost: "Selon le prix", who: "Notaire uniquement" },
      { name: "Certificat d'appartenance", what: "Vendre pendant que le titre est en cours (1 an)", delay: "10 jours", cost: "50 500 F", who: "Présumé propriétaire" },
      { name: "Demande de titre foncier", what: "Faire confirmer sa propriété", delay: "120 jours", cost: "Selon la superficie", who: "Béninois, ou étranger sous réciprocité" },
    ],
  },

  close: {
    title: "Un NUP, trente secondes, et vous savez.",
    cta: "Vérifier une parcelle",
  },

  footer: {
    about: "Démonstration portée par UDI-AFRICA, lauréat du Hackathon IA « Foncier Intelligent » (ASIN · ANDF · LuxDev, 2025). Ce site n'est pas un service officiel : pour tout acte, adressez-vous à l'ANDF ou à un notaire.",
    columns: [
      { title: "Vérifier", links: [["Rechercher une parcelle", "/recherche"], ["Carte", "/carte"], ["Publicité foncière", "/publicite"]] },
      { title: "Comprendre", links: [["Démarches", "/guides"], ["Calcul des frais", "/outils/frais"], ["Qui peut acheter ?", "/outils/eligibilite"]] },
      { title: "Le projet", links: [["À propos", "/a-propos"], ["Charte IA", "/ia-responsable"], ["Développeurs", "/developpeurs"]] },
    ],
    legal: [["Confidentialité", "/confidentialite"], ["Conditions", "/conditions"]],
  },
} as const;

export type Dictionary = typeof fr;
