import type { BuildStep } from "../types";

/** 10 étapes, ~20 secondes au total. */
export const buildSteps: BuildStep[] = [
  { id: "architecture", label: "Architecture", detail: "Préparation de la structure du serveur", duration: 1800 },
  { id: "database", label: "Base de données", detail: "Création des comptes et des personnages", duration: 1600 },
  { id: "jobs", label: "Jobs", detail: "Police, EMS, mécano et métiers décrits", duration: 2600 },
  { id: "economy", label: "Économie", detail: "Salaires, prix et équilibrage", duration: 2200 },
  { id: "vehicles", label: "Véhicules", detail: "Concessionnaires et garages", duration: 1800 },
  { id: "permissions", label: "Permissions", detail: "Rôles du staff et whitelist", duration: 1400 },
  { id: "discord", label: "Discord", detail: "Salons, rôles et règlement", duration: 2400 },
  { id: "website", label: "Site web", detail: "Page de présentation et règlement", duration: 1800 },
  { id: "backup", label: "Sauvegarde", detail: "Première sauvegarde complète", duration: 1400 },
  { id: "tests", label: "Tests", detail: "Vérification de bout en bout", duration: 3000 },
];

export const totalBuildDuration = buildSteps.reduce((acc, s) => acc + s.duration, 0);
