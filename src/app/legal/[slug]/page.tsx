import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteShell } from "@/components/layout/SiteShell";
import { Tag } from "@/components/ui/Tag";
import { getI18n } from "@/lib/i18n/server";
import type { Dictionary } from "@/lib/i18n/dictionaries";

type LegalSlug = keyof Dictionary["pages"]["legal"]["pages"];
const slugs: LegalSlug[] = ["mentions-legales", "confidentialite", "cgv"];
const isLegalSlug = (value: string): value is LegalSlug => (slugs as string[]).includes(value);

export async function generateMetadata({ params }: PageProps<"/legal/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  if (!isLegalSlug(slug)) return {};
  const { t } = await getI18n();
  return { title: t.pages.legal.pages[slug].title, robots: { index: false } };
}

export default async function LegalPage({ params }: PageProps<"/legal/[slug]">) {
  const { slug } = await params;
  if (!isLegalSlug(slug)) notFound();
  const { t } = await getI18n();
  const page = t.pages.legal.pages[slug];

  return (
    <SiteShell finalCta={false}>
      <article className="container-x max-w-3xl pb-24 pt-20 sm:pt-28">
        <Tag>{t.pages.legal.tag}</Tag>
        <h1 className="display mt-6 text-4xl sm:text-6xl">{page.title}</h1>
        <p className="mt-4 text-sm text-muted">{t.pages.legal.updated}</p>
        <div className="mt-12 space-y-10">
          {page.sections.map((s) => (
            <section key={s.title}>
              <h2 className="text-xl font-bold tracking-tight">{s.title}</h2>
              <p className="mt-3 leading-relaxed text-muted">{s.text}</p>
            </section>
          ))}
        </div>
      </article>
    </SiteShell>
  );
}
