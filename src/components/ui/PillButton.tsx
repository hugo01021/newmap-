"use client";

import Link from "next/link";
import { cn } from "@/lib/cn";
import type { ComponentProps, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost";
type Size = "md" | "lg" | "sm";

const base =
  "inline-flex items-center justify-center gap-2.5 rounded-full font-semibold tracking-tight transition-all duration-300 ease-out-expo select-none disabled:opacity-40 disabled:pointer-events-none whitespace-nowrap";

const variants: Record<Variant, string> = {
  primary: "bg-paper text-ink hover:bg-white hover:scale-[1.02] active:scale-[0.98]",
  secondary: "bg-ink-2/70 text-white border border-line-2 backdrop-blur hover:border-white/40 hover:bg-ink-3 hover:scale-[1.02] active:scale-[0.98]",
  ghost: "text-white hover:bg-white/5",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-6 text-[15px]",
  lg: "h-13 px-7 text-base",
};

interface CommonProps {
  variant?: Variant;
  size?: Size;
  icon?: ReactNode;
  iconRight?: ReactNode;
  className?: string;
  children: ReactNode;
}

type ButtonProps = CommonProps & Omit<ComponentProps<"button">, "className" | "children"> & { href?: undefined };
type LinkProps = CommonProps & Omit<ComponentProps<typeof Link>, "className" | "children"> & { href: string };

/** Bouton en forme de pilule. Devient un lien quand `href` est fourni. */
export function PillButton(props: ButtonProps | LinkProps) {
  const { variant = "primary", size = "md", icon, iconRight, className, children, ...rest } = props;
  const classes = cn(base, variants[variant], sizes[size], className);
  const content = (
    <>
      {icon && <span className="shrink-0 -ml-1">{icon}</span>}
      <span>{children}</span>
      {iconRight && <span className="shrink-0 -mr-1">{iconRight}</span>}
    </>
  );
  if ("href" in rest && rest.href !== undefined) {
    const { href, ...linkRest } = rest as LinkProps;
    return (
      <Link href={href} className={classes} {...(linkRest as Omit<ComponentProps<typeof Link>, "href">)}>
        {content}
      </Link>
    );
  }
  const buttonRest = rest as Omit<ComponentProps<"button">, "className" | "children">;
  return (
    <button type="button" className={classes} {...buttonRest}>
      {content}
    </button>
  );
}
