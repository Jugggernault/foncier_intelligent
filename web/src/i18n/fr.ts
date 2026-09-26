// Textes de l'interface publique. Ajouter en.ts / fon.ts avec la même forme.
export const fr = {
  brand: "Foncier Intelligent",
  nav: [
    { href: "/recherche", label: "Vérifier" },
    { href: "/leve", label: "Levé" },
    { href: "/carte", label: "Carte" },
    { href: "/publicite", label: "Publicité foncière" },
    { href: "/guides", label: "Démarches" },
    { href: "/assistant", label: "Assistant" },
  ],
  account: "Mon espace",
  menu: "Menu",

  hero: {
    title: "Avant de payer un terrain, vérifiez-le.",
    lead: "Entrez le numéro unique de parcelle (NUP) que vous donne le vendeur. Statut juridique, image satellite et risques, en 30\u00a0secondes.",
    label: "Numéro unique de parcelle",
    placeholder: "Ex. 101236198",
    submit: "Vérifier",
    tryLabel: "Essayez\u00a0:",
    noNup: "Pas de NUP\u00a0? Vérifiez avec le levé",
    invalid: "Un NUP compte 9 chiffres.",
    notFound: "Cette parcelle n'est pas encore dans la démonstration.",
    notFoundAction: "Consulter la fiche sur le cadastre ANDF",
  },

  verdict: {
    why: "Pourquoi ce verdict ?",
    open: "Voir la fiche complète",
    source: "Sources : avis de publicité foncière ANDF · Sentinel-2 GeoMAD annuel © Digital Earth Africa (CC BY 4.0), données Copernicus modifiées",
  },

  how: {
    title: "Trois gestes, trente secondes.",
    lead: "Du numéro inscrit sur le papier du vendeur à un verdict que vous pouvez comprendre.",
    steps: [
      { title: "Relevez le NUP", text: "Le numéro unique de parcelle compte 9 chiffres. Il figure sur l'attestation, le certificat ou le titre que vous montre le vendeur." },
      { title: "Regardez le terrain", text: "Un vendeur peut produire un faux papier, pas une fausse image satellite. Faites glisser\u00a0: la côte de Togbin, de 2017 à 2025." },
      { title: "Lisez le verdict", text: "Pas de note mystérieuse\u00a0: chaque signal est expliqué, avec ses sources et ce qu'il faut faire pour lever le doute." },
    ],
    docLabel: "Numéro unique de parcelle",
    docHint: "Sur les documents du vendeur",
    tryCta: "Vérifier cette parcelle",
    slider: "Année de l'image satellite",
    caption: "Togbin-Daho, Godomey · NUP 101236198 · Sentinel-2 GeoMAD annuel © Digital Earth Africa (CC BY 4.0), données Copernicus modifiées",
    levels: [
      { level: "danger", title: "Rouge\u00a0: n'achetez pas", text: "Terrain de l'État, litige déclaré, ou vendeur qui n'est pas le titulaire." },
      { level: "caution", title: "Orange\u00a0: vérifiez avant de payer", text: "Propriété pas encore confirmée ou information manquante." },
      { level: "clear", title: "Vert\u00a0: aucun signal connu", text: "Titre foncier au nom du vendeur, aucun litige ni alerte connus." },
    ],
  },

  tools: {
    title: "Avant, pendant et après l'achat.",
    lead: "Chaque outil part de la parcelle et renvoie vers elle.",
    items: [
      { href: "/recherche", icon: "search", title: "Vérifier une parcelle", text: "Statut juridique, image satellite et risques, à partir du NUP." },
      { href: "/leve", icon: "ruler", title: "Pas de NUP\u00a0? Le levé", text: "Vérifiez avec le plan du géomètre que vous remet le vendeur." },
      { href: "/carte", icon: "map", title: "La carte", text: "Les parcelles publiées, vues du ciel, année par année." },
      { href: "/publicite", icon: "bell", title: "Publicité foncière", text: "Les demandes de titre en cours, et 15\u00a0jours pour s'opposer." },
      { href: "/assistant", icon: "message", title: "Ilèmi, l'agent foncier", text: "Vos questions, répondues avec la source juridique." },
      { href: "/outils/frais", icon: "calculator", title: "Calcul des frais", text: "Les frais de mutation ANDF, selon le barème officiel." },
      { href: "/outils/eligibilite", icon: "user", title: "Qui peut acheter\u00a0?", text: "Nationalité, ville ou campagne\u00a0: ce que dit le Code foncier." },
      { href: "/guides", icon: "file", title: "Les démarches", text: "Délais, coûts et qui peut les faire, sans détour." },
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
      { title: "Vérifier", links: [["Rechercher une parcelle", "/recherche"], ["Carte", "/carte"], ["Publicité foncière", "/publicite"], ["Vérifier un rapport", "/verifier"]] },
      { title: "Comprendre", links: [["Démarches", "/guides"], ["Calcul des frais", "/outils/frais"], ["Qui peut acheter ?", "/outils/eligibilite"]] },
      { title: "Le projet", links: [["À propos", "/a-propos"], ["Impact", "/impact"], ["Charte IA", "/ia-responsable"], ["Documentation", "/docs"], ["API", "/docs/api"]] },
    ],
    legal: [["Confidentialité", "/confidentialite"], ["Conditions", "/conditions"]],
  },
} as const;

export type Dictionary = typeof fr;
