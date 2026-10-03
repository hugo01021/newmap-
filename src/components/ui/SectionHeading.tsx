import { cn } from "@/lib/cn";
import { Tag } from "./Tag";

interface SectionHeadingProps {
  tag?: string;
  title: React.ReactNode;
  text?: React.ReactNode;
  align?: "left" | "center";
  className?: string;
  size?: "md" | "lg";
}

export function SectionHeading({ tag, title, text, align = "left", className, size = "md" }: SectionHeadingProps) {
  return (
    <div className={cn("max-w-3xl", align === "center" && "mx-auto text-center", className)}>
      {tag && <Tag className="mb-6">{tag}</Tag>}
      <h2 className={cn("display text-white", size === "lg" ? "text-5xl sm:text-6xl lg:text-7xl" : "text-4xl sm:text-5xl lg:text-6xl")}>
        {title}
      </h2>
      {text && <p className={cn("mt-6 text-base leading-relaxed text-muted sm:text-lg", align === "center" && "mx-auto", "max-w-xl")}>{text}</p>}
    </div>
  );
}
