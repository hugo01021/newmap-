"use client";

import { useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useWizard } from "@/lib/wizard-store";

/** Le parcours de création demande un compte : sinon, direction l'inscription, puis retour ici. */
export function RequireAccount({ children }: { children: React.ReactNode }) {
  const { state, hydrated } = useWizard();
  const router = useRouter();
  const pathname = usePathname();
  const search = useSearchParams();
  const missing = hydrated && !state.account;

  useEffect(() => {
    if (!missing) return;
    const query = search.toString();
    router.replace(`/inscription?next=${encodeURIComponent(pathname + (query ? `?${query}` : ""))}`);
  }, [missing, pathname, search, router]);

  if (!hydrated || missing) return null;
  return <>{children}</>;
}
