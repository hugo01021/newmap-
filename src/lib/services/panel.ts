/**
 * Données du panel (simulées).
 * À brancher sur PostgreSQL via /api/panel/*.
 */
export interface JobConfig {
  id: string;
  name: string;
  enabled: boolean;
  salary: number;
  members: number;
}

export interface VehicleConfig {
  id: string;
  name: string;
  category: string;
  price: number;
  enabled: boolean;
}

export interface PropertyConfig {
  id: string;
  name: string;
  zone: string;
  price: number;
  rent: number;
}

export interface Player {
  id: string;
  name: string;
  job: string;
  playtime: string;
  status: "en ligne" | "hors ligne";
}

export interface HistoryItem {
  id: string;
  date: string;
  title: string;
  author: string;
  area: string;
}

export interface Backup {
  id: string;
  date: string;
  size: string;
  type: "automatique" | "manuelle";
}

export const defaultJobs: JobConfig[] = [
  { id: "police", name: "Police", enabled: true, salary: 2400, members: 18 },
  { id: "ems", name: "EMS", enabled: true, salary: 2100, members: 9 },
  { id: "meca", name: "Mécano", enabled: true, salary: 1700, members: 6 },
  { id: "taxi", name: "Taxi", enabled: true, salary: 1200, members: 4 },
  { id: "avocat", name: "Avocat", enabled: false, salary: 2600, members: 0 },
  { id: "journaliste", name: "Journaliste", enabled: false, salary: 1500, members: 0 },
];

export const defaultVehicles: VehicleConfig[] = [
  { id: "v1", name: "Berline compacte", category: "Citadine", price: 18500, enabled: true },
  { id: "v2", name: "SUV familial", category: "SUV", price: 42000, enabled: true },
  { id: "v3", name: "Coupé sport", category: "Sport", price: 128000, enabled: true },
  { id: "v4", name: "Moto routière", category: "Moto", price: 24000, enabled: true },
  { id: "v5", name: "Supercar", category: "Super", price: 650000, enabled: false },
];

export const defaultProperties: PropertyConfig[] = [
  { id: "p1", name: "Studio Vespucci", zone: "Vespucci", price: 85000, rent: 900 },
  { id: "p2", name: "Appartement Vinewood", zone: "Vinewood", price: 240000, rent: 2400 },
  { id: "p3", name: "Maison Mirror Park", zone: "Mirror Park", price: 410000, rent: 3800 },
  { id: "p4", name: "Villa Rockford Hills", zone: "Rockford Hills", price: 1900000, rent: 12000 },
];

export const defaultPlayers: Player[] = [
  { id: "1", name: "Marco_Lefèvre", job: "Police", playtime: "42 h", status: "en ligne" },
  { id: "2", name: "Léa_Moreau", job: "EMS", playtime: "31 h", status: "en ligne" },
  { id: "3", name: "Kevin_Dubois", job: "Mécano", playtime: "18 h", status: "en ligne" },
  { id: "4", name: "Sofia_Benali", job: "Civil", playtime: "12 h", status: "en ligne" },
  { id: "5", name: "Noah_Garcia", job: "Taxi", playtime: "9 h", status: "hors ligne" },
  { id: "6", name: "Inès_Martin", job: "Police", playtime: "55 h", status: "hors ligne" },
  { id: "7", name: "Hugo_Petit", job: "Civil", playtime: "3 h", status: "en ligne" },
];

export const defaultHistory: HistoryItem[] = [
  { id: "h1", date: "Aujourd'hui, 14:02", title: "Serveur créé et mis en ligne", author: "IA ServCraft", area: "Système" },
  { id: "h2", date: "Aujourd'hui, 14:03", title: "Discord généré : 24 salons, 11 rôles", author: "IA ServCraft", area: "Discord" },
  { id: "h3", date: "Aujourd'hui, 14:03", title: "Première sauvegarde complète", author: "Automatique", area: "Sauvegardes" },
];

export const defaultBackups: Backup[] = [
  { id: "b1", date: "Aujourd'hui, 14:03", size: "412 Mo", type: "automatique" },
];
