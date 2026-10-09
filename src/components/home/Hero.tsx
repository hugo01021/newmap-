"use client";

import { motion } from "framer-motion";
import { images } from "@/lib/data/images";
import { useT } from "@/lib/i18n/client";
import { Tag } from "@/components/ui/Tag";
import { PillButton } from "@/components/ui/PillButton";
import { PlayIcon } from "@/components/ui/Icons";

const ease = [0.16, 1, 0.3, 1] as const;

export function Hero() {
  const t = useT();
  return (
    <section className="relative isolate min-h-[100svh] overflow-hidden">
      <motion.div
        className="absolute inset-0 -z-10"
        initial={{ scale: 1.08, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.6, ease }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={images.hero.src} alt={t.images.hero} className="h-full w-full object-cover" fetchPriority="high" />
      </motion.div>
      {/* Dégradés : lisibilité + fondu vers le noir */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-ink/70 via-ink/20 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 -z-10 h-[55%] bg-gradient-to-t from-ink via-ink/70 to-transparent" />
      <div className="absolute inset-x-0 top-0 -z-10 h-40 bg-gradient-to-b from-ink/60 to-transparent" />

      <div className="container-x flex min-h-[100svh] flex-col justify-end pb-20 pt-32 sm:pb-28">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3, ease }}>
          <Tag>{t.hero.tag}</Tag>
        </motion.div>
        <motion.h1
          className="display mt-7 max-w-5xl text-[2.9rem] text-white sm:text-7xl lg:text-[6.5rem]"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.45, ease }}
        >
          {t.hero.line1}
          <br />
          {t.hero.line2}
        </motion.h1>
        <motion.div
          className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7, ease }}
        >
          <PillButton href="/creer" size="lg">
            {t.common.create}
          </PillButton>
          <PillButton href="/#demo" variant="secondary" size="lg" icon={<PlayIcon width={14} height={14} />}>
            {t.common.demo}
          </PillButton>
        </motion.div>
      </div>
    </section>
  );
}
