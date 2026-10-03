/**
 * Génère les illustrations du site dans /public/images (SVG vectoriels).
 * Style : nuit, néons, silhouettes noires, toute la couleur vient du ciel et des lumières.
 * Remplace n'importe quel fichier par ta propre image en gardant le même nom.
 *   node scripts/images.mjs
 */
import { writeFileSync, mkdirSync } from "node:fs";

const out = new URL("../public/images/", import.meta.url);
mkdirSync(out, { recursive: true });

const INK = "#07070b";
const rnd = (seed) => {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
};
const f = (n) => Math.round(n * 10) / 10;

/* ------------------------------------------------------------------ */
/* Primitives                                                          */
/* ------------------------------------------------------------------ */

const rect = (x, y, w, h, fill, o = {}) =>
  `<rect x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(h)}" fill="${fill}"${o.rx ? ` rx="${o.rx}"` : ""}${o.op != null ? ` opacity="${o.op}"` : ""}${o.filter ? ` filter="url(#${o.filter})"` : ""}${o.stroke ? ` stroke="${o.stroke}" stroke-width="${o.sw ?? 1}"` : ""}/>`;
const circle = (cx, cy, r, fill, o = {}) =>
  `<circle cx="${f(cx)}" cy="${f(cy)}" r="${f(r)}" fill="${fill}"${o.op != null ? ` opacity="${o.op}"` : ""}${o.filter ? ` filter="url(#${o.filter})"` : ""}${o.stroke ? ` stroke="${o.stroke}" stroke-width="${o.sw ?? 1}"` : ""}/>`;
const poly = (pts, fill, o = {}) =>
  `<polygon points="${pts.map(([x, y]) => `${f(x)},${f(y)}`).join(" ")}" fill="${fill}"${o.op != null ? ` opacity="${o.op}"` : ""}${o.filter ? ` filter="url(#${o.filter})"` : ""}/>`;
const path = (d, fill, o = {}) =>
  `<path d="${d}" fill="${fill}"${o.op != null ? ` opacity="${o.op}"` : ""}${o.filter ? ` filter="url(#${o.filter})"` : ""}${o.stroke ? ` stroke="${o.stroke}" stroke-width="${o.sw ?? 1}" stroke-linecap="round" stroke-linejoin="round"` : ""}/>`;
const text = (x, y, str, size, o = {}) =>
  `<text x="${f(x)}" y="${f(y)}" font-family="ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif" font-size="${size}" font-weight="${o.weight ?? 700}" fill="${o.fill ?? "#fff"}"${o.anchor ? ` text-anchor="${o.anchor}"` : ""}${o.op != null ? ` opacity="${o.op}"` : ""}${o.ls ? ` letter-spacing="${o.ls}"` : ""}>${str}</text>`;

/** Halo lumineux (cercle flouté). */
const glow = (cx, cy, r, color, op = 0.6, filter = "blurL") => circle(cx, cy, r, color, { op, filter });

/** Étoiles. */
function stars(w, h, n, r, x0 = 0, y0 = 0) {
  let s = "";
  for (let i = 0; i < n; i++) s += circle(x0 + r() * w, y0 + r() * h, 0.6 + r() * 1.6, "#fff", { op: 0.15 + r() * 0.6 });
  return s;
}

/** Montagnes lointaines. */
function mountains(w, baseY, maxH, r, fill, op = 1, x0 = 0) {
  const pts = [[x0 - 50, baseY]];
  let x = x0 - 50;
  while (x < x0 + w + 50) {
    x += 90 + r() * 160;
    pts.push([x, baseY - (0.25 + r() * 0.75) * maxH]);
  }
  pts.push([x0 + w + 100, baseY], [x0 + w + 100, baseY + 200], [x0 - 50, baseY + 200]);
  return poly(pts, fill, { op });
}

/** Ligne d'immeubles avec fenêtres allumées. */
function skyline(w, baseY, minH, maxH, r, { fill = INK, windows = 0.35, winColor = "#ffe1a8", gap = 8, op = 1, x0 = -20 } = {}) {
  let s = "";
  let x = x0;
  while (x < x0 + w + 20) {
    const bw = 40 + r() * 120;
    const bh = minH + r() * (maxH - minH);
    const top = baseY - bh;
    s += rect(x, top, bw, bh + 300, fill, { op });
    if (r() > 0.75) s += rect(x + bw / 2 - 2, top - 25 - r() * 40, 4, 60, fill, { op }); // antenne
    if (windows > 0) {
      const cols = Math.max(1, Math.floor((bw - 12) / 16));
      const rows = Math.max(1, Math.floor((bh - 14) / 20));
      for (let i = 0; i < cols; i++)
        for (let j = 0; j < rows; j++)
          if (r() < windows) s += rect(x + 8 + i * 16, top + 10 + j * 20, 7, 10, winColor, { op: 0.35 + r() * 0.65 });
    }
    x += bw + gap + r() * 24;
  }
  return s;
}

/** Palmier (silhouette). */
function palm(x, baseY, h, r, flip = 1) {
  const topX = x + flip * h * 0.12;
  const topY = baseY - h;
  let s = path(`M${f(x - h * 0.03)},${baseY} Q${f(x + flip * h * 0.05)},${f(baseY - h * 0.55)} ${f(topX)},${f(topY)} L${f(topX + flip * 6)},${f(topY)} Q${f(x + flip * h * 0.09)},${f(baseY - h * 0.55)} ${f(x + h * 0.035)},${baseY} Z`, INK);
  const n = 7;
  for (let i = 0; i < n; i++) {
    const a = -Math.PI * 0.95 + (i / (n - 1)) * Math.PI * 0.9 + (r() - 0.5) * 0.25;
    const len = h * (0.32 + r() * 0.16);
    const ex = topX + Math.cos(a) * len;
    const ey = topY + Math.sin(a) * len * 0.75 + len * 0.35;
    const cx = topX + Math.cos(a) * len * 0.55;
    const cy = topY + Math.sin(a) * len * 0.45 - len * 0.2;
    s += path(`M${f(topX)},${f(topY)} Q${f(cx)},${f(cy)} ${f(ex)},${f(ey)} Q${f(cx + 10 * flip)},${f(cy + 26)} ${f(topX)},${f(topY + 8)} Z`, INK);
  }
  return s;
}

/** Route en perspective vers l'horizon. */
function road(w, h, hx, hy, bottomL, bottomR, fill = "#0a0a0e") {
  let s = poly([[hx - 6, hy], [hx + 6, hy], [bottomR, h + 10], [bottomL, h + 10]], fill);
  for (let i = 0; i < 10; i++) {
    const t = (i + 0.5) / 10;
    const y = hy + t * t * (h - hy);
    const len = 4 + t * t * 70;
    const wd = 2 + t * t * 14;
    s += rect(hx - wd / 2, y, wd, len, "#fff", { op: 0.25 + t * 0.5 });
  }
  return s;
}

