import type { Metadata } from "next";
import { SiteShell } from "@/components/layout/SiteShell";
import { Reveal } from "@/components/ui/Reveal";
import { Tag } from "@/components/ui/Tag";
import { Picture } from "@/components/ui/Picture";
import { PillButton } from "@/components/ui/PillButton";
import { Discord } from "@/components/ui/Icons";
import { getI18n } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n();
  return { title: t.pages.community.metaTitle, description: t.pages.community.metaDescription };
}

export default async function CommunautePage() {
  const { t } = await getI18n();
  const page = t.pages.community;
  return (
    <SiteShell>
      <section className="container-x grid gap-12 pb-24 pt-20 sm:pt-28 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <Reveal>
            <Tag>{page.tag}</Tag>
            <h1 className="display mt-6 text-5xl sm:text-7xl">{page.title}</h1>
            <p className="mt-6 max-w-xl text-lg text-muted">{page.text}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <PillButton href="https://discord.gg/servcraft" target="_blank" rel="noreferrer" icon={<Discord width={18} height={18} />}>
                {page.join}
              </PillButton>
              <PillButton href="/creer" variant="secondary">
                {t.common.create}
              </PillButton>
            </div>
          </Reveal>
        </div>
        <Reveal delay={0.1} className="lg:col-span-6">
          <Picture image="community" ratio="4/3" />
        </Reveal>
      </section>
      <section className="border-t border-line">
        <div className="container-x grid gap-px overflow-hidden rounded-card border border-line bg-line py-0 md:grid-cols-3">
          {page.highlights.map((h, i) => (
            <Reveal key={h.title} delay={i * 0.08} className="bg-ink p-8">
              <p className="label text-muted">0{i + 1}</p>
              <p className="mt-8 text-2xl font-bold tracking-tight">{h.title}</p>
              <p className="mt-4 text-sm leading-relaxed text-muted">{h.text}</p>
            </Reveal>
          ))}
        </div>
        <div className="h-24" />
      </section>
    </SiteShell>
  );
}
