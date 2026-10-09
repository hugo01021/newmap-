"use client";

import { cn } from "@/lib/cn";
import { images, type ImageKey, type SiteImage } from "@/lib/data/images";
import { useT } from "@/lib/i18n/client";

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
 * Le texte alternatif vient du dictionnaire (images).
 */
export function Picture({ image, className, imgClassName, priority, ratio, hover = true }: PictureProps) {
  const t = useT();
  const { src, position } = images[image] as SiteImage;
  const alt = t.images[image];
  return (
    <div
      className={cn("group relative overflow-hidden rounded-card bg-ink-2", className)}
      style={ratio ? { aspectRatio: ratio } : undefined}
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- photos et illustrations servies telles quelles depuis /public */}
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
        style={position ? { objectPosition: position } : undefined}
      />
    </div>
  );
}
