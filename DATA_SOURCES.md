# Données réelles intégrables — Foncier Intelligent

> Recensement vérifié le 24/09/2026 (appels réels aux URL). Complète `SITEMAP.md` § 13.
> Statuts : 🟢 **aujourd'hui** (public, sans clé) · 🔑 **clé/sandbox gratuite** · 🕸️ **scraping de pages publiques** · 📝 **accord ou licence requis** · ⛔ **indisponible / à éviter**

---

## 1. Ce qui change tout

1. **Le cadastre ANDF a une API JSON publique** (sans authentification, CORS `*`) :
   `GET https://b-cadastre.andf.bj:9293/getInformationParcel/{NUP}?documentNumber=`
   → surface, nature (Individuelle, ETAT…), type de registre, n° de TF, commune/arrondissement/quartier avec codes INSAE, centroïde UTM 31N. Aucun nom de propriétaire. *Vérifié sur les 5 NUP de la démo.*
2. **Un GeoServer ANDF ouvert** : `https://geoserver.andf.bj/geoserver/efb/ows` (WFS/WMS/WMTS) avec **564 352 parcelles** (`efb:efb_parcel`, polygone réel + `right_type`, `party_exists`, `shortcoming`, `title_number_*`) et **328 254 zones déclarées** (`efb:parcel_zone_declaree` : « Parcelle avec TF »…). *Vérifié : polygone réel du NUP 101236198.*
3. **La publicité foncière est lisible en une requête** : `https://andf.bj/les-publicites-foncieres/` (table de 153 avis rendue côté serveur, avec NUP, commune, dates d'opposition). Des avis sont **en cours aujourd'hui** (ex. 18/09 → 02/10/2026).
4. **Le catalogue des démarches a une API JSON** : `https://service-public.bj/api/portal/publicservices/{PSxxxxx}` (1 205 services, 41 fonciers : délais, coûts, pièces, textes). *Vérifié sur PS01427 (mutation).*
5. **Aucun cadastre n'est à inventer côté géodonnées** : bâti (Google, Microsoft, Overture), imagerie Sentinel (STAC sans compte), inondations (JRC), érosion côtière (DE Africa) sont libres, commercial compris.

**Conséquence pour la démo** : la fiche parcelle peut devenir **réelle pour n'importe quel NUP** (et non plus 5 parcelles codées en dur), avec le vrai polygone au lieu de l'emprise approximative. Le NUP 100666667, affiché « sans localisation », est en fait une parcelle individuelle de 616 m² à Ouèdo (Abomey-Calavi).

---

## 2. Par cas d'usage

| Cas d'usage (PRD) | Données réelles | Statut |
|---|---|---|
| **Fiche parcelle par NUP** (FP-01→07) | API `getInformationParcel` + WFS `efb_parcel` (polygone, droits, anomalies) + lien `cadastre.andf.bj/nup/…` | 🟢 (usage à la demande + cache ; volume : accord ANDF) |
| **Carte / explorateur** (CA-01) | WMS/WMTS ANDF (parcelles) · geoBoundaries ADM3 (546 arrondissements) · HDX COD-AB (communes) · OSM Geofabrik / Overture (routes) · fond OpenFreeMap | 🟢 |
| **Fiche santé terrain** (IA-01) | Sentinel-2 L2A via **Earth Search** (AWS) ou **Planetary Computer** (STAC, sans compte) · **Digital Earth Africa** (mosaïques annuelles GeoMAD, WMS NDVI prêts) · Landsat | 🟢 |
| **Alertes d'empiètement** (IA-02) | Open Buildings 2.5D Temporal (2016–2023) · Microsoft Buildings (02/2026) · Overture buildings · Hansen Forest Change (2025) · Sentinel-1 via DE Africa | 🟢 · forêts classées : 📝 (voir § 4) |
| **Pré-tracé des limites** (IA-03) | Données d'entraînement : **564 352 polygones ANDF** · imagerie THR : aucune ouverte (Esri World Imagery 📝, orthophoto ANDF 20 cm non exposée 📝) | 📝 |
| **Mise en valeur > 20 ha** (IA-04) | NDVI Sentinel-2 (DE Africa WMS / STAC) · `crop_mask` DE Africa · WorldCover | 🟢 |
| **Assiette TFU** (IA-05) | Google Open Buildings v3 + Microsoft + GHSL + WorldCover · valeurs administratives : **circulaire DGI 709** (PDF sur andf.bj, à transcrire) | 🟢 |
| **Risque climatique** (IA-06) | **JRC GloFAS flood hazard** RP10–RP500 (CC BY) · JRC Global Surface Water · Deltares floods · WRI Aqueduct · **DE Africa Coastlines** (5 125 transects Bénin/Togo, taux d'érosion) · Copernicus DEM 30 m | 🟢 |
| **Lecture des dossiers** (IA-07) | Claude (vision, FR) · Mistral OCR (manuscrit) · repli open source PaddleOCR/docTR · liste des pièces : API service-public.bj | 🔑 |
| **Faux documents** (IA-08) | Aucun jeu de spécimens public | 📝 (communes, ANDF) |
| **Assistant juridique** (IA-09) | Corpus : SGG `sgg.gouv.bj/doc/{loi\|decret}-AAAA-NNN/download` (loi 2013-01 scannée → OCR, 2017-15, décrets 2015-010, 2015-017, 2025-176) · FAOLEX (versions OCR) · 26 arrêtés/circulaires sur andf.bj · API service-public.bj · LLM Claude + pgvector | 🟢 corpus · 🔑 LLM |
| **Copilote agent** (IA-10) | Mêmes briques que IA-07/09 + WFS (anomalies `shortcoming`) | 🔑 |
| **Veille publicité foncière** (IA-11) | Table `andf.bj/les-publicites-foncieres/` (diff quotidien par `nt_row_id`) → NUP → WFS → parcelles voisines | 🕸️ |
| **Triage des litiges** (IA-12) | Statistiques de litiges (PDF andf.bj) pour calibrer ; pas de données de cas | 📝 |
| **Estimation de valeur** (IA-13) | **Pas d'API de prix au Bénin.** Annonces : CoinAfrique (sitemap), Keur-Immo, Immooz, Benin-Immo, Golden Immobilier, BazarAfrique (robots.txt permissifs) · prior : circulaire DGI 709 | 🕸️ (scraping léger, sans données vendeurs) |
| **Score de risque** (IA-14) | WFS : `right_type` (présumé / titré), `party_exists`, `shortcoming`, superposition avec `parcel_zone_declaree` (TF existants) · publicité en cours · alertes satellite | 🟢 |
| **Anti-blanchiment** (IA-15) | Aucune donnée de transactions publique | 📝 (ANDF, CENTIF) |
| **Recommandation** (IA-16) | Annonces scrapées (IA-13) filtrées par score de risque réel | 🕸️ |
| **Chevauchements cadastraux** (IA-17) | Polygones WFS ANDF (calcul topologique par zone, à la demande) | 🟢 (échelle nationale : 📝) |
| **Pilotage / tableaux de bord** (IA-18) | 22 PDF de statistiques ANDF (TF 2021–2025, mutations, litiges, e-Notaire) · HDX COD-PS population 2024 · WorldPop 2026 · ThinkHazard | 🟢 (extraction PDF) |
| **Calculateur de frais** (TR-04) | API service-public.bj (PS01427 mutation, PS01428 morcellement, PS00124 TF…) · barème des notaires 2020 (PDF andf.bj) | 🟢 |
| **Géocodage** | Nominatim + Photon (OSM, résolvent les quartiers de Cotonou/Calavi) · Plus Codes (hors ligne) | 🟢 (usage modéré) |
| **Paiement** (mock → réel) | **FedaPay** et **Kkiapay** (béninois, sandbox avec numéros de test MTN/Moov) · PayDunya · MTN MoMo sandbox | 🔑 |
| **Notifications** | **WhatsApp Cloud API** (numéro de test gratuit, 5 destinataires) · Twilio SMS (0,30 $/SMS, expéditeur à enregistrer) · agrégateurs locaux | 🔑 |
| **Voix fon / yoruba** | **Meta Omnilingual ASR** (Apache-2.0, fon CER 1,4) · MMS TTS fon/yor (CC BY-NC, démo seulement) · Google STT yoruba | 🟢 (auto-hébergé) / 🔑 |
| **Traduction FR↔fon** | NLLB-200 (CC BY-NC, démo seulement) | 🟢 démo |
| **Identité NPI / SSO** | Aucune API publique ; X-Road BJ par convention | 📝 (ASIN, ANIP) |

---

## 3. Catalogue détaillé

### 3.1 ANDF et État béninois
| Source | Endpoint | Contenu | Statut |
|---|---|---|---|
| API fiche parcelle | `https://b-cadastre.andf.bj:9293/getInformationParcel/{NUP}?documentNumber=` | JSON : `nup, calculatedArea, surveyedArea, nature, registerType, baUnitType, titleNumber*, departement…quartier Name + OidLocalId, coordinate{x,y}` (EPSG:32631) | 🟢 |
| WFS parcelles | `https://geoserver.andf.bj/geoserver/efb/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=efb:efb_parcel&outputFormat=application/json&CQL_FILTER=nup='{NUP}'&srsName=EPSG:4326` | GeoJSON Polygon + droits, anomalies, TF, codes INSAE | 🟢 |
| WFS zones déclarées | même service, `typeName=efb:parcel_zone_declaree` | MultiPolygon, type (« Parcelle avec TF »), n° de TF | 🟢 |
| WMS / WMTS parcelles | `…/efb/wms` · `…/gwc/service/wmts` | Tuiles des parcelles (styles `sst`, `dnp`, `zhsf`, `zdup`, `pag` non documentés) | 🟢 |
| Orthophoto 20 cm | couche `andf-ortho` | `LayerNotDefined` | 📝 |
| Publicité foncière | `https://andf.bj/les-publicites-foncieres/` | 153 avis (NUP, demandeur, commune, BCDF, dates) | 🕸️ |
| TF non retirés | `andf.bj/titres-fonciers-non-retires` | Commune, n° TF, BCDF | 🕸️ |
| Statistiques | `andf.bj/statistiques` | 22 PDF | 🕸️ |
| Textes, arrêtés, circulaires | `andf.bj/normes-de-services-arretes`, `andf.bj/textes-et-publications` | 26 + 4 PDF (barème notaires, CGP, DGI 709, lois de finances) | 🟢 |
| Documentation Terra Benin | `andf.bj/documentation-terra-benin` | 5 rapports | 🟢 |
| Catalogue e-services | `https://service-public.bj/api/portal/publicservices/?categories=true` · `/{PSxxxxx}` | 1 205 services, 41 fonciers | 🟢 |
| Textes officiels | `https://sgg.gouv.bj/doc/{loi\|decret}-AAAA-NNN/download` · FAOLEX `ben236248.pdf` (2025-176), `Ben174252.pdf` (2017-15) | PDF (scans à OCRiser pour 2013-01 et 2025-176) | 🟢 |
| Open data national | `https://donneespubliques.gouv.bj/api/v1/open/datasets/all?limit=200` | 1 115 jeux, aucun foncier | 🟢 (peu utile) |
| e-Foncier, E-Notaire, services.andf.bj, NPI, X-Road | — | Authentifiés, hors ligne ou par convention | 📝 |
| INStaD, impots.bj | — | En maintenance / suspendu | ⛔ (retester) |
| Couches IGN Bénin | `https://ign.bj/webmap/assets/layer/benin_route.geojson`, `benin_piste.geojson` | Routes et pistes officielles | 📝 (fichiers publics, sans licence affichée) |

### 3.2 Géodonnées ouvertes
| Source | Endpoint | Licence | Statut |
|---|---|---|---|
| geoBoundaries ADM3 | `github.com/wmgeolab/geoBoundaries/raw/9469f09/releaseData/gbOpen/BEN/ADM3/geoBoundaries-BEN-ADM3.geojson` | ODbL | 🟢 |
| HDX COD-AB / COD-PS | `data.humdata.org/dataset/cod-ab-ben` · `cod-ps-ben` | CC BY-IGO | 🟢 |
| OSM Bénin | `download.geofabrik.de/africa/benin-latest.osm.pbf` (23/09/2026) | ODbL | 🟢 |
| Overture Maps | `s3://overturemaps-us-west-2/release/2026-09-23.0/` | ODbL / CDLA | 🟢 |
| Google Open Buildings v3 | `storage.googleapis.com/open-buildings-data/v3/polygons_s2_level_4_gzip/103_buildings.csv.gz` | CC BY 4.0 / ODbL | 🟢 |
| Open Buildings 2.5D Temporal | HDX `google-open-buildings-temporal` (GCS) | CC BY 4.0 | 🟢 |
| Microsoft Buildings | `minedbuildings.z5.web.core.windows.net/global-buildings/dataset-links.csv` | ODbL | 🟢 |
| Earth Search (Sentinel-1/2, Landsat, DEM) | `https://earth-search.aws.element84.com/v1` | Copernicus libre | 🟢 |
| Planetary Computer | `https://planetarycomputer.microsoft.com/api/stac/v1` (+ jeton SAS anonyme) | par collection | 🟢 (S1-RTC : 🔑) |
| Digital Earth Africa | STAC `explorer.digitalearth.africa/stac` · WMS `ows.digitalearth.africa/wms` · WFS `geoserver.digitalearth.africa/geoserver/wfs` | CC BY 4.0 | 🟢 |
| Copernicus Data Space | `stac.dataspace.copernicus.eu/v1/` · Sentinel Hub | quota gratuit | 🔑 |
| ESA WorldCover · IO LULC 2017–2024 | S3 ESA · PC `io-lulc-annual-v02` | CC BY 4.0 | 🟢 |
| Hansen Forest Change 2025 | `storage.googleapis.com/earthenginepartners-hansen/GFC-2025-v1.13/…` | CC BY 4.0 | 🟢 |
| JRC Global Surface Water | `storage.googleapis.com/global-surface-water/downloads2021/…` | libre | 🟢 |
| GloFAS flood hazard | `jeodpp.jrc.ec.europa.eu/ftp/jrc-opendata/CEMS-GLOFAS/flood_hazard/RP100/ID118_N10_W0_RP100_depth.tif` | CC BY 4.0 | 🟢 |
| DE Africa Coastlines | WFS `coastlines:coastlines_v0_4_4_rates_of_change` | CC BY 4.0 | 🟢 |
| Copernicus DEM 30 m | `copernicus-dem-30m.s3.amazonaws.com/…N06_00_E002_00…` | libre | 🟢 |
| WorldPop 2026 · GHSL · GRID3 · Africapolis | voir URL dans le rapport | CC BY / CC BY-SA | 🟢 |
| ThinkHazard | `thinkhazard.org/en/report/29-benin.json` | ouvert | 🟢 |
| Fond de carte | OpenFreeMap `tiles.openfreemap.org/styles/liberty` · Protomaps (PMTiles auto-hébergé) | OSM | 🟢 |

### 3.3 Services tiers
| Service | Usage | Statut |
|---|---|---|
| Claude API (`claude-sonnet-5`, `claude-opus-5-5`) | Assistant, extraction, copilote | 🔑 payant à l'usage |
| Mistral OCR | Manuscrit FR, 4 $/1 000 p. | 🔑 |
| pgvector | Recherche vectorielle | 🟢 |
| Meta Omnilingual ASR | Voix fon/yoruba | 🟢 (GPU) |
| FedaPay · Kkiapay · PayDunya | Paiement MoMo/Moov/carte | 🔑 sandbox |
| WhatsApp Cloud API | Alertes | 🔑 |
| Nominatim · Photon | Géocodage | 🟢 |
| CoinAfrique · Keur-Immo · Immooz | Prix (AVM) | 🕸️ |

---

## 4. À éviter ou sous condition

| Source | Problème |
|---|---|
| **EOX Sentinel-2 cloudless** (abandonné le 25/09/2026) | CC BY-NC-SA ; usage commercial payant depuis 06/2026 → remplacer par DE Africa GeoMAD ou Sentinel-2 via Earth Search avant tout usage commercial |
| Google Earth Engine / Dynamic World | Application web = usage commercial payant (exception possible pour une agence publique d'un PMA comme le Bénin) |
| Esri World Imagery | Clé ArcGIS requise, pas de reproduction commerciale sans accord |
| Planet NICFI | Programme gratuit terminé en 2025 |
| GADM | Pas d'usage commercial ni de redistribution |
| WDPA (aires protégées) | Pas de commercial ni de téléchargement depuis une carte ; affichage seul toléré |
| Forêts classées | Aucune couche officielle ouverte (OSM : 7 objets) → demander à la DGEFC / IGN |
| MMS TTS, NLLB-200 | CC BY-NC : démo uniquement |
| Groupes Facebook, Google Geocoding | Conditions d'utilisation incompatibles |
| Jumia House, Lamudi, Afrimalin, Jiji | Morts ou absents du Bénin |

---

## 5. Précautions

- **ANDF** : les mentions légales d'andf.bj interdisent la reproduction. Appels **à la demande** avec cache court, **pas de moissonnage** des 564 352 parcelles sans convention.
- **Données personnelles** : les avis de publicité contiennent des noms et téléphones. Ne stocker que NUP, lieu et dates ; masquer les noms (loi 2017-20, APDP).
- **Sécurité** : le GeoServer ANDF annonce le support WFS-T (écriture). Non testé, **à signaler à l'ANDF** dans la démarche partenariale, jamais à exploiter.
- **Attribution** : OSM/ODbL, Copernicus, CC BY (Google, JRC, DE Africa, WorldPop) à afficher sur les cartes et fiches.

---

## 6. Accords à demander (par priorité)

1. **ANDF** : convention d'usage de l'API et du WFS (volume, SLA), orthophoto 20 cm, publicité en flux structuré, e-Foncier en accès partenaire, données de transactions (AVM, LCB-FT). Contact : DG ANDF, immeuble AÏSSI, Cotonou, +229 21 32 67 71.
2. **ASIN / ANIP** : SSO NPI et X-Road BJ.
3. **IGN / DGEFC** : routes officielles, forêts classées.
4. **DGI** : valeurs administratives TFU à jour.
5. **Licences** : Imagerie basculée sur DE Africa GeoMAD (CC BY 4.0) ; Earth Engine si nécessaire.

---

## 7. Plan d'intégration proposé

| Priorité | Travail | Écrans débloqués |
|---|---|---|
| 1 | Route `app/api/parcels/[nup]` : proxy `getInformationParcel` + WFS, cache, reprojection ; remplacer les données codées en dur de `lib/data/parcels.ts` | Accueil, `/parcelle/[nup]`, `/recherche` |
| 2 | Imagerie : bascule EOX → DE Africa GeoMAD / Sentinel-2 STAC, découpée sur le vrai polygone | Fiche terrain, frise · ✅ fait (GeoMAD annuel) |
| 3 | Scraper publicité (cron quotidien, diff, noms masqués) | `/publicite`, veille |
| 4 | Catalogue service-public.bj en cache | `/guides`, `/outils/frais`, assistant |
| 5 | Corpus RAG (SGG + FAOLEX + andf.bj, OCR) + Claude + pgvector | `/assistant` |
| 6 | Couches carte : WMS ANDF, geoBoundaries, GloFAS, Coastlines, Open Buildings | `/carte`, risque climatique |
| 7 | Sandbox FedaPay/Kkiapay, WhatsApp test | Dossiers, alertes |
