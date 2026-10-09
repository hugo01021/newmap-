import { Suspense } from "react";
import type { Metadata } from "next";
import { WizardShell } from "@/components/wizard/WizardShell";
import { RequireAccount } from "@/components/wizard/RequireAccount";

export const metadata: Metadata = {
  title: "Créer mon serveur",
  robots: { index: false },
};

export default function CreerLayout({ children }: LayoutProps<"/creer">) {
  return (
    <WizardShell>
      <Suspense fallback={null}>
        <RequireAccount>{children}</RequireAccount>
      </Suspense>
    </WizardShell>
  );
}
