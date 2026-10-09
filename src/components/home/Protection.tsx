"use client";

import { useT } from "@/lib/i18n/client";
import { Picture } from "@/components/ui/Picture";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { PillButton } from "@/components/ui/PillButton";
import { Check } from "@/components/ui/Icons";

export function Protection() {
  const t = useT();
  return (
    <section className="border-t border-line bg-ink" id="protection">
      <div className="container-x py-24 sm:py-32">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-5">
            <Reveal>
              <SectionHeading tag={t.protection.tag} title={t.protection.title} text={t.protection.text} />
            </Reveal>
            <Reveal delay={0.1}>
              <ul className="mt-10 space-y-5">
                {t.protection.promises.map((p) => (
                  <li key={p.title} className="flex gap-4">
                    <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white text-ink">
                      <Check width={12} height={12} strokeWidth={3} />
                    </span>
                    <div>
                      <p className="font-semibold tracking-tight">{p.title}</p>
                      <p className="mt-1 text-sm leading-relaxed text-muted">{p.text}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </Reveal>
            <Reveal delay={0.15}>
              <div className="mt-10">
                <PillButton href="/fonctionnalites/protection-anti-attaques" variant="secondary">
                  {t.protection.cta}
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
