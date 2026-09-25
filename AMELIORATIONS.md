# Ilèmi (hackathon) × Foncier Intelligent : analyse et axes d'amélioration

> Analyse du dépôt `ilemi-main/` (solution UDI-AFRICA, 1er prix, sept. 2025), comparée à la démo actuelle (`web/`) et au site de l'ANDF. Document de décision : chaque axe est indépendant.

---

## 1. Ce que contient Ilèmi

| Brique | Ce qui existe | État réel |
|---|---|---|
| **Données du hackathon** | 12 couches GeoJSON fournies par l'ANDF (UTM 31N), environ 18 500 polygones | ✅ Le vrai trésor, intégrable |
| Vérification par document | Upload PDF/image → API externe d'extraction des bornes (X, Y) → superposition Turf.js sur les 12 couches → rapport + carte | ⚠️ L'extracteur est un service externe **absent du dépôt** (`COORDINATE_EXTRACTION_API_URL`) |
| Chatbot | Gemini 2.5 Flash Lite, deux piles en parallèle (AI SDK `/api/chat` et LangChain `/api/langchain/chat`) | ⚠️ Doublon |
| UI générative | Le LLM renvoie un JSON `{message, uiComponents[]}` avec 6 composants (ContactCard, MapView, ChecklistDocuments, RedirectButtons, ProcessContainer, ReportContainer) | ⚠️ Le modèle « décrit » l'UI mais n'**agit** pas |
| Outils de l'agent | `retrieve_document` (RAG sur 13 textes, embeddings Google dans LibSQL), `get_analysis_data` | ❌ `get_analysis_data` renvoie des **données inventées** (BF-2024-00123…) |
| Voix | Transcription et synthèse audio | ✅ À garder |
| Sécurité | Arcjet (rate limit, bots), filtre de grossièretés, contrôle du referer | ✅ Idée à garder |

**Défauts techniques relevés**
- Les 90 Mo de GeoJSON sont relus depuis le disque **à chaque analyse**, sans index spatial.
- Domaine public lagunaire et maritime : test « la parcelle est au nord de la ligne » par boîtes englobantes, faux dans la plupart des cas.
- Pas de contrôle du système de coordonnées : les bornes extraites doivent être en UTM 31N pour que l'intersection soit juste.
- Deux piles d'agent, deux fournisseurs d'embeddings, fichiers compilés (`dist/`) et prototypes (`.tmp/`) versionnés.

## 2. Les données du hackathon : intégrables, et elles changent tout

| Couche | Objets | Attributs utiles | Usage dans la plateforme |
|---|---|---|---|
| `tf_en_cours` | **13 594** | commune, îlot, parcelle, **`validation` (oui/non)**, **`motif` du rejet**, `nup` (366), `num_tf` | Statut « titre en cours » ; **jeu d'entraînement du pré-contrôle des plans** (3 265 rejets motivés) |
| `tf_demembres` | 1 496 | n° TF, commune | Parcelle issue d'un TF morcelé ou recasé |
| `titre_reconstitue` | 613 | **`nup`**, BCDF, n° TF | Pont NUP ↔ titre |
| `litige` | 645 | tribunal, n° de rôle, objet, parties (**noms réels**, avec des champs `_alea` pseudonymisés) | Verdict rouge « litige devant le tribunal » |
| `restriction` | 149 | type (**ZDUP** 38, **PAG** 17, domaine public naturel 90, zones frontalières, sable), désignation | Verdict « zone déclarée d'utilité publique » |
| `zone_inondable` | 1 922 | source, surface | Remplace l'heuristique climat actuelle |
| `air_proteges` | 22 | désignation (Pendjari, forêts classées…) | Empiètement sur aire protégée (fiabilité variable, cf. PRD Ilèmi) |
| `tf_etat` | 18 | n° TF, surface | Domaine de l'État |
| `aif` | 25 | n° TF, localisation | Associations d'intérêts fonciers |
| `enregistrement individuel` | 77 | code INSAE, bloc, parcelle, superficie | Parcelles du cadastre (échantillon) |
| `dpl`, `dpm` | 15 + 4 lignes | — | Domaine public lagunaire / maritime (bande de 100 m à calculer) |

**Preuve immédiate sur nos parcelles réelles** : la parcelle **101236198** (Togbin) tombe dans la **ZDUP « Périmètre de la Route des Pêches »**. C'est exactement le terrassement que la frise satellite de la page d'accueil montre à partir de 2022. Le 101236087 est dans la même ZDUP, le 101232574 est dans un **PAG « logements socio-économiques »**, et le 101236307 et le 101232574 ont un **titre en cours**. Aujourd'hui, la démo ne dit rien de tout cela.

**Précautions**
- Utiliser uniquement les champs `_alea` (pseudonymisés) pour les litiges ; ne jamais afficher ni versionner les noms réels.
- Ces données ont été fournies pour le hackathon : **confirmer avec l'ANDF / l'ASIN** leur usage dans la démo avant toute diffusion hors de ces institutions.
- Ne pas committer `ilemi-main/public/data_files` dans un dépôt public.

## 3. Ce que notre solution fait que le site de l'ANDF ne fait pas

