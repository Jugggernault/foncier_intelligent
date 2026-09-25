# Démo Foncier Intelligent en 5 minutes

Site : https://foncier-intelligent.vercel.app · trois personnages, un fil rouge : **la vérification qui évite l'erreur, de l'acheteur jusqu'à l'agent de l'ANDF**.

Message à faire passer : *le site de l'ANDF dit ce qui est enregistré ; Foncier Intelligent dit si c'est sûr, empêche les dossiers voués au rejet et contrôle les avis avant la fin du délai d'opposition. Sur les données réelles de l'ANDF.*

## Avant de monter sur scène (J-1 et H-30 min)

- [ ] Ouvrir le site une première fois : Supabase (offre gratuite) se met en pause après 7 jours sans activité. Dans ce cas, le réveiller depuis le tableau de bord Supabase.
- [ ] Charger à l'avance, dans des onglets : `/`, `/carte`, `/impact`, `/publicite/101525236`, `/assistant`, `/parcelle/101236198/rapport`. La première ouverture de la carte à l'échelle du pays est lente (tuiles des couches).
- [ ] Se connecter une fois comme géomètre puis comme agente (menu « Mon espace » → « Entrer en démonstration »), pour que le changement de profil soit instantané.
- [ ] Télécharger en local `leve-calavi-tankpe.pdf` et `leve-calavi-calage.pdf` depuis `/demo-docs/`.
- [ ] Vérifier qu'Ilèmi répond (`/assistant` → « Vérifie la parcelle 101236198 »). Si OpenRouter est en panne, retirer `OPENROUTER_API_KEY` sur Vercel et redéployer : le modèle scripté prend le relais avec les mêmes écrans.
- [ ] WhatsApp : depuis le téléphone de démo, avoir déjà envoyé `join <code>` au numéro du bac à sable Twilio.
- [ ] Enregistrer la démo complète en vidéo (OBS ou l'enregistreur de l'écran, 1080p) : plan B si le réseau lâche.

## Déroulé

### 0:00 – 0:30 · Le problème

> « Au Bénin, on achète un terrain sur la foi de papiers. Double vente, terrain de l'État, zone réservée : on le découvre après avoir payé. Et côté ANDF, un plan sur quatre est rejeté. »

Écran : page d'accueil.

### 0:30 – 1:30 · Afi, acheteuse : vérifier avant de payer

1. Accueil → taper **101236198** → Vérifier.
2. Montrer : le **vrai polygone** de l'ANDF sur l'image satellite, la frise 2017 → 2025 (l'aménagement littoral apparaît en 2023), le verdict rouge **« Terrain de l'État : il ne peut pas vous être vendu »**.
3. « Pourquoi ce verdict ? » : zone réservée (Périmètre de la Route des Pêches) à 93 %, domaine public maritime à 20 %. *Ces couches sont celles de l'ANDF.*
4. Pas de NUP ? Lien « Vérifiez avec le levé du vendeur » → `/leve` → déposer `leve-calavi-tankpe.pdf` : bornes lues, placées sur la carte, **zone en litige**.

> « Trente secondes, sans rien connaître au foncier. »

### 1:30 – 2:15 · Ilèmi, l'agent qui fait le travail

1. `/assistant` → « Vérifie la parcelle 101236307 et surveille-la ».
2. Montrer : le panneau de réflexion et les outils appelés, la carte et le verdict rendus dans le chat, les **sources numérotées [1] [2]** (fiche cadastrale, couches ANDF), puis la **demande d'accord** avant de surveiller → Confirmer.
3. Montrer le téléphone : même question sur **WhatsApp**, réponse en quelques secondes.

> « L'IA propose, l'utilisateur dispose. Et chaque affirmation est sourcée. »

### 2:15 – 3:15 · Kévin, géomètre, puis Sènami, agente de l'ANDF

1. Profil **géomètre** → « Pré-contrôler un plan » (`/pro/leves/nouveau`) → charger `leve-calavi-calage.pdf`.
2. Montrer le rapport : chevauchement avec un plan existant, *un plan voisin déjà rejeté pour défaut de calage*, **risque de rejet** appris sur les 6 930 plans d'Abomey-Calavi → **Transmettre au cadastre**.
3. Profil **agente** → « Plans des géomètres » → le plan arrive **avec son rapport** → « Renvoyer pour correction » avec un message.
4. Retour géomètre → « Mes levés » : la décision et le message sont là.

> « Le dossier voué au rejet ne part plus. L'agente reçoit des dossiers déjà contrôlés. »

### 3:15 – 4:00 · Contrôler les avis avant la fin du délai

1. `/publicite` → « Signalés par le contrôle automatique : 12 sur 143 ».
2. Ouvrir **101525236** : demande de confirmation **située à 100 % dans la zone de l'aéroport de Glo-Djigbé**.
3. Dans l'espace agente, « Publicité foncière » : mêmes signalements, classés en tête.

> « Aujourd'hui, personne ne croise systématiquement les avis avec les couches. Nous le faisons pour chaque avis publié. »

### 4:00 – 4:40 · L'impact, chiffré sur les décisions réelles

`/impact` : **13 594 plans**, **26 % rejetés**, **52 % des rejets avaient une cause détectable avant le dépôt**. Régler le calculateur en direct (part interceptée, semaines perdues, coût d'un rejet) : ~1 250 rejets évités, ~7 500 semaines d'attente épargnées.

> « Les hypothèses sont réglables, le nombre de rejets évitables, lui, est réel. »

### 4:40 – 5:00 · La confiance, et la suite

1. Rapport de vérification (`/parcelle/101236198/rapport`) : le **QR code** → le scanner avec le téléphone → « Rapport authentique ».
2. Montrer qu'en changeant un caractère du code sur `/verifier`, le rapport est refusé.

> « Même notre rapport ne peut pas être falsifié. Prochaine étape : une convention avec l'ANDF pour brancher le cadastre en direct, déjà prêt derrière un interrupteur. »

## Questions probables

| Question | Réponse courte |
| --- | --- |
| D'où viennent les données ? | Couches fournies par l'ANDF au hackathon (PostGIS), avis publiés sur andf.bj, polygones du WFS de l'ANDF, imagerie Digital Earth Africa (CC BY 4.0). Aucune donnée nominative conservée. |
| Et les données personnelles ? | Aucun nom de demandeur ou de partie n'est stocké : seuls le NUP, les dates et des catégories. L'identité complète reste dans e-Foncier, côté agent. |
| L'IA peut-elle se tromper ? | Elle ne décide jamais d'un droit. Les verdicts viennent de règles et des couches de l'ANDF ; l'agent conversationnel cite ses sources et demande l'accord avant d'agir. |
| Combien ça coûte à faire tourner ? | Vercel + Supabase, sans serveur à gérer. Le modèle de langage est interchangeable (OpenRouter). |
| Qu'est-ce qui est simulé ? | Les dossiers, litiges et alertes des espaces professionnels, faute d'accès à e-Foncier. Tout ce qui est montré sur les parcelles, les avis et l'impact est réel. |
| Faille de sécurité ? | Le GeoServer de l'ANDF annonce l'écriture WFS-T : nous le signalons dans la démarche partenariale, sans l'avoir exploité. |
