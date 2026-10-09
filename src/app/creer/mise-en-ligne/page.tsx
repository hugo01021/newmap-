"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/cn";
import { fmt } from "@/lib/i18n/config";
import { useT } from "@/lib/i18n/client";
import { useWizard } from "@/lib/wizard-store";
import { registerLicenseKey } from "@/lib/services/deploy";
import { botInviteUrl, localizedDiscordSteps, runDiscordBuild } from "@/lib/services/discord";
import { StepHeading } from "@/components/wizard/StepHeading";
import { PillButton } from "@/components/ui/PillButton";
import { CopyField } from "@/components/ui/CopyField";
import { BuildList } from "@/components/ui/BuildList";
import { Input } from "@/components/ui/Field";
import { Tag } from "@/components/ui/Tag";
import { ArrowRight, Check, Discord, Loader } from "@/components/ui/Icons";

const ease = [0.16, 1, 0.3, 1] as const;

/* ------------------------------------------------------------------ */
/* Briques de la formation                                             */
/* ------------------------------------------------------------------ */

function GuideCard({ number, title, duration, done, doneLabel, children }: { number: number; title: string; duration: string; done: boolean; doneLabel: string; children: React.ReactNode }) {
  const t = useT();
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: number * 0.08, ease }}
      className={cn("rounded-card border bg-ink-2/60 transition-colors", done ? "border-white/40" : "border-line")}
      aria-label={fmt(t.guide.part, { n: number, title })}
    >
      <header className="flex items-center justify-between gap-4 border-b border-line px-6 py-5 sm:px-8">
        <div className="flex items-center gap-4">
          <span className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-full border text-sm font-bold", done ? "border-white bg-white text-ink" : "border-line-2 text-white")}>
            {done ? <Check width={16} height={16} strokeWidth={3} /> : number}
          </span>
          <h2 className="text-xl font-bold tracking-tight sm:text-2xl">{title}</h2>
        </div>
        <span className="label hidden text-muted sm:block">{done ? doneLabel : duration}</span>
      </header>
      <div className="px-6 py-6 sm:px-8 sm:py-7">{children}</div>
    </motion.section>
  );
}

function Why({ children }: { children: React.ReactNode }) {
  return <p className="max-w-2xl text-[15px] leading-relaxed text-muted">{children}</p>;
}

function Steps({ items }: { items: React.ReactNode[] }) {
  return (
    <ol className="mt-6 space-y-5">
      {items.map((item, i) => (
        <li key={i} className="flex gap-4">
          <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-line-2 text-xs font-bold text-white">{i + 1}</span>
          <div className="min-w-0 flex-1 text-[15px] leading-relaxed text-white/90">{item}</div>
        </li>
      ))}
    </ol>
  );
}

