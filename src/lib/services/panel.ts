/**
 * Données du panel (simulées).
 * À brancher sur PostgreSQL via /api/panel/*.
 * Les libellés viennent du dictionnaire (panel.data) ; les chiffres sont ici.
 */
import type { Dictionary } from "../i18n/dictionaries";

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
  status: "online" | "offline";
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
  type: "automatic" | "manual";
}

export interface PanelData {
  jobs: JobConfig[];
  vehicles: VehicleConfig[];
  properties: PropertyConfig[];
  players: Player[];
  history: HistoryItem[];
  backups: Backup[];
}

const VEHICLE_PRICES = [18500, 42000, 128000, 24000, 650000];
const PROPERTY_PRICES: Array<[number, number]> = [
  [85000, 900],
  [240000, 2400],
  [410000, 3800],
  [1900000, 12000],
];

/** Les valeurs de départ du panel, dans la langue du dictionnaire. */
export function defaultPanelData(t: Dictionary): PanelData {
  const d = t.panel.data;
  const j = d.jobs;
  return {
    jobs: [
      { id: "police", name: j.police, enabled: true, salary: 2400, members: 18 },
      { id: "ems", name: j.ems, enabled: true, salary: 2100, members: 9 },
      { id: "meca", name: j.mechanic, enabled: true, salary: 1700, members: 6 },
      { id: "taxi", name: j.taxi, enabled: true, salary: 1200, members: 4 },
      { id: "avocat", name: j.lawyer, enabled: false, salary: 2600, members: 0 },
      { id: "journaliste", name: j.journalist, enabled: false, salary: 1500, members: 0 },
    ],
    vehicles: d.vehicles.map((v, i) => ({ id: `v${i + 1}`, ...v, price: VEHICLE_PRICES[i], enabled: i !== 4 })),
    properties: d.properties.map((p, i) => ({ id: `p${i + 1}`, ...p, price: PROPERTY_PRICES[i][0], rent: PROPERTY_PRICES[i][1] })),
    players: [
      { id: "1", name: "Marco_Lefèvre", job: j.police, playtime: "42 h", status: "online" },
      { id: "2", name: "Léa_Moreau", job: j.ems, playtime: "31 h", status: "online" },
      { id: "3", name: "Kevin_Dubois", job: j.mechanic, playtime: "18 h", status: "online" },
      { id: "4", name: "Sofia_Benali", job: t.panel.playersTab.civilian, playtime: "12 h", status: "online" },
      { id: "5", name: "Noah_Garcia", job: j.taxi, playtime: "9 h", status: "offline" },
      { id: "6", name: "Inès_Martin", job: j.police, playtime: "55 h", status: "offline" },
      { id: "7", name: "Hugo_Petit", job: t.panel.playersTab.civilian, playtime: "3 h", status: "online" },
    ],
    history: d.history.map((h, i) => ({ id: `h${i + 1}`, ...h, author: i === 2 ? d.automatic : d.ai })),
    backups: [{ id: "b1", date: d.backupDate, size: `412 ${t.panel.backups.unit}`, type: "automatic" }],
  };
}
