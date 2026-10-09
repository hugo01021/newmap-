"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/cn";
import { fmt } from "@/lib/i18n/config";
import { useLocale } from "@/lib/i18n/client";
import { demoSpec, useWizard } from "@/lib/wizard-store";
import { defaultPanelData, type HistoryItem } from "@/lib/services/panel";
import type { AiProposal } from "@/lib/types";
import { Logo } from "@/components/layout/Logo";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { PanelChat } from "@/components/panel/PanelChat";
import { PanelTabContent, tabs, type Tab } from "@/components/panel/PanelTabs";
import { Discord, Users } from "@/components/ui/Icons";
import { LanguageSwitcher } from "@/components/i18n/LanguageSwitcher";

export default function PanelPage() {
  const { t, locale } = useLocale();
  const p = t.panel;
  const { state, hydrated, newServer } = useWizard();
  const [tab, setTab] = useState<Tab>("overview");
  const [history, setHistory] = useState<HistoryItem[]>(() => defaultPanelData(t).history);
  const [online, setOnline] = useState(27);

  const spec = useMemo(() => (state.spec && state.built ? state.spec : demoSpec(locale, t)), [state.spec, state.built, locale, t]);
  const isDemo = !(state.spec && state.built);
  const ob = state.onboarding;
  const remaining = isDemo ? 0 : 3 - [ob.cfxDone, ob.discordBuilt, ob.playDone].filter(Boolean).length;
  const discordMembers = useMemo(() => 180 + (spec.name.length % 7) * 23, [spec.name]);

  // Petites variations de joueurs connectés pour donner vie à l'en-tête.
  useEffect(() => {
    const id = setInterval(() => setOnline((n) => Math.max(5, Math.min(spec.players, n + (Math.random() > 0.5 ? 1 : -1)))), 4000);
    return () => clearInterval(id);
  }, [spec.players]);

  const log = (item: Omit<HistoryItem, "id" | "date">) =>
    setHistory((h) => [{ id: `h-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, date: p.backups.justNow, ...item }, ...h]);

  const onPublished = (prop: AiProposal) => log({ title: prop.title, author: p.data.ai, area: prop.area });

  return (
    <div className="min-h-svh bg-ink">
      <ProgressBar value={1} className="fixed inset-x-0 top-0 z-50" label={p.stepAria} />

      {/* En-tête du panel */}
      <header className="border-b border-line">
        <div className="container-x flex h-16 items-center justify-between sm:h-[72px]">
          <div className="flex items-center gap-6">
            <Logo />
            <span className="hidden items-center gap-3 sm:flex">
              <span className="h-4 w-px bg-line-2" />
              <span className="label text-muted">{p.label}</span>
            </span>
          </div>
          <div className="flex items-center gap-4 text-sm">
            {isDemo && <span className="label hidden text-muted md:inline">{p.demo}</span>}
            {!isDemo && (
              <Link href="/creer/mise-en-ligne" className="label text-white/80 transition-opacity hover:opacity-60">
                {p.guide}
              </Link>
            )}
            <Link href="/" className="label text-white/80 transition-opacity hover:opacity-60">
              {t.common.home}
            </Link>
            <LanguageSwitcher />
            {hydrated && state.account && (
              <span className="hidden h-8 w-8 items-center justify-center rounded-full bg-white text-xs font-bold text-ink sm:flex" title={state.account.email}>
                {state.account.displayName.slice(0, 1).toUpperCase()}
              </span>
            )}
          </div>
        </div>
        <div className="container-x flex flex-col gap-6 py-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <span className="relative flex h-2.5 w-2.5">
                <span className="pulse-dot absolute inset-0 rounded-full bg-white/60" />
                <span className="relative h-2.5 w-2.5 rounded-full bg-white" />
              </span>
              <span className="label text-white">{p.online}</span>
            </div>
            <h1 className="display mt-3 text-4xl sm:text-5xl">{spec.name}</h1>
          </div>
          <dl className="flex gap-8">
            <div>
              <dt className="label flex items-center gap-1.5 text-muted">
                <Users width={13} height={13} /> {p.players}
              </dt>
              <dd className="mt-2 text-2xl font-bold tabular-nums tracking-tight">
                {online}
                <span className="text-base text-muted"> / {spec.players}</span>
              </dd>
            </div>
            <div>
              <dt className="label flex items-center gap-1.5 text-muted">
                <Discord width={13} height={13} /> {p.discord}
              </dt>
              <dd className="mt-2 text-2xl font-bold tabular-nums tracking-tight">{discordMembers}</dd>
            </div>
          </dl>
        </div>

        {/* Onglets */}
        <nav className="container-x relative -mb-px" aria-label={p.tabsAria}>
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-ink to-transparent lg:hidden" />
          <ul className="flex gap-6 overflow-x-auto whitespace-nowrap scrollbar-none">
            {tabs.map((key) => (
              <li key={key}>
                <button
                  type="button"
                  onClick={() => setTab(key)}
                  aria-current={tab === key ? "page" : undefined}
                  className={cn("label border-b-2 py-4 transition-colors", tab === key ? "border-white text-white" : "border-transparent text-muted hover:text-white")}
                >
                  {p.tabs[key]}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      {remaining > 0 && (
        <div className="container-x pt-6">
          <div className="flex flex-col gap-3 rounded-card border border-white/30 bg-ink-2 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm">
              <span className="font-semibold">{remaining === 1 ? p.banner.remainingOne : fmt(p.banner.remainingMany, { n: remaining })}</span>
              <span className="text-muted"> {p.banner.text}</span>
            </p>
            <Link href="/creer/mise-en-ligne" className="label whitespace-nowrap underline underline-offset-4">
              {p.banner.resume}
            </Link>
          </div>
        </div>
      )}
      <main className="container-x grid gap-6 py-8 lg:grid-cols-12">
        <div className="lg:col-span-7 xl:col-span-8">
          <PanelTabContent key={`${tab}-${locale}`} tab={tab} spec={spec} history={history} online={online} discordMembers={discordMembers} onLog={log} />
        </div>
        <div className="lg:col-span-5 xl:col-span-4">
          <PanelChat onPublished={onPublished} />
        </div>
      </main>

      <footer className="container-x flex flex-col gap-3 border-t border-line py-6 text-xs text-muted-2 sm:flex-row sm:items-center sm:justify-between">
        <p>
          {isDemo ? (
            <>
              {p.footer.demo}{" "}
              <Link href="/creer" className="link-inline">
                {p.footer.demoLink}
              </Link>
              .
            </>
          ) : (
            <>
              {p.footer.created}{" "}
              <Link href="/creer" onClick={newServer} className="link-inline">
                {p.footer.another}
              </Link>
              .
            </>
          )}
        </p>
        <p>{t.footer.disclaimer}</p>
      </footer>
    </div>
  );
}
