"use client";

import { useT } from "@/lib/i18n/client";
import { Reveal } from "@/components/ui/Reveal";
import { Picture } from "@/components/ui/Picture";

export function Intro() {
  const t = useT();
  return (
    <section className="bg-ink">
      <div className="container-x pb-24 pt-6 sm:pb-32">
        <div className="max-w-2xl">
          <Reveal>
            <p className="text-3xl font-bold leading-[1.1] tracking-tight text-white sm:text-4xl lg:text-5xl">{t.intro.headline}</p>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-7 max-w-xl text-base leading-relaxed text-muted sm:text-lg">{t.intro.text}</p>
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