/** Voiture de profil. type : sedan | police | ambulance | van | tow */
function car(x, baseY, L, type = "sedan", o = {}) {
  const k = L / 100;
  const P = (pts) => pts.map(([px, py]) => [x + px * k, baseY + py * k]);
  let s = "";
  const body = o.fill ?? INK;
  const glass = o.glass ?? "#9fd3ff";
  if (type === "sedan" || type === "police") {
    s += poly(P([[0, 0], [0, -22], [6, -30], [30, -34], [43, -58], [78, -58], [93, -38], [100, -30], [100, 0]]), body);
    s += poly(P([[32, -35], [44, -55], [58, -55], [58, -35]]), glass, { op: 0.28 });
    s += poly(P([[61, -55], [77, -55], [89, -37], [61, -37]]), glass, { op: 0.28 });
    s += rect(x + 97 * k, baseY - 28 * k, 3 * k, 7 * k, "#ff3b3b", { op: 0.95 });
    s += rect(x, baseY - 28 * k, 3 * k, 7 * k, "#fff5c0", { op: 0.95 });
    if (type === "police") {
      s += rect(x + 46 * k, baseY - 66 * k, 13 * k, 7 * k, "#ff2a2a", { rx: 2 });
      s += rect(x + 61 * k, baseY - 66 * k, 13 * k, 7 * k, "#2a6cff", { rx: 2 });
      s += rect(x + 20 * k, baseY - 20 * k, 60 * k, 5 * k, "#fff", { op: 0.75 });
    }
  } else if (type === "ambulance") {
    s += poly(P([[0, 0], [0, -24], [5, -30], [26, -34], [34, -62], [100, -62], [100, 0]]), body);
    s += poly(P([[28, -36], [36, -58], [52, -58], [52, -36]]), glass, { op: 0.28 });
    s += rect(x + 62 * k, baseY - 54 * k, 24 * k, 24 * k, "#fff", { op: 0.9 });
    s += rect(x + 72 * k, baseY - 50 * k, 4 * k, 16 * k, "#e63946");
    s += rect(x + 66 * k, baseY - 44 * k, 16 * k, 4 * k, "#e63946");
    s += rect(x + 40 * k, baseY - 69 * k, 50 * k, 6 * k, "#ff2a2a", { rx: 2 });
    s += rect(x, baseY - 28 * k, 3 * k, 7 * k, "#fff5c0");
  } else if (type === "tow") {
    s += poly(P([[0, 0], [0, -22], [4, -28], [24, -32], [32, -58], [58, -58], [60, -32], [100, -32], [100, 0]]), body);
    s += poly(P([[27, -34], [34, -55], [48, -55], [48, -34]]), glass, { op: 0.28 });
    s += path(`M${f(x + 64 * k)},${f(baseY - 34 * k)} L${f(x + 92 * k)},${f(baseY - 70 * k)}`, "none", { stroke: body, sw: 5 * k });
    s += path(`M${f(x + 92 * k)},${f(baseY - 70 * k)} L${f(x + 96 * k)},${f(baseY - 50 * k)}`, "none", { stroke: "#f2c14e", sw: 2 * k });
    s += rect(x + 40 * k, baseY - 66 * k, 16 * k, 6 * k, "#ffb627", { rx: 2 });
  } else {
    s += poly(P([[0, 0], [0, -26], [6, -32], [20, -36], [28, -60], [100, -60], [100, 0]]), body);
    s += poly(P([[22, -38], [30, -56], [46, -56], [46, -38]]), glass, { op: 0.28 });
  }
  const wheelY = baseY - 2 * k;
  for (const wx of [21, 79]) {
    s += circle(x + wx * k, wheelY, 12 * k, body);
    s += circle(x + wx * k, wheelY, 5 * k, "#3a3a44");
  }
  return s;
}

/** Silhouette humaine debout. */
function figure(x, baseY, h, o = {}) {
  const r = h * 0.085;
  const fill = o.fill ?? INK;
  let s = circle(x, baseY - h + r, r, fill);
  s += path(`M${f(x - h * 0.16)},${f(baseY - h * 0.72)} Q${f(x)},${f(baseY - h * 0.84)} ${f(x + h * 0.16)},${f(baseY - h * 0.72)} L${f(x + h * 0.14)},${f(baseY - h * 0.38)} L${f(x - h * 0.14)},${f(baseY - h * 0.38)} Z`, fill);
  s += rect(x - h * 0.13, baseY - h * 0.4, h * 0.11, h * 0.4, fill);
  s += rect(x + h * 0.02, baseY - h * 0.4, h * 0.11, h * 0.4, fill);
  if (o.armUp) s += path(`M${f(x + h * 0.12)},${f(baseY - h * 0.7)} L${f(x + h * 0.26)},${f(baseY - h * 0.98)}`, "none", { stroke: fill, sw: h * 0.07 });
  return s;
}

/** Lampadaire avec halo. */
function lamp(x, baseY, h, color = "#ffd58a") {
  let s = rect(x - 3, baseY - h, 6, h, INK);
  s += path(`M${f(x)},${f(baseY - h)} L${f(x + 46)},${f(baseY - h)}`, "none", { stroke: INK, sw: 6 });
  s += rect(x + 34, baseY - h - 4, 26, 10, INK, { rx: 3 });
  s += glow(x + 47, baseY - h + 6, 60, color, 0.55, "blurM");
  s += poly([[x + 36, baseY - h + 4], [x + 58, baseY - h + 4], [x + 150, baseY], [x - 50, baseY]], color, { op: 0.08 });
  return s;
}

/** Maison moderne. */
function house(x, baseY, w, h, r, { win = "#ffe1a8", roof = "flat" } = {}) {
  let s = rect(x, baseY - h, w, h, INK);
  if (roof === "gable") s += poly([[x - 8, baseY - h], [x + w / 2, baseY - h - w * 0.32], [x + w + 8, baseY - h]], INK);
  else s += rect(x - 6, baseY - h - 8, w + 12, 10, INK);
  const cols = Math.floor((w - 20) / 34);
  for (let i = 0; i < cols; i++) {
    const lit = r() > 0.3;
    s += rect(x + 14 + i * 34, baseY - h + 18, 20, 26, win, { op: lit ? 0.9 : 0.15, rx: 1 });
  }
  s += rect(x + w - 34, baseY - 44, 20, 44, win, { op: 0.9, rx: 1 });
  return s;
}

/** Fenêtre d'interface (carte sombre). */
function uiCard(x, y, w, h, o = {}) {
  return rect(x, y, w, h, o.fill ?? "#0e0e11", { rx: o.rx ?? 16, stroke: o.stroke ?? "rgba(255,255,255,0.12)", sw: 1.5, op: o.op });
}
const bar = (x, y, w, h = 10, op = 0.5, fill = "#fff") => rect(x, y, w, h, fill, { rx: h / 2, op });
const toggle = (x, y, on) => rect(x, y, 44, 24, on ? "#fff" : "#2a2a30", { rx: 12 }) + circle(on ? x + 32 : x + 12, y + 12, 8, on ? "#111" : "#777");
const check = (x, y, s = 1, color = "#fff") => path(`M${f(x)},${f(y)} l${f(5 * s)},${f(5 * s)} l${f(9 * s)},${f(-10 * s)}`, "none", { stroke: color, sw: 2.4 * s });
const sparkle = (x, y, s, color = "#fff", op = 1) => path(`M${f(x)},${f(y - s)} Q${f(x)},${f(y)} ${f(x + s)},${f(y)} Q${f(x)},${f(y)} ${f(x)},${f(y + s)} Q${f(x)},${f(y)} ${f(x - s)},${f(y)} Q${f(x)},${f(y)} ${f(x)},${f(y - s)} Z`, color, { op });

