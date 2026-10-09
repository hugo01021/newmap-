"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/cn";
import { useT } from "@/lib/i18n/client";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function Faq() {
  const t = useT();
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="border-t border-line bg-ink" id="faq">
      <div className="container-x py-24 sm:py-32">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Reveal>
              <SectionHeading tag={t.faq.tag} title={t.faq.title} />
            </Reveal>
          </div>
          <div className="lg:col-span-8">
            <Reveal delay={0.1}>
              <ul className="divide-y divide-line border-y border-line">
                {t.faq.items.map((item, i) => {
                  const isOpen = open === i;
                  return (
                    <li key={item.q}>
                      <button
                        type="button"
                        onClick={() => setOpen(isOpen ? null : i)}
                        aria-expanded={isOpen}
                        className="flex w-full items-center justify-between gap-6 py-6 text-left"
                      >
                        <span className="text-lg font-semibold tracking-tight sm:text-xl">{item.q}</span>
                        <span className={cn("relative h-5 w-5 shrink-0 transition-transform duration-300", isOpen && "rotate-45")}>
                          <span className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-white" />
                          <span className="absolute top-1/2 left-0 h-px w-full -translate-y-1/2 bg-white" />
                        </span>
                      </button>
                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                            className="overflow-hidden"
                          >
                            <p className="max-w-2xl pb-7 text-[15px] leading-relaxed text-muted sm:text-base">{item.a}</p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </li>
                  );
                })}
              </ul>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
