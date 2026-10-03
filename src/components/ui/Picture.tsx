import { cn } from "@/lib/cn";
import { images, type ImageKey } from "@/lib/data/images";

interface PictureProps {
  image: ImageKey;
  className?: string;
  imgClassName?: string;
  priority?: boolean;
  /** Ratio CSS, ex. "16/9". */
  ratio?: string;
  hover?: boolean;
}

/**
 * Image placée dans un cadre aux coins arrondis.
 * Les sources viennent de lib/data/images.ts : remplace les fichiers, pas le code.
 */
export function Picture({ image, className, imgClassName, priority, ratio, hover = true }: PictureProps) {
  const { src, alt } = images[image];
  return (
    <div
      className={cn("group relative overflow-hidden rounded-card bg-ink-2", className)}
      style={ratio ? { aspectRatio: ratio } : undefined}
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- placeholders SVG ; passe à next/image en remplaçant par des JPG */}
      <img
        src={src}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        className={cn(
          "h-full w-full object-cover transition-transform duration-700 ease-out-expo",
          hover && "group-hover:scale-[1.04]",
          imgClassName,
        )}
      />
    </div>
  );
}