/* ------------------------------------------------------------------ */
/* Document                                                            */
/* ------------------------------------------------------------------ */

function doc(w, h, [c1, c2, c3], body, { horizon = 0.62, grain = 0.5, extraDefs = "" } = {}) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
<defs>
  <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${c1}"/><stop offset="${horizon}" stop-color="${c2}"/><stop offset="1" stop-color="${c3}"/></linearGradient>
  <radialGradient id="vig" cx="0.5" cy="0.5" r="0.75"><stop offset="0.5" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity="0.55"/></radialGradient>
  <filter id="blurS" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="6"/></filter>
  <filter id="blurM" x="-80%" y="-80%" width="260%" height="260%"><feGaussianBlur stdDeviation="22"/></filter>
  <filter id="blurL" x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="70"/></filter>
  <filter id="grain"><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="1" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/><feComponentTransfer><feFuncA type="linear" slope="0.07"/></feComponentTransfer></filter>
  ${extraDefs}
</defs>
<rect width="${w}" height="${h}" fill="url(#bg)"/>
${body}
<rect width="${w}" height="${h}" filter="url(#grain)" opacity="${grain}"/>
<rect width="${w}" height="${h}" fill="url(#vig)"/>
</svg>`;
}

/* ------------------------------------------------------------------ */
/* Scènes                                                              */
/* ------------------------------------------------------------------ */

const scenes = {};

/* Hero : boulevard au coucher du soleil */
scenes["hero-accueil"] = () => {
  const w = 1920, h = 1080, r = rnd(11);
  let b = "";
  b += glow(1180, 640, 420, "#ff9a4a", 0.55);
  b += circle(1180, 640, 150, "#ffd38a");
  b += glow(1180, 640, 170, "#fff1c4", 0.7, "blurM");
  b += mountains(w, 700, 150, r, "#2b1830", 0.95);
  b += mountains(w, 720, 100, rnd(5), "#1b1020", 0.98);
  b += skyline(w, 740, 60, 240, r, { fill: "#120b16", windows: 0.2, winColor: "#ffd9a0", gap: 10 });
  b += rect(0, 740, w, 400, "#0c0a10");
  b += road(w, h, 1010, 745, 120, 1880, "#0b0b10");
  // voiture vue de dos sur la route
  b += path(`M1090,980 q0,-30 24,-34 l30,-60 q10,-18 36,-18 l220,0 q26,0 36,18 l30,60 q24,4 24,34 l0,40 l-400,0 Z`, INK);
  b += rect(1120, 940, 60, 14, "#ff3b3b", { rx: 4, filter: "blurS" });
  b += rect(1120, 940, 60, 14, "#ff5a5a", { rx: 4 });
  b += rect(1400, 940, 60, 14, "#ff3b3b", { rx: 4, filter: "blurS" });
  b += rect(1400, 940, 60, 14, "#ff5a5a", { rx: 4 });
  b += palm(170, 760, 640, r, 1);
  b += palm(380, 760, 460, r, -1);
  b += palm(1760, 760, 600, r, -1);
  b += palm(1580, 760, 400, r, 1);
  b += rect(0, 1000, w, 80, INK);
  return doc(w, h, ["#160b2a", "#7a2b3c", "#f4a24e"], b, { horizon: 0.58 });
};

/* Ville de nuit */
scenes["showcase-ville"] = () => {
  const w = 1600, h = 1000, r = rnd(21);
  let b = stars(w, 520, 140, r);
  b += glow(1220, 200, 160, "#dfe8ff", 0.35);
  b += circle(1220, 200, 62, "#f3f6ff");
  b += glow(800, 700, 700, "#1d5c9a", 0.5);
  b += skyline(w, 720, 120, 360, rnd(3), { fill: "#0c1222", windows: 0.3, winColor: "#9ed7ff", op: 0.9 });
  b += skyline(w, 790, 60, 300, rnd(9), { fill: INK, windows: 0.45, winColor: "#ffe1a8", x0: -40 });
  b += rect(0, 790, w, 210, "#060811");
  for (let i = 0; i < 40; i++) b += rect(r() * w, 795, 2 + r() * 4, 60 + r() * 140, r() > 0.5 ? "#ffe1a8" : "#9ed7ff", { op: 0.05 + r() * 0.18 });
  return doc(w, h, ["#040611", "#0a1a3a", "#1a4a7a"], b, { horizon: 0.7 });
};

/* Intervention de police */
scenes["showcase-police"] = () => {
  const w = 1600, h = 1000, r = rnd(31);
  let b = stars(w, 400, 60, r);
  b += skyline(w, 640, 100, 300, r, { fill: "#0d0f18", windows: 0.12, winColor: "#ffd9a0", op: 0.95 });
  b += rect(0, 640, w, 400, "#08080c");
  b += glow(520, 700, 320, "#ff2a2a", 0.55);
  b += glow(1060, 700, 320, "#2a6cff", 0.55);
  b += rect(0, 820, w, 6, "#fff", { op: 0.12 });
  b += car(380, 830, 820, "police", { fill: "#0a0a0f" });
  b += glow(1210, 605, 50, "#fff5c0", 0.9, "blurM");
  b += poly([[1200, 590], [1600, 520], [1600, 760]], "#fff5c0", { op: 0.06 });
  b += glow(760, 300, 60, "#ff2a2a", 0.35, "blurM");
  b += glow(880, 300, 60, "#2a6cff", 0.35, "blurM");
  return doc(w, h, ["#06070c", "#10141f", "#1b2238"], b);
};

/* Panel de gestion (contenu centré : l'accueil le recadre en portrait) */
scenes["showcase-panel"] = () => {
  const w = 1600, h = 1000, X = 420, W = 760, Y = 50;
  let b = glow(800, 500, 600, "#2a2a34", 0.6);
  b += uiCard(X, Y, W, 900);
  b += circle(X + 40, Y + 52, 6, "#fff");
  b += text(X + 56, Y + 58, "EN LIGNE", 12, { ls: 2.5, op: 0.9 });
  b += text(X + 32, Y + 112, "Los Santos Legacy", 40, { weight: 800 });
  b += text(X + W - 32, Y + 52, "JOUEURS", 11, { ls: 2.5, op: 0.6, anchor: "end" });
  b += text(X + W - 32, Y + 86, "27 / 64", 26, { weight: 800, anchor: "end" });
  b += text(X + W - 32, Y + 118, "DISCORD · 249", 13, { weight: 600, op: 0.7, anchor: "end" });
  const tabs = ["VUE D'ENSEMBLE", "GAMEPLAY", "JOBS", "ÉCONOMIE", "DISCORD"];
  let tx = X + 32;
  tabs.forEach((t, i) => {
    b += text(tx, Y + 176, t, 12, { ls: 2, op: i === 0 ? 1 : 0.5 });
    if (i === 0) b += rect(tx, Y + 188, t.length * 9.2, 2, "#fff");
    tx += t.length * 9.2 + 30;
  });
  b += rect(X + 32, Y + 204, W - 64, 1, "#fff", { op: 0.12 });
  const tiles = [["JOUEURS CONNECTÉS", "27 / 64"], ["MEMBRES DISCORD", "249"], ["DISPONIBILITÉ", "100 %"], ["DERNIÈRE SAUVEGARDE", "14:03"]];
  tiles.forEach(([l, v], i) => {
    const x = X + 32 + (i % 2) * 356, y = Y + 228 + Math.floor(i / 2) * 100;
    b += uiCard(x, y, 340, 84, { fill: "#131317", rx: 12 });
    b += text(x + 18, y + 30, l, 10, { ls: 2, op: 0.6 });
    b += text(x + 18, y + 66, v, 26, { weight: 800 });
  });
  b += uiCard(X + 32, Y + 440, W - 64, 232, { fill: "#131317", rx: 12 });
  b += text(X + 50, Y + 472, "JOBS ET SALAIRES", 10, { ls: 2, op: 0.6 });
  ["Police", "EMS", "Mécano", "Avocat"].forEach((j, i) => {
    const y = Y + 492 + i * 46;
    b += toggle(X + 50, y, i < 3);
    b += text(X + 108, y + 17, j, 15, { weight: 600, op: i < 3 ? 1 : 0.45 });
    b += rect(X + W - 190, y - 3, 110, 30, "#1d1d22", { rx: 6 });
    b += text(X + W - 92, y + 17, ["2 400", "2 100", "1 700", "2 600"][i], 14, { anchor: "end", weight: 600 });
    if (i < 3) b += rect(X + 50, y + 38, W - 100, 1, "#fff", { op: 0.08 });
  });
  b += uiCard(X + 32, Y + 692, W - 64, 186, { fill: "#131317", rx: 12 });
  b += circle(X + 62, Y + 724, 11, "#fff");
  b += sparkle(X + 62, Y + 724, 5.5, "#111");
  b += text(X + 82, Y + 729, "IA DE GESTION", 10, { ls: 2, op: 0.6 });
  b += rect(X + W - 392, Y + 708, 340, 34, "#fff", { rx: 12 });
  b += text(X + W - 222, Y + 730, "Divise le salaire des policiers par 2", 13, { fill: "#111", anchor: "middle", weight: 600 });
  b += text(X + 50, Y + 782, "Salaire Police divisé par 2", 18, { weight: 800 });
  b += check(X + 52, Y + 802, 0.8, "#9a9a9a");
  b += bar(X + 74, Y + 798, 300, 9, 0.5);
  b += rect(X + 50, Y + 826, 88, 32, "#fff", { rx: 16 });
  b += text(X + 94, Y + 847, "Publier", 13, { fill: "#111", anchor: "middle", weight: 700 });
  b += rect(X + 148, Y + 826, 88, 32, "#0e0e11", { rx: 16, stroke: "rgba(255,255,255,0.25)", sw: 1 });
  b += text(X + 192, Y + 847, "Annuler", 13, { anchor: "middle", weight: 700 });
  return doc(w, h, ["#09090b", "#0f0f12", "#17171b"], b, { grain: 0.35 });
};

/* Discord généré. variant 1 : composition centrée (recadrage portrait) ; 2 : large avec rôles */
function discordUI(w, h, variant) {
  const { X, Y, W, H, sv, ch } = variant === 1 ? { X: 420, Y: 50, W: 760, H: 900, sv: 70, ch: 200 } : { X: 120, Y: 90, W: 1360, H: 840, sv: 92, ch: 300 };
  let b = glow(800, 500, 620, "#3b3f9a", 0.5);
  b += uiCard(X, Y, W, H, { fill: "#101222" });
  b += rect(X, Y, sv, H, "#0b0c18", { rx: 16 });
  const sr = sv * 0.25;
  for (let i = 0; i < 7; i++) b += circle(X + sv / 2, Y + 58 + i * sr * 3, i === 0 ? sr * 1.1 : sr, i === 0 ? "#fff" : "#262a4a");
  b += text(X + sv / 2, Y + 58 + sr * 0.4, "S", sr * 1.1, { fill: "#101222", anchor: "middle", weight: 800 });
  b += rect(X + sv, Y, ch, H, "#131530");
  b += text(X + sv + 22, Y + 46, "Los Santos Legacy", variant === 1 ? 14 : 17, { weight: 800 });
  b += rect(X + sv, Y + 66, ch, 1, "#fff", { op: 0.1 });
  const chans = variant === 2
    ? ["INFOS", "# accueil", "# règlement", "# annonces", "CANDIDATURES", "# whitelist", "# résultats", "JOBS", "# police", "# ems", "# mécano", "GANGS", "# ballas", "# vagos"]
    : ["BIENVENUE", "# accueil", "# règlement", "# annonces", "COMMUNAUTÉ", "# général", "# clips", "# suggestions", "JOBS", "# police", "# ems", "# mécano", "SUPPORT", "# tickets", "# statut", "STAFF", "# logs"];
  chans.forEach((c, i) => {
    const y = Y + 100 + i * (variant === 1 ? 46 : 46);
    if (y > Y + H - 40) return;
    const head = !c.startsWith("#");
    b += text(X + sv + 22, y, c, head ? 10 : 14, { weight: head ? 700 : 500, op: head ? 0.45 : i === 1 ? 1 : 0.7, ls: head ? 2 : 0 });
    if (i === 1) b += rect(X + sv + 10, y - 23, ch - 20, 34, "#fff", { rx: 6, op: 0.08 });
  });
  const mx = X + sv + ch + 28, mw = W - sv - ch - 56;
  b += text(mx, Y + 46, "# accueil", 18, { weight: 800 });
  b += rect(mx - 28, Y + 66, mw + 56, 1, "#fff", { op: 0.1 });
  const colors = ["#f2c14e", "#5b8def", "#e06c9f", "#4ecdc4", "#fff", "#f2c14e", "#5b8def"];
  const n = variant === 1 ? 7 : 5, step = variant === 1 ? 108 : 118;
  for (let i = 0; i < n; i++) {
    const y = Y + 100 + i * step;
    b += circle(mx + 22, y + 18, 20, colors[i]);
    b += bar(mx + 58, y + 6, mw * 0.22 + (i % 3) * 20, 12, 0.9);
    b += bar(mx + 58 + mw * 0.22 + (i % 3) * 20 + 12, y + 8, 46, 8, 0.3);
    b += bar(mx + 58, y + 32, mw * (0.55 + ((i * 37) % 35) / 100), 10, 0.55);
    b += bar(mx + 58, y + 52, mw * (0.4 + ((i * 53) % 40) / 100), 10, 0.45);
    if (i === 2) b += rect(mx + 58, y + 72, 250, 22, "#fff", { rx: 11, op: 0.12 }) + text(mx + 183, y + 87, "Serveur en ligne · 27 / 64", 11, { anchor: "middle", weight: 600 });
  }
  b += rect(mx, Y + H - 70, mw, 46, "#1a1c3a", { rx: 10 });
  b += bar(mx + 20, Y + H - 52, mw * 0.3, 10, 0.3);
  if (variant === 2) {
    b += uiCard(X + W - 340, Y + 110, 300, 240, { fill: "#0b0c18", rx: 12 });
    b += text(X + W - 320, Y + 142, "RÔLES", 11, { ls: 2, op: 0.6 });
    ["Fondateur", "Staff", "Police", "EMS", "Citoyen"].forEach((rl, i) => {
      b += circle(X + W - 310, Y + 172 + i * 34, 6, colors[i]);
      b += text(X + W - 292, Y + 177 + i * 34, rl, 15, { weight: 600, op: 0.85 });
    });
  }
  return doc(w, h, ["#0b0c1c", "#171a3a", "#2f3488"], b, { grain: 0.35 });
}
scenes["showcase-discord"] = () => discordUI(1600, 1000, 1);
scenes["feature-discord"] = () => discordUI(1600, 1000, 2);

/* Serveur de jeu : baies de serveurs */
scenes["feature-serveur"] = () => {
  const w = 1600, h = 1000, r = rnd(41);
  let b = glow(800, 560, 560, "#1dbfae", 0.4);
  b += rect(0, 860, w, 140, "#06100f");
  for (let k = 0; k < 3; k++) {
    const x = 330 + k * 340, y = 180, rw = 280, rh = 690;
    b += rect(x, y, rw, rh, "#0b1416", { rx: 10, stroke: "rgba(255,255,255,0.14)", sw: 2 });
    for (let i = 0; i < 14; i++) {
      const uy = y + 22 + i * 47;
      b += rect(x + 18, uy, rw - 36, 38, "#0f1b1e", { rx: 4, stroke: "rgba(255,255,255,0.07)", sw: 1 });
      const on = r() > 0.25;
      b += circle(x + 40, uy + 19, 5, on ? "#3df2c0" : "#1f3a3a");
      if (on) b += glow(x + 40, uy + 19, 12, "#3df2c0", 0.7, "blurS");
      b += circle(x + 58, uy + 19, 4, r() > 0.6 ? "#f2c14e" : "#1f3a3a");
      for (let j = 0; j < 6; j++) b += rect(x + 90 + j * 26, uy + 10, 18, 18, "#15282b", { rx: 2 });
      b += rect(x + rw - 74, uy + 15, 44, 8, "#1b3538", { rx: 4 });
    }
    b += rect(x + 40, y + rh, rw - 80, 20, "#0a1213");
    b += rect(x, 862, rw, 60, "#1dbfae", { op: 0.12, filter: "blurM" });
  }
  return doc(w, h, ["#04100f", "#0a2a2b", "#0f5a57"], b, { horizon: 0.75 });
};

/* Jobs : police, ambulance, dépanneuse */
scenes["feature-jobs"] = () => {
  const w = 1600, h = 1000, r = rnd(51);
  let b = glow(800, 300, 500, "#ffb347", 0.35);
  b += skyline(w, 600, 80, 240, r, { fill: "#1a1309", windows: 0.15, winColor: "#ffe1a8", op: 0.95 });
  b += rect(0, 600, w, 400, "#0c0906");
  b += rect(0, 606, w, 3, "#fff", { op: 0.1 });
  b += lamp(120, 760, 420, "#ffd58a");
  b += lamp(1470, 760, 420, "#ffd58a");
  b += glow(360, 700, 220, "#ff2a2a", 0.3);
  b += glow(560, 700, 220, "#2a6cff", 0.3);
  b += rect(0, 755, w, 5, "#fff", { op: 0.15 });
  b += car(120, 760, 420, "police");
  b += car(590, 760, 420, "ambulance");
  b += car(1060, 760, 420, "tow");
  for (let i = 0; i < 12; i++) b += rect(60 + i * 130, 880, 60, 6, "#fff", { op: 0.25 });
  return doc(w, h, ["#15100a", "#4a3312", "#d0902a"], b, { horizon: 0.6 });
};

/* Économie : courbe, barres, pièces */
scenes["feature-economie"] = () => {
  const w = 1600, h = 1000;
  let b = glow(900, 520, 560, "#2ecc71", 0.35);
  for (let x = 0; x <= w; x += 100) b += rect(x, 0, 1, h, "#fff", { op: 0.05 });
  for (let y = 0; y <= h; y += 100) b += rect(0, y, w, 1, "#fff", { op: 0.05 });
  const heights = [180, 230, 210, 300, 340, 320, 420, 470, 520, 600];
  heights.forEach((bh, i) => {
    const x = 300 + i * 112;
    b += rect(x, 860 - bh, 80, bh, INK, { rx: 6 });
    b += rect(x, 860 - bh, 80, 6, "#7dffb0", { rx: 3, op: 0.9 });
  });
  const pts = heights.map((bh, i) => [340 + i * 112, 860 - bh - 40]);
  b += path("M" + pts.map(([x, y]) => `${x},${y}`).join(" L"), "none", { stroke: "#fff", sw: 4 });
  pts.forEach(([x, y]) => (b += circle(x, y, 7, "#fff")));
  b += path(`M${pts[8][0]},${pts[8][1]} L${pts[9][0] + 60},${pts[9][1] - 50}`, "none", { stroke: "#fff", sw: 4 });
  b += path(`M${pts[9][0] + 30},${pts[9][1] - 52} L${pts[9][0] + 62},${pts[9][1] - 52} L${pts[9][0] + 62},${pts[9][1] - 20}`, "none", { stroke: "#fff", sw: 4 });
  // pièces
  for (let s = 0; s < 3; s++) {
    const cx = 160 + s * 90, n = 5 + s * 3;
    for (let i = 0; i < n; i++) {
      const cy = 900 - i * 14;
      if (i !== n - 1) b += rect(cx - 44, cy - 14, 88, 14, "#b58a22");
      b += path(`M${cx - 44},${cy} a44,14 0 1 0 88,0 a44,14 0 1 0 -88,0`, i === n - 1 ? "#f6d365" : "#d7a93a");
    }
    b += text(cx, 900 - (n - 1) * 14 + 6, "€", 16, { fill: "#6b4e0b", anchor: "middle", weight: 800 });
  }
  b += rect(0, 904, w, 96, "#07130b");
  return doc(w, h, ["#06120a", "#103a1e", "#2f9b52"], b, { horizon: 0.7 });
};

/* Site web du serveur */
scenes["feature-site"] = () => {
  const w = 1600, h = 1000, r = rnd(71);
  let b = glow(800, 500, 600, "#ff7b5c", 0.35);
  b += uiCard(200, 110, 1200, 800, { fill: "#0f0d0e" });
  b += rect(200, 110, 1200, 56, "#17141a", { rx: 16 });
  b += rect(200, 150, 1200, 16, "#17141a");
  [0, 1, 2].forEach((i) => (b += circle(232 + i * 22, 138, 6, "#fff", { op: 0.35 })));
  b += rect(320, 126, 520, 24, "#0f0d0e", { rx: 12 });
  b += text(340, 143, "los-santos-legacy.servcraft.gg", 12, { op: 0.6, weight: 500 });
  // mini hero
  b += rect(200, 166, 1200, 380, "url(#mini)");
  b += glow(1000, 480, 200, "#ff9a4a", 0.6);
  b += circle(1000, 480, 60, "#ffd38a");
  b += mountains(1200, 500, 70, rnd(2), "#1a0f1a", 1, 200);
  b += skyline(1200, 520, 30, 120, rnd(8), { fill: "#120b16", windows: 0.2, x0: 200 });
  b += rect(200, 520, 1200, 26, "#0f0d0e");
  b += rect(0, 166, 200, 400, "#0f0d0e");
  b += rect(1400, 166, 200, 400, "#0f0d0e");
  b += palm(280, 530, 260, r, 1);
  b += palm(1320, 530, 230, r, -1);
  b += rect(260, 240, 150, 24, "#fff", { rx: 3 });
  b += text(335, 257, "SERVEUR RP", 11, { fill: "#111", anchor: "middle", ls: 2 });
  b += text(260, 330, "Los Santos Legacy", 52, { weight: 800 });
  b += text(260, 380, "Une ville qui vit, même quand tu dors.", 20, { weight: 500, op: 0.8 });
  b += rect(260, 420, 170, 46, "#fff", { rx: 23 });
  b += text(345, 450, "Rejoindre", 16, { fill: "#111", anchor: "middle" });
  b += rect(446, 420, 150, 46, "#0f0d0e", { rx: 23, stroke: "rgba(255,255,255,0.35)", sw: 1.5, op: 0.9 });
  b += text(521, 450, "Discord", 16, { anchor: "middle" });
  // sections
  [0, 1, 2].forEach((i) => {
    const x = 260 + i * 380;
    b += rect(x, 600, 340, 150, "#1b1618", { rx: 12 });
    b += text(x + 20, 640, ["JOBS", "RÈGLEMENT", "WHITELIST"][i], 11, { ls: 2, op: 0.6 });
    b += bar(x + 20, 664, 220 + i * 30, 12, 0.8);
    b += bar(x + 20, 690, 260, 9, 0.35);
    b += bar(x + 20, 710, 200, 9, 0.35);
  });
  b += rect(260, 790, 1080, 1, "#fff", { op: 0.1 });
  b += bar(260, 820, 160, 8, 0.3);
  b += bar(1180, 820, 160, 8, 0.3);
  const extraDefs = `<linearGradient id="mini" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1a0d2a"/><stop offset="0.7" stop-color="#7a2b3c"/><stop offset="1" stop-color="#f4a24e"/></linearGradient>`;
  return doc(w, h, ["#170f10", "#4a1f22", "#e87a60"], b, { grain: 0.35, extraDefs });
};

