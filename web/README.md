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

1. **Public** : `/` → saisir un NUP (ex. `101236198`, terrain de l'État) → `/parcelle/101236198` → rapport PDF. Aussi `/carte`, `/publicite`, `/assistant`, `/guides`, `/outils/*`.
2. **Connexion** : « Mon espace » → « Entrer en démonstration » → choisir un profil. On change de profil depuis le menu en haut à droite.
3. **Citoyenne** : vérifier avant d'acheter (`/espace/verifications/nouvelle`, bouton « Exemple » puis « pièces d'exemple »), déposer un dossier, faire opposition, porter plainte.
4. **Agente ANDF** : file d'instruction triée par anomalies → poste d'instruction avec copilote (`/agent/dossiers/D-2026-04103`), empiètements, pré-tracé IA, qualité du cadastre.
5. **Pro** : mutation avec contrôle du prix (notaire), import de levé avec contrôle de chevauchement (géomètre, bouton « Exemple »), garanties (banque).
6. **Commune, pilotage, administration** : médiations et PV, assiette TFU, indicateurs nationaux, graphe anti-blanchiment, qualité et équité de l'IA, état des intégrations.

## Données

- **Réelles** : 5 parcelles issues des avis de publicité foncière ANDF, imagerie Sentinel-2 (EOX, CC BY-NC-SA, démo non commerciale), fond OpenFreeMap, barème des frais et règles d'accès au foncier.
- **Simulées** : tout le reste, généré de façon déterministe dans `src/lib/data/`. Chaque module expose la même interface que la future source réelle ; le plan de branchement est dans `../DATA_SOURCES.md` § 7.
- Les raccourcis assumés sont marqués `ponytail:` dans le code (`grep -rn "ponytail:" src`).
