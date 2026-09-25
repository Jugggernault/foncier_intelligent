# Foncier Intelligent

**Vérifier un terrain avant de l'acheter, éviter les dossiers voués au rejet, contrôler les avis de publicité foncière.** Démonstration construite sur les données réelles de l'ANDF (Bénin).

Site : https://foncier-intelligent.vercel.app · Démonstration non officielle, sans lien institutionnel avec l'ANDF.

## Ce que fait la plateforme

1. **Vérifier un terrain en 30 secondes**, par NUP ou à partir du levé du vendeur : verdict expliqué qui croise les 12 couches géographiques de l'ANDF (litiges, zones réservées, domaine public, titres de l'État) avec le vrai polygone de la parcelle.
2. **Pré-contrôler les plans de bornage** avant dépôt : géométrie, surface, zones bloquantes, chevauchements, risque de rejet appris sur 13 594 décisions réelles. Le plan arrive chez l'agent de l'ANDF avec son rapport.
3. **Contrôler chaque avis de publicité foncière** avant la fin du délai d'opposition (croisement avec les couches et avec les autres avis).
4. **Ilèmi, agent IA à interface générative** : vérifie, explique, prépare les démarches, cite ses sources et demande l'accord avant toute action. Aussi sur WhatsApp.
5. **Rapports infalsifiables** : code et QR code de vérification en ligne.

Chiffres réels et hypothèses : page [`/impact`](https://foncier-intelligent.vercel.app/impact).

## Documentation

| Fichier | Contenu |
| --- | --- |
| [`PRD.md`](PRD.md) · [`PRD.html`](PRD.html) | Besoin produit, usages, apports de l'IA |
| [`SITEMAP.md`](SITEMAP.md) | Toutes les pages, par espace (citoyen, professionnels, agent ANDF, commune, pilotage) |
| [`DATA_SOURCES.md`](DATA_SOURCES.md) | Sources de données réelles, licences, plan de branchement |
| [`AMELIORATIONS.md`](AMELIORATIONS.md) | Axes d'amélioration et état d'avancement |
| [`DEMO.md`](DEMO.md) | Scénario de démonstration en 5 minutes |
| [`DESIGN.md`](DESIGN.md) · [`PRODUCT.md`](PRODUCT.md) | Système visuel et principes produit |

## Lancer l'application

L'application Next.js est dans [`web/`](web) : Next.js 16 (App Router), shadcn/ui (base-nova sur Base UI), Tailwind 4, bun.

```bash
cd web
bun install      # copie aussi le worker MapLibre dans public/maplibre (postinstall)
bun dev          # http://localhost:3000
bun test         # règles métier : risque, frais, éligibilité, assistant, copilote, triage, levés
bun run lint
bun run build
```

## Parcours de démonstration

Scénario minuté pour une présentation : [`DEMO.md`](DEMO.md).

1. **Public** : `/` → saisir un NUP (ex. `101236198`, terrain de l'État) → `/parcelle/101236198` → rapport vérifiable. Sans NUP : `/leve` (levés de démonstration dans `web/public/demo-docs/`). Une question : champ Ilèmi de l'accueil → `/assistant`. Aussi `/carte` (12 couches ANDF), `/publicite` (avis contrôlés), `/impact`, `/verifier`, `/guides`, `/outils/*`.
2. **Connexion** : « Mon espace » → « Entrer en démonstration » → choisir un profil. On change de profil depuis le menu en haut à droite.
3. **Citoyenne** : vérifier avant d'acheter (`/espace/verifications/nouvelle`), déposer un dossier, faire opposition, porter plainte.
4. **Agente ANDF** : plans reçus des géomètres avec leur pré-contrôle (`/agent/plans`), avis signalés (`/agent/publicite`), file d'instruction avec copilote, empiètements, qualité du cadastre.
5. **Pro** : pré-contrôle et transmission d'un plan (géomètre, `/pro/leves/nouveau`), mutation avec contrôle du prix (notaire), garanties (banque).
6. **Commune, pilotage, administration** : médiations et PV, assiette TFU, indicateurs nationaux, graphe anti-blanchiment, qualité et équité de l'IA.

## Données

- **Réelles** : 12 couches géographiques de l'ANDF (PostGIS), parcelles des avis de publicité foncière publiés sur andf.bj avec leur vrai polygone (`bun scripts/fetch-publicity.ts`, sans aucun nom de demandeur ; 5 parcelles détaillées via `bun scripts/fetch-real-polygons.ts`), tout autre NUP lu en direct sur l'ANDF si `ANDF_LIVE=true`, imagerie Sentinel-2 GeoMAD (Digital Earth Africa, CC BY 4.0), fond OpenFreeMap, barème des frais et règles d'accès au foncier.
- **Documents de démonstration** : PDF fictifs au contenu connu (`bun scripts/generate-demo-docs.tsx` → `public/demo-docs/`).
- **Simulées** : dossiers, litiges et alertes des espaces professionnels, générés de façon déterministe dans `web/src/lib/data/`. Chaque module expose la même interface que la future source réelle ; le plan de branchement est dans [`DATA_SOURCES.md`](DATA_SOURCES.md) § 7.
- **Données personnelles** : aucun nom de demandeur, de partie ou d'avocat n'est stocké ; seuls des identifiants pseudonymes et des catégories.
- Les raccourcis assumés sont marqués `ponytail:` dans le code (`grep -rn "ponytail:" web/src`).

## Base géographique (PostGIS)

En local (commandes depuis `web/`) :

```bash
docker run -d --name fi-postgis -p 54322:5432 -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=foncier postgis/postgis:17-3.5
cp .env.example .env.local
bun scripts/load-layers.ts [dossier des 12 GeoJSON]   # ~10 s
bun scripts/migrate.ts                                 # tables applicatives (plans transmis)
```

Sans `DATABASE_URL`, l'application tourne quand même : les verdicts retombent sur les données simulées.

## Déploiement : Vercel + Supabase, sans serveur à gérer

1. **Supabase** : créer un projet, activer l'extension `postgis` (Database → Extensions), copier la chaîne du *pooler* (mode transaction, port 6543).
2. Charger les couches depuis votre machine (les GeoJSON ne sont jamais envoyés sur Vercel) : renseigner `DIRECT_URL` (pooler de session, port 5432) dans `web/.env.local`, puis `bun scripts/load-layers.ts` et `bun scripts/migrate.ts`.
3. **Vercel** : importer le dépôt, dossier racine `web`, puis définir les variables (voir `web/.env.example`) :
   - `DATABASE_URL` : la chaîne du pooler Supabase ;
   - `OPENROUTER_API_KEY` et `OPENROUTER_MODEL` ; sans elles, Ilèmi utilise son modèle scripté ;
   - `REPORT_SECRET` : sceau des rapports (`openssl rand -hex 32`) ;
   - `TWILIO_*` et `NEXT_PUBLIC_WHATSAPP_*` pour Ilèmi sur WhatsApp (webhook `/api/whatsapp`) ;
   - `ANDF_LIVE` : laisser à `false` tant qu'il n'y a pas de convention avec l'ANDF.

Les tuiles vectorielles sont servies par `/api/layers/[id]/tiles/…` (PostGIS `ST_AsMVT`, cache CDN d'une journée), l'imagerie directement par Digital Earth Africa.
