import type { Metadata } from "next";
import { SiteShell } from "@/components/layout/SiteShell";
import { Pricing } from "@/components/home/Pricing";
import { Faq } from "@/components/home/Faq";
import { Reveal } from "@/components/ui/Reveal";
import { Tag } from "@/components/ui/Tag";
import { getI18n } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n();
  return { title: t.pages.pricing.metaTitle, description: t.pages.pricing.metaDescription };
}

export default async function TarifsPage() {
  const { t } = await getI18n();
  const page = t.pages.pricing;
  return (
    <SiteShell>
      <section className="container-x pb-4 pt-20 sm:pt-28">
        <Reveal>
          <Tag>{t.pricing.tag}</Tag>
          <h1 className="display mt-6 max-w-4xl text-5xl sm:text-7xl">{t.pricing.title}</h1>
          <p className="mt-6 max-w-xl text-lg text-muted">{page.intro}</p>
        </Reveal>
      </section>
      <Pricing withHeading={false} />
      <section className="border-t border-line">
        <div className="container-x py-24 sm:py-32">
          <Reveal>
            <h2 className="display text-4xl sm:text-5xl">{page.commonTitle}</h2>
          </Reveal>
          <div className="mt-12 grid gap-px overflow-hidden rounded-card border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
            {page.commons.map((c, i) => (
              <Reveal key={c.title} delay={i * 0.06} className="bg-ink p-7">
                <p className="text-xl font-bold tracking-tight">{c.title}</p>
                <p className="mt-3 text-sm leading-relaxed text-muted">{c.text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
      <Faq />
    </SiteShell>
  );
}
