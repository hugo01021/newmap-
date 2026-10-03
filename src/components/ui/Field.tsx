import { cn } from "@/lib/cn";
import type { ComponentProps } from "react";

export function Input({ className, ...props }: ComponentProps<"input">) {
  return (
    <input
      {...props}
      className={cn(
        "h-11 w-full rounded-md border border-line bg-ink-2 px-4 text-[15px] text-white placeholder:text-muted-2 transition-colors focus:border-white/50",
        className,
      )}
    />
  );
}

export function Textarea({ className, ...props }: ComponentProps<"textarea">) {
  return (
    <textarea
      {...props}
      className={cn(
        "w-full resize-none rounded-md border border-line bg-ink-2 px-4 py-3 text-[15px] leading-relaxed text-white placeholder:text-muted-2 transition-colors focus:border-white/50",
        className,
      )}
    />
  );
}

export function FieldLabel({ children, className }: { children: React.ReactNode; className?: string }) {
  return <span className={cn("label block text-muted", className)}>{children}</span>;
}