/* IA de gestion */
scenes["feature-ia"] = () => {
  const w = 1600, h = 1000, r = rnd(81);
  let b = glow(800, 480, 600, "#8b6ad6", 0.45);
  for (let i = 0; i < 26; i++) b += sparkle(r() * w, r() * h, 4 + r() * 14, "#e9ddff", 0.25 + r() * 0.6);
  b += rect(860, 150, 540, 64, "#fff", { rx: 24 });
  b += text(1130, 191, "Ajoute un braquage de banque", 20, { fill: "#111", anchor: "middle", weight: 600 });
  b += uiCard(200, 260, 1000, 560, { fill: "#0f0d16" });
  b += circle(250, 310, 18, "#fff");
  b += sparkle(250, 310, 9, "#111");
  b += text(282, 316, "IA SERVCRAFT · GAMEPLAY", 12, { ls: 2.5, op: 0.6 });
  b += rect(1010, 292, 150, 34, "#0f0d16", { rx: 4, stroke: "rgba(255,255,255,0.35)", sw: 1.2 });
  b += text(1085, 315, "IMPACT IMPORTANT", 11, { anchor: "middle", ls: 1.5 });
  b += text(240, 390, "Nouveau braquage de banque", 38, { weight: 800 });
  b += bar(240, 416, 760, 10, 0.4);
  b += bar(240, 438, 600, 10, 0.4);
  b += rect(240, 480, 920, 1, "#fff", { op: 0.12 });
  ["Braquage de banque activé", "Condition : 4 policiers minimum en service", "Butin : 45 000 à 80 000 €", "Recharge : 2 heures"].forEach((l, i) => {
    b += check(244, 512 + i * 44, 1, "#9a8fc0");
    b += text(276, 522 + i * 44, l, 18, { weight: 500, op: 0.9 });
  });
  b += rect(240, 720, 150, 52, "#fff", { rx: 26 });
  b += text(315, 753, "Publier", 18, { fill: "#111", anchor: "middle" });
  b += rect(406, 720, 150, 52, "#0f0d16", { rx: 26, stroke: "rgba(255,255,255,0.3)", sw: 1.5 });
  b += text(481, 753, "Annuler", 18, { anchor: "middle" });
  b += glow(1300, 560, 80, "#c9a6ff", 0.8, "blurM");
  b += sparkle(1300, 560, 40, "#fff", 0.9);
  b += sparkle(1380, 460, 18, "#fff", 0.7);
  b += sparkle(1250, 680, 24, "#fff", 0.6);
  return doc(w, h, ["#0b0914", "#241a44", "#6d4fc2"], b, { grain: 0.35 });
};

