---
title: API
description: Les points d'accès disponibles en démonstration.
order: 3
---

Les banques, notaires et applications partenaires pourront interroger la plateforme. Deux points d'accès sont déjà disponibles en démonstration.

## Fiche d'une parcelle

`GET /api/parcels/{nup}` renvoie la parcelle (sans identité du propriétaire) et son score de risque avec ses raisons.

```bash
curl https://…/api/parcels/101236198
```

## Frais de mutation

`GET /api/fees?amount=25000000` applique le barème de l'ANDF.

```bash
curl "https://…/api/fees?amount=25000000"
```

## À venir

- `GET /api/parcels/{nup}/imagery` : indicateurs satellite par année.
- `POST /api/documents/extract` : lecture d'une pièce foncière.
- `POST /api/subscriptions` : alertes sur une parcelle.

Authentification OAuth2 prévue, avec des clés par partenaire.