| Besoin | ANDF aujourd'hui | Foncier Intelligent |
|---|---|---|
| Savoir si un terrain est sûr | `cadastre.andf.bj/nup/…` : surface, localisation, n° de TF. Aucun verdict | **Un verdict expliqué** qui croise titre, litiges, ZDUP/PAG, domaine public, zone inondable et publicité en cours |
| Vérifier sans NUP | Impossible | **À partir du levé du vendeur** (photo ou PDF) : bornes extraites puis croisées avec les couches |
| Voir le terrain | Une orthophoto ponctuelle | **L'évolution depuis 2016** et des alertes de changement |
| Être prévenu | Rien : il faut aller lire la liste des avis | **Alertes** : demande de titre publiée à côté, construction, litige |
| Déposer un plan qui passe du premier coup | Rejet après instruction (« revoir le calage », « élément physique manquant », « zone ZDUP », « autre plan de bornage »…) | **Pré-contrôle avant dépôt**, appris sur les 13 594 décisions réelles |
| Comprendre et agir | Pages de FAQ | **Un agent qui fait** : il vérifie, calcule, prépare le dossier ou l'opposition, surveille, avec validation humaine |
| Instruire plus vite (agents) | e-Foncier, sans aide | **Copilote** : anomalies, projet d'acte, file priorisée |
| Pilotage | Statistiques en PDF | Indicateurs vivants, empiètements, TFU, LCB-FT |

Positionnement : **une couche d'intelligence au-dessus des systèmes de l'ANDF, pas un concurrent**. L'ANDF reste la source de vérité ; la plateforme lit, croise, anticipe et accompagne.

## 4. Axes d'amélioration proposés

| # | Axe | Ce que ça change | Effort | Dépend de |
|---|---|---|---|---|
| **A** | **Intégrer les 12 couches** : conversion unique en WGS84, simplification, index spatial, remplacement des données simulées (litiges, État, inondation, restrictions) | Verdicts réels ; la carte montre les couches ; « Couches traversées » sur chaque fiche | M | — |
| **B** | **Vérification par levé ou document** (moat Ilèmi n° 1) : photo ou PDF → extraction des bornes par LLM vision (remplace l'API externe manquante) → contrôle UTM → superposition → rapport | Plus besoin du NUP ; c'est le cas réel du marché informel | M | A |
| **C** | **Agent à UI générative qui agit** (moat Ilèmi n° 2) : un seul agent (AI SDK) avec de vrais outils (`verifierParcelle`, `analyserLeve`, `calculerFrais`, `preparerDossier`, `redigerOpposition`, `surveiller`, `chercherTexte`). Chaque outil rend un composant (verdict, carte, formulaire pré-rempli), et toute action demande confirmation | L'assistant devient le point d'entrée : on délègue au lieu de naviguer | L | A (+ B) |
| **D** | **Automatisation du cadastre v2 : pré-contrôle des plans** : règles d'abord (chevauchement avec un plan existant, ZDUP/PAG, domaine public, écart de calage avec les voisins), puis modèle entraîné sur les motifs de rejet de `tf_en_cours` | Moins d'allers-retours ; argument fort pour l'ANDF et les géomètres | M | A |
| **E** | **Brancher l'API cadastre ANDF** et relier NUP ↔ couches (`nup` présent dans `tf_en_cours` et `titre_reconstitue`) | N'importe quel NUP réel, avec son vrai polygone | S–M | — |
| **F** | **Faire de l'agent la porte d'entrée** : l'accueil propose trois gestes (taper un NUP, déposer un levé, poser une question) et tout aboutit à l'agent | Retrouve l'expérience primée d'Ilèmi dans la nouvelle plateforme | S | C |
| **G** | **Reprendre la voix et la sécurité d'Ilèmi** : transcription/synthèse (fon et yoruba plus tard), limitation de débit et anti-bots sur les routes IA | Accessibilité, robustesse de la démo publique | S | C |
| **H** | **Imagerie sous licence propre** : bascule EOX → Digital Earth Africa / Sentinel-2 | Levée du blocage commercial | S | — |

**À ne pas reprendre d'Ilèmi** : la double pile LangChain + AI SDK, les données d'analyse inventées, la relecture des GeoJSON à chaque requête, le test du domaine public par boîtes englobantes, les dossiers `dist/` et `.tmp/`.

**Ordre recommandé** : A → B → C → D, avec E en parallèle dès qu'on a l'accord de principe de l'ANDF.

## 5. État (25 septembre 2026)

Les huit axes sont construits dans `web/` :

| # | Livré | Où |
|---|---|---|
| A | 12 couches dans PostGIS (tuiles vectorielles, croisement par polygone), noms de personnes jamais stockés | `supabase/migrations/0001_layers.sql`, `scripts/load-layers.ts`, `/carte`, fiches parcelle |
| B | Vérification par levé : documents fictifs pdfcn au contenu connu, lecture de la couche texte des PDF (pas d'OCR) | `/leve`, `lib/documents/extract.ts` |
| C | Agent Ilèmi (AI SDK, OpenRouter) : 9 outils, UI générative, validation avant action ; modèle scripté sans clé | `/assistant`, `lib/agent/` |
| D | Pré-contrôle des plans : géométrie, surface, zones bloquantes, chevauchement, risque de rejet appris sur les décisions `tf_en_cours` de la commune | `/pro/leves/nouveau`, `lib/geo/precheck.ts` |
| E | Adaptateur ANDF en direct (API fiche + WFS, polygone réel), à la demande, cache 24 h, drapeau `ANDF_LIVE` | `lib/data/andf.ts` |
| F | Accueil à trois gestes : NUP, levé, question à Ilèmi | `/` |
| G | Dictée et lecture à voix haute (API du navigateur, français), limitation de débit par IP sur les routes IA | `lib/rate-limit.ts` |
| H | Imagerie Digital Earth Africa GeoMAD 2017–2025 (CC BY 4.0) | `components/map/parcel-map.tsx` |

Restent ouverts : fon et yoruba (modèle vocal dédié), modèle de rejet entraîné (règles pondérées aujourd'hui), convention ANDF avant d'activer `ANDF_LIVE` en public.