/* Gangs : rue la nuit, mur taggué, silhouettes */
scenes["inclus-gangs"] = () => {
  const w = 1600, h = 1000, r = rnd(91);
  let b = stars(w, 300, 40, r);
  b += skyline(w, 520, 60, 220, r, { fill: "#140a12", windows: 0.1, winColor: "#ffb3d1", op: 0.95 });
  b += rect(0, 520, w, 300, "#1c1016");
  for (let j = 0; j < 11; j++) {
    const y = 520 + j * 27;
    b += rect(0, y, w, 2, "#000", { op: 0.35 });
    for (let x = (j % 2) * 36; x < w; x += 72) b += rect(x, y, 2, 27, "#000", { op: 0.3 });
  }
  b += rect(0, 520, w, 6, "#2a1a22");
  // tags à la bombe : halo flou + trait épais
  const tagCols = ["#ff4fa3", "#9b5cff", "#4fd5ff", "#ffd54f"];
  for (let i = 0; i < 6; i++) {
    const x = 90 + i * 250 + r() * 50, y = 590 + r() * 90, s = 90 + r() * 80, c = tagCols[i % 4];
    b += circle(x + s * 0.3, y + 20, s * 0.45, c, { op: 0.35, filter: "blurM" });
    b += path(`M${f(x)},${f(y + 30)} c${f(s * 0.2)},${f(-s * 0.5)} ${f(s * 0.45)},${f(-s * 0.2)} ${f(s * 0.5)},${f(s * 0.05)} s${f(s * 0.3)},${f(s * 0.4)} ${f(s * 0.55)},${f(-s * 0.1)}`, "none", { stroke: c, sw: 12, op: 0.85 });
    b += path(`M${f(x + s * 0.1)},${f(y + 60)} l${f(s * 0.7)},${f(-s * 0.15)}`, "none", { stroke: "#fff", sw: 5, op: 0.5 });
    for (let d = 0; d < 3; d++) b += rect(x + s * 0.2 + d * s * 0.22, y + 40 + d * 6, 4, 16 + r() * 30, c, { op: 0.7 });
  }
  b += rect(0, 820, w, 180, "#09060a");
  b += glow(400, 650, 260, "#ff4fa3", 0.3);
  b += lamp(1380, 820, 380, "#ff8fc8");
  b += car(900, 822, 480, "sedan", { glass: "#ff9ad0" });
  [[260, 330], [330, 360], [420, 340], [500, 370], [590, 320]].forEach(([x, hh]) => (b += figure(x, 822, hh)));
  return doc(w, h, ["#120812", "#3c1230", "#b83a7a"], b, { horizon: 0.55 });
};

