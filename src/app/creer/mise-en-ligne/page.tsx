"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/cn";
import { useWizard } from "@/lib/wizard-store";
import { registerLicenseKey } from "@/lib/services/deploy";
import { botInviteUrl, discordBuildSteps, runDiscordBuild } from "@/lib/services/discord";
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

function GuideCard({ number, title, duration, done, children }: { number: number; title: string; duration: string; done: boolean; children: React.ReactNode }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: number * 0.08, ease }}
      className={cn("rounded-card border bg-ink-2/60 transition-colors", done ? "border-white/40" : "border-line")}
      aria-label={`Partie ${number} : ${title}`}
    >
      <header className="flex items-center justify-between gap-4 border-b border-line px-6 py-5 sm:px-8">
        <div className="flex items-center gap-4">
          <span className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-full border text-sm font-bold", done ? "border-white bg-white text-ink" : "border-line-2 text-white")}>
            {done ? <Check width={16} height={16} strokeWidth={3} /> : number}
          </span>
          <h2 className="text-xl font-bold tracking-tight sm:text-2xl">{title}</h2>
        </div>
        <span className="label hidden text-muted sm:block">{done ? "Terminé" : duration}</span>
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
  const ip = state.server.ip || "en cours d'attribution";
  const host = address.replace(/^connect\s+/, "");
  const doneCount = [ob.cfxDone, ob.discordBuilt, ob.playDone].filter(Boolean).length;
  const allDone = doneCount === 3;

  const verifyKey = async () => {
    setKeyBusy(true);
    setKeyError(null);
    const result = await registerLicenseKey(key);
    setKeyBusy(false);
    if (result.ok) setOnboarding({ cfxKey: key.trim(), cfxDone: true });
    else setKeyError(result.reason ?? "Clé invalide.");
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
      <StepHeading
        tag="Étape 6"
        title={allDone ? "Ton serveur est en ligne." : "Plus que trois choses à faire."}
        text={
          allDone
            ? `${state.spec.name} est prêt à accueillir tes joueurs. Tout se gère maintenant depuis ton panel.`
            : "Ton serveur est construit. Ce guide est écrit pour quelqu'un qui n'a jamais rien configuré. Compte dix minutes, dans l'ordre que tu veux."
        }
      />

      {/* Progression */}
      <div className="mt-10 flex w-full max-w-3xl items-center gap-4">
        <div className="h-1 flex-1 overflow-hidden rounded-full bg-white/10">
          <motion.div className="h-full bg-white" initial={false} animate={{ width: `${(doneCount / 3) * 100}%` }} transition={{ duration: 0.6, ease }} />
        </div>
        <span className="label whitespace-nowrap text-muted">{doneCount} / 3 terminées</span>
      </div>

      <div className="mt-8 w-full max-w-3xl space-y-5">
        {/* Bloc final */}
        <AnimatePresence>
          {allDone && (
            <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="rounded-card border border-white/40 bg-ink-2 p-6 sm:p-8">
              <div className="flex items-center gap-3">
                <Tag>Serveur en ligne</Tag>
                <span className="label text-muted">Partage ces liens à tes joueurs</span>
              </div>
              <div className="mt-6 grid gap-3">
                <CopyField label="Adresse de connexion (dans FiveM, touche F8)" value={address} />
                <CopyField label="Invitation Discord" value={discordInvite} />
                <CopyField label="Site web du serveur" value={siteUrl} />
              </div>
              <div className="mt-6">
                <PillButton size="lg" href="/panel" iconRight={<ArrowRight width={16} height={16} />}>
                  Ouvrir mon panel
                </PillButton>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 1. Clé de serveur */}
        <GuideCard number={1} title="Ta clé de serveur" duration="2 minutes" done={ob.cfxDone}>
          <Why>
            FiveM, le système qui fait tourner les serveurs GTA RP, demande une clé gratuite pour chaque serveur. Elle prouve que le serveur est à toi. Sans elle, le serveur ne peut pas s&apos;allumer.
          </Why>
          {ob.cfxDone ? (
            <div className="mt-6 flex flex-wrap items-center gap-3 rounded-md border border-line bg-ink-2 px-4 py-3 text-sm">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-ink">
                <Check width={12} height={12} strokeWidth={3} />
              </span>
              <span className="font-semibold">Clé enregistrée.</span>
              <span className="text-muted">Ton serveur peut démarrer.</span>
              <code className="ml-auto truncate text-xs text-muted-2">{ob.cfxKey.slice(0, 12)}…</code>
            </div>
          ) : (
            <>
              <Steps
                items={[
                  <>
                    Ouvre <Ext href="https://portal.cfx.re">portal.cfx.re</Ext> et connecte-toi. Pas de compte ? Clique sur « Créer un compte », c&apos;est gratuit et ça prend une minute.
                  </>,
                  <>
                    Dans le menu, va dans <b>Servers</b>, puis <b>Registered servers</b>, puis clique sur <b>Register new server</b>.
                  </>,
                  <>
                    Quand une adresse IP est demandée, colle celle de ta machine :
                    <CopyField value={ip} inline className="mt-3 max-w-md" />
                  </>,
                  <>Valide. Une clé qui commence par « cfxk_ » s&apos;affiche : copie-la.</>,
                  <>
                    Colle-la ici, puis clique sur « Vérifier ».
                    <div className="mt-3 flex max-w-xl flex-col gap-2 sm:flex-row">
                      <Input value={key} onChange={(e) => setKey(e.target.value)} placeholder="cfxk_…" aria-label="Clé de serveur" spellCheck={false} />
                      <PillButton onClick={verifyKey} disabled={keyBusy || key.trim().length < 8} icon={keyBusy ? <Loader width={16} height={16} /> : undefined}>
                        {keyBusy ? "Vérification…" : "Vérifier"}
                      </PillButton>
                    </div>
                    {keyError && <p className="mt-2 text-sm text-white/80">{keyError}</p>}
                  </>,
                ]}
              />
            </>
          )}
        </GuideCard>

        {/* 2. Discord */}
        <GuideCard number={2} title="Ton Discord" duration="3 minutes" done={ob.discordBuilt}>
          <Why>
            Ton Discord est le point de rendez-vous de ta communauté. Tu crées la coquille vide, l&apos;IA remplit tout : salons, rôles, règlement, formulaire de whitelist.
          </Why>
          {ob.discordBuilt ? (
            <div className="mt-6 space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-ink">
                  <Check width={12} height={12} strokeWidth={3} />
                </span>
                <span className="font-semibold">Discord prêt.</span>
                <span className="text-muted">Voici le lien d&apos;invitation à partager.</span>
              </div>
              <CopyField value={discordInvite} inline className="max-w-md" />
            </div>
          ) : discordBuilding ? (
            <div className="mt-6 rounded-md border border-line bg-ink-2 px-5 py-2">
              <BuildList items={discordBuildSteps.map((s) => ({ id: s.id, label: s.label, detail: s.detail }))} completed={discordProgress} compact />
            </div>
          ) : (
            <Steps
              items={[
                <>
                  Ouvre Discord, sur ordinateur ou sur téléphone. Dans la colonne de gauche, clique sur le <b>+</b> (« Ajouter un serveur »).
                </>,
                <>
                  Choisis <b>Créer le mien</b>, puis <b>Pour un club ou une communauté</b>. Donne-lui le nom de ton serveur : <b>{state.spec.name}</b>.
                </>,
                <>
                  Clique sur le bouton ci-dessous. Discord te demande sur quel serveur ajouter le robot : choisis celui que tu viens de créer, puis clique sur <b>Autoriser</b>.
                  <div className="mt-3 flex flex-wrap gap-2">
                    <PillButton href={botInviteUrl} target="_blank" rel="noreferrer" variant="secondary" icon={<Discord width={16} height={16} />} onClick={() => setOnboarding({ discordCreated: true })}>
                      Inviter le robot ServCraft
                    </PillButton>
                    {!ob.discordCreated && (
                      <PillButton variant="ghost" onClick={() => setOnboarding({ discordCreated: true })}>
                        C&apos;est fait
                      </PillButton>
                    )}
                  </div>
                </>,
                <>
                  Reviens ici et lance la construction. L&apos;IA crée tout en moins d&apos;une minute.
                  <div className="mt-3">
                    <PillButton onClick={buildDiscord} disabled={!ob.discordCreated}>
                      Construire mon Discord
                    </PillButton>
                    {!ob.discordCreated && <p className="mt-2 text-xs text-muted">Disponible une fois le robot invité.</p>}
                  </div>
                </>,
              ]}
            />
          )}
        </GuideCard>

        {/* 3. Rejoindre */}
        <GuideCard number={3} title="Rejoindre ton serveur" duration="5 minutes" done={ob.playDone}>
          <Why>Pour jouer, il faut GTA V et FiveM sur ton ordinateur. FiveM est gratuit, c&apos;est lui qui permet de rejoindre les serveurs RP.</Why>
          <Steps
            items={[
              <>Vérifie que <b>GTA V</b> (version PC) est installé sur ton ordinateur, via Steam, Rockstar ou Epic.</>,
              <>
                Télécharge <Ext href="https://fivem.net">FiveM</Ext> et installe-le. Lance-le une première fois : il termine son installation tout seul, ça peut prendre quelques minutes.
              </>,
              <>
                Dans FiveM, appuie sur la touche <b>F8</b>, colle cette commande et valide avec Entrée :
                <CopyField value={address} inline className="mt-3 max-w-md" />
                <p className="mt-2 text-sm text-muted">
                  Ou clique directement sur{" "}
                  <a href={`fivem://connect/${host}`} className="link-inline hover:opacity-70">
                    Rejoindre mon serveur
                  </a>{" "}
                  si FiveM est déjà installé.
                </p>
              </>,
              <>
                Tu es dans ta ville. Partage l&apos;adresse et le lien Discord à tes joueurs.
                {!ob.playDone && (
                  <div className="mt-3">
                    <PillButton onClick={() => setOnboarding({ playDone: true })}>C&apos;est fait, je suis connecté</PillButton>
                  </div>
                )}
              </>,
            ]}
          />
        </GuideCard>

        {!allDone && (
          <p className="pt-2 text-center text-sm text-muted">
            Tu peux faire ça plus tard : ce guide reste disponible dans ton panel.{" "}
            <Link href="/panel" className="link-inline hover:opacity-70">
              Ouvrir le panel
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}
