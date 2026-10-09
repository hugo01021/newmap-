"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { useWizard } from "@/lib/wizard-store";
import { signInWithDiscord, signInWithEmail } from "@/lib/services/auth";
import { images } from "@/lib/data/images";
import { Logo } from "@/components/layout/Logo";
import { PillButton } from "@/components/ui/PillButton";
import { Input, FieldLabel } from "@/components/ui/Field";
import { Tag } from "@/components/ui/Tag";
import { Discord, Loader, Mail } from "@/components/ui/Icons";

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
  const router = useRouter();
  const params = useSearchParams();
  const { setAccount } = useWizard();
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState<null | "email" | "discord">(null);
  const next = safeNext(params.get("next"), mode === "inscription" ? "/creer" : "/panel");
  const signup = mode === "inscription";

  const done = () => router.push(next);

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col px-5 py-6 sm:px-10">
        <div className="flex items-center justify-between">
          <Logo />
          <Link href="/" className="label text-white/80 hover:opacity-60">
            Retour
          </Link>
        </div>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center py-16">
          <Tag>{signup ? "Inscription" : "Connexion"}</Tag>
          <h1 className="display mt-6 text-4xl sm:text-5xl">{signup ? "Crée ton compte." : "Retrouve ta ville."}</h1>
          <p className="mt-4 text-muted">
            {signup ? "Trente secondes, et tu passes à la description de ton serveur. Rien à payer pour l'instant." : "Connecte-toi pour ouvrir ton panel."}
          </p>

          <div className="mt-10 space-y-3">
            <PillButton
              variant="secondary"
              className="w-full"
              disabled={busy !== null}
              onClick={async () => {
                setBusy("discord");
                setAccount(await signInWithDiscord());
                done();
              }}
              icon={busy === "discord" ? <Loader width={16} height={16} /> : <Discord width={18} height={18} />}
            >
              Continuer avec Discord
            </PillButton>
            <div className="flex items-center gap-4 py-2 text-xs text-muted-2">
              <span className="h-px flex-1 bg-line" />
              ou par e-mail
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
                <FieldLabel className="mb-2">Adresse e-mail</FieldLabel>
                <Input type="email" required autoComplete="email" placeholder="toi@exemple.fr" value={email} onChange={(e) => setEmail(e.target.value)} />
              </label>
              <PillButton type="submit" className="w-full" disabled={busy !== null || !EMAIL.test(email)} icon={busy === "email" ? <Loader width={16} height={16} /> : <Mail width={16} height={16} />}>
                {signup ? "Créer mon compte" : "Recevoir un lien de connexion"}
              </PillButton>
            </form>
          </div>

          {signup ? (
            <>
              <p className="mt-5 text-xs leading-relaxed text-muted-2">
                En continuant, tu acceptes nos{" "}
                <Link href="/legal/cgv" className="link-inline">
                  conditions
                </Link>{" "}
                et notre{" "}
                <Link href="/legal/confidentialite" className="link-inline">
                  politique de confidentialité
                </Link>
                .
              </p>
              <p className="mt-8 text-sm text-muted">
                Déjà un compte ?{" "}
                <Link href={`/connexion?next=${encodeURIComponent(next)}`} className="link-inline">
                  Se connecter
                </Link>
              </p>
            </>
          ) : (
            <p className="mt-8 text-sm text-muted">
              Pas encore de serveur ?{" "}
              <Link href="/inscription" className="link-inline">
                Crée ton compte en trente secondes
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