/* Immobilier : villas sur les collines */
scenes["inclus-immobilier"] = () => {
  const w = 1600, h = 1000, r = rnd(101);
  let b = glow(1150, 420, 360, "#ffb86b", 0.5);
  b += circle(1150, 420, 90, "#ffe0a8");
  b += mountains(w, 560, 140, r, "#2a2016", 0.9);
  b += mountains(w, 600, 90, rnd(4), "#1b150f");
  b += rect(0, 600, w, 400, "#120e09");
  b += house(140, 700, 300, 160, r);
  b += house(500, 700, 240, 120, r, { roof: "gable" });
  b += house(820, 700, 360, 200, r);
  b += house(1240, 700, 260, 140, r, { roof: "gable" });
  b += rect(0, 700, w, 300, "#0d0a06");
  b += path("M860,760 a90,28 0 1 0 180,0 a90,28 0 1 0 -180,0", "#7fd4ff", { op: 0.75 });
  b += path("M860,760 a90,28 0 1 0 180,0 a90,28 0 1 0 -180,0", "#bfe9ff", { op: 0.35, filter: "blurS" });
  b += palm(70, 760, 300, r, 1);
  b += palm(780, 760, 240, r, -1);
  b += palm(1540, 760, 330, r, -1);
  b += rect(1120, 720, 4, 60, "#fff", { op: 0.8 });
  b += rect(1080, 700, 84, 30, "#fff", { rx: 3 });
  b += text(1122, 720, "À VENDRE", 10, { fill: "#111", anchor: "middle", ls: 1 });
  for (let i = 0; i < 10; i++) b += rect(60 + i * 160, 900, 70, 5, "#fff", { op: 0.18 });
  return doc(w, h, ["#17110b", "#4a3620", "#dfb270"], b, { horizon: 0.6 });
};

