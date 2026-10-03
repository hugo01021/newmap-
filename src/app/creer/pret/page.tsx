import { redirect } from "next/navigation";

/** Ancienne adresse de l'étape finale : elle redirige vers le guide de mise en ligne. */
export default function PretPage() {
  redirect("/creer/mise-en-ligne");
}
