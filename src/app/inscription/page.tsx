import { Suspense } from "react";
import type { Metadata } from "next";
import { AuthPanel } from "@/components/auth/AuthPanel";

export const metadata: Metadata = {
  title: "Inscription",
  description: "Crée ton compte ServCraft en trente secondes, puis décris ton serveur.",
};

export default function InscriptionPage() {
  return (
    <Suspense fallback={null}>
      <AuthPanel mode="inscription" />
    </Suspense>
  );
}