function Ext({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noreferrer" className="link-inline hover:opacity-70">
      {children}
    </a>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function MiseEnLignePage() {
  const t = useT();
  const g = t.guide;
  const router = useRouter();
  const { state, hydrated, setOnboarding } = useWizard();
  const ob = state.onboarding;

  // Partie 1 : clé de serveur
  const [key, setKey] = useState("");
  const [keyBusy, setKeyBusy] = useState(false);
  const [keyError, setKeyError] = useState<string | null>(null);

  // Partie 2 : Discord
  const [discordProgress, setDiscordProgress] = useState(0);
  const [discordBuilding, setDiscordBuilding] = useState(false);
  const stopBuild = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (!hydrated) return;
    if (!state.server) router.replace(state.paid ? "/creer/construction" : "/creer");
  }, [hydrated, state.server, state.paid, router]);

  useEffect(() => () => stopBuild.current?.(), []);

  if (!hydrated || !state.server || !state.spec) return null;

  const { address, discordInvite, siteUrl } = state.server;
  const ip = state.server.ip || g.ipPending;
  const host = address.replace(/^connect\s+/, "");
  const doneCount = [ob.cfxDone, ob.discordBuilt, ob.playDone].filter(Boolean).length;
  const allDone = doneCount === 3;

  const verifyKey = async () => {
    setKeyBusy(true);
    setKeyError(null);
    const result = await registerLicenseKey(key);
    setKeyBusy(false);
    if (result.ok) setOnboarding({ cfxKey: key.trim(), cfxDone: true });
    else setKeyError(g.key.invalidFormat);
  };

  const buildDiscord = () => {
    setDiscordBuilding(true);
    setDiscordProgress(0);
    stopBuild.current = runDiscordBuild(
      (i) => setDiscordProgress(i + 1),
      () => {
        setDiscordBuilding(false);
        setOnboarding({ discordBuilt: true });
      },
    );
  };

  return (
    <div className="flex flex-1 flex-col items-center">
      <StepHeading tag={g.tag} title={allDone ? g.titleDone : g.titleTodo} text={allDone ? fmt(g.textDone, { name: state.spec.name }) : g.textTodo} />

      {/* Progression */}
      <div className="mt-10 flex w-full max-w-3xl items-center gap-4">
        <div className="h-1 flex-1 overflow-hidden rounded-full bg-white/10">
          <motion.div className="h-full bg-white" initial={false} animate={{ width: `${(doneCount / 3) * 100}%` }} transition={{ duration: 0.6, ease }} />
        </div>
        <span className="label whitespace-nowrap text-muted">{fmt(g.progress, { n: doneCount })}</span>
      </div>

      <div className="mt-8 w-full max-w-3xl space-y-5">
        {/* Bloc final */}
        <AnimatePresence>
          {allDone && (
            <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="rounded-card border border-white/40 bg-ink-2 p-6 sm:p-8">
              <div className="flex items-center gap-3">
                <Tag>{g.onlineTag}</Tag>
                <span className="label text-muted">{g.share}</span>
              </div>
              <div className="mt-6 grid gap-3">
                <CopyField label={g.address} value={address} />
                <CopyField label={g.discordInvite} value={discordInvite} />
                <CopyField label={g.site} value={siteUrl} />
              </div>
              <div className="mt-6">
                <PillButton size="lg" href="/panel" iconRight={<ArrowRight width={16} height={16} />}>
                  {t.common.openPanel}
                </PillButton>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 1. Clé de serveur */}
        <GuideCard number={1} title={g.key.title} duration={g.key.duration} done={ob.cfxDone} doneLabel={g.finished}>
          <Why>{g.key.why}</Why>
          {ob.cfxDone ? (
            <div className="mt-6 flex flex-wrap items-center gap-3 rounded-md border border-line bg-ink-2 px-4 py-3 text-sm">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-ink">
                <Check width={12} height={12} strokeWidth={3} />
              </span>
              <span className="font-semibold">{g.key.registered}</span>
              <span className="text-muted">{g.key.canStart}</span>
              <code className="ml-auto truncate text-xs text-muted-2">{ob.cfxKey.slice(0, 12)}…</code>
            </div>
          ) : (
            <Steps
              items={[
                <>
                  {g.key.step1a} <Ext href="https://portal.cfx.re">portal.cfx.re</Ext> {g.key.step1b}
                </>,
                <>
                  {g.key.step2a} <b>Servers</b>
                  {g.key.step2b} <b>Registered servers</b>
                  {g.key.step2c} <b>Register new server</b>
                  {g.key.step2d}
                </>,
                <>
                  {g.key.step3}
                  <CopyField value={ip} inline className="mt-3 max-w-md" />
                </>,
                <>{g.key.step4}</>,
                <>
                  {g.key.step5}
                  <div className="mt-3 flex max-w-xl flex-col gap-2 sm:flex-row">
                    <Input value={key} onChange={(e) => setKey(e.target.value)} placeholder="cfxk_…" aria-label={g.key.aria} spellCheck={false} />
                    <PillButton onClick={verifyKey} disabled={keyBusy || key.trim().length < 8} icon={keyBusy ? <Loader width={16} height={16} /> : undefined}>
                      {keyBusy ? g.key.verifying : g.key.verify}
                    </PillButton>
                  </div>
                  {keyError && <p className="mt-2 text-sm text-white/80">{keyError}</p>}
                </>,
              ]}
            />
          )}
        </GuideCard>

        {/* 2. Discord */}
        <GuideCard number={2} title={g.discord.title} duration={g.discord.duration} done={ob.discordBuilt} doneLabel={g.finished}>
          <Why>{g.discord.why}</Why>
          {ob.discordBuilt ? (
            <div className="mt-6 space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-ink">
                  <Check width={12} height={12} strokeWidth={3} />
                </span>
                <span className="font-semibold">{g.discord.ready}</span>
                <span className="text-muted">{g.discord.shareInvite}</span>
              </div>
              <CopyField value={discordInvite} inline className="max-w-md" />
            </div>
          ) : discordBuilding ? (
            <div className="mt-6 rounded-md border border-line bg-ink-2 px-5 py-2">
              <BuildList items={localizedDiscordSteps(t)} completed={discordProgress} compact />
            </div>
          ) : (
            <Steps
              items={[
                <>
                  {g.discord.step1a} <b>+</b> {g.discord.step1b}
                </>,
                <>
                  {g.discord.step2a} <b>{g.discord.step2b}</b>
                  {g.discord.step2c} <b>{g.discord.step2d}</b>
                  {g.discord.step2e} <b>{state.spec.name}</b>.
                </>,
                <>
                  {g.discord.step3a} <b>{g.discord.step3b}</b>.
                  <div className="mt-3 flex flex-wrap gap-2">
                    <PillButton href={botInviteUrl} target="_blank" rel="noreferrer" variant="secondary" icon={<Discord width={16} height={16} />} onClick={() => setOnboarding({ discordCreated: true })}>
                      {g.discord.invite}
                    </PillButton>
                    {!ob.discordCreated && (
                      <PillButton variant="ghost" onClick={() => setOnboarding({ discordCreated: true })}>
                        {g.discord.done}
                      </PillButton>
                    )}
                  </div>
                </>,
                <>
                  {g.discord.step4}
                  <div className="mt-3">
                    <PillButton onClick={buildDiscord} disabled={!ob.discordCreated}>
                      {g.discord.build}
                    </PillButton>
                    {!ob.discordCreated && <p className="mt-2 text-xs text-muted">{g.discord.availableAfter}</p>}
                  </div>
                </>,
              ]}
            />
          )}
        </GuideCard>

        {/* 3. Rejoindre */}
        <GuideCard number={3} title={g.play.title} duration={g.play.duration} done={ob.playDone} doneLabel={g.finished}>
          <Why>{g.play.why}</Why>
          <Steps
            items={[
              <>
                {g.play.step1a} <b>GTA V</b> {g.play.step1b}
              </>,
              <>
                {g.play.step2a} <Ext href="https://fivem.net">FiveM</Ext> {g.play.step2b}
              </>,
              <>
                {g.play.step3a} <b>F8</b>
                {g.play.step3b}
                <CopyField value={address} inline className="mt-3 max-w-md" />
                <p className="mt-2 text-sm text-muted">
                  {g.play.orClick}{" "}
                  <a href={`fivem://connect/${host}`} className="link-inline hover:opacity-70">
                    {g.play.join}
                  </a>{" "}
                  {g.play.ifInstalled}
                </p>
              </>,
              <>
                {g.play.step4}
                {!ob.playDone && (
                  <div className="mt-3">
                    <PillButton onClick={() => setOnboarding({ playDone: true })}>{g.play.connected}</PillButton>
                  </div>
                )}
              </>,
            ]}
          />
        </GuideCard>

        {!allDone && (
          <p className="pt-2 text-center text-sm text-muted">
            {g.later}{" "}
            <Link href="/panel" className="link-inline hover:opacity-70">
              {g.openPanel}
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}
