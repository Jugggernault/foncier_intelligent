# Foncier Intelligent · application web

Démonstration de la plateforme décrite dans `../PRD.md` et `../SITEMAP.md` : Next.js 16 (App Router), shadcn/ui (base-nova sur Base UI), Tailwind 4, bun.

## Lancer

```bash
bun install      # copie aussi le worker MapLibre dans public/maplibre (postinstall)
bun dev          # http://localhost:3000
bun test         # règles métier : risque, frais, éligibilité, assistant, copilote, triage, levés
bun run lint
bun run build
```

## Parcours de démonstration

1. **Public** : `/` → saisir un NUP (ex. `101236198`, terrain de l'État) → `/parcelle/101236198` → rapport PDF. Sans NUP : `/leve` (levés de démonstration dans `public/demo-docs/`). Une question : champ Ilèmi de l'accueil → `/assistant`. Aussi `/carte` (12 couches ANDF), `/publicite`, `/guides`, `/outils/*`.
2. **Connexion** : « Mon espace » → « Entrer en démonstration » → choisir un profil. On change de profil depuis le menu en haut à droite.
3. **Citoyenne** : vérifier avant d'acheter (`/espace/verifications/nouvelle`, bouton « Exemple » puis « pièces d'exemple »), déposer un dossier, faire opposition, porter plainte.
4. **Agente ANDF** : file d'instruction triée par anomalies → poste d'instruction avec copilote (`/agent/dossiers/D-2026-04103`), empiètements, pré-tracé IA, qualité du cadastre.
5. **Pro** : mutation avec contrôle du prix (notaire), pré-contrôle d'un plan avant dépôt (géomètre, `/pro/leves/nouveau`, bouton « Exemple » ou PDF de `public/demo-docs/`), garanties (banque).
6. **Commune, pilotage, administration** : médiations et PV, assiette TFU, indicateurs nationaux, graphe anti-blanchiment, qualité et équité de l'IA, état des intégrations.

## Données

- **Réelles** : 12 couches géographiques fournies au hackathon (PostGIS), 5 parcelles issues des avis de publicité foncière ANDF, tout autre NUP lu en direct sur l'ANDF si `ANDF_LIVE=true`, imagerie Sentinel-2 GeoMAD (Digital Earth Africa, CC BY 4.0), fond OpenFreeMap, barème des frais et règles d'accès au foncier.
- **Documents de démonstration** : PDF fictifs au contenu connu (`bun scripts/generate-demo-docs.tsx` → `public/demo-docs/`).
- **Simulées** : tout le reste, généré de façon déterministe dans `src/lib/data/`. Chaque module expose la même interface que la future source réelle ; le plan de branchement est dans `../DATA_SOURCES.md` § 7.
- Les raccourcis assumés sont marqués `ponytail:` dans le code (`grep -rn "ponytail:" src`).

## Base géographique (PostGIS)

En local :

```bash
docker run -d --name fi-postgis -p 54322:5432 -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=foncier postgis/postgis:17-3.5
cp .env.example .env.local
bun scripts/load-layers.ts            # lit ../ilemi-main/public/data_files (12 GeoJSON), ~10 s
```

Sans `DATABASE_URL`, l'application tourne quand même : les verdicts retombent sur les données simulées.

## Déploiement : Vercel + Supabase, sans serveur à gérer

1. **Supabase** : créer un projet, activer l'extension `postgis` (Database → Extensions), copier la chaîne du *pooler* (mode transaction, port 6543).
2. Charger les couches depuis votre machine (les GeoJSON ne sont jamais envoyés sur Vercel) :
   renseigner `DIRECT_URL` (pooler de session, port 5432) dans `.env.local`, puis `bun scripts/load-layers.ts`
3. **Vercel** : importer le dépôt, dossier racine `web`, puis définir les variables :
   - `DATABASE_URL` : la chaîne du pooler Supabase ;
   - `OPENROUTER_API_KEY` et `OPENROUTER_MODEL` (identifiant du modèle GLM sur OpenRouter) ; sans elles, Ilèmi utilise son modèle scripté ;
   - `ANDF_LIVE` : laisser à `false` tant qu'il n'y a pas de convention avec l'ANDF.

Les tuiles vectorielles sont servies par `/api/layers/[id]/tiles/…` (PostGIS `ST_AsMVT`, cache CDN d'une journée), l'imagerie directement par Digital Earth Africa.
