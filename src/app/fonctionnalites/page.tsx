import type { Metadata } from "next";
import { SiteShell } from "@/components/layout/SiteShell";
import { features } from "@/lib/data/features";
import { ImageCard } from "@/components/ui/ImageCard";
import { Reveal } from "@/components/ui/Reveal";
import { Tag } from "@/components/ui/Tag";

export const metadata: Metadata = {
  title: "Fonctionnalités",
  description: "Serveur de jeu, jobs et factions, économie, Discord automatique, site web, IA de gestion.",
};

export default function FonctionnalitesPage() {
  return (
    <SiteShell>
      <section className="container-x pb-24 pt-20 sm:pt-28">
        <Reveal>
          <Tag>Fonctionnalités</Tag>
          <h1 className="display mt-6 max-w-4xl text-5xl sm:text-7xl">Tout ce que ton serveur sait faire.</h1>
        </Reveal>
        <div className="mt-16 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-3 lg:gap-y-14">
          {features.map((f, i) => (
            <Reveal key={f.slug} delay={(i % 3) * 0.08}>
              <ImageCard image={f.image} label={f.label} title={f.title} href={`/fonctionnalites/${f.slug}`} ratio="16/10" />
            </Reveal>
          ))}
        </div>
      </section>
    </SiteShell>
  );
}
