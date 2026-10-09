"use client";

import Link from "next/link";
import { useT } from "@/lib/i18n/client";
import { Tag } from "@/components/ui/Tag";
import { Discord, TikTok, XLogo, YouTube } from "@/components/ui/Icons";
import { Logo } from "./Logo";

const socials = [
  { label: "Discord", href: "https://discord.gg/servcraft", Icon: Discord },
  { label: "X", href: "https://x.com/servcraft", Icon: XLogo },
  { label: "YouTube", href: "https://youtube.com/@servcraft", Icon: YouTube },
  { label: "TikTok", href: "https://tiktok.com/@servcraft", Icon: TikTok },
];

export function Footer() {
  const t = useT();
  const l = t.footer.links;
  const columns = [
    {
      tag: t.footer.product,
      links: [
        { label: l.features, href: "/fonctionnalites" },
        { label: l.pricing, href: "/tarifs" },
        { label: l.demo, href: "/#demo" },
        { label: l.create, href: "/creer" },
        { label: l.panel, href: "/panel" },
      ],
    },
    {
      tag: t.footer.support,
      links: [
        { label: l.faq, href: "/#faq" },
        { label: l.community, href: "/communaute" },
        { label: l.discord, href: "https://discord.gg/servcraft", external: true },
        { label: l.email, href: "mailto:aide@servcraft.gg", external: true },
      ],
    },
    {
      tag: t.footer.company,
      links: [
        { label: l.about, href: "/a-propos" },
        { label: l.legal, href: "/legal/mentions-legales" },
        { label: l.privacy, href: "/legal/confidentialite" },
        { label: l.terms, href: "/legal/cgv" },
      ],
    },
  ];

  return (
    <footer className="relative z-10 bg-ink">
      <div className="container-x pb-10 pt-16 sm:pt-20">
        <div className="grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-12">
          <div className="col-span-2 md:col-span-3">
            <Logo />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted">{t.footer.tagline}</p>
          </div>
          {columns.map((col) => (
            <div key={col.tag} className="md:col-span-2">
              <Tag>{col.tag}</Tag>
              <ul className="mt-6 space-y-3.5">
                {col.links.map((link) => (
                  <li key={link.href}>
                    {"external" in link && link.external ? (
                      <a href={link.href} target="_blank" rel="noreferrer" className="label text-white/80 transition-opacity hover:opacity-60">
                        {link.label}
                      </a>
                    ) : (
                      <Link href={link.href} className="label text-white/80 transition-opacity hover:opacity-60">
                        {link.label}
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
          <p>
            © {new Date().getFullYear()} ServCraft. {t.footer.rights}
          </p>
          <p>{t.footer.disclaimer}</p>
        </div>
      </div>
    </footer>
  );
}
