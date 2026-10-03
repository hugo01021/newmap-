"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";
import { steps, stepForPath } from "@/lib/steps";
import { Logo } from "@/components/layout/Logo";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { ArrowLeft, X } from "@/components/ui/Icons";

interface WizardShellProps {
  children: React.ReactNode;
  /** Masque la barre et le lien retour (écran de construction). */
  locked?: boolean;
}

/** Enveloppe des étapes : barre de progression fine en haut + en-tête minimal. */
export function WizardShell({ children, locked }: WizardShellProps) {
  const pathname = usePathname();
  const current = stepForPath(pathname);
  const index = current?.index ?? 1;
  const total = steps.length;
  // Pas de retour possible une fois le serveur construit.
  const canGoBack = index > 1 && current?.path !== "/creer/pret";
  const previous = canGoBack ? steps[index - 2] : null;

  return (
    <div className="flex min-h-svh flex-col bg-ink">
      <ProgressBar value={index / total} className="fixed inset-x-0 top-0 z-50" label={`Étape ${index} sur ${total}`} />

      <header className="container-x flex h-16 items-center justify-between sm:h-[72px]">
        <div className="flex items-center gap-6">
          <Logo />
          <span className="hidden items-center gap-3 text-sm text-muted sm:flex">
            <span className="h-4 w-px bg-line-2" />
            <span className="label">
              Étape {index}/{total}
            </span>
            <span className="font-medium text-white">{current?.label}</span>
          </span>
        </div>
        <div className="flex items-center gap-2">
          {!locked && previous && (
            <Link href={previous.path} className="label flex h-10 items-center gap-2 rounded-full px-4 text-white/80 transition-colors hover:bg-white/5">
              <ArrowLeft width={14} height={14} />
              <span className="hidden sm:inline">Retour</span>
            </Link>
          )}
          {!locked && (
            <Link href="/" aria-label="Quitter et revenir à l'accueil" className="flex h-10 w-10 items-center justify-center rounded-full text-white/80 transition-colors hover:bg-white/5">
              <X width={16} height={16} />
            </Link>
          )}
        </div>
      </header>

      <main className={cn("container-x flex flex-1 flex-col pb-16 pt-6 sm:pt-10")}>{children}</main>

      {/* Fil d'Ariane des étapes (ordinateur) */}
      {!locked && canGoBack && (
        <footer className="container-x hidden pb-8 md:block">
          <ol className="flex items-center gap-2 text-muted-2">
            {steps.map((s) => (
              <li key={s.path} className="flex items-center gap-2">
                {s.index < index ? (
                  <Link href={s.path} className="label text-white/60 transition-opacity hover:opacity-100">
                    {s.short}
                  </Link>
                ) : (
                  <span className={cn("label", s.index === index ? "text-white" : "")}>{s.short}</span>
                )}
                {s.index < total && <span className="h-px w-4 bg-line" />}
              </li>
            ))}
          </ol>
        </footer>
      )}
    </div>
  );
}
