"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

const QUERY = "(pointer: fine)";
const subscribe = (cb: () => void) => {
  const mq = window.matchMedia(QUERY);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
};
const getFine = () => window.matchMedia(QUERY).matches;
const getServerFine = () => false;

type Kind = "idle" | "link" | "text";

const spring = { type: "spring", stiffness: 420, damping: 28 } as const;
const line = { position: "absolute", background: "#fff", borderRadius: 1 } as const;
const corner = { position: "absolute", width: 9, height: 9, borderColor: "#fff", borderStyle: "solid", borderWidth: 0 } as const;

/**
 * Curseur personnalisé (ordinateur uniquement) : un réticule fin.
 * Au repos, une petite croix ; sur un lien ou un bouton, quatre coins qui s'écartent
 * pour encadrer la cible ; dans un champ de texte, une barre verticale.
 */
export function Cursor() {
  const enabled = useSyncExternalStore(subscribe, getFine, getServerFine);
  const [kind, setKind] = useState<Kind>("idle");
  const [down, setDown] = useState(false);
  const [hidden, setHidden] = useState(true);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 600, damping: 45, mass: 0.5 });
  const sy = useSpring(y, { stiffness: 600, damping: 45, mass: 0.5 });

  useEffect(() => {
    if (!enabled) return;
    const root = document.documentElement;
    root.classList.add("has-cursor");

    const onMove = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setHidden(false);
      const target = e.target as HTMLElement | null;
      if (target?.closest("input, textarea, [contenteditable]")) setKind("text");
      else if (target?.closest("a, button, [role=button], [role=option], label, select, summary")) setKind("link");
      else setKind("idle");
    };
    const onDown = () => setDown(true);
    const onUp = () => setDown(false);
    const onLeave = () => setHidden(true);
    const onEnter = () => setHidden(false);
    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    root.addEventListener("mouseleave", onLeave);
    root.addEventListener("mouseenter", onEnter);
    return () => {
      root.classList.remove("has-cursor");
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      root.removeEventListener("mouseleave", onLeave);
      root.removeEventListener("mouseenter", onEnter);
    };
  }, [enabled, x, y]);

  if (!enabled) return null;

  const link = kind === "link";
  const text = kind === "text";
  // Demi-côté du cadre formé par les quatre coins.
  const d = link ? 20 : 5;
  // Longueur des branches de la croix (plus longues en mode texte, à la verticale).
  const v = text ? 9 : 7;
  const gap = 3;

  return (
    <motion.div aria-hidden className="pointer-events-none fixed left-0 top-0 z-[9999] mix-blend-difference" style={{ x: sx, y: sy }}>
      <motion.div animate={{ scale: down ? 0.78 : 1, opacity: hidden ? 0 : 1 }} transition={spring} className="relative">
        {/* Croix fine (repos) / barre verticale (texte) */}
        <motion.span style={{ ...line, width: 1, left: -0.5 }} animate={{ top: -(gap + v), height: v, opacity: link ? 0 : 1 }} transition={spring} />
        <motion.span style={{ ...line, width: 1, left: -0.5 }} animate={{ top: gap, height: v, opacity: link ? 0 : 1 }} transition={spring} />
        <motion.span style={{ ...line, height: 1, top: -0.5 }} animate={{ left: -(gap + v), width: v, opacity: link || text ? 0 : 1 }} transition={spring} />
        <motion.span style={{ ...line, height: 1, top: -0.5 }} animate={{ left: gap, width: v, opacity: link || text ? 0 : 1 }} transition={spring} />

        {/* Quatre coins qui encadrent la cible (lien, bouton) */}
        <motion.span style={{ ...corner, borderTopWidth: 1.5, borderLeftWidth: 1.5, borderTopLeftRadius: 3 }} animate={{ left: -d, top: -d, opacity: link ? 1 : 0 }} transition={spring} />
        <motion.span style={{ ...corner, borderTopWidth: 1.5, borderRightWidth: 1.5, borderTopRightRadius: 3 }} animate={{ left: d - 9, top: -d, opacity: link ? 1 : 0 }} transition={spring} />
        <motion.span style={{ ...corner, borderBottomWidth: 1.5, borderLeftWidth: 1.5, borderBottomLeftRadius: 3 }} animate={{ left: -d, top: d - 9, opacity: link ? 1 : 0 }} transition={spring} />
        <motion.span style={{ ...corner, borderBottomWidth: 1.5, borderRightWidth: 1.5, borderBottomRightRadius: 3 }} animate={{ left: d - 9, top: d - 9, opacity: link ? 1 : 0 }} transition={spring} />
      </motion.div>
    </motion.div>
  );
}
