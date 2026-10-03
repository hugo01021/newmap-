import type { Metadata } from "next";
import { SiteShell } from "@/components/layout/SiteShell";
import { Reveal } from "@/components/ui/Reveal";
import { Tag } from "@/components/ui/Tag";
import { Picture } from "@/components/ui/Picture";
import { PillButton } from "@/components/ui/PillButton";
import { Discord } from "@/components/ui/Icons";

export const metadata: Metadata = {
  title: "Communauté",
  description: "Rejoins les créateurs de serveurs ServCraft : entraide, retours, nouveautés.",
};

const highlights = [
  ["Entraide", "Des créateurs qui ont lancé leur ville partagent ce qui marche : règlement, recrutement du staff, événements."],
  ["Nouveautés en avant-première", "Les nouvelles fonctionnalités de l'IA sont testées avec la communauté avant d'arriver sur ton panel."],
  ["Événements", "Des soirées inter-serveurs, des concours de création, et des sessions questions-réponses avec l'équipe."],
];

export default function CommunautePage() {
  return (
    <SiteShell>
      <section className="container-x grid gap-12 pb-24 pt-20 sm:pt-28 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <Reveal>
            <Tag>Communauté</Tag>
            <h1 className="display mt-6 text-5xl sm:text-7xl">Tu n&apos;es pas seul à lancer ta ville.</h1>
            <p className="mt-6 max-w-xl text-lg text-muted">
              Des centaines de créateurs utilisent ServCraft. Ils se retrouvent sur notre Discord pour s&apos;entraider, partager leurs serveurs et peser sur les prochaines fonctionnalités.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <PillButton href="https://discord.gg/servcraft" target="_blank" rel="noreferrer" icon={<Discord width={18} height={18} />}>
                Rejoindre le Discord
              </PillButton>
              <PillButton href="/creer" variant="secondary">
                Créer mon serveur
              </PillButton>
            </div>
          </Reveal>
        </div>
        <Reveal delay={0.1} className="lg:col-span-6">
          <Picture image="community" ratio="4/3" />
        </Reveal>
      </section>
      <section className="border-t border-line">
        <div className="container-x grid gap-px overflow-hidden rounded-card border border-line bg-line py-0 md:grid-cols-3">
          {highlights.map(([t, d], i) => (
            <Reveal key={t} delay={i * 0.08} className="bg-ink p-8">
              <p className="label text-muted">0{i + 1}</p>
              <p className="mt-8 text-2xl font-bold tracking-tight">{t}</p>
              <p className="mt-4 text-sm leading-relaxed text-muted">{d}</p>
            </Reveal>
          ))}
        </div>
        <div className="h-24" />
      </section>
    </SiteShell>
  );
}