/* Braquages : porte de coffre */
scenes["inclus-braquages"] = () => {
  const w = 1600, h = 1000;
  let b = poly([[0, 0], [700, 0], [1100, 1000], [0, 1000]], "#fff", { op: 0.05 });
  b += glow(820, 500, 420, "#f2b632", 0.45);
  b += circle(820, 500, 330, "#17150f", { stroke: "#2b2718", sw: 10 });
  b += circle(820, 500, 300, "#1f1c13");
  for (let i = 0; i < 16; i++) {
    const a = (i / 16) * Math.PI * 2;
    b += circle(820 + Math.cos(a) * 316, 500 + Math.sin(a) * 316, 9, "#5a5240");
  }
  b += circle(820, 500, 250, "#14120c", { stroke: "#3a3524", sw: 4 });
  b += circle(820, 500, 150, "#1f1c13", { stroke: "#4a4330", sw: 4 });
  b += circle(820, 500, 118, "none", { stroke: "#c9a74a", sw: 10 });
  for (let i = 0; i < 3; i++) {
    const a = (i / 3) * Math.PI * 2 - Math.PI / 2;
    b += path(`M820,500 L${f(820 + Math.cos(a) * 120)},${f(500 + Math.sin(a) * 120)}`, "none", { stroke: "#c9a74a", sw: 12 });
  }
  b += circle(820, 500, 28, "#e2c25e");
  b += circle(820, 500, 10, "#6b5a1f");
  b += rect(1160, 440, 80, 120, "#2a2518", { rx: 8 });
  b += rect(1178, 470, 44, 12, "#c9a74a", { rx: 2 });
  b += rect(1178, 500, 44, 12, "#c9a74a", { rx: 2 });
  b += rect(0, 830, w, 170, "#0a0906");
  b += rect(560, 826, 520, 8, "#2a2518");
  return doc(w, h, ["#0b0b0a", "#2a2010", "#c99a2a"], b, { horizon: 0.65 });
};

/* Sauvegardes : bouclier et bases de données */
scenes["inclus-sauvegardes"] = () => {
  const w = 1600, h = 1000;
  let b = glow(800, 500, 560, "#3b8fd4", 0.4);
  for (let x = 0; x <= w; x += 100) b += rect(x, 0, 1, h, "#fff", { op: 0.05 });
  for (let y = 0; y <= h; y += 100) b += rect(0, y, w, 1, "#fff", { op: 0.05 });
  const cyl = (cx, cy, rx, ry, hh, fill, top) => {
    let s = path(`M${cx - rx},${cy} a${rx},${ry} 0 1 0 ${rx * 2},0 v${hh} a${rx},${ry} 0 1 1 ${-rx * 2},0 Z`, fill);
    s += path(`M${cx - rx},${cy} a${rx},${ry} 0 1 0 ${rx * 2},0 a${rx},${ry} 0 1 0 ${-rx * 2},0`, top);
    return s;
  };
  for (let i = 0; i < 3; i++) b += cyl(330, 420 + i * 120, 150, 40, 70, INK, "#1b2d44");
  for (let i = 0; i < 3; i++) b += cyl(1270, 460 + i * 120, 130, 36, 64, INK, "#1b2d44");
  for (let i = 0; i < 3; i++) b += circle(430, 450 + i * 120, 7, "#6fd0ff");
  b += path("M800,230 L1010,310 V520 Q1010,700 800,790 Q590,700 590,520 V310 Z", INK, { stroke: "#9fd3ff", sw: 8 });
  b += path("M800,270 L970,336 V520 Q970,666 800,746 Q630,666 630,520 V336 Z", "#10233a");
  b += check(720, 500, 5.5, "#fff");
  b += path("M560,200 a260,260 0 0 1 160,-90", "none", { stroke: "#9fd3ff", sw: 10 });
  b += poly([[700, 90], [745, 118], [705, 150]], "#9fd3ff");
  b += path("M1040,800 a260,260 0 0 1 -160,90", "none", { stroke: "#9fd3ff", sw: 10 });
  b += poly([[900, 910], [855, 882], [895, 850]], "#9fd3ff");
  return doc(w, h, ["#06101c", "#0f2a48", "#2f78b8"], b, { horizon: 0.7 });
};

