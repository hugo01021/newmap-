import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteShell } from "@/components/layout/SiteShell";
import { Tag } from "@/components/ui/Tag";

const pages: Record<string, { title: string; sections: Array<[string, string]> }> = {
  "mentions-legales": {
    title: "Mentions légales",
    sections: [
      ["Éditeur", "ServCraft SAS, société en cours d'immatriculation. Siège social : à compléter. Contact : aide@servcraft.gg."],
      ["Hébergement", "Les serveurs de jeu et le site sont hébergés dans l'Union européenne chez des prestataires certifiés. Les coordonnées complètes seront précisées ici."],
      ["Propriété intellectuelle", "La marque ServCraft, le site et ses contenus sont protégés. Les marques GTA V, Rockstar Games, Take-Two et Cfx.re appartiennent à leurs propriétaires respectifs. ServCraft n'est affilié à aucun d'entre eux."],
    ],
  },
  confidentialite: {
    title: "Politique de confidentialité",
    sections: [
      ["Données collectées", "Ton adresse e-mail ou ton identifiant Discord, la description de ton serveur, et les informations nécessaires au paiement (traitées par notre prestataire de paiement, jamais stockées chez nous)."],
      ["Utilisation", "Ces données servent uniquement à créer et gérer ton serveur, à t'envoyer les informations liées à ton compte, et à améliorer le service."],
      ["Tes droits", "Tu peux demander l'accès, la rectification ou la suppression de tes données à tout moment en écrivant à aide@servcraft.gg."],
    ],
  },
  cgv: {
    title: "Conditions générales de vente",
    sections: [
      ["Offres", "ServCraft propose trois offres : Launch, Pro RP et Studio. Chacune comprend des frais de mise en place uniques et un abonnement mensuel."],
      ["Paiement et résiliation", "Les frais de mise en place sont dus à la commande et ne sont pas remboursables une fois la construction lancée. L'abonnement mensuel est résiliable à tout moment depuis le panel ; il prend fin à l'échéance en cours."],
      ["Disponibilité", "ServCraft s'engage à surveiller ton serveur en continu et à le remettre en ligne au plus vite en cas d'incident. Les sauvegardes sont conservées 30 jours."],
      ["Contenu", "Tu restes responsable du contenu de ton serveur et du respect des conditions d'utilisation des plateformes tierces."],
    ],
  },
};

export function generateStaticParams() {
  return Object.keys(pages).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/legal/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const p = pages[slug];
  return p ? { title: p.title, robots: { index: false } } : {};
}

export default async function LegalPage({ params }: PageProps<"/legal/[slug]">) {
  const { slug } = await params;
  const page = pages[slug];
  if (!page) notFound();

  return (
    <SiteShell finalCta={false}>
      <article className="container-x max-w-3xl pb-24 pt-20 sm:pt-28">
        <Tag>Légal</Tag>
        <h1 className="display mt-6 text-4xl sm:text-6xl">{page.title}</h1>
        <p className="mt-4 text-sm text-muted">Dernière mise à jour : octobre 2026. Document provisoire, à compléter avant la mise en production.</p>
        <div className="mt-12 space-y-10">
          {page.sections.map(([h, body]) => (
            <section key={h}>
              <h2 className="text-xl font-bold tracking-tight">{h}</h2>
              <p className="mt-3 leading-relaxed text-muted">{body}</p>
            </section>
          ))}
        </div>
      </article>
    </SiteShell>
  );
}
