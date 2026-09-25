// Personas de démonstration (SITEMAP § 4) et navigation de chaque espace.
// ponytail: connexion simulée par cookie ; remplacer par la fédération NPI / PNS (DATA_SOURCES.md § 6).
import {
  AlertTriangleIcon,
  ArchiveIcon,
  BanknoteIcon,
  BellIcon,
  BotIcon,
  BriefcaseIcon,
  Building2Icon,
  CalendarClockIcon,
  ChartColumnIcon,
  ClipboardCheckIcon,
  FileCheck2Icon,
  FileSearchIcon,
  FileSignatureIcon,
  FilesIcon,
  GavelIcon,
  HandshakeIcon,
  HomeIcon,
  KeyRoundIcon,
  LandmarkIcon,
  LayersIcon,
  LayoutDashboardIcon,
  MapIcon,
  MapPinnedIcon,
  MegaphoneIcon,
  NetworkIcon,
  ReceiptIcon,
  RulerIcon,
  ScaleIcon,
  ScanSearchIcon,
  SearchIcon,
  SettingsIcon,
  ShieldCheckIcon,
  SproutIcon,
  StampIcon,
  StoreIcon,
  TractorIcon,
  UserIcon,
  UsersIcon,
  WalletIcon,
  type LucideIcon,
} from "lucide-react";

export type Space = "espace" | "pro" | "agent" | "commune" | "pilotage" | "admin";
export type ProRole = "notaire" | "geometre" | "huissier" | "banque";

export type Persona = {
  id: string;
  name: string;
  title: string;
  space: Space;
  proRole?: ProRole;
  initials: string;
  description: string;
};

export const PERSONAS: Persona[] = [
  { id: "citoyen", name: "Afi Houngbédji", title: "Citoyenne, acheteuse et propriétaire", space: "espace", initials: "AH", description: "Vérifie un terrain avant d'acheter, surveille ses parcelles, suit ses dossiers." },
  { id: "notaire", name: "Me Rodrigue Agossou", title: "Notaire à Cotonou", space: "pro", proRole: "notaire", initials: "RA", description: "Vérifie avant signature, prépare les mutations." },
  { id: "geometre", name: "Kévin Dossou", title: "Géomètre-expert", space: "pro", proRole: "geometre", initials: "KD", description: "Importe ses levés, valide les limites pré-tracées par l'IA." },
  { id: "huissier", name: "Me Clarisse Zinsou", title: "Huissier de justice", space: "pro", proRole: "huissier", initials: "CZ", description: "Demande compulsions et états descriptifs." },
  { id: "banque", name: "Service crédit immobilier", title: "Banque partenaire (démo)", space: "pro", proRole: "banque", initials: "BP", description: "Vérifie et suit les parcelles données en garantie." },
  { id: "agent", name: "Sènami Adjovi", title: "Agente instructrice, BCDF Abomey-Calavi", space: "agent", initials: "SA", description: "Instruit les dossiers avec le copilote, traite les alertes." },
  { id: "commune", name: "CoGeF d'Abomey-Calavi", title: "Commission de gestion foncière", space: "commune", initials: "CG", description: "Suit les litiges et médiations de la commune, l'assiette TFU." },
  { id: "decideur", name: "Direction générale", title: "Pilotage national (démo)", space: "pilotage", initials: "DG", description: "Indicateurs nationaux, délais, risques, fiscalité, anti-blanchiment." },
  { id: "admin", name: "Administrateur plateforme", title: "Administration", space: "admin", initials: "AD", description: "Utilisateurs, intégrations, modèles, audit." },
];

export const getPersona = (id?: string) => PERSONAS.find((p) => p.id === id);

export type NavItem = { href: string; label: string; icon: LucideIcon; roles?: ProRole[]; soon?: boolean };
export type NavGroup = { label: string; items: NavItem[] };

