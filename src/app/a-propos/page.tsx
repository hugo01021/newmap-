import type { Metadata } from "next";
import { SiteShell } from "@/components/layout/SiteShell";
import { Reveal } from "@/components/ui/Reveal";
import { Tag } from "@/components/ui/Tag";
import { Picture } from "@/components/ui/Picture";
import { PillButton } from "@/components/ui/PillButton";

export const metadata: Metadata = {
  title: "À propos",
  description: "Pourquoi on a créé ServCraft : lancer un serveur RP ne devrait pas demander des semaines de technique.",
};

const values = [
  ["Zéro jargon", "Tu ne verras jamais un terme technique. Si tu dois le chercher sur Internet, on a échoué."],
  ["Tu gardes le contrôle", "L'IA propose, tu publies. Chaque changement est visible, expliqué et réversible."],
  ["Premium, pas low-cost", "On préfère moins de serveurs mieux accompagnés. La qualité de ta ville passe avant le volume."],
  ["Sérénité", "Surveillance, sauvegardes, réparation automatique. Tu t'occupes de ta communauté, on s'occupe du reste."],
];

export default function AProposPage() {
  return (
    <SiteShell>
      <section className="container-x pb-20 pt-20 sm:pt-28">
        <Reveal>
          <Tag>À propos</Tag>
          <h1 className="display mt-6 max-w-5xl text-5xl sm:text-7xl">On a passé trop de nuits à configurer des serveurs.</h1>
        </Reveal>
        <div className="mt-12 grid gap-12 lg:grid-cols-12">
          <Reveal className="lg:col-span-7">
            <Picture image="about" ratio="16/10" />
          </Reveal>
          <Reveal delay={0.1} className="space-y-5 text-base leading-relaxed text-muted sm:text-lg lg:col-span-5">
            <p>
              ServCraft est né d&apos;un constat simple : les meilleures idées de serveurs RP ne viennent pas forcément des gens qui savent les mettre en ligne. Entre l&apos;hébergement, la configuration, les bugs et le Discord à monter, la plupart abandonnent avant d&apos;avoir accueilli un seul joueur.
            </p>
            <p>
              On a donc construit une plateforme qui fait tout ça à ta place. Tu décris ta ville, l&apos;IA l&apos;assemble, la met en ligne, et te donne un panel où tu gères tout en parlant.
            </p>
            <p className="text-white">Notre promesse : tu te concentres sur ta communauté, jamais sur la technique.</p>
          </Reveal>
        </div>
      </section>
      <section className="border-t border-line">
        <div className="container-x py-24 sm:py-32">
          <Reveal>
            <h2 className="display text-4xl sm:text-5xl">Ce qui nous guide.</h2>
          </Reveal>
          <div className="mt-12 grid gap-px overflow-hidden rounded-card border border-line bg-line sm:grid-cols-2">
            {values.map(([t, d], i) => (
              <Reveal key={t} delay={i * 0.06} className="bg-ink p-8">
                <p className="text-2xl font-bold tracking-tight">{t}</p>
                <p className="mt-4 text-sm leading-relaxed text-muted sm:text-base">{d}</p>
              </Reveal>
            ))}
          </div>
          <div className="mt-12">
            <PillButton href="/creer" size="lg">
              Créer mon serveur
            </PillButton>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
