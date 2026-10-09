import { SiteShell } from "@/components/layout/SiteShell";
import { PillButton } from "@/components/ui/PillButton";
import { Tag } from "@/components/ui/Tag";
import { getI18n } from "@/lib/i18n/server";

export default async function NotFound() {
  const { t } = await getI18n();
  const page = t.pages.notFound;
  return (
    <SiteShell finalCta={false}>
      <section className="container-x flex min-h-[60vh] flex-col items-start justify-center py-24">
        <Tag>{page.tag}</Tag>
        <h1 className="display mt-6 text-5xl sm:text-7xl">{page.title}</h1>
        <p className="mt-6 max-w-md text-muted">{page.text}</p>
        <div className="mt-8 flex gap-3">
          <PillButton href="/">{page.home}</PillButton>
          <PillButton href="/creer" variant="secondary">
            {t.common.create}
          </PillButton>
        </div>
      </section>
    </SiteShell>
  );
}
