import type { SVGProps } from "react";

const d = (props: SVGProps<SVGSVGElement>) => ({
  width: 18,
  height: 18,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  ...props,
});

export const PlayIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg {...d(p)} fill="currentColor" stroke="none">
    <path d="M8 5.5v13l11-6.5z" />
  </svg>
);
export const ChevronDown = (p: SVGProps<SVGSVGElement>) => (
  <svg {...d(p)}>
    <path d="m6 9 6 6 6-6" />
  </svg>
);
export const ArrowRight = (p: SVGProps<SVGSVGElement>) => (
  <svg {...d(p)}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);
export const ArrowLeft = (p: SVGProps<SVGSVGElement>) => (
  <svg {...d(p)}>
    <path d="M19 12H5M11 6l-6 6 6 6" />
  </svg>
);
export const Check = (p: SVGProps<SVGSVGElement>) => (
  <svg {...d(p)}>
    <path d="m5 12 5 5L20 7" />
  </svg>
);
export const Globe = (p: SVGProps<SVGSVGElement>) => (
  <svg {...d(p)}>
    <circle cx="12" cy="12" r="9" />
    <path d="M3 12h18M12 3c3 3.5 3 14.5 0 18M12 3c-3 3.5-3 14.5 0 18" />
  </svg>
);
export const Copy = (p: SVGProps<SVGSVGElement>) => (
  <svg {...d(p)}>
    <rect x="9" y="9" width="11" height="11" rx="2" />
    <path d="M5 15V6a2 2 0 0 1 2-2h9" />
  </svg>
);
export const Discord = (p: SVGProps<SVGSVGElement>) => (
  <svg {...d(p)} fill="currentColor" stroke="none">
    <path d="M19.6 5.4A17 17 0 0 0 15.4 4l-.2.4a15 15 0 0 1 3.9 1.9 13.9 13.9 0 0 0-14.2 0A15 15 0 0 1 8.8 4.4L8.6 4a17 17 0 0 0-4.2 1.4C1.7 9.4 1 13.3 1.4 17.1a17 17 0 0 0 5.2 2.6l1.1-1.8a11 11 0 0 1-1.7-.8l.4-.3a12.2 12.2 0 0 0 11.2 0l.4.3c-.6.3-1.1.6-1.7.8l1.1 1.8a17 17 0 0 0 5.2-2.6c.5-4.4-.7-8.3-3-11.7ZM8.7 14.8c-1 0-1.9-1-1.9-2.1s.8-2.1 1.9-2.1 1.9 1 1.9 2.1-.8 2.1-1.9 2.1Zm6.6 0c-1 0-1.9-1-1.9-2.1s.8-2.1 1.9-2.1 1.9 1 1.9 2.1-.8 2.1-1.9 2.1Z" />
  </svg>
);
export const XLogo = (p: SVGProps<SVGSVGElement>) => (
  <svg {...d(p)} fill="currentColor" stroke="none">
    <path d="M17.5 3h3l-7.1 8.1L21.6 21h-6.4l-4.6-6-5.3 6H2.3l7.6-8.7L2 3h6.5l4.2 5.5L17.5 3Zm-1.1 16.2h1.7L7.7 4.7H5.9l10.5 14.5Z" />
  </svg>
);
export const YouTube = (p: SVGProps<SVGSVGElement>) => (
  <svg {...d(p)} fill="currentColor" stroke="none">
    <path d="M22.5 7.2a2.8 2.8 0 0 0-2-2C18.8 4.8 12 4.8 12 4.8s-6.8 0-8.5.4a2.8 2.8 0 0 0-2 2C1 8.9 1 12 1 12s0 3.1.5 4.8a2.8 2.8 0 0 0 2 2c1.7.4 8.5.4 8.5.4s6.8 0 8.5-.4a2.8 2.8 0 0 0 2-2c.5-1.7.5-4.8.5-4.8s0-3.1-.5-4.8ZM9.8 15V9l5.7 3-5.7 3Z" />
  </svg>
);
export const TikTok = (p: SVGProps<SVGSVGElement>) => (
  <svg {...d(p)} fill="currentColor" stroke="none">
    <path d="M16.5 2h-3.2v13.3a2.9 2.9 0 1 1-2.9-2.9c.3 0 .6 0 .9.1V9.3a6.1 6.1 0 1 0 5.2 6V8.7a7.3 7.3 0 0 0 4.3 1.4V6.9A4.4 4.4 0 0 1 16.5 2Z" />
  </svg>
);
export const Spark = (p: SVGProps<SVGSVGElement>) => (
  <svg {...d(p)}>
    <path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M5.6 18.4l2.8-2.8M15.6 8.4l2.8-2.8" />
  </svg>
);
export const Pencil = (p: SVGProps<SVGSVGElement>) => (
  <svg {...d(p)}>
    <path d="M4 20h4l10.5-10.5a2.1 2.1 0 0 0-3-3L5 17v3Z" />
    <path d="m13.5 6.5 3 3" />
  </svg>
);
export const Mail = (p: SVGProps<SVGSVGElement>) => (
  <svg {...d(p)}>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="m3 7 9 6 9-6" />
  </svg>
);
export const Users = (p: SVGProps<SVGSVGElement>) => (
  <svg {...d(p)}>
    <circle cx="9" cy="8" r="3.5" />
    <path d="M2.5 20a6.5 6.5 0 0 1 13 0M16 4.5a3.5 3.5 0 0 1 0 7M21.5 20a6.5 6.5 0 0 0-4-6" />
  </svg>
);
export const Send = (p: SVGProps<SVGSVGElement>) => (
  <svg {...d(p)}>
    <path d="M22 2 11 13M22 2l-7 20-4-9-9-4 20-7Z" />
  </svg>
);
export const X = (p: SVGProps<SVGSVGElement>) => (
  <svg {...d(p)}>
    <path d="M18 6 6 18M6 6l12 12" />
  </svg>
);
export const Menu = (p: SVGProps<SVGSVGElement>) => (
  <svg {...d(p)}>
    <path d="M4 7h16M4 12h16M4 17h16" />
  </svg>
);
export const Shield = (p: SVGProps<SVGSVGElement>) => (
  <svg {...d(p)}>
    <path d="M12 3 4 6v6c0 4.5 3.4 7.8 8 9 4.6-1.2 8-4.5 8-9V6l-8-3Z" />
  </svg>
);
export const Loader = (p: SVGProps<SVGSVGElement>) => (
  <svg {...d(p)} className={`animate-spin ${p.className ?? ""}`}>
    <path d="M12 3a9 9 0 1 0 9 9" />
  </svg>
);
