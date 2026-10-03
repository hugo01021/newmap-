"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useWizard } from "@/lib/wizard-store";
import { StepHeading } from "@/components/wizard/StepHeading";
import { PillButton } from "@/components/ui/PillButton";
import { ArrowRight, Check, Copy, Discord } from "@/components/ui/Icons";
import { Picture } from "@/components/ui/Picture";

function CopyField({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* presse-papiers indisponible */
    }
  };
  return (
    <div className="rounded-card border border-line bg-ink-2/60 p-5 sm:p-6">
      <p className="label text-muted">{label}</p>
      <div className="mt-3 flex items-center justify-between gap-4">
        <code className="truncate text-base font-semibold tracking-tight sm:text-lg">{value}</code>
        <PillButton size="sm" variant="secondary" onClick={copy} icon={copied ? <Check width={14} height={14} /> : <Copy width={14} height={14} />}>
          {copied ? "Copié" : "Copier"}
        </PillButton>
      </div>
    </div>
  );
}

export default function PretPage() {
  const router = useRouter();
  const { state, hydrated } = useWizard();

  useEffect(() => {
    if (!hydrated) return;
    if (!state.server) router.replace(state.paid ? "/creer/construction" : "/creer");
  }, [hydrated, state.server, state.paid, router]);

  if (!hydrated || !state.server || !state.spec) return null;

  const { address, discordInvite, siteUrl } = state.server;

  return (
    <div className="flex flex-1 flex-col items-center">
      <motion.div initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 260, damping: 20 }} className="mb-8 flex h-16 w-16 items-center justify-center rounded-full bg-white text-ink">
        <Check width={28} height={28} strokeWidth={2.5} />
      </motion.div>
      <StepHeading tag="Étape 6" title="Ton serveur est prêt." text={`${state.spec.name} est en ligne. Partage l'adresse à tes joueurs, rejoins ton Discord, et ouvre ton panel pour tout gérer.`} />

      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }} className="mt-12 grid w-full max-w-5xl gap-6 lg:grid-cols-12">
        <div className="space-y-4 lg:col-span-7">
          <CopyField label="Adresse de connexion" value={address} />
          <div className="rounded-card border border-line bg-ink-2/60 p-5 sm:p-6">
            <p className="label text-muted">Invitation Discord</p>
            <div className="mt-3 flex items-center justify-between gap-4">
              <code className="truncate text-base font-semibold tracking-tight sm:text-lg">{discordInvite}</code>
              <PillButton size="sm" variant="secondary" href={discordInvite} target="_blank" rel="noreferrer" icon={<Discord width={16} height={16} />}>
                Ouvrir
              </PillButton>
            </div>
          </div>
          <CopyField label="Site web du serveur" value={siteUrl} />
          <div className="pt-4">
            <PillButton size="lg" href="/panel" className="w-full sm:w-auto" iconRight={<ArrowRight width={16} height={16} />}>
              Ouvrir mon panel
            </PillButton>
          </div>
        </div>
        <div className="lg:col-span-5">
          <Picture image="showcase3" ratio="4/5" className="h-full" />
        </div>
      </motion.div>
    </div>
  );
}