/* Réparation automatique : clé, engrenage, badge */
scenes["inclus-reparation"] = () => {
  const w = 1600, h = 1000;
  let b = glow(800, 500, 520, "#8a8a8a", 0.35);
  const gear = (cx, cy, R, n, fill) => {
    const pts = [];
    for (let i = 0; i < n * 2; i++) {
      const a = (i / (n * 2)) * Math.PI * 2;
      const rr = i % 2 === 0 ? R : R * 0.8;
      pts.push([cx + Math.cos(a) * rr, cy + Math.sin(a) * rr]);
    }
    return poly(pts, fill) + circle(cx, cy, R * 0.42, "#1c1c1c");
  };
  b += gear(1080, 420, 230, 12, "#2a2a2a");
  b += gear(1290, 640, 130, 10, "#232323");
  b += `<g transform="rotate(-40 700 540)">${rect(560, 505, 420, 70, INK, { rx: 20 })}${circle(530, 540, 90, INK)}${path("M470,540 l70,-50 v100 Z", "#1c1c1c")}${circle(530, 540, 90, "none", { stroke: "#5a5a5a", sw: 8 })}${rect(840, 520, 150, 40, "#5a5a5a", { rx: 20, op: 0.6 })}</g>`;
  b += glow(1000, 760, 120, "#fff", 0.35, "blurM");
  b += circle(1000, 760, 92, "#fff");
  b += check(948, 762, 5, "#111");
  return doc(w, h, ["#0b0b0b", "#222222", "#7a7a7a"], b, { horizon: 0.7 });
};

/* Final noir et blanc : autoroute de nuit */
scenes["final-noir-et-blanc"] = () => {
  const w = 1920, h = 1080, r = rnd(111);
  let b = stars(w, 500, 120, r);
  b += glow(1500, 230, 220, "#ffffff", 0.3);
  b += circle(1500, 230, 90, "#f4f4f4");
  b += mountains(w, 600, 220, r, "#161616");
  b += mountains(w, 640, 120, rnd(7), "#0e0e0e");
  b += rect(0, 640, w, 500, "#0a0a0a");
  b += road(w, h, 960, 645, -200, 2120, "#111");
  for (let i = 0; i < 9; i++) {
    const t = i / 9;
    const y = 650 + t * t * 430;
    const lx = 960 - 40 - t * t * 1000, rx = 960 + 40 + t * t * 1000;
    const hh = 20 + t * t * 320;
    b += rect(lx - 2, y - hh, 4 + t * 4, hh, "#2a2a2a");
    b += rect(rx - 2, y - hh, 4 + t * 4, hh, "#2a2a2a");
    b += rect(lx - 2, y - hh, 24 + t * 30, 4 + t * 4, "#2a2a2a");
    b += rect(rx - 22 - t * 30, y - hh, 24 + t * 30, 4 + t * 4, "#2a2a2a");
    b += glow(lx + 10, y - hh, 10 + t * 40, "#fff", 0.6, "blurM");
    b += glow(rx - 10, y - hh, 10 + t * 40, "#fff", 0.6, "blurM");
  }
  return doc(w, h, ["#030303", "#141414", "#4a4a4a"], b, { horizon: 0.6 });
};

/* À propos : bureau de nuit */
scenes["a-propos"] = () => {
  const w = 1600, h = 1000, r = rnd(121);
  let b = rect(0, 0, w, 1000, "#120d09");
  // fenêtre sur la ville
  b += rect(980, 120, 460, 360, "#1b2a45", { rx: 6 });
  b += stars(440, 240, 40, r, 980, 120);
  b += circle(1340, 200, 36, "#f3f6ff");
  b += `<g clip-path="url(#win)">${skyline(440, 480, 60, 220, r, { fill: "#0a1020", windows: 0.4, winColor: "#ffe1a8", x0: 980, gap: 6 })}</g>`;
  b += rect(980, 120, 460, 360, "none", { stroke: "#2a2018", sw: 14 });
  b += rect(1204, 120, 12, 360, "#2a2018");
  b += rect(0, 600, w, 400, "#1f1610");
  b += rect(120, 600, 1360, 26, "#3a2a1c", { rx: 4 });
  b += rect(160, 626, 30, 300, "#2a1e14");
  b += rect(1410, 626, 30, 300, "#2a1e14");
  // écrans
  const screen = (x, y, sw, sh) => {
    let s = glow(x + sw / 2, y + sh / 2, sw * 0.5, "#c9b7ff", 0.18, "blurM");
    s += rect(x, y, sw, sh, INK, { rx: 8 });
    s += rect(x + 8, y + 8, sw - 16, sh - 16, "#0d0d10", { rx: 4 });
    s += text(x + 28, y + 50, "EN LIGNE", 11, { ls: 2, op: 0.6 });
    s += bar(x + 28, y + 70, sw * 0.5, 14, 0.9);
    for (let i = 0; i < 4; i++) s += bar(x + 28, y + 104 + i * 26, sw * (0.3 + ((i * 37) % 40) / 100), 10, 0.35);
    s += rect(x + sw / 2 - 40, y + sh - 50, 80, 28, "#fff", { rx: 14 });
    s += rect(x + sw / 2 - 14, y + sh, 28, 26, INK);
    s += rect(x + sw / 2 - 60, y + sh + 24, 120, 8, INK, { rx: 4 });
    return s;
  };
  b += screen(300, 330, 420, 250);
  b += screen(760, 350, 360, 220);
  b += rect(460, 612, 300, 14, "#141010", { rx: 4 });
  b += rect(860, 560, 40, 40, "#d8b48a", { rx: 6 });
  b += lamp(1300, 600, 200, "#ffc98a");
  b += glow(500, 700, 300, "#ffb06b", 0.18);
  const extraDefs = `<clipPath id="win"><rect x="980" y="120" width="460" height="360" rx="6"/></clipPath>`;
  return doc(w, h, ["#120d09", "#2a1d13", "#8a5a34"], b, { grain: 0.4, extraDefs });
};

/* Communauté : foule et projecteurs */
scenes["communaute"] = () => {
  const w = 1600, h = 1000, r = rnd(131);
  let b = glow(800, 200, 500, "#39c4b4", 0.4);
  for (let i = 0; i < 5; i++) {
    const x = 200 + i * 300;
    b += poly([[x, 0], [x + 40, 0], [x + 260 + (i - 2) * 80, 1000], [x - 220 + (i - 2) * 80, 1000]], "#9ff5ea", { op: 0.07 });
    b += glow(x + 20, 10, 60, "#fff", 0.8, "blurM");
  }
  for (let i = 0; i < 60; i++) b += circle(r() * w, r() * 600, 2 + r() * 4, ["#9ff5ea", "#ffd166", "#ff6b9d", "#fff"][i % 4], { op: 0.4 + r() * 0.5 });
  const rows = [[620, 120, 0.35, 70], [700, 150, 0.55, 90], [800, 200, 0.8, 120], [930, 280, 1, 170]];
  rows.forEach(([baseY, hh, op, step]) => {
    for (let x = -40 + r() * 60; x < w + 60; x += step * (0.7 + r() * 0.5)) {
      b += figure(x, baseY, hh * (0.85 + r() * 0.3), { fill: `rgba(7,7,11,${op})`, armUp: r() > 0.5 });
    }
  });
  return doc(w, h, ["#06161a", "#0f3d42", "#2fb3a4"], b, { horizon: 0.55 });
};

/* ------------------------------------------------------------------ */

let count = 0;
for (const [name, make] of Object.entries(scenes)) {
  writeFileSync(new URL(`${name}.svg`, out), make());
  count += 1;
}
console.log(`${count} illustrations générées dans public/images/`);
