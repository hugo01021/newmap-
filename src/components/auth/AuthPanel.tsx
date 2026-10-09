"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { useWizard } from "@/lib/wizard-store";
import { useT } from "@/lib/i18n/client";
import { signInWithDiscord, signInWithEmail } from "@/lib/services/auth";
import { images } from "@/lib/data/images";
import { Logo } from "@/components/layout/Logo";
import { PillButton } from "@/components/ui/PillButton";
import { Input, FieldLabel } from "@/components/ui/Field";
import { Tag } from "@/components/ui/Tag";
import { Discord, Loader, Mail } from "@/components/ui/Icons";
import { LanguageSwitcher } from "@/components/i18n/LanguageSwitcher";

const EMAIL = /^\S+@\S+\.\S+$/;

/** N'accepte qu'une adresse interne (évite les redirections vers un autre site). */
function safeNext(value: string | null, fallback: string) {
  return value && value.startsWith("/") && !value.startsWith("//") ? value : fallback;
}

interface AuthPanelProps {
  mode: "inscription" | "connexion";
}

/** Inscription (avant de décrire son serveur) ou connexion (pour retrouver son panel). */
export function AuthPanel({ mode }: AuthPanelProps) {
  const t = useT();
  const router = useRouter();
  const params = useSearchParams();
  const { setAccount } = useWizard();
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState<null | "email" | "discord">(null);
  const next = safeNext(params.get("next"), mode === "inscription" ? "/creer" : "/panel");
  const signup = mode === "inscription";
  const copy = signup ? t.auth.signup : t.auth.login;

  const done = () => router.push(next);

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col px-5 py-6 sm:px-10">
        <div className="flex items-center justify-between">
          <Logo />
          <div className="flex items-center gap-5">
            <LanguageSwitcher />
            <Link href="/" className="label text-white/80 hover:opacity-60">
              {t.auth.back}
            </Link>
          </div>
        </div>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center py-16">
          <Tag className="self-start">{copy.tag}</Tag>
          <h1 className="display mt-6 text-4xl sm:text-5xl">{copy.title}</h1>
          <p className="mt-4 text-muted">{copy.text}</p>

          <div className="mt-10 space-y-3">
            <PillButton
              variant="secondary"
              className="w-full"
              disabled={busy !== null}
              onClick={async () => {
                setBusy("discord");
                setAccount(await signInWithDiscord(t.auth.discordAccount));
                done();
              }}
              icon={busy === "discord" ? <Loader width={16} height={16} /> : <Discord width={18} height={18} />}
            >
              {t.auth.discord}
            </PillButton>
            <div className="flex items-center gap-4 py-2 text-xs text-muted-2">
              <span className="h-px flex-1 bg-line" />
              {t.auth.orEmail}
              <span className="h-px flex-1 bg-line" />
            </div>
            <form
              className="space-y-3"
              onSubmit={async (e) => {
                e.preventDefault();
                if (!EMAIL.test(email)) return;
                setBusy("email");
                setAccount(await signInWithEmail(email));
                done();
              }}
            >
              <label className="block">
                <FieldLabel className="mb-2">{t.auth.email}</FieldLabel>
                <Input type="email" required autoComplete="email" placeholder={t.auth.emailPlaceholder} value={email} onChange={(e) => setEmail(e.target.value)} />
              </label>
              <PillButton type="submit" className="w-full" disabled={busy !== null || !EMAIL.test(email)} icon={busy === "email" ? <Loader width={16} height={16} /> : <Mail width={16} height={16} />}>
                {copy.submit}
              </PillButton>
            </form>
          </div>

          {signup ? (
            <>
              <p className="mt-5 text-xs leading-relaxed text-muted-2">
                {t.auth.signup.terms1}{" "}
                <Link href="/legal/cgv" className="link-inline">
                  {t.auth.signup.terms}
                </Link>{" "}
                {t.auth.signup.terms2}{" "}
                <Link href="/legal/confidentialite" className="link-inline">
                  {t.auth.signup.privacy}
                </Link>
                .
              </p>
              <p className="mt-8 text-sm text-muted">
                {t.auth.signup.haveAccount}{" "}
                <Link href={`/connexion?next=${encodeURIComponent(next)}`} className="link-inline">
                  {t.auth.signup.login}
                </Link>
              </p>
            </>
          ) : (
            <p className="mt-8 text-sm text-muted">
              {t.auth.login.noAccount}{" "}
              <Link href="/inscription" className="link-inline">
                {t.auth.login.create}
              </Link>
              .
            </p>
          )}
        </motion.div>
      </div>
      <div className="relative hidden lg:block">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={signup ? images.hero.src : images.showcase1.src} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink to-transparent" />
      </div>
    </div>
  );
}
