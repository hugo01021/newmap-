import Link from "next/link";
import { cn } from "@/lib/cn";
import { Picture } from "./Picture";
import type { ImageKey } from "@/lib/data/images";

interface ImageCardProps {
  image: ImageKey;
  label: string;
  title: string;
  href?: string;
  ratio?: string;
  className?: string;
  onClick?: () => void;
}

/** Carte image + petit libellé gris + titre blanc (méga-menu, « Ce qui est inclus »). */
export function ImageCard({ image, label, title, href, ratio = "4/3", className, onClick }: ImageCardProps) {
  const body = (
    <>
      <Picture image={image} ratio={ratio} />
      <div className="mt-3.5 space-y-1.5">
        <p className="label text-muted">{label}</p>
        <p className="text-[17px] font-bold tracking-tight text-white">{title}</p>
      </div>
    </>
  );
  const classes = cn("group block text-left", className);
  if (href) {
    return (
      <Link href={href} className={classes} onClick={onClick}>
        {body}
      </Link>
    );
  }
  return <div className={classes}>{body}</div>;
}
