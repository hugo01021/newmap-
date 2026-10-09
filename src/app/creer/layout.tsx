import { Suspense } from "react";
import type { Metadata } from "next";
import { WizardShell } from "@/components/wizard/WizardShell";
import { RequireAccount } from "@/components/wizard/RequireAccount";
import { getI18n } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n();
  return { title: t.common.create, robots: { index: false } };
}

export default function CreerLayout({ children }: LayoutProps<"/creer">) {
  return (
    <WizardShell>
      <Suspense fallback={null}>
        <RequireAccount>{children}</RequireAccount>
      </Suspense>
    </WizardShell>
  );
}
