import type { Metadata } from "next";
import { SiteShell } from "@/components/layout/SiteShell";
import { Reveal } from "@/components/ui/Reveal";
import { Tag } from "@/components/ui/Tag";
import { Picture } from "@/components/ui/Picture";
import { PillButton } from "@/components/ui/PillButton";
import { getI18n } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n();
  return { title: t.pages.about.metaTitle, description: t.pages.about.metaDescription };
}

export default async function AProposPage() {
  const { t } = await getI18n();
  const page = t.pages.about;
  return (
    <SiteShell>
      <section className="container-x pb-20 pt-20 sm:pt-28">
        <Reveal>
          <Tag>{page.tag}</Tag>
          <h1 className="display mt-6 max-w-5xl text-5xl sm:text-7xl">{page.title}</h1>
        </Reveal>
        <div className="mt-12 grid gap-12 lg:grid-cols-12">
          <Reveal className="lg:col-span-7">
            <Picture image="about" ratio="16/10" />
          </Reveal>
          <Reveal delay={0.1} className="space-y-5 text-base leading-relaxed text-muted sm:text-lg lg:col-span-5">
            <p>{page.p1}</p>
            <p>{page.p2}</p>
            <p className="text-white">{page.p3}</p>
          </Reveal>
        </div>
      </section>
      <section className="border-t border-line">
        <div className="container-x py-24 sm:py-32">
          <Reveal>
            <h2 className="display text-4xl sm:text-5xl">{page.valuesTitle}</h2>
          </Reveal>
          <div className="mt-12 grid gap-px overflow-hidden rounded-card border border-line bg-line sm:grid-cols-2">
            {page.values.map((v, i) => (
              <Reveal key={v.title} delay={i * 0.06} className="bg-ink p-8">
                <p className="text-2xl font-bold tracking-tight">{v.title}</p>
                <p className="mt-4 text-sm leading-relaxed text-muted sm:text-base">{v.text}</p>
              </Reveal>
            ))}
          </div>
          <div className="mt-12">
            <PillButton href="/creer" size="lg">
              {t.common.create}
            </PillButton>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
