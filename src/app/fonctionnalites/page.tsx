import type { Metadata } from "next";
import { SiteShell } from "@/components/layout/SiteShell";
import { localizedFeatures } from "@/lib/data/features";
import { ImageCard } from "@/components/ui/ImageCard";
import { Reveal } from "@/components/ui/Reveal";
import { Tag } from "@/components/ui/Tag";
import { getI18n } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n();
  return { title: t.pages.featuresIndex.metaTitle, description: t.pages.featuresIndex.metaDescription };
}

export default async function FonctionnalitesPage() {
  const { t } = await getI18n();
  const features = localizedFeatures(t);
  return (
    <SiteShell>
      <section className="container-x pb-24 pt-20 sm:pt-28">
        <Reveal>
          <Tag>{t.pages.featuresIndex.tag}</Tag>
          <h1 className="display mt-6 max-w-4xl text-5xl sm:text-7xl">{t.pages.featuresIndex.title}</h1>
        </Reveal>
        <div className="mt-16 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-3 lg:gap-y-14">
          {features.map((f, i) => (
            <Reveal key={f.slug} delay={(i % 3) * 0.08}>
              <ImageCard image={f.image} label={f.label} title={f.title} href={`/fonctionnalites/${f.slug}`} ratio="16/10" />
            </Reveal>
          ))}
        </div>
      </section>
    </SiteShell>
  );
}
