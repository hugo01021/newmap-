import { Picture } from "@/components/ui/Picture";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { PillButton } from "@/components/ui/PillButton";
import { Check } from "@/components/ui/Icons";

const promises = [
  ["Attaques filtrées automatiquement", "Le trafic malveillant est bloqué avant d'atteindre ton serveur. Tes joueurs ne voient rien."],
  ["Zéro action de ta part", "Pas de réglage, pas de bouton à presser à 3 h du matin. La protection est active dès la mise en ligne."],
  ["Alerte et rapport sur Discord", "Tu es prévenu pendant l'attaque et tu reçois un compte-rendu clair une fois qu'elle est terminée."],
  ["Incluse dans toutes les offres", "De 32 à 256 joueurs, au même niveau de protection. Ce n'est pas une option payante."],
];

export function Protection() {
  return (
    <section className="border-t border-line bg-ink" id="protection">
      <div className="container-x py-24 sm:py-32">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-5">
            <Reveal>
              <SectionHeading
                tag="Priorité numéro un"
                title="Ta ville ne tombe pas."
                text="Les attaques sont la première cause de disparition des serveurs RP : un serveur injoignable un samedi soir perd ses joueurs. On a construit ServCraft en partant de là."
              />
            </Reveal>
            <Reveal delay={0.1}>
              <ul className="mt-10 space-y-5">
                {promises.map(([title, text]) => (
                  <li key={title} className="flex gap-4">
                    <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white text-ink">
                      <Check width={12} height={12} strokeWidth={3} />
                    </span>
                    <div>
                      <p className="font-semibold tracking-tight">{title}</p>
                      <p className="mt-1 text-sm leading-relaxed text-muted">{text}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </Reveal>
            <Reveal delay={0.15}>
              <div className="mt-10">
                <PillButton href="/fonctionnalites/protection-anti-attaques" variant="secondary">
                  Comment on protège ton serveur
                </PillButton>
              </div>
            </Reveal>
          </div>
          <Reveal delay={0.1} className="lg:col-span-7">
            <Picture image="includedProtection" ratio="16/10" />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
