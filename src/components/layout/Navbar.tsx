"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/cn";
import { menuFeatures } from "@/lib/data/features";
import { useT } from "@/lib/i18n/client";
import { Logo } from "./Logo";
import { ImageCard } from "@/components/ui/ImageCard";
import { ChevronDown, Menu, X } from "@/components/ui/Icons";
import { PillButton } from "@/components/ui/PillButton";
import { LanguageSwitcher } from "@/components/i18n/LanguageSwitcher";

interface NavbarProps {
  /** Transparente, posée sur le hero. Devient opaque au scroll. */
  overlay?: boolean;
}

export function Navbar({ overlay = true }: NavbarProps) {
  const t = useT();
  const [megaOpen, setMegaOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const wrapRef = useRef<HTMLDivElement>(null);
  const features = menuFeatures(t);

  const links = [
    { label: t.nav.pricing, href: "/tarifs" },
    { label: t.nav.community, href: "/communaute" },
    { label: t.nav.about, href: "/a-propos" },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Ferme les menus quand la route change.
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setMegaOpen(false);
    setMobileOpen(false);
  }

  useEffect(() => {
    if (!megaOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMegaOpen(false);
    const onClick = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setMegaOpen(false);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("mousedown", onClick);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("mousedown", onClick);
    };
  }, [megaOpen]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const solid = !overlay || scrolled || megaOpen;

  return (
    <div ref={wrapRef} className="fixed inset-x-0 top-0 z-50">
      <header
        className={cn(
          "transition-colors duration-500",
          solid ? "bg-ink/80 backdrop-blur-xl border-b border-line" : "bg-transparent border-b border-transparent",
        )}
      >
        <nav className="container-x flex h-16 items-center justify-between sm:h-[72px]">
          <Logo />

          {/* Menu centré */}
          <ul className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-8 lg:flex">
            <li>
              <button
                type="button"
                onClick={() => setMegaOpen((v) => !v)}
                aria-expanded={megaOpen}
                className="label flex items-center gap-1.5 py-2 text-white/90 transition-opacity hover:opacity-70"
              >
                {t.nav.features}
                <ChevronDown width={13} height={13} className={cn("transition-transform duration-300", megaOpen && "rotate-180")} />
              </button>
            </li>
            {links.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className={cn("label block py-2 text-white/90 transition-opacity hover:opacity-70", pathname === l.href && "underline underline-offset-4")}>
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-5">
            <LanguageSwitcher className="hidden sm:block" />
            <Link href="/connexion" className="label hidden text-white/90 transition-opacity hover:opacity-70 sm:block">
              {t.nav.login}
            </Link>
            <button
              type="button"
              className="-mr-2 flex h-10 w-10 items-center justify-center text-white lg:hidden"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label={mobileOpen ? t.nav.closeMenu : t.nav.openMenu}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X /> : <Menu />}
            </button>
          </div>
        </nav>

        {/* Méga-menu */}
        <AnimatePresence>
          {megaOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="hidden border-t border-line lg:block"
            >
              <div className="container-x py-10">
                <div className="grid grid-cols-3 gap-x-6 gap-y-10">
                  {features.map((f, i) => (
                    <motion.div
                      key={f.slug}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.05 * i, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <ImageCard image={f.image} label={f.label} title={f.title} href={`/fonctionnalites/${f.slug}`} ratio="16/10" onClick={() => setMegaOpen(false)} />
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Menu mobile */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-x-0 bottom-0 top-16 z-40 overflow-y-auto bg-ink/95 backdrop-blur-xl lg:hidden"
          >
            <div className="container-x flex min-h-full flex-col py-8">
              <p className="label mb-4 text-muted">{t.nav.features}</p>
              <ul className="grid grid-cols-2 gap-5">
                {features.map((f) => (
                  <li key={f.slug}>
                    <ImageCard image={f.image} label={f.label} title={f.title} href={`/fonctionnalites/${f.slug}`} ratio="16/10" />
                  </li>
                ))}
              </ul>
              <ul className="mt-10 divide-y divide-line border-y border-line">
                {links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="flex items-center justify-between py-5 text-2xl font-bold tracking-tight">
                      {l.label}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link href="/connexion" className="flex items-center justify-between py-5 text-2xl font-bold tracking-tight">
                    {t.nav.login}
                  </Link>
                </li>
              </ul>
              <div className="mt-8 flex flex-col gap-6">
                <LanguageSwitcher variant="inline" />
                <PillButton href="/creer" className="self-start">
                  {t.common.create}
                </PillButton>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
