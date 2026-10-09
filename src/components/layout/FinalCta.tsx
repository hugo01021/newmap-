"use client";

import { images } from "@/lib/data/images";
import { useT } from "@/lib/i18n/client";
import { Reveal } from "@/components/ui/Reveal";

/** Grande section finale : image noir et blanc très assombrie + question centrée. */
export function FinalCta() {
  const t = useT();
  return (
    <section className="relative isolate overflow-hidden">
      <div className="absolute inset-0 -z-10">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={images.finalCta.src} alt="" className="h-full w-full object-cover grayscale" loading="lazy" />
        <div className="absolute inset-0 bg-ink/80" />
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-ink to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-ink to-transparent" />
      </div>
      <div className="container-x flex min-h-[70vh] flex-col items-center justify-center py-32 text-center sm:min-h-[80vh]">
        <Reveal>
          <h2 className="display mx-auto max-w-5xl text-5xl text-white sm:text-7xl lg:text-8xl">{t.final.title}</h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mt-8 text-base text-muted sm:text-lg">
            {t.final.join}{" "}
            <a href="https://discord.gg/servcraft" target="_blank" rel="noreferrer" className="link-inline hover:opacity-70">
              Discord
            </a>{" "}
            {t.final.or}{" "}
            <a href="mailto:aide@servcraft.gg" className="link-inline hover:opacity-70">
              aide@servcraft.gg
            </a>
          </p>
        </Reveal>
      </div>
    </section>
  );
}
