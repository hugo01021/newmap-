import Link from "next/link";
import { Tag } from "@/components/ui/Tag";
import { Discord, TikTok, XLogo, YouTube } from "@/components/ui/Icons";
import { Logo } from "./Logo";

const columns = [
  {
    tag: "Produit",
    links: [
      { label: "Fonctionnalités", href: "/fonctionnalites" },
      { label: "Tarifs", href: "/tarifs" },
      { label: "Démo", href: "/#demo" },
      { label: "Créer mon serveur", href: "/creer" },
      { label: "Panel", href: "/panel" },
    ],
  },
  {
    tag: "Support",
    links: [
      { label: "FAQ", href: "/#faq" },
      { label: "Communauté", href: "/communaute" },
      { label: "Discord", href: "https://discord.gg/servcraft", external: true },
      { label: "E-mail", href: "mailto:aide@servcraft.gg", external: true },
    ],
  },
  {
    tag: "Société",
    links: [
      { label: "À propos", href: "/a-propos" },
      { label: "Mentions légales", href: "/legal/mentions-legales" },
      { label: "Confidentialité", href: "/legal/confidentialite" },
      { label: "CGV", href: "/legal/cgv" },
    ],
  },
];

const socials = [
  { label: "Discord", href: "https://discord.gg/servcraft", Icon: Discord },
  { label: "X", href: "https://x.com/servcraft", Icon: XLogo },
  { label: "YouTube", href: "https://youtube.com/@servcraft", Icon: YouTube },
  { label: "TikTok", href: "https://tiktok.com/@servcraft", Icon: TikTok },
];

export function Footer() {
  return (
    <footer className="relative z-10 bg-ink">
      <div className="container-x pb-10 pt-16 sm:pt-20">
        <div className="grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-12">
          <div className="col-span-2 md:col-span-3">
            <Logo />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted">
              Décris ton serveur. L&apos;IA le construit, le met en ligne et t&apos;aide à le gérer.
            </p>
          </div>
          {columns.map((col) => (
            <div key={col.tag} className="md:col-span-2">
              <Tag>{col.tag}</Tag>
              <ul className="mt-6 space-y-3.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    {"external" in l && l.external ? (
                      <a href={l.href} target="_blank" rel="noreferrer" className="label text-white/80 transition-opacity hover:opacity-60">
                        {l.label}
                      </a>
                    ) : (
                      <Link href={l.href} className="label text-white/80 transition-opacity hover:opacity-60">
                        {l.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div className="col-span-2 flex items-start gap-3 md:col-span-3 md:justify-end">
            {socials.map(({ label, href, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-line text-white transition-colors hover:border-white/50"
              >
                <Icon width={16} height={16} />
              </a>
            ))}
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-3 border-t border-line pt-6 text-xs text-muted-2 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} ServCraft. Tous droits réservés.</p>
          <p>Non affilié à Rockstar Games, Take-Two ou Cfx.re.</p>
        </div>
      </div>
    </footer>
  );
}
