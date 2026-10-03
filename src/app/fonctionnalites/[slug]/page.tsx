import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteShell } from "@/components/layout/SiteShell";
import { features } from "@/lib/data/features";
import { Picture } from "@/components/ui/Picture";
import { Reveal } from "@/components/ui/Reveal";
import { Tag } from "@/components/ui/Tag";
import { PillButton } from "@/components/ui/PillButton";
import { ImageCard } from "@/components/ui/ImageCard";
import { ArrowLeft, Check } from "@/components/ui/Icons";

export function generateStaticParams() {
  return features.map((f) => ({ slug: f.slug }));
}

export async function generateMetadata({ params }: PageProps<"/fonctionnalites/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const f = features.find((x) => x.slug === slug);
  return f ? { title: f.title, description: f.intro } : {};
}

export default async function FeaturePage({ params }: PageProps<"/fonctionnalites/[slug]">) {
  const { slug } = await params;
  const feature = features.find((f) => f.slug === slug);
  if (!feature) notFound();
  const others = features.filter((f) => f.slug !== slug).slice(0, 3);

  return (
    <SiteShell>
      <section className="container-x pb-20 pt-20 sm:pt-28">
        <Link href="/fonctionnalites" className="label inline-flex items-center gap-2 text-muted transition-opacity hover:opacity-70">
          <ArrowLeft width={14} height={14} /> Toutes les fonctionnalités
        </Link>
        <div className="mt-10 grid gap-12 lg:grid-cols-12">
          <Reveal className="lg:col-span-5">
            <Tag>{feature.label}</Tag>
            <h1 className="display mt-6 text-5xl sm:text-7xl">{feature.title}</h1>
            <p className="mt-6 text-lg leading-relaxed text-muted">{feature.intro}</p>
            <ul className="mt-10 space-y-4 border-t border-line pt-8">
              {feature.points.map((p) => (
                <li key={p} className="flex items-start gap-3 text-[15px] text-white/90 sm:text-base">
                  <Check width={16} height={16} className="mt-1 shrink-0 text-muted" />
                  {p}
                </li>
              ))}
            </ul>
            <div className="mt-10">
              <PillButton href="/creer" size="lg">
                Créer mon serveur
              </PillButton>
            </div>
          </Reveal>
          <Reveal delay={0.1} className="lg:col-span-7">
            <Picture image={feature.image} ratio="4/3" priority />
          </Reveal>
        </div>
      </section>
      <section className="border-t border-line">
        <div className="container-x py-24">
          <p className="label text-muted">Voir aussi</p>
          <div className="mt-8 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-3">
            {others.map((f) => (
              <ImageCard key={f.slug} image={f.image} label={f.label} title={f.title} href={`/fonctionnalites/${f.slug}`} ratio="16/10" />
            ))}
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
