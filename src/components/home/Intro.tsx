import { Reveal } from "@/components/ui/Reveal";
import { Picture } from "@/components/ui/Picture";

export function Intro() {
  return (
    <section className="bg-ink">
      <div className="container-x pb-24 pt-6 sm:pb-32">
        <div className="max-w-2xl">
          <Reveal>
            <p className="text-3xl font-bold leading-[1.1] tracking-tight text-white sm:text-4xl lg:text-5xl">
              Un serveur RP complet, en ligne en une minute, sans toucher à une seule ligne de code.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-7 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
              Tu racontes la ville que tu imagines : son ambiance, ses métiers, ses gangs, son économie. ServCraft construit
              tout, met ton serveur en ligne, le protège contre les attaques, génère ton Discord et ton site, puis te donne un
              panel pour tout gérer en parlant. Pas de jargon, pas d&apos;hébergeur à configurer, pas de nuit blanche.
            </p>
          </Reveal>
        </div>

        <div className="mt-16 grid grid-cols-2 gap-3 sm:mt-20 sm:gap-4 lg:grid-cols-4">
          {(["showcase1", "showcase2", "showcase3", "showcase4"] as const).map((img, i) => (
            <Reveal key={img} delay={i * 0.08}>
              <Picture image={img} ratio="4/5" />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
