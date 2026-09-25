-- Couches géographiques du Hackathon IA Foncier Intelligent (ANDF), servies depuis PostGIS (Supabase).
-- Géométries stockées en WGS84 (EPSG:4326) ; sources en UTM 31N (EPSG:32631), reprojetées au chargement.
create extension if not exists postgis;

create table if not exists layers (
  id text primary key,
  label text not null,
  category text not null,          -- droit | restriction | risque | domaine-public | cadastre
  severity text not null,          -- danger | caution | info
  description text not null,
  source text not null default 'ANDF, données du Hackathon IA Foncier Intelligent (2025)'
);

create table if not exists layer_features (
  id bigserial primary key,
  layer_id text not null references layers(id) on delete cascade,
  props jsonb not null default '{}'::jsonb,   -- attributs filtrés : aucun nom de personne
  geom geometry(Geometry, 4326) not null
);
create index if not exists layer_features_geom_idx on layer_features using gist (geom);
create index if not exists layer_features_layer_idx on layer_features (layer_id);

-- Couches qui touchent un polygone (GeoJSON WGS84), avec la surface commune et sa part dans le polygone.
create or replace function layers_at(poly jsonb)
returns table (layer_id text, label text, category text, severity text, description text, feature_id bigint, props jsonb, overlap_m2 double precision, share double precision)
language sql stable as $$
  with p as (select st_makevalid(st_setsrid(st_geomfromgeojson(poly::text), 4326)) as g)
  select l.id, l.label, l.category, l.severity, l.description, f.id, f.props,
         st_area(st_intersection(f.geom, p.g)::geography) as overlap_m2,
         st_area(st_intersection(f.geom, p.g)::geography) / nullif(st_area(p.g::geography), 0) as share
  from p join layer_features f on st_intersects(f.geom, p.g)
  join layers l on l.id = f.layer_id
  order by case l.severity when 'danger' then 0 when 'caution' then 1 else 2 end, overlap_m2 desc;
$$;

-- Tuile vectorielle (MVT) d'une couche, pour l'affichage MapLibre. Seules la couche et l'étiquette sortent.
create or replace function layer_tile(layer text, z int, x int, y int)
returns bytea
language sql stable as $$
  with b as (select st_tileenvelope(z, x, y) as env),
  mvt as (
    select st_asmvtgeom(st_transform(f.geom, 3857), b.env, 4096, 64, true) as geom,
           f.layer_id as layer,
           coalesce(f.props->>'label', '') as label
    from layer_features f, b
    where f.layer_id = layer and f.geom && st_transform(b.env, 4326)
  )
  select coalesce(st_asmvt(mvt.*, layer, 4096, 'geom'), ''::bytea) from mvt where geom is not null;
$$;
