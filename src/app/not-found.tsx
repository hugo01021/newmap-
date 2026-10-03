import { SiteShell } from "@/components/layout/SiteShell";
import { PillButton } from "@/components/ui/PillButton";
import { Tag } from "@/components/ui/Tag";

export default function NotFound() {
  return (
    <SiteShell finalCta={false}>
      <section className="container-x flex min-h-[60vh] flex-col items-start justify-center py-24">
        <Tag>Erreur 404</Tag>
        <h1 className="display mt-6 text-5xl sm:text-7xl">Cette rue n&apos;existe pas.</h1>
        <p className="mt-6 max-w-md text-muted">La page que tu cherches a déménagé ou n&apos;a jamais été construite.</p>
        <div className="mt-8 flex gap-3">
          <PillButton href="/">Retour à l&apos;accueil</PillButton>
          <PillButton href="/creer" variant="secondary">
            Créer mon serveur
          </PillButton>
        </div>
      </section>
    </SiteShell>
  );
}
