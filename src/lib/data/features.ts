import { images, type ImageKey } from "./images";

export interface Feature {
  slug: string;
  label: string;
  title: string;
  intro: string;
  points: string[];
  image: ImageKey;
}

export const features: Feature[] = [
  {
    slug: "serveur-de-jeu",
    label: "Infrastructure",
    title: "Serveur de jeu",
    intro:
      "Un serveur GTA V RP complet, hébergé et surveillé pour toi. Tu n'installes rien, tu ne configures rien : il est en ligne quelques minutes après ta description.",
    points: [
      "Mise en ligne automatique, sans aucune manipulation",
      "Surveillance 24h/24 et redémarrage en cas de problème",
      "Capacité de 32 à 256 joueurs selon ton offre",
      "Mises à jour appliquées pour toi, sans coupure",
    ],
    image: "featureServer",
  },
  {
    slug: "jobs-et-factions",
    label: "Gameplay",
    title: "Jobs et factions",
    intro:
      "Police, EMS, mécano, taxi, avocat… L'IA crée les métiers que tu décris, avec leurs grades, leurs salaires et leurs lieux de travail.",
    points: [
      "Jobs légaux et illégaux prêts à jouer",
      "Grades, salaires et permissions modifiables en une phrase",
      "Factions et gangs avec territoires",
      "Recrutement géré directement depuis le panel",
    ],
    image: "featureJobs",
  },
  {
    slug: "economie",
    label: "Gameplay",
    title: "Économie",
    intro:
      "Une économie cohérente du premier jour : prix des véhicules, salaires, loyers, taxes. Rapide, réaliste ou hardcore, c'est toi qui choisis.",
    points: [
      "Trois modes d'économie équilibrés par l'IA",
      "Prix et salaires ajustables à tout moment",
      "Banques, entreprises et commerces de joueurs",
      "Rapports d'inflation et conseils d'équilibrage",
    ],
    image: "featureEconomy",
  },
  {
    slug: "discord-automatique",
    label: "Communauté",
    title: "Discord automatique",
    intro:
      "Ton Discord est généré en même temps que ton serveur : salons, rôles, règlement, candidatures whitelist, tout est prêt et synchronisé.",
    points: [
      "Salons et rôles créés automatiquement",
      "Règlement rédigé à partir de ta description",
      "Whitelist et candidatures gérées dans Discord",
      "Statut du serveur et annonces en direct",
    ],
    image: "featureDiscord",
  },
  {
    slug: "site-web",
    label: "Présence",
    title: "Site web",
    intro:
      "Un site vitrine pour ton serveur, avec ta présentation, tes règles et le bouton pour rejoindre. Hébergé, rapide, à tes couleurs.",
    points: [
      "Page de présentation générée depuis ta fiche",
      "Règlement et guide du débutant",
      "Bouton « Rejoindre » et lien Discord",
      "Nom de domaine personnalisé (offre Studio)",
    ],
    image: "featureSite",
  },
  {
    slug: "ia-de-gestion",
    label: "Panel",
    title: "IA de gestion",
    intro:
      "Gère ton serveur en parlant. « Divise le salaire des policiers par 2 », « Ajoute un braquage de banque » : l'IA prépare le changement, tu publies.",
    points: [
      "Modifications en langage naturel",
      "Aperçu de chaque changement avant publication",
      "Historique complet et retour en arrière",
      "Réparation automatique des erreurs",
    ],
    image: "featureAi",
  },
];

export const megaMenuFeatures = features.map((f) => ({
  ...f,
  imageSrc: images[f.image].src,
}));