export const NAV: Record<Space, NavGroup[]> = {
  espace: [
    {
      label: "Mon foncier",
      items: [
        { href: "/espace", label: "Tableau de bord", icon: HomeIcon },
        { href: "/espace/parcelles", label: "Mes parcelles", icon: MapPinnedIcon },
        { href: "/espace/surveillance", label: "Surveillance", icon: ScanSearchIcon },
        { href: "/espace/alertes", label: "Alertes", icon: BellIcon },
      ],
    },
    {
      label: "Démarches",
      items: [
        { href: "/espace/verifications", label: "Vérifications", icon: ShieldCheckIcon },
        { href: "/espace/dossiers", label: "Mes dossiers", icon: FilesIcon },
        { href: "/espace/litiges", label: "Litiges et plaintes", icon: ScaleIcon },
        { href: "/espace/paiements", label: "Paiements", icon: ReceiptIcon },
      ],
    },
    {
      label: "Marché",
      items: [
        { href: "/espace/marche", label: "Parcelles recommandées", icon: StoreIcon, soon: true },
        { href: "/espace/annonces", label: "Mes annonces", icon: MegaphoneIcon, soon: true },
      ],
    },
    { label: "Compte", items: [{ href: "/espace/profil", label: "Profil et notifications", icon: UserIcon }] },
  ],
  pro: [
    {
      label: "Activité",
      items: [
        { href: "/pro", label: "Tableau de bord", icon: LayoutDashboardIcon },
        { href: "/pro/due-diligence", label: "Vérifications", icon: FileSearchIcon, roles: ["notaire", "banque"] },
        { href: "/pro/clients", label: "Clients et dossiers", icon: BriefcaseIcon, roles: ["notaire"] },
        { href: "/pro/mutations", label: "Mutations", icon: FileSignatureIcon, roles: ["notaire"] },
        { href: "/pro/leves", label: "Mes levés", icon: RulerIcon, roles: ["geometre"] },
        { href: "/pro/actes", label: "Actes et compulsions", icon: StampIcon, roles: ["huissier", "notaire"] },
        { href: "/pro/portefeuille", label: "Garanties", icon: WalletIcon, roles: ["banque"] },
      ],
    },
    {
      label: "Compte",
      items: [
        { href: "/pro/api", label: "Clés API", icon: KeyRoundIcon, roles: ["banque"] },
        { href: "/pro/facturation", label: "Facturation", icon: BanknoteIcon },
      ],
    },
  ],
  agent: [
    {
      label: "Instruction",
      items: [
        { href: "/agent", label: "Ma journée", icon: CalendarClockIcon },
        { href: "/agent/dossiers", label: "File d'instruction", icon: FilesIcon },
        { href: "/agent/plans", label: "Plans des géomètres", icon: RulerIcon },
        { href: "/agent/publicite", label: "Publicité foncière", icon: MegaphoneIcon },
        { href: "/agent/litiges", label: "Litiges", icon: ScaleIcon },
        { href: "/agent/recherche", label: "Recherche", icon: SearchIcon },
      ],
    },
    {
      label: "Surveillance",
      items: [
        { href: "/agent/alertes", label: "Empiètements", icon: AlertTriangleIcon },
        { href: "/agent/terrain", label: "Missions terrain", icon: MapIcon },
        { href: "/agent/documents-suspects", label: "Documents suspects", icon: FileCheck2Icon },
      ],
    },
    {
      label: "Cadastre et rural",
      items: [
        { href: "/agent/cadastre/qualite", label: "Qualité du cadastre", icon: LayersIcon },
        { href: "/agent/cadastre/pre-trace", label: "Pré-tracé IA", icon: RulerIcon },
        { href: "/agent/rural/preemption", label: "Préemption", icon: TractorIcon },
        { href: "/agent/rural/mise-en-valeur", label: "Mise en valeur", icon: SproutIcon },
        { href: "/agent/archives", label: "Numérisation", icon: ArchiveIcon },
      ],
    },
  ],
  commune: [
    {
      label: "Commune",
      items: [
        { href: "/commune", label: "Tableau de bord", icon: HomeIcon },
        { href: "/commune/carte", label: "Carte communale", icon: MapIcon },
        { href: "/commune/litiges", label: "Litiges", icon: ScaleIcon },
        { href: "/commune/mediations", label: "Médiations", icon: HandshakeIcon },
        { href: "/commune/transactions-rurales", label: "Transactions rurales", icon: TractorIcon },
        { href: "/commune/fiscalite", label: "Assiette TFU", icon: LandmarkIcon },
        { href: "/commune/patrimoine", label: "Patrimoine communal", icon: Building2Icon },
        { href: "/commune/rapports", label: "Rapports", icon: ClipboardCheckIcon },
      ],
    },
  ],
  pilotage: [
    {
      label: "Pilotage",
      items: [
        { href: "/pilotage", label: "Vue nationale", icon: ChartColumnIcon },
        { href: "/pilotage/carte", label: "Carte nationale", icon: MapIcon },
        { href: "/pilotage/delais", label: "Délais et charge", icon: CalendarClockIcon },
        { href: "/pilotage/risques", label: "Risques", icon: AlertTriangleIcon },
        { href: "/pilotage/fiscalite", label: "Fiscalité", icon: LandmarkIcon },
        { href: "/pilotage/lcb-ft", label: "Anti-blanchiment", icon: NetworkIcon },
        { href: "/pilotage/ia", label: "Qualité de l'IA", icon: BotIcon },
        { href: "/pilotage/rapports", label: "Rapports", icon: ClipboardCheckIcon },
      ],
    },
  ],
  admin: [
    {
      label: "Administration",
      items: [
        { href: "/admin/utilisateurs", label: "Utilisateurs", icon: UsersIcon },
        { href: "/admin/roles", label: "Rôles", icon: ShieldCheckIcon },
        { href: "/admin/communes", label: "Couverture", icon: MapPinnedIcon },
        { href: "/admin/integrations", label: "Intégrations", icon: NetworkIcon },
        { href: "/admin/connaissances", label: "Textes de l'assistant", icon: GavelIcon },
        { href: "/admin/modeles", label: "Modèles et seuils", icon: BotIcon },
        { href: "/admin/specimens", label: "Spécimens", icon: StampIcon },
        { href: "/admin/bareme", label: "Barème des frais", icon: BanknoteIcon },
        { href: "/admin/audit", label: "Journal d'audit", icon: SettingsIcon },
      ],
    },
  ],
};

export const SPACE_HOME: Record<Space, string> = {
  espace: "/espace",
  pro: "/pro",
  agent: "/agent",
  commune: "/commune",
  pilotage: "/pilotage",
  admin: "/admin/utilisateurs",
};

export const SPACE_LABEL: Record<Space, string> = {
  espace: "Espace citoyen",
  pro: "Espace professionnel",
  agent: "Espace agent ANDF",
  commune: "Espace commune",
  pilotage: "Pilotage",
  admin: "Administration",
};
