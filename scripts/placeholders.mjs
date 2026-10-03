/**
 * Génère les images placeholders dans /public/images.
 * Remplace ensuite chaque fichier par ta propre image (même nom).
 *   node scripts/placeholders.mjs
 */
import { writeFileSync, mkdirSync } from "node:fs";

const out = new URL("../public/images/", import.meta.url);
mkdirSync(out, { recursive: true });

const slots = [
  ["hero-accueil", 1920, 1080, ["#2a1a3d", "#8a3b2a", "#f2a65a"], "skyline"],
  ["showcase-ville", 1600, 1000, ["#0b1d3a", "#1d3b6e", "#4fa3c7"], "skyline"],
  ["showcase-police", 1600, 1000, ["#0e0e14", "#1b2a4a", "#c23b3b"], "road"],
  ["showcase-panel", 1600, 1000, ["#0a0a0a", "#141414", "#2a2a2a"], "ui"],
  ["showcase-discord", 1600, 1000, ["#0f0f1a", "#1e1f3a", "#4e5bd6"], "ui"],
  ["feature-serveur", 1600, 1000, ["#0b1a2a", "#163a4f", "#3fb0a8"], "grid"],
  ["feature-jobs", 1600, 1000, ["#1d1a0e", "#4a3b14", "#e3b23c"], "road"],
  ["feature-economie", 1600, 1000, ["#0f1a12", "#1f4a2d", "#7ccf7f"], "grid"],
  ["feature-discord", 1600, 1000, ["#13132a", "#2a2d6b", "#7b86ff"], "ui"],
  ["feature-site", 1600, 1000, ["#1a1414", "#3d2626", "#f07f6a"], "ui"],
  ["feature-ia", 1600, 1000, ["#0d0d0d", "#2a1f3d", "#c9a6ff"], "grid"],
  ["inclus-gangs", 1600, 1000, ["#1a0d14", "#4a1f33", "#d94f8a"], "road"],
  ["inclus-immobilier", 1600, 1000, ["#1c1a12", "#4a4330", "#e8d7a6"], "skyline"],
  ["inclus-braquages", 1600, 1000, ["#0c0c0c", "#3a2a0f", "#f0b429"], "road"],
  ["inclus-sauvegardes", 1600, 1000, ["#0c141c", "#1e3346", "#6fb7e8"], "grid"],
  ["inclus-reparation", 1600, 1000, ["#121212", "#2c2c2c", "#9a9a9a"], "grid"],
  ["final-noir-et-blanc", 1920, 1080, ["#050505", "#2b2b2b", "#777777"], "road"],
  ["a-propos", 1600, 1000, ["#1a1612", "#3b2f22", "#d2a675"], "skyline"],
  ["communaute", 1600, 1000, ["#101a1c", "#1f3f45", "#5fd3c6"], "skyline"],
];

const rand = (seed) => () => {
  seed = (seed * 1664525 + 1013904223) % 4294967296;
  return seed / 4294967296;
};

function skyline(w, h, r) {
  let d = "";
  let x = 0;
  while (x < w) {
    const bw = 40 + r() * 140;
    const bh = h * (0.25 + r() * 0.45);
    d += `<rect x="${x}" y="${h - bh}" width="${bw}" height="${bh}" fill="#000" opacity="${0.55 + r() * 0.35}"/>`;
    // fenêtres
    for (let i = 0; i < 6; i++) {
      if (r() > 0.6) continue;
      d += `<rect x="${x + 8 + r() * (bw - 20)}" y="${h - bh + 14 + r() * (bh - 30)}" width="6" height="9" fill="#fff" opacity="${0.15 + r() * 0.5}"/>`;
    }
    x += bw + 6 + r() * 20;
  }
  return d;
}

function road(w, h, r) {
  let d = `<polygon points="${w * 0.42},${h * 0.55} ${w * 0.58},${h * 0.55} ${w * 1.1},${h} ${-w * 0.1},${h}" fill="#000" opacity="0.6"/>`;
  for (let i = 0; i < 9; i++) {
    const t = i / 9;
    const y = h * 0.56 + t * t * h * 0.46;
    const len = 6 + t * 60;
    d += `<rect x="${w / 2 - 2 - t * 6}" y="${y}" width="${4 + t * 12}" height="${len}" fill="#fff" opacity="${0.25 + t * 0.5}"/>`;
  }
  for (let i = 0; i < 24; i++) {
    d += `<circle cx="${r() * w}" cy="${h * 0.3 + r() * h * 0.25}" r="${1 + r() * 3}" fill="#fff" opacity="${0.2 + r() * 0.6}"/>`;
  }
  return d;
}

