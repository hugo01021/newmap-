import type { Metadata } from "next";
import { WizardShell } from "@/components/wizard/WizardShell";

export const metadata: Metadata = {
  title: "Créer mon serveur",
  robots: { index: false },
};

export default function CreerLayout({ children }: LayoutProps<"/creer">) {
  return <WizardShell>{children}</WizardShell>;
}
