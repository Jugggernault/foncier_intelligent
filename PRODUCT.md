# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Next.js (App Router) + shadcn/ui. Règle : tout composant de base (inputs, tables, dialogs, etc.) vient de shadcn/ui quand il existe ; pas de composant maison pour ce que shadcn couvre. Une seule application, organisée en espaces par rôle (route groups). MCP shadcn installé au niveau projet (`.mcp.json`).

## Users

- **Principal : acheteur / citoyen** (y compris diaspora) qui veut savoir si une parcelle est sûre avant de payer. Il arbitre les conflits de conception.
- Propriétaires (urbains, détenteurs coutumiers) qui veulent être alertés.
- Professionnels : notaires (seuls habilités aux mutations), géomètres, huissiers, banques.
- Agents ANDF et bureaux communaux (BCDF) qui instruisent les dossiers.
- Communes : maires, CoGeF, SVGF.
- Décideurs : DG ANDF, MEF, DGI, CENTIF.

## Product Purpose

Couche d'intelligence artificielle posée sur les briques numériques existantes de l'ANDF (NUP, e-Foncier, PNS/NPI, E-Notaire) pour vérifier une parcelle en 30 secondes, surveiller le terrain par satellite, accélérer l'instruction des dossiers et donner à l'État des alertes. Détail : `PRD.md`, `PRD.html`.

Cette version sert d'abord de **démo crédible pour l'ANDF et l'ASIN** : données réelles là où c'est possible, mocks réalistes ailleurs (vrais NUP publics, vraies communes), puis passage progressif en production.

## Positioning

On ne remplace pas le registre de l'ANDF, on l'augmente. Le NUP (décret 2025-176) est la clé pivot. « L'IA propose, l'agent dispose » : aucun modèle n'accorde ni ne refuse un droit.

## Operating Context

- Procédures réelles : titre foncier (120 j), mutation (72 h, notaires uniquement), état descriptif, compulsion, certificat d'appartenance, confirmation de droits, publicité foncière (~15 j d'opposition), plaintes CGP.
- 12 communes e-Foncier depuis janvier 2025 ; pilote proposé : Abomey-Calavi.
- Usages terrain sur mobile, connexion 3G, parfois hors-ligne (agents, SVGF, géomètres).
- Paiement MoMo / Visa ; identité NPI.

## Capabilities and Constraints

- 18 usages IA définis (IA-01 à IA-18) et exigences FP/CA/TR/PU/LI/DE/FI/AS dans `PRD.md`.
- Images Google Maps non analysables automatiquement : passer par Earth Engine et données ouvertes.
- Registre ANDF en lecture seule.
- Interface en français, textes externalisés pour i18n (fon, yoruba, anglais plus tard).
- Données personnelles des propriétaires masquées au public.
- Ouvert : hébergement, licence Earth Engine, accès API ANDF, modèle économique.

## Brand Commitments

Nom de travail : « Foncier Intelligent ». Porté par UDI-AFRICA (1er prix, Hackathon IA Foncier Intelligent, ASIN · ANDF · LuxDev, sept. 2025).

Identité visuelle épinglée par l'utilisateur : ADN du portail innovation.gouv.bj (marine #093E73, jaune #FFD400, filet tricolore du drapeau, angles nets) extrait puis modernisé. Ne pas utiliser les armoiries, logos ministériels ni se présenter comme un site officiel : la plateforme reste une démonstration portée par UDI-AFRICA.

## Evidence on Hand

- Documents de travail (non publiés) : missions ANDF, e-services et tarifs, avis de publicité foncière, textes réglementaires, chiffres du cadastre.
- Aucun témoignage, client, chiffre d'impact mesuré ou partenariat signé : ne pas en inventer.

## Product Principles

1. La parcelle (NUP) est l'unité de tout : chaque écran y ramène.
2. Montrer le risque avant le paiement, avec ses raisons et ses sources.
3. L'IA suggère, un humain habilité décide ; chaque suggestion est tracée.
4. S'intégrer à l'existant plutôt que le dupliquer.
5. Utilisable sur un téléphone modeste, en français simple.

## Accessibility & Inclusion

Usagers peu alphabétisés et multilingues (voix et langues nationales prévues) ; droits coutumiers et droits des femmes à ne pas pénaliser ; WCAG AA.
