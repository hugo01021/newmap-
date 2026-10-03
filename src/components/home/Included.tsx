import { ImageCard } from "@/components/ui/ImageCard";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { ImageKey } from "@/lib/data/images";

const included: Array<{ image: ImageKey; label: string; title: string; href: string }> = [
  { image: "featureServer", label: "Infrastructure", title: "Serveur de jeu", href: "/fonctionnalites/serveur-de-jeu" },
  { image: "includedProtection", label: "Priorité numéro un", title: "Protection anti-attaques", href: "/fonctionnalites/protection-anti-attaques" },
  { image: "featureJobs", label: "Gameplay", title: "Jobs : police, EMS, mécano", href: "/fonctionnalites/jobs-et-factions" },
  { image: "featureEconomy", label: "Gameplay", title: "Économie", href: "/fonctionnalites/economie" },
  { image: "includedGangs", label: "Gameplay", title: "Gangs", href: "/fonctionnalites/jobs-et-factions" },
  { image: "includedHousing", label: "Gameplay", title: "Immobilier", href: "/fonctionnalites/economie" },
  { image: "includedHeists", label: "Gameplay", title: "Braquages", href: "/fonctionnalites/ia-de-gestion" },
  { image: "featureDiscord", label: "Communauté", title: "Discord complet généré automatiquement", href: "/fonctionnalites/discord-automatique" },
  { image: "featureSite", label: "Présence", title: "Site web du serveur", href: "/fonctionnalites/site-web" },
  { image: "includedBackups", label: "Sérénité", title: "Sauvegardes", href: "/fonctionnalites/serveur-de-jeu" },
  { image: "includedRepair", label: "Sérénité", title: "Réparation automatique des erreurs", href: "/fonctionnalites/ia-de-gestion" },
];

export function Included() {
  return (
    <section className="border-t border-line bg-ink" id="inclus">
      <div className="container-x py-24 sm:py-32">
        <Reveal>
          <SectionHeading tag="Ce qui est inclus" title="Tout ce qu'il faut pour une vraie ville." text="Pas une base vide à remplir : un serveur complet, cohérent avec ta description, prêt à accueillir des joueurs." />
        </Reveal>
        <div className="mt-16 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-4 lg:gap-y-12">
          {included.map((item, i) => (
            <Reveal key={item.title} delay={(i % 4) * 0.06}>
              <ImageCard {...item} ratio="4/3" />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
