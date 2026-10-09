import { Suspense } from "react";
import type { Metadata } from "next";
import { AuthPanel } from "@/components/auth/AuthPanel";
import { getI18n } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n();
  return { title: t.auth.signup.tag, description: t.auth.signup.text };
}

export default function InscriptionPage() {
  return (
    <Suspense fallback={null}>
      <AuthPanel mode="inscription" />
    </Suspense>
  );
}
