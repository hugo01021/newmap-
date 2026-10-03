import { cn } from "@/lib/cn";

/** Étiquette blanche à texte noir, en majuscules. */
export function Tag({ children, className, tone = "white" }: { children: React.ReactNode; className?: string; tone?: "white" | "ghost" }) {
  return (
    <span
      className={cn(
        "label inline-flex items-center rounded-[3px] px-2.5 py-2",
        tone === "white" ? "bg-white text-ink" : "border border-line-2 text-white",
        className,
      )}
    >
      {children}
    </span>
  );
}
