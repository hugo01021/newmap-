import type { Metadata } from "next";
import { SiteShell } from "@/components/layout/SiteShell";
import { Pricing } from "@/components/home/Pricing";
import { Faq } from "@/components/home/Faq";
import { Reveal } from "@/components/ui/Reveal";
import { Tag } from "@/components/ui/Tag";

export const metadata: Metadata = {
  title: "Tarifs",
  description: "Un abonnement mensuel selon le nombre de joueurs, à partir de 22 € par mois. Sans frais de mise en place, sans engagement.",
};

export default function TarifsPage() {
  return (
    <SiteShell>
      <section className="container-x pb-4 pt-20 sm:pt-28">
        <Reveal>
          <Tag>Tarifs</Tag>
          <h1 className="display mt-6 max-w-4xl text-5xl sm:text-7xl">Un prix clair. Un serveur complet.</h1>
          <p className="mt-6 max-w-xl text-lg text-muted">
            Un abonnement mensuel calculé sur le nombre de joueurs, à partir de 22 € par mois. Pas de frais de mise en place, pas d&apos;engagement. Tout est inclus.
          </p>
        </Reveal>
      </section>
      <Pricing withHeading={false} />
      <section className="border-t border-line">
        <div className="container-x py-24 sm:py-32">
          <Reveal>
            <h2 className="display text-4xl sm:text-5xl">Ce que toutes les offres ont en commun.</h2>
          </Reveal>
          <div className="mt-12 grid gap-px overflow-hidden rounded-card border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["Création et hébergement", "Ta description devient un serveur complet, en ligne, surveillé et mis à jour pour toi."],
              ["Protection anti-attaques", "Notre priorité numéro un : attaques filtrées, serveur maintenu en ligne, alerte sur Discord."],
              ["Panel de gestion", "Tu modifies tout en parlant à l'IA, sans jargon."],
              ["Sauvegardes", "Tes données sont sauvegardées et restaurables en un clic."],
            ].map(([t, d], i) => (
              <Reveal key={t} delay={i * 0.06} className="bg-ink p-7">
                <p className="text-xl font-bold tracking-tight">{t}</p>
                <p className="mt-3 text-sm leading-relaxed text-muted">{d}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
      <Faq />
    </SiteShell>
  );
}
