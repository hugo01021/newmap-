import { Suspense } from "react";
import type { Metadata } from "next";
import { AuthPanel } from "@/components/auth/AuthPanel";
import { getI18n } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n();
  return { title: t.auth.login.tag, description: t.auth.login.text };
}

export default function ConnexionPage() {
  return (
    <Suspense fallback={null}>
      <AuthPanel mode="connexion" />
    </Suspense>
  );
}
