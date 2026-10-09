"use client";

import { useT } from "@/lib/i18n/client";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function HowItWorks() {
  const t = useT();
  return (
    <section className="border-t border-line bg-ink" id="comment">
      <div className="container-x py-24 sm:py-32">
        <Reveal>
          <SectionHeading tag={t.how.tag} title={t.how.title} />
        </Reveal>
        <ol className="mt-16 grid gap-px overflow-hidden rounded-card border border-line bg-line sm:mt-20 md:grid-cols-3">
          {t.how.steps.map((s, i) => (
            <Reveal key={s.title} delay={i * 0.1} className="bg-ink p-7 sm:p-9">
              <li className="flex h-full flex-col">
                <span className="label text-muted">
                  {t.how.step} 0{i + 1}
                </span>
                <h3 className="display mt-10 text-3xl text-white sm:text-4xl">{s.title}</h3>
                <p className="mt-5 text-[15px] leading-relaxed text-muted">{s.text}</p>
              </li>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