function grid(w, h, r) {
  let d = "";
  for (let x = 0; x <= w; x += 80) d += `<line x1="${x}" y1="0" x2="${x}" y2="${h}" stroke="#fff" stroke-opacity="0.06"/>`;
  for (let y = 0; y <= h; y += 80) d += `<line x1="0" y1="${y}" x2="${w}" y2="${y}" stroke="#fff" stroke-opacity="0.06"/>`;
  for (let i = 0; i < 14; i++) {
    const s = 60 + r() * 220;
    d += `<rect x="${r() * w}" y="${r() * h}" width="${s}" height="${s * (0.4 + r() * 0.6)}" rx="8" fill="#fff" opacity="${0.03 + r() * 0.08}"/>`;
  }
  return d;
}

function ui(w, h, r) {
  let d = `<rect x="${w * 0.12}" y="${h * 0.16}" width="${w * 0.76}" height="${h * 0.84}" rx="18" fill="#000" opacity="0.55"/>`;
  d += `<rect x="${w * 0.12}" y="${h * 0.16}" width="${w * 0.76}" height="54" rx="18" fill="#fff" opacity="0.06"/>`;
  for (let i = 0; i < 3; i++) d += `<circle cx="${w * 0.12 + 30 + i * 20}" cy="${h * 0.16 + 27}" r="5" fill="#fff" opacity="0.35"/>`;
  for (let i = 0; i < 7; i++) {
    const y = h * 0.16 + 90 + i * 52;
    d += `<rect x="${w * 0.15}" y="${y}" width="${w * (0.15 + r() * 0.35)}" height="14" rx="7" fill="#fff" opacity="${0.1 + r() * 0.2}"/>`;
    d += `<rect x="${w * 0.72}" y="${y - 4}" width="${w * 0.12}" height="22" rx="11" fill="#fff" opacity="${r() > 0.5 ? 0.6 : 0.15}"/>`;
  }
  return d;
}

const shapes = { skyline, road, grid, ui };

slots.forEach(([name, w, h, [c1, c2, c3], shape], i) => {
  const r = rand(i * 7919 + 17);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
<defs>
  <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="${c1}"/><stop offset="0.6" stop-color="${c2}"/><stop offset="1" stop-color="${c3}"/>
  </linearGradient>
  <radialGradient id="glow" cx="0.5" cy="0.62" r="0.6">
    <stop offset="0" stop-color="${c3}" stop-opacity="0.9"/><stop offset="1" stop-color="${c3}" stop-opacity="0"/>
  </radialGradient>
  <filter id="noise"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/><feComponentTransfer><feFuncA type="linear" slope="0.08"/></feComponentTransfer></filter>
</defs>
<rect width="${w}" height="${h}" fill="url(#g)"/>
<rect width="${w}" height="${h}" fill="url(#glow)"/>
${shapes[shape](w, h, r)}
<rect width="${w}" height="${h}" filter="url(#noise)" opacity="0.6"/>
<rect width="${w}" height="${h}" fill="url(#g)" opacity="0.15"/>
<g font-family="ui-sans-serif, system-ui, sans-serif" font-weight="700" fill="#fff" opacity="0.6">
  <text x="${w / 2}" y="${h / 2}" text-anchor="middle" font-size="${Math.round(w / 48)}" letter-spacing="${Math.round(w / 300)}">IMAGE À REMPLACER</text>
  <text x="${w / 2}" y="${h / 2 + w / 32}" text-anchor="middle" font-size="${Math.round(w / 70)}" font-weight="500" opacity="0.8">/images/${name}.svg</text>
</g>
</svg>`;
  writeFileSync(new URL(`${name}.svg`, out), svg);
});

console.log(`${slots.length} placeholders générés dans public/images/`);
