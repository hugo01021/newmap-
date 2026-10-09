"use client";

import { useT } from "@/lib/i18n/client";
import { ImageCard } from "@/components/ui/ImageCard";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { ImageKey } from "@/lib/data/images";
import type { Dictionary } from "@/lib/i18n/dictionaries";

type IncludedKey = keyof Dictionary["included"]["items"];

const included: Array<{ key: IncludedKey; image: ImageKey; href: string }> = [
  { key: "server", image: "featureServer", href: "/fonctionnalites/serveur-de-jeu" },
  { key: "protection", image: "includedProtection", href: "/fonctionnalites/protection-anti-attaques" },
  { key: "jobs", image: "featureJobs", href: "/fonctionnalites/jobs-et-factions" },
  { key: "economy", image: "featureEconomy", href: "/fonctionnalites/economie" },
  { key: "gangs", image: "includedGangs", href: "/fonctionnalites/jobs-et-factions" },
  { key: "housing", image: "includedHousing", href: "/fonctionnalites/economie" },
  { key: "heists", image: "includedHeists", href: "/fonctionnalites/ia-de-gestion" },
  { key: "discord", image: "featureDiscord", href: "/fonctionnalites/discord-automatique" },
  { key: "site", image: "featureSite", href: "/fonctionnalites/site-web" },
  { key: "backups", image: "includedBackups", href: "/fonctionnalites/serveur-de-jeu" },
  { key: "repair", image: "includedRepair", href: "/fonctionnalites/ia-de-gestion" },
];

export function Included() {
  const t = useT();
  return (
    <section className="border-t border-line bg-ink" id="inclus">
      <div className="container-x py-24 sm:py-32">
        <Reveal>
          <SectionHeading tag={t.included.tag} title={t.included.title} text={t.included.text} />
        </Reveal>
        <div className="mt-16 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-4 lg:gap-y-12">
          {included.map((item, i) => (
            <Reveal key={item.key} delay={(i % 4) * 0.06}>
              <ImageCard image={item.image} href={item.href} label={t.included.items[item.key].label} title={t.included.items[item.key].title} ratio="4/3" />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
