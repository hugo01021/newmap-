import Link from "next/link";
import { cn } from "@/lib/cn";

export function Logo({ className, href = "/" }: { className?: string; href?: string }) {
  return (
    <Link href={href} className={cn("inline-flex items-center text-[19px] font-extrabold tracking-[-0.04em] text-white", className)} aria-label="ServCraft, accueil">
      ServCraft
    </Link>
  );
}
