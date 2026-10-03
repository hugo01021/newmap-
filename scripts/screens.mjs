/**
 * Génère les visuels « écrans du produit » (public/images/*.jpg) à partir de
 * compositions HTML rendues dans Chromium, avec la police du site.
 *
 *   npm run build            (fournit la police dans .next/static/media)
 *   node scripts/screens.mjs [nom …]
 *
 * Dépendance : Playwright (npm i -D playwright, ou SCREENS_PLAYWRIGHT=/chemin/vers/playwright).
 */
import { mkdirSync, readdirSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";

const root = resolve(new URL("..", import.meta.url).pathname);
const outDir = join(root, "public", "images");
const tmpDir = join(root, ".screens");
mkdirSync(tmpDir, { recursive: true });

/* ------------------------------------------------------------------ */
/* Police et styles partagés                                           */
/* ------------------------------------------------------------------ */

function fontFaces() {
  try {
    const dir = join(root, ".next", "static", "media");
    const files = readdirSync(dir).filter((f) => f.includes("-s.p.") && f.endsWith(".woff2"));
    return files
      .map((f) => `@font-face{font-family:"Inter Tight";font-weight:100 900;font-display:block;src:url(${pathToFileURL(join(dir, f)).href}) format("woff2")}`)
      .join("\n");
  } catch {
    return "";
  }
}

const icon = {
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12 5 5L20 7"/></svg>',
  spark: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2c.6 5.2 4.8 9.4 10 10-5.2.6-9.4 4.8-10 10-.6-5.2-4.8-9.4-10-10 5.2-.6 9.4-4.8 10-10Z"/></svg>',
  shield: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"><path d="M12 3 4 6v6c0 4.5 3.4 7.8 8 9 4.6-1.2 8-4.5 8-9V6l-8-3Z"/></svg>',
  hash: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M9 4 7 20M17 4l-2 16M4 9h17M3 15h17"/></svg>',
  speaker: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 5 6 9H3v6h3l5 4V5ZM15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13"/></svg>',
  lock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>',
  chevron: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>',
  send: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 2 11 13M22 2l-7 20-4-9-9-4 20-7Z"/></svg>',
};

const base = (w, h, glow, gx = "50%", gy = "40%") => `
${fontFaces()}
*{box-sizing:border-box;margin:0;padding:0}
html,body{width:${w}px;height:${h}px;overflow:hidden;background:#0a0a0a;color:#fff;font-family:"Inter Tight",ui-sans-serif,system-ui,sans-serif;-webkit-font-smoothing:antialiased;font-size:16px;line-height:1.4}
.bg{position:absolute;inset:0;background:radial-gradient(55% 45% at ${gx} ${gy},${glow} 0%,rgba(10,10,10,0) 70%),#0a0a0a}
.grid{position:absolute;inset:0;background-image:linear-gradient(rgba(255,255,255,.045) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.045) 1px,transparent 1px);background-size:80px 80px;-webkit-mask-image:radial-gradient(70% 70% at 50% 50%,#000 20%,transparent 100%)}
.card{position:absolute;background:rgba(13,13,15,.94);border:1px solid rgba(255,255,255,.13);border-radius:22px;box-shadow:0 60px 140px rgba(0,0,0,.7),0 0 0 1px rgba(0,0,0,.6),inset 0 1px 0 rgba(255,255,255,.06);overflow:hidden}
.label{font-size:11px;font-weight:700;letter-spacing:.18em;text-transform:uppercase;color:#a3a3a3;line-height:1}
.tag{display:inline-block;background:#fff;color:#0a0a0a;font-size:11px;font-weight:700;letter-spacing:.18em;text-transform:uppercase;padding:8px 10px;border-radius:3px;line-height:1}
.ghost{display:inline-block;border:1px solid rgba(255,255,255,.3);color:#fff;font-size:11px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;padding:8px 10px;border-radius:3px;line-height:1}
.tile{background:#131317;border:1px solid rgba(255,255,255,.08);border-radius:14px;padding:18px 20px}
.num{font-weight:700;letter-spacing:-.04em;line-height:1}
.muted{color:#a3a3a3}.dim{color:#737373}
.row{display:flex;align-items:center;justify-content:space-between;gap:16px}
.hr{height:1px;background:rgba(255,255,255,.1)}
.pill{display:inline-flex;align-items:center;justify-content:center;gap:8px;height:42px;padding:0 22px;border-radius:999px;font-weight:600;font-size:15px;white-space:nowrap}
.pill.sm{height:34px;padding:0 16px;font-size:13px}
.pill.primary{background:#f5f5f5;color:#0a0a0a}
.pill.secondary{border:1px solid rgba(255,255,255,.25);color:#fff;background:rgba(17,17,17,.7)}
.toggle{width:44px;height:24px;border-radius:12px;background:#fff;position:relative;flex:none}
.toggle::after{content:"";position:absolute;top:4px;right:4px;width:16px;height:16px;border-radius:50%;background:#0a0a0a}
.toggle.off{background:#2a2a30}.toggle.off::after{right:auto;left:4px;background:#777}
.dot{width:9px;height:9px;border-radius:50%;background:#fff;box-shadow:0 0 0 5px rgba(255,255,255,.14);flex:none}
.ic{width:16px;height:16px;flex:none;display:inline-block}
.ic svg{width:100%;height:100%;display:block}
.checkline{display:flex;gap:12px;align-items:flex-start;font-size:16px;color:rgba(255,255,255,.9)}
.checkline .ic{color:#8a8a8a;margin-top:3px}
.bubble{display:inline-block;background:#fff;color:#0a0a0a;font-weight:600;padding:14px 20px;border-radius:22px 22px 6px 22px;font-size:17px}
.aicard{background:#101013;border:1px solid rgba(255,255,255,.12);border-radius:18px;padding:28px}
.sparkbadge{width:34px;height:34px;border-radius:50%;background:#fff;color:#0a0a0a;display:flex;align-items:center;justify-content:center;flex:none}
.sparkbadge svg{width:15px;height:15px}
.field{height:40px;border-radius:8px;background:#1b1b20;border:1px solid rgba(255,255,255,.08);display:flex;align-items:center;padding:0 14px;font-size:14px;font-weight:600;color:#fff;justify-content:flex-end;min-width:120px}
`;

const page = (w, h, css, body) => `<!doctype html><html lang="fr"><head><meta charset="utf-8"><style>${css}</style></head><body>${body}</body></html>`;

/** Courbe lissée pour un graphique. */
function areaChart(w, h, data, { stroke = "#fff", fill = "rgba(255,255,255,.14)", pad = 8 } = {}) {
  const max = Math.max(...data) * 1.1, min = Math.min(...data) * 0.8;
  const pts = data.map((v, i) => [pad + (i / (data.length - 1)) * (w - pad * 2), h - pad - ((v - min) / (max - min)) * (h - pad * 2)]);
  let d = `M${pts[0][0]},${pts[0][1]}`;
  for (let i = 1; i < pts.length; i++) {
    const [x0, y0] = pts[i - 1], [x1, y1] = pts[i];
    const cx = (x0 + x1) / 2;
    d += ` C${cx},${y0} ${cx},${y1} ${x1},${y1}`;
  }
  const area = `${d} L${pts[pts.length - 1][0]},${h} L${pts[0][0]},${h} Z`;
  const last = pts[pts.length - 1];
  return `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" style="display:block">
<defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${fill}"/><stop offset="1" stop-color="rgba(255,255,255,0)"/></linearGradient></defs>
${[0.25, 0.5, 0.75].map((t) => `<line x1="0" y1="${h * t}" x2="${w}" y2="${h * t}" stroke="rgba(255,255,255,.07)"/>`).join("")}
<path d="${area}" fill="url(#g)"/><path d="${d}" fill="none" stroke="${stroke}" stroke-width="2.5" stroke-linejoin="round"/>
<circle cx="${last[0]}" cy="${last[1]}" r="5" fill="#fff"/><circle cx="${last[0]}" cy="${last[1]}" r="11" fill="rgba(255,255,255,.18)"/></svg>`;
}

const tiles = (items, cols = 4) => `<div style="display:grid;grid-template-columns:repeat(${cols},1fr);gap:14px">${items
  .map(([l, v, hint]) => `<div class="tile"><div class="label">${l}</div><div class="num" style="font-size:34px;margin-top:16px">${v}</div>${hint ? `<div class="dim" style="font-size:13px;margin-top:8px">${hint}</div>` : ""}</div>`)
  .join("")}</div>`;

const checks = (items) => items.map((t) => `<div class="checkline"><span class="ic">${icon.check}</span><span>${t}</span></div>`).join("");

const aiCard = ({ area, impact, title, summary, items, compact = false }) => `
<div class="aicard" style="${compact ? "padding:22px" : ""}">
  <div class="row"><div style="display:flex;align-items:center;gap:12px"><span class="sparkbadge">${icon.spark}</span><span class="label">IA ServCraft · ${area}</span></div><span class="ghost">Impact ${impact}</span></div>
  <div class="num" style="font-size:${compact ? 26 : 34}px;margin-top:${compact ? 18 : 24}px">${title}</div>
  <p class="muted" style="font-size:${compact ? 14 : 16}px;line-height:1.5;margin-top:10px;max-width:640px">${summary}</p>
  <div class="hr" style="margin:${compact ? 16 : 22}px 0"></div>
  <div style="display:grid;gap:${compact ? 10 : 14}px;font-size:${compact ? 14 : 16}px">${checks(items)}</div>
  <div style="display:flex;gap:12px;margin-top:${compact ? 20 : 26}px"><span class="pill primary ${compact ? "sm" : ""}">Publier</span><span class="pill secondary ${compact ? "sm" : ""}">Annuler</span></div>
</div>`;

/* ------------------------------------------------------------------ */
/* Scènes                                                              */
/* ------------------------------------------------------------------ */

const scenes = {};

scenes["feature-serveur"] = {
  w: 1600, h: 1000,
  html() {
    const css = base(1600, 1000, "rgba(29,191,174,.32)", "30%", "30%");
    const body = `<div class="bg"></div><div class="grid"></div>
<div class="card" style="left:70px;top:80px;width:1040px;height:840px;padding:40px 44px">
  <div class="row"><div style="display:flex;align-items:center;gap:12px"><span class="dot"></span><span class="label" style="color:#fff">En ligne</span></div><span class="label">Région · Paris · 2 ms</span></div>
  <div class="num" style="font-size:46px;margin-top:26px">Los Santos Legacy</div>
  <div class="muted" style="margin-top:8px;font-size:15px">Serveur de jeu · 64 joueurs · mises à jour appliquées automatiquement</div>
  <div style="margin-top:30px">${tiles([["Joueurs connectés", "27 / 64", "Pic aujourd'hui : 41"], ["Disponibilité", "100 %", "30 derniers jours"], ["Temps de réponse", "2 ms", "Mesuré toutes les 10 s"], ["Dernier redémarrage", "6 j", "Planifié, 05:00"]])}</div>
  <div class="row" style="margin-top:30px"><span class="label">Joueurs connectés · 24 h</span><span class="dim" style="font-size:13px">Max. 64</span></div>
  <div style="margin-top:14px">${areaChart(952, 230, [12, 9, 6, 5, 7, 11, 16, 22, 28, 31, 30, 34, 38, 41, 39, 36, 33, 35, 30, 29, 27, 28, 27, 27])}</div>
  <div class="hr" style="margin-top:26px"></div>
  <div style="display:grid;gap:14px;margin-top:20px;font-size:15px">
    ${[["14:03", "Sauvegarde automatique terminée", "412 Mo"], ["13:12", "Mise à jour appliquée sans coupure", "v2.14"], ["05:00", "Redémarrage planifié", "41 s"]].map(([t, l, r]) => `<div class="row"><div style="display:flex;gap:16px"><span class="dim" style="font-variant-numeric:tabular-nums">${t}</span><span>${l}</span></div><span class="dim">${r}</span></div>`).join("")}
  </div>
</div>
<div class="card" style="left:1140px;top:560px;width:400px;height:360px;padding:30px 32px">
  <div class="row"><span class="label">Surveillance 24h/24</span><span class="dot"></span></div>
  <div style="display:flex;align-items:center;gap:14px;margin-top:26px"><span class="sparkbadge" style="width:40px;height:40px">${icon.check.replace("stroke-width=\"2.4\"", "stroke-width=\"3\"")}</span><span class="num" style="font-size:26px">Tout est normal</span></div>
  <div style="display:grid;gap:18px;margin-top:30px">
    ${[["Processeur", 23], ["Mémoire", 41], ["Stockage", 18]].map(([l, v]) => `<div><div class="row" style="font-size:14px"><span class="muted">${l}</span><span style="font-weight:600">${v} %</span></div><div style="height:6px;border-radius:3px;background:rgba(255,255,255,.1);margin-top:8px"><div style="width:${v}%;height:100%;border-radius:3px;background:#fff"></div></div></div>`).join("")}
  </div>
</div>`;
    return page(1600, 1000, css, body);
  },
};

scenes["feature-economie"] = {
  w: 1600, h: 1000,
  html() {
    const css = base(1600, 1000, "rgba(46,204,113,.3)", "70%", "35%");
    const body = `<div class="bg"></div><div class="grid"></div>
<div class="card" style="left:70px;top:80px;width:1120px;height:840px;padding:40px 44px">
  <div class="row"><span class="label">Économie · Masse monétaire</span><span class="ghost">Équilibrage IA : stable</span></div>
  <div class="num" style="font-size:76px;margin-top:26px">2 450 000 $</div>
  <div class="muted" style="margin-top:10px;font-size:16px"><span style="color:#fff;font-weight:600">+3,2 %</span> cette semaine · inflation maîtrisée · aucun ajustement recommandé</div>
  <div style="margin-top:30px">${areaChart(1032, 300, [1.9, 1.95, 2.0, 1.98, 2.05, 2.1, 2.08, 2.15, 2.2, 2.18, 2.25, 2.3, 2.28, 2.35, 2.4, 2.38, 2.42, 2.45])}</div>
  <div style="display:flex;justify-content:space-between;margin-top:8px" class="dim">${["1 sept.", "8 sept.", "15 sept.", "22 sept.", "29 sept.", "Aujourd'hui"].map((d) => `<span style="font-size:12px">${d}</span>`).join("")}</div>
  <div style="margin-top:30px">${tiles([["Salaire moyen", "1 850 $ / h", "Tous jobs confondus"], ["Véhicule moyen", "42 000 $", "Concessionnaire"], ["Loyer moyen", "2 400 $ / sem", "Appartements"]], 3)}</div>
</div>
<div class="card" style="left:1230px;top:180px;width:300px;height:520px;padding:30px 28px">
  <span class="label">Réglages</span>
  <div style="display:grid;gap:14px;margin-top:22px">
    ${[["Argent de départ", "5 000 $"], ["Taxe sur les achats", "8 %"], ["Paie toutes les", "15 min"], ["Carburant", "1,9 $ / L"]].map(([l, v]) => `<div><div class="muted" style="font-size:13px">${l}</div><div class="field" style="margin-top:6px">${v}</div></div>`).join("")}
  </div>
  <div class="hr" style="margin:24px 0 18px"></div>
  <div class="row" style="font-size:14px"><span>Inflation automatique</span><span class="toggle"></span></div>
  <div class="row" style="font-size:14px;margin-top:14px"><span>Prix dynamiques</span><span class="toggle off"></span></div>
</div>`;
    return page(1600, 1000, css, body);
  },
};

function discordLayout({ left, top, width, height, members, messages, channelsWidth = 260, compact = false }) {
  const chans = [
    ["INFOS", ["accueil", "règlement", "annonces"]],
    ["CANDIDATURES", ["whitelist", "résultats"]],
    ["JOBS", ["police", "ems", "mécano"]],
    ["GANGS", ["ballas", "vagos"]],
    ["VOCAL", ["Général", "Police"], true],
  ];
  const roleColors = { fondateur: "#f2c14e", staff: "#5b8def", police: "#4ecdc4", ems: "#e06c9f", citoyen: "#d9d9de", app: "#fff" };
  const msgHtml = messages
    .map(
      ([name, role, time, text, embed]) => `
    <div style="display:flex;gap:16px;padding:${compact ? "10px 0" : "12px 0"}">
      <div style="width:40px;height:40px;border-radius:50%;background:${roleColors[role]};flex:none;display:flex;align-items:center;justify-content:center;color:#0a0a0a;font-weight:800;font-size:15px">${name.slice(0, 1)}</div>
      <div style="min-width:0;flex:1">
        <div style="display:flex;align-items:baseline;gap:8px"><span style="font-weight:600;color:${roleColors[role]}">${name}</span>${role === "app" ? '<span style="background:#5865f2;color:#fff;font-size:10px;font-weight:700;padding:2px 5px;border-radius:3px;line-height:1.3">APP</span>' : ""}<span class="dim" style="font-size:12px">${time}</span></div>
        <div style="color:#dbdee1;font-size:${compact ? 14 : 15}px;margin-top:3px;line-height:1.45">${text}</div>
        ${embed ? `<div style="margin-top:10px;background:#2b2d31;border-left:4px solid #3ba55c;border-radius:6px;padding:12px 14px;max-width:460px"><div style="font-weight:700;font-size:14px">${embed[0]}</div><div style="color:#b5bac1;font-size:13px;margin-top:4px">${embed[1]}</div></div>` : ""}
      </div>
    </div>`,
    )
    .join("");
  return `<div class="card" style="left:${left}px;top:${top}px;width:${width}px;height:${height}px;border-radius:18px;display:flex;background:#313338">
  <div style="width:${compact ? 64 : 72}px;background:#1e1f22;padding:12px 0;display:flex;flex-direction:column;align-items:center;gap:10px;flex:none">
    <div style="width:${compact ? 42 : 48}px;height:${compact ? 42 : 48}px;border-radius:16px;background:#fff;color:#0a0a0a;font-weight:800;display:flex;align-items:center;justify-content:center;font-size:15px">LS</div>
    <div style="width:${compact ? 26 : 32}px;height:2px;background:#35373c;border-radius:1px"></div>
    ${[0, 1, 2, 3, 4].map(() => `<div style="width:${compact ? 42 : 48}px;height:${compact ? 42 : 48}px;border-radius:50%;background:#313338"></div>`).join("")}
  </div>
  <div style="width:${channelsWidth}px;background:#2b2d31;flex:none;display:flex;flex-direction:column">
    <div style="height:50px;display:flex;align-items:center;justify-content:space-between;padding:0 16px;border-bottom:1px solid #1f2023;font-weight:700;font-size:15px">Los Santos Legacy<span class="ic" style="color:#b5bac1">${icon.chevron}</span></div>
    <div style="padding:14px 10px;display:grid;gap:4px;color:#949ba4;font-size:${compact ? 14 : 15}px;font-weight:500">
      ${chans.map(([cat, list, voice], ci) => `<div style="font-size:11px;font-weight:700;letter-spacing:.04em;padding:${ci ? 14 : 4}px 6px 4px;color:#949ba4">${cat}</div>${list.map((c, i) => `<div style="display:flex;align-items:center;gap:8px;padding:6px 8px;border-radius:5px;${ci === 0 && i === 0 ? "background:#404249;color:#fff" : ""}"><span class="ic" style="width:17px;height:17px">${voice ? icon.speaker : icon.hash}</span>${c}</div>`).join("")}`).join("")}
    </div>
  </div>
  <div style="flex:1;min-width:0;display:flex;flex-direction:column">
    <div style="height:50px;display:flex;align-items:center;gap:10px;padding:0 20px;border-bottom:1px solid #26272b;font-weight:700;font-size:15px"><span class="ic" style="color:#80848e;width:20px;height:20px">${icon.hash}</span>accueil<span style="width:1px;height:20px;background:#3f4147;margin:0 6px"></span><span style="color:#949ba4;font-weight:400;font-size:14px">Bienvenue sur Los Santos Legacy</span></div>
    <div style="flex:1;padding:${compact ? "12px 20px" : "16px 24px"};overflow:hidden;display:flex;flex-direction:column;justify-content:flex-end">
      <div style="padding:8px 0 18px;border-bottom:1px solid #3f4147;margin-bottom:10px">
        <div style="width:68px;height:68px;border-radius:50%;background:#41434a;display:flex;align-items:center;justify-content:center;color:#fff"><span class="ic" style="width:40px;height:40px">${icon.hash}</span></div>
        <div style="font-size:28px;font-weight:800;letter-spacing:-.02em;margin-top:14px">Bienvenue dans #accueil !</div>
        <div style="color:#b5bac1;font-size:15px;margin-top:4px">C'est le début du salon #accueil. Le serveur Los Santos Legacy a été créé avec ServCraft.</div>
      </div>${msgHtml}</div>
    <div style="margin:0 20px 20px;height:46px;border-radius:8px;background:#383a40;display:flex;align-items:center;padding:0 16px;color:#6d6f78;font-size:15px">Envoyer un message dans #accueil</div>
  </div>
  ${members ? `<div style="width:230px;background:#2b2d31;flex:none;padding:16px 12px;font-size:14px;color:#949ba4">
    ${[["Fondateur — 1", ["Marco"], "fondateur"], ["Staff — 3", ["Léa", "Noah", "Inès"], "staff"], ["Police — 18", ["Kevin", "Sofia", "Hugo", "Yanis"], "police"], ["En ligne — 27", ["Lina", "Théo", "Camille", "Adam"], "citoyen"]].map(([t, names, role]) => `<div style="font-size:11px;font-weight:700;letter-spacing:.04em;padding:10px 8px 6px">${t.toUpperCase()}</div>${names.map((n) => `<div style="display:flex;align-items:center;gap:10px;padding:5px 8px"><span style="width:28px;height:28px;border-radius:50%;background:${roleColors[role]};display:inline-block"></span><span style="color:${roleColors[role]};font-weight:500">${n}</span></div>`).join("")}`).join("")}
  </div>` : ""}
</div>`;
}

const discordMessages = [
  ["ServCraft", "app", "Aujourd'hui à 14:02", "Le serveur <b>Los Santos Legacy</b> est en ligne. Adresse de connexion : <code style=\"background:#1e1f22;padding:2px 6px;border-radius:4px;font-size:13px\">connect los-santos-legacy.servcraft.gg</code>", ["Statut du serveur", "27 / 64 joueurs · 2 ms · dernière sauvegarde 14:03"]],
  ["Marco", "fondateur", "Aujourd'hui à 14:05", "Bienvenue à tous ! Lisez le règlement avant de candidater dans #whitelist. Les réponses arrivent sous 24 h."],
  ["Léa", "staff", "Aujourd'hui à 14:06", "Les candidatures sont ouvertes. Pensez à préciser votre expérience RP et votre disponibilité."],
  ["Kevin", "police", "Aujourd'hui à 14:09", "La police recrute 4 nouveaux agents cette semaine. Entretien vendredi à 21 h au commissariat."],
  ["Sofia", "citoyen", "Aujourd'hui à 14:11", "Trop hâte de lancer mon personnage ce soir, le garage de Mirror Park a l'air incroyable."],
  ["Noah", "staff", "Aujourd'hui à 14:14", "Rappel : la soirée d'ouverture commence à 21 h, rendez-vous devant la mairie."],
  ["Lina", "citoyen", "Aujourd'hui à 14:16", "On monte un taxi collectif pour y aller, qui est chaud ?"],
  ["Inès", "ems", "Aujourd'hui à 14:18", "Les EMS seront en service dès 20 h 30, l'hôpital central est prêt."],
  ["Théo", "citoyen", "Aujourd'hui à 14:21", "Quelqu'un vend une moto pas trop chère ? Je débute, budget serré."],
  ["ServCraft", "app", "Aujourd'hui à 14:30", "Sauvegarde automatique terminée (412 Mo). Prochaine sauvegarde à 15:30."],
];

scenes["feature-discord"] = {
  w: 1600, h: 1000,
  html() {
    const css = base(1600, 1000, "rgba(88,101,242,.32)", "50%", "40%");
    const body = `<div class="bg"></div><div class="grid"></div>${discordLayout({ left: 70, top: 70, width: 1460, height: 860, members: true, messages: discordMessages.slice(0, 6) })}`;
    return page(1600, 1000, css, body);
  },
};

scenes["showcase-discord"] = {
  w: 1200, h: 1500,
  html() {
    const css = base(1200, 1500, "rgba(88,101,242,.32)", "50%", "35%");
    const body = `<div class="bg"></div><div class="grid"></div>${discordLayout({ left: 60, top: 70, width: 1080, height: 1360, members: false, messages: discordMessages.slice(0, 9), channelsWidth: 236 })}`;
    return page(1200, 1500, css, body);
  },
};

scenes["feature-site"] = {
  w: 1600, h: 1000,
  html() {
    const css = base(1600, 1000, "rgba(232,122,96,.3)", "50%", "30%");
    const photo = pathToFileURL(join(outDir, "hero-accueil.jpg")).href;
    const body = `<div class="bg"></div><div class="grid"></div>
<div class="card" style="left:110px;top:70px;width:1380px;height:900px;border-radius:18px;background:#0a0a0a">
  <div style="height:52px;background:#161618;display:flex;align-items:center;padding:0 18px;gap:8px;border-bottom:1px solid rgba(255,255,255,.08)">
    <span style="width:12px;height:12px;border-radius:50%;background:#ff5f57"></span><span style="width:12px;height:12px;border-radius:50%;background:#febc2e"></span><span style="width:12px;height:12px;border-radius:50%;background:#28c840"></span>
    <div style="margin-left:20px;flex:1;max-width:560px;height:32px;border-radius:8px;background:#0e0e10;display:flex;align-items:center;gap:8px;padding:0 12px;color:#a3a3a3;font-size:13px"><span class="ic" style="width:13px;height:13px">${icon.lock}</span>los-santos-legacy.servcraft.gg</div>
  </div>
  <div style="position:relative;height:520px;background:url(${photo}) center/cover">
    <div style="position:absolute;inset:0;background:linear-gradient(90deg,rgba(10,10,10,.75),rgba(10,10,10,.2) 60%,transparent),linear-gradient(0deg,#0a0a0a 0%,rgba(10,10,10,.5) 35%,transparent 70%)"></div>
    <div style="position:absolute;inset:0;padding:26px 44px;display:flex;flex-direction:column">
      <div class="row"><span style="font-weight:800;letter-spacing:-.03em;font-size:19px">Los Santos Legacy</span><div style="display:flex;gap:28px" class="label"><span style="color:#fff">Règlement</span><span style="color:#fff">Jobs</span><span style="color:#fff">Whitelist</span><span style="color:#fff">Discord</span></div><span class="pill sm primary">Rejoindre</span></div>
      <div style="margin-top:auto"><span class="tag">Serveur RP français</span><div class="num" style="font-size:58px;margin-top:20px;max-width:720px">Une ville qui vit, même quand tu dors.</div><div style="display:flex;gap:12px;margin-top:26px"><span class="pill primary">Rejoindre le serveur</span><span class="pill secondary">Rejoindre le Discord</span></div></div>
    </div>
  </div>
  <div style="padding:30px 44px">
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:16px">
      ${[["Règlement", "Un RP sérieux, respectueux et sans sortie de personnage. Les règles complètes avant de candidater."], ["Jobs", "Police, EMS, mécano, taxi, avocat, journaliste. Des métiers vivants avec grades et salaires."], ["Whitelist", "Candidature sur Discord, réponse sous 24 h. Un entretien rapide pour garantir l'ambiance."]].map(([t, d]) => `<div class="tile" style="padding:22px"><div class="label">${t}</div><p class="muted" style="font-size:14px;line-height:1.5;margin-top:12px">${d}</p></div>`).join("")}
    </div>
    <div class="row" style="margin-top:26px;padding-top:22px;border-top:1px solid rgba(255,255,255,.1)" ><div style="display:flex;gap:30px;font-size:14px"><span><b>27</b> <span class="muted">joueurs en ligne</span></span><span><b>249</b> <span class="muted">membres Discord</span></span><span><b>Ouverte</b> <span class="muted">whitelist</span></span></div><span class="dim" style="font-size:12px">Site généré par ServCraft</span></div>
  </div>
</div>`;
    return page(1600, 1000, css, body);
  },
};

scenes["feature-ia"] = {
  w: 1600, h: 1000,
  html() {
    const css = base(1600, 1000, "rgba(139,106,214,.35)", "55%", "45%");
    const sparkle = (x, y, s, o) => `<div style="position:absolute;left:${x}px;top:${y}px;width:${s}px;height:${s}px;color:#fff;opacity:${o};filter:drop-shadow(0 0 ${s / 2}px rgba(201,166,255,.9))">${icon.spark}</div>`;
    const body = `<div class="bg"></div><div class="grid"></div>
${sparkle(1330, 300, 70, 0.95)}${sparkle(1430, 480, 34, 0.7)}${sparkle(1300, 640, 44, 0.6)}${sparkle(240, 120, 26, 0.5)}
<div style="position:absolute;left:140px;top:90px;opacity:.38"><span class="bubble" style="font-size:15px;padding:10px 16px">Divise le salaire des policiers par 2</span><div style="display:flex;align-items:center;gap:8px;margin-top:10px;font-size:13px" class="muted"><span class="sparkbadge" style="width:20px;height:20px">${icon.check}</span>Publié sur ton serveur il y a 2 min</div></div>
<div style="position:absolute;right:360px;top:150px"><span class="bubble">Ajoute un braquage de banque avec 4 policiers minimum</span></div>
<div class="card" style="left:140px;top:250px;width:1100px;height:560px;padding:0;border-radius:22px">${aiCard({
  area: "Gameplay",
  impact: "important",
  title: "Nouveau braquage de banque",
  summary: "Un braquage de la banque principale sera disponible, uniquement quand au moins 4 policiers sont en service. Le butin et le temps de recharge sont équilibrés selon ton économie.",
  items: ["Braquage de banque activé", "Condition : 4 policiers minimum en service", "Butin : 45 000 à 80 000 $ selon la difficulté", "Recharge : 2 heures entre deux braquages", "Alerte envoyée à la police au déclenchement"],
}).replace('class="aicard"', 'class="aicard" style="border:0;border-radius:22px;padding:40px 44px;height:560px"')}</div>`;
    return page(1600, 1000, css, body);
  },
};

scenes["inclus-sauvegardes"] = {
  w: 1600, h: 1000,
  html() {
    const css = base(1600, 1000, "rgba(59,143,212,.35)", "28%", "40%");
    const rows = [["Aujourd'hui, 14:03", "412 Mo", "automatique"], ["Aujourd'hui, 13:03", "411 Mo", "automatique"], ["Aujourd'hui, 12:03", "411 Mo", "automatique"], ["Aujourd'hui, 09:41", "409 Mo", "manuelle"], ["Hier, 23:03", "405 Mo", "automatique"], ["Hier, 22:03", "405 Mo", "automatique"]];
    const body = `<div class="bg"></div><div class="grid"></div>
<div style="position:absolute;left:140px;top:300px;width:340px;height:400px;color:#fff;filter:drop-shadow(0 0 60px rgba(159,211,255,.45))">${icon.shield.replace('stroke-width="1.5"', 'stroke-width="1.1"')}</div>
<div style="position:absolute;left:250px;top:430px;width:120px;height:120px;color:#fff">${icon.check.replace('stroke-width="2.4"', 'stroke-width="2.6"')}</div>
<div class="card" style="left:600px;top:100px;width:930px;height:800px;padding:36px 40px">
  <div class="row"><span class="label">Sauvegardes</span><span class="pill sm primary">Sauvegarder maintenant</span></div>
  <div class="num" style="font-size:38px;margin-top:22px">Dernière sauvegarde il y a 12 minutes</div>
  <div class="muted" style="margin-top:8px;font-size:15px">Automatique toutes les heures · conservées 30 jours · chiffrées</div>
  <div class="hr" style="margin:26px 0 6px"></div>
  ${rows.map(([d, s, t]) => `<div class="row" style="padding:15px 0;border-bottom:1px solid rgba(255,255,255,.07)"><div><div style="font-weight:600;font-size:16px">${d}</div><div class="dim" style="font-size:13px;margin-top:3px">${s} · ${t}</div></div><span class="pill sm secondary">Restaurer</span></div>`).join("")}
  <div style="display:flex;gap:28px;margin-top:22px;font-size:14px;color:#d4d4d4">${["Restauration en un clic", "Testées chaque nuit", "Exportables à tout moment"].map((t) => `<span style="display:flex;align-items:center;gap:8px"><span class="ic" style="color:#8a8a8a">${icon.check}</span>${t}</span>`).join("")}</div>
</div>`;
    return page(1600, 1000, css, body);
  },
};

scenes["inclus-reparation"] = {
  w: 1600, h: 1000,
  html() {
    const css = base(1600, 1000, "rgba(170,170,180,.26)", "50%", "40%");
    const steps = [["14:02:10", "Erreur détectée", "Le script des concessionnaires a renvoyé une erreur sur 3 véhicules."], ["14:02:14", "Diagnostic", "Cause identifiée : prix manquants après la dernière modification."], ["14:02:38", "Correctif appliqué", "Valeurs restaurées depuis la sauvegarde de 14:00, sans redémarrage."], ["14:02:51", "Serveur stable", "Vérifications réussies, surveillance reprise, rapport envoyé sur Discord."]];
    const body = `<div class="bg"></div><div class="grid"></div>
<div class="card" style="left:200px;top:160px;width:1200px;height:680px;padding:40px 48px">
  <div class="row"><span class="label">Réparation automatique</span><span class="tag">Résolu</span></div>
  <div class="num" style="font-size:46px;margin-top:24px">Erreur corrigée en 41 secondes.</div>
  <div class="muted" style="margin-top:10px;font-size:16px">Aucun joueur déconnecté · aucune action de ta part · tu peux relire chaque étape.</div>
  <div style="margin-top:40px;display:grid;gap:0">
    ${steps.map(([t, l, d], i) => `<div style="display:flex;gap:24px;position:relative;padding-bottom:${i < steps.length - 1 ? 34 : 0}px">
      ${i < steps.length - 1 ? '<div style="position:absolute;left:17px;top:38px;bottom:0;width:2px;background:rgba(255,255,255,.14)"></div>' : ""}
      <span class="sparkbadge" style="width:36px;height:36px;margin-top:2px">${icon.check}</span>
      <div style="flex:1"><div class="row"><span class="num" style="font-size:24px;letter-spacing:-.02em">${l}</span><span class="dim" style="font-variant-numeric:tabular-nums;font-size:14px">${t}</span></div><div class="muted" style="font-size:15px;margin-top:6px">${d}</div></div>
    </div>`).join("")}
  </div>
  <div class="hr" style="margin:34px 0 22px"></div>
  <div class="row"><div style="display:flex;gap:26px;font-size:14px;color:#d4d4d4">${["Surveillance continue", "Retour arrière possible", "Historique conservé 90 jours"].map((t) => `<span style="display:flex;align-items:center;gap:8px"><span class="ic" style="color:#8a8a8a">${icon.check}</span>${t}</span>`).join("")}</div><span class="pill sm secondary">Voir le rapport</span></div>
</div>`;
    return page(1600, 1000, css, body);
  },
};

scenes["inclus-protection"] = {
  w: 1600, h: 1000,
  html() {
    const css = base(1600, 1000, "rgba(220,70,70,.22)", "40%", "40%");
    // Trafic : légitime (blanc) et attaque filtrée (gris)
    const legit = [20, 22, 21, 24, 23, 25, 26, 24, 25, 27, 26, 28, 27, 26, 28, 29, 28, 27];
    const attack = [0, 0, 0, 0, 0, 0, 2, 38, 42, 40, 35, 12, 3, 0, 0, 0, 0, 0];
    const chart = (w, h, data, color, fill) => {
      const max = 45, pad = 8;
      const pts = data.map((v, i) => [pad + (i / (data.length - 1)) * (w - pad * 2), h - pad - (v / max) * (h - pad * 2)]);
      let d = `M${pts[0][0]},${pts[0][1]}`;
      for (let i = 1; i < pts.length; i++) { const [x0, y0] = pts[i - 1], [x1, y1] = pts[i]; const cx = (x0 + x1) / 2; d += ` C${cx},${y0} ${cx},${y1} ${x1},${y1}`; }
      return `<path d="${d} L${pts[pts.length - 1][0]},${h} L${pts[0][0]},${h} Z" fill="${fill}"/><path d="${d}" fill="none" stroke="${color}" stroke-width="2.5" stroke-linejoin="round"/>`;
    };
    const body = `<div class="bg"></div><div class="grid"></div>
<div style="position:absolute;left:150px;top:310px;width:280px;height:340px;color:#fff;filter:drop-shadow(0 0 60px rgba(255,120,120,.35))">${icon.shield.replace('stroke-width="1.5"', 'stroke-width="1.1"')}</div>
<div style="position:absolute;left:242px;top:424px;width:96px;height:96px;color:#fff">${icon.check.replace('stroke-width="2.4"', 'stroke-width="2.6"')}</div>
<div class="card" style="left:500px;top:90px;width:940px;height:820px;padding:36px 40px">
  <div class="row"><span class="label">Protection anti-attaques</span><span class="tag">Active</span></div>
  <div class="num" style="font-size:42px;margin-top:22px">Attaque bloquée en 2 secondes.</div>
  <div class="muted" style="margin-top:8px;font-size:15px">Aujourd'hui, 02:14 · 42 Gbit/s filtrés · 0 joueur déconnecté · rapport envoyé sur Discord</div>
  <div class="row" style="margin-top:28px"><span class="label">Trafic · dernière heure</span><div style="display:flex;gap:18px;font-size:12px" class="muted"><span><span style="display:inline-block;width:10px;height:10px;border-radius:2px;background:#fff;margin-right:6px"></span>Joueurs</span><span><span style="display:inline-block;width:10px;height:10px;border-radius:2px;background:#6a6a72;margin-right:6px"></span>Attaque filtrée</span></div></div>
  <svg width="860" height="250" viewBox="0 0 860 250" style="display:block;margin-top:12px">${[0.25, 0.5, 0.75].map((t) => `<line x1="0" y1="${250 * t}" x2="860" y2="${250 * t}" stroke="rgba(255,255,255,.07)"/>`).join("")}${chart(860, 250, attack, "#6a6a72", "rgba(120,120,130,.18)")}${chart(860, 250, legit, "#fff", "rgba(255,255,255,.12)")}</svg>
  <div style="margin-top:26px">${tiles([["Attaques bloquées ce mois", "12", "Toutes sans coupure"], ["Disponibilité", "100 %", "30 derniers jours"], ["Temps de réaction", "1,8 s", "Moyenne du mois"]], 3)}</div>
  <div class="hr" style="margin:26px 0 18px"></div>
  <div style="display:flex;gap:26px;font-size:14px;color:#d4d4d4">${["Filtrage automatique", "Alerte Discord en direct", "Rapport après chaque attaque"].map((t) => `<span style="display:flex;align-items:center;gap:8px"><span class="ic" style="color:#8a8a8a">${icon.check}</span>${t}</span>`).join("")}</div>
</div>`;
    return page(1600, 1000, css, body);
  },
};

scenes["showcase-panel"] = {
  w: 1200, h: 1500,
  html() {
    const css = base(1200, 1500, "rgba(120,120,140,.35)", "50%", "30%");
    const body = `<div class="bg"></div><div class="grid"></div>
<div class="card" style="left:70px;top:80px;width:1060px;height:1360px;padding:40px 44px;display:flex;flex-direction:column">
  <div class="row"><div style="display:flex;align-items:center;gap:12px"><span class="dot"></span><span class="label" style="color:#fff">En ligne</span></div><div style="display:flex;gap:26px;font-size:15px"><span><b>27 / 64</b> <span class="muted">joueurs</span></span><span><b>249</b> <span class="muted">Discord</span></span></div></div>
  <div class="num" style="font-size:52px;margin-top:22px">Los Santos Legacy</div>
  <div style="display:flex;gap:26px;margin-top:30px;border-bottom:1px solid rgba(255,255,255,.1)">${["Vue d'ensemble", "Gameplay", "Jobs", "Véhicules", "Économie", "Discord"].map((t, i) => `<span class="label" style="padding:0 0 14px;${i === 0 ? "color:#fff;border-bottom:2px solid #fff;margin-bottom:-1px" : ""}">${t}</span>`).join("")}</div>
  <div style="margin-top:26px">${tiles([["Joueurs connectés", "27 / 64", "Pic aujourd'hui : 41"], ["Membres Discord", "249", "+38 cette semaine"], ["Disponibilité", "100 %", "30 derniers jours"], ["Dernière sauvegarde", "14:03", "Automatique"]], 2)}</div>
  <div style="margin-top:28px;flex:1;display:flex;flex-direction:column;border:1px solid rgba(255,255,255,.1);border-radius:18px;background:rgba(255,255,255,.02);padding:24px 26px">
    <div style="display:flex;align-items:center;gap:12px"><span class="sparkbadge" style="width:28px;height:28px">${icon.spark}</span><span class="label">IA de gestion</span></div>
    <div style="display:flex;justify-content:flex-end;margin-top:20px;opacity:.45"><span class="bubble" style="font-size:15px;padding:10px 16px">Ajoute un job de chauffeur de bus</span></div>
    <div style="display:flex;align-items:center;gap:8px;margin-top:10px;font-size:13px;opacity:.45" class="muted"><span class="sparkbadge" style="width:20px;height:20px">${icon.check}</span>Publié sur ton serveur il y a 8 min · 4 grades, 1 600 $ / h</div>
    <div style="display:flex;justify-content:flex-end;margin-top:22px"><span class="bubble" style="font-size:16px">Divise le salaire des policiers par 2</span></div>
    <div style="margin-top:18px">${aiCard({ area: "Jobs", impact: "moyen", title: "Salaire Police divisé par 2", summary: "Le salaire des membres du job Police sera divisé par 2 pour tous les grades. Les paies déjà versées ne changent pas.", items: ["Salaire de base : 2 400 $ → 1 200 $ par heure", "Grades intermédiaires et supérieurs recalculés proportionnellement", "Annonce automatique dans le salon Discord de la police"] })}</div>
    <div style="margin-top:auto;height:50px;border-radius:12px;background:#121216;border:1px solid rgba(255,255,255,.1);display:flex;align-items:center;justify-content:space-between;padding:0 8px 0 16px;color:#737373;font-size:15px">Que veux-tu modifier ?<span style="width:36px;height:36px;border-radius:9px;background:#fff;color:#0a0a0a;display:flex;align-items:center;justify-content:center"><span class="ic">${icon.send}</span></span></div>
  </div>
</div>`;
    return page(1200, 1500, css, body);
  },
};

/* ------------------------------------------------------------------ */
/* Rendu                                                               */
/* ------------------------------------------------------------------ */

async function loadPlaywright() {
  const candidates = [process.env.SCREENS_PLAYWRIGHT, "playwright"].filter(Boolean);
  for (const c of candidates) {
    try {
      return await import(c);
    } catch {
      /* suivant */
    }
  }
  throw new Error("Playwright introuvable : npm i -D playwright, ou SCREENS_PLAYWRIGHT=/chemin/vers/playwright/index.mjs");
}

const wanted = process.argv.slice(2);
const { chromium } = await loadPlaywright();
const browser = await chromium.launch(process.env.SCREENS_CHROMIUM ? { executablePath: process.env.SCREENS_CHROMIUM } : {});
for (const [name, scene] of Object.entries(scenes)) {
  if (wanted.length && !wanted.includes(name)) continue;
  const file = join(tmpDir, `${name}.html`);
  writeFileSync(file, scene.html());
  const page = await browser.newPage({ viewport: { width: scene.w, height: scene.h }, deviceScaleFactor: 1 });
  await page.goto(pathToFileURL(file).href, { waitUntil: "load" });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(150);
  await page.screenshot({ path: join(outDir, `${name}.jpg`), type: "jpeg", quality: 90 });
  console.log(`${name}.jpg (${scene.w}×${scene.h})`);
  await page.close();
}
await browser.close();
