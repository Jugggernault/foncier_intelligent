-- Plans transmis par les géomètres avec leur rapport de pré-contrôle, reçus par les agents de l'ANDF.
create table if not exists plan_submissions (
  id bigserial primary key,
  created_at timestamptz not null default now(),
  surveyor text not null,                 -- persona de démonstration (nom professionnel du géomètre)
  commune text,
  declared_m2 integer,
  area_m2 integer not null,
  bornes jsonb not null,                  -- [[X, Y], …] UTM 31N
  ring jsonb not null,                    -- [[lon, lat], …] WGS84
  precheck jsonb not null,                -- checks, contexte, couches touchées (recalculés côté serveur)
  reject_risk real not null,
  status text not null default 'recu' check (status in ('recu', 'accepte', 'renvoye')),
  decided_at timestamptz,
  note text
);
create index if not exists plan_submissions_created_idx on plan_submissions (created_at desc);

-- Supabase expose le schéma public par son API REST : RLS activée sans politique = aucun accès anonyme.
-- Le serveur Next.js se connecte avec le rôle propriétaire des tables, qui n'est pas soumis à RLS.
alter table plan_submissions enable row level security;
alter table layers enable row level security;
alter table layer_features enable row level security;
