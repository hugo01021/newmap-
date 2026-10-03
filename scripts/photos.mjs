/**
 * Photos libres de droit (Wikimedia Commons) pour les emplacements « monde du jeu ».
 *
 *   node scripts/photos.mjs candidates [dossier]   → cherche des photos par emplacement,
 *                                                     télécharge des vignettes et génère une planche-contact
 *   node scripts/photos.mjs pick hero-accueil=3 showcase-ville=1 …
 *                                                  → télécharge les photos choisies en grand dans public/images
 *                                                     et écrit src/lib/data/credits.ts (attribution obligatoire)
 *
 * Licences acceptées : domaine public, CC0, CC BY, CC BY-SA (jamais NC ni ND).
 */
import { mkdirSync, writeFileSync, readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const API = "https://commons.wikimedia.org/w/api.php";
const UA = "ServCraftSite/1.0 (site vitrine ; contact: aide@servcraft.gg)";

/** Emplacements à remplacer par des photos, avec plusieurs requêtes de secours. */
export const slots = {
  "hero-accueil": { queries: ["Los Angeles palm trees sunset", "Sunset Boulevard palm trees", "Venice Beach palm trees sunset"], minRatio: 1.4 },
  "showcase-ville": { queries: ["Los Angeles skyline night", "Downtown Los Angeles night", "Los Angeles at night"], minRatio: 1.2 },
  "showcase-police": { queries: ["LAPD police car", "Los Angeles Police Department cruiser", "police car lights night"], minRatio: 1.2 },
  "feature-jobs": { queries: ["Los Angeles Fire Department ambulance", "LAPD patrol car street", "tow truck Los Angeles"], minRatio: 1.2 },
  "inclus-gangs": { queries: ["Los Angeles graffiti wall", "Venice Beach graffiti", "Los Angeles alley night"], minRatio: 1.2 },
  "inclus-immobilier": { queries: ["Hollywood Hills houses", "Beverly Hills mansion", "Los Angeles villa pool"], minRatio: 1.2 },
  "inclus-braquages": { queries: ["bank vault door", "safe vault door", "bank vault"], minRatio: 1.1 },
  "final-noir-et-blanc": { queries: ["Los Angeles freeway night", "Los Angeles highway long exposure", "Mulholland Drive night view"], minRatio: 1.4 },
  "communaute": { queries: ["esports crowd", "concert crowd night", "gaming event audience"], minRatio: 1.2 },
  "a-propos": { queries: ["gaming setup desk night", "computer desk neon", "office desk monitors night"], minRatio: 1.2 },
};

const OK_LICENSE = /^(public domain|pd|cc0|cc by(-sa)?( \d(\.\d)?)?)/i;

async function api(params) {
  const url = `${API}?${new URLSearchParams({ format: "json", formatversion: "2", origin: "*", ...params })}`;
  const res = await fetch(url, { headers: { "User-Agent": UA } });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return res.json();
}

function clean(html = "") {
  return html.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
}

/** Cherche des photos libres pour une requête. */
export async function search(query, minRatio = 1.2, limit = 30) {
  const data = await api({
    action: "query",
    generator: "search",
    gsrsearch: `${query} filetype:bitmap`,
    gsrnamespace: "6",
    gsrlimit: String(limit),
    prop: "imageinfo",
    iiprop: "url|size|mime|extmetadata",
    iiurlwidth: "640",
    iiextmetadatafilter: "LicenseShortName|Artist|Credit|ImageDescription|Restrictions|AttributionRequired",
  });
  const pages = data.query?.pages ?? [];
  return pages
    .map((p) => {
      const ii = p.imageinfo?.[0];
      if (!ii) return null;
      const m = ii.extmetadata ?? {};
      const license = m.LicenseShortName?.value ?? "";
      return {
        title: p.title.replace(/^File:/, ""),
        pageUrl: ii.descriptionurl,
        thumb: ii.thumburl,
        url: ii.url,
        width: ii.width,
        height: ii.height,
        mime: ii.mime,
        license,
        author: clean(m.Artist?.value ?? m.Credit?.value ?? "Auteur inconnu"),
        description: clean(m.ImageDescription?.value ?? "").slice(0, 160),
      };
    })
    .filter(Boolean)
    .filter((c) => c.mime === "image/jpeg" && c.width >= 1600 && c.width / c.height >= minRatio && OK_LICENSE.test(c.license) && !/NC|ND/i.test(c.license));
}

async function download(url, dest) {
  const res = await fetch(url, { headers: { "User-Agent": UA } });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  writeFileSync(dest, Buffer.from(await res.arrayBuffer()));
}

/** Pour obtenir une version redimensionnée d'un fichier Commons. */
function thumbAt(url, width) {
  // https://upload.wikimedia.org/wikipedia/commons/a/ab/Nom.jpg → …/commons/thumb/a/ab/Nom.jpg/1920px-Nom.jpg
  const m = url.match(/\/commons\/([0-9a-f])\/([0-9a-f]{2})\/([^/]+)$/);
  if (!m) return url;
  return `https://upload.wikimedia.org/wikipedia/commons/thumb/${m[1]}/${m[2]}/${m[3]}/${width}px-${m[3]}`;
}

const [mode, ...args] = process.argv.slice(2);
const outDir = mode === "candidates" && args[0] ? args[0] : join(process.cwd(), ".photos");

if (mode === "candidates") {
  mkdirSync(outDir, { recursive: true });
  const all = {};
  for (const [slot, cfg] of Object.entries(slots)) {
    let found = [];
    for (const q of cfg.queries) {
      const res = await search(q, cfg.minRatio);
      for (const c of res) if (!found.some((x) => x.title === c.title)) found.push(c);
      if (found.length >= 8) break;
    }
    found = found.slice(0, 8);
    mkdirSync(join(outDir, slot), { recursive: true });
    for (let i = 0; i < found.length; i++) {
      const dest = join(outDir, slot, `${i}.jpg`);
      try {
        await download(found[i].thumb, dest);
        found[i].local = dest;
      } catch (e) {
        console.error("vignette impossible :", found[i].title, e.message);
      }
    }
    all[slot] = found;
    console.log(`${slot}: ${found.length} candidates`);
  }
  writeFileSync(join(outDir, "candidates.json"), JSON.stringify(all, null, 2));
  const html = `<!doctype html><html><body style="margin:0;background:#111;color:#ddd;font-family:sans-serif">${Object.entries(all)
    .map(
      ([slot, list]) => `<h2 style="padding:16px 16px 0">${slot}</h2><div style="display:grid;grid-template-columns:repeat(4,1fr);gap:10px;padding:12px">${list
        .map((c, i) => `<figure style="margin:0"><img src="file://${c.local}" style="width:100%;aspect-ratio:16/10;object-fit:cover;border-radius:6px"><figcaption style="font-size:11px;padding:4px 0">${i} · ${c.width}×${c.height} · ${c.license}</figcaption></figure>`)
        .join("")}</div>`,
    )
    .join("")}</body></html>`;
  writeFileSync(join(outDir, "sheet.html"), html);
  console.log(`Planche-contact : ${join(outDir, "sheet.html")}`);
} else if (mode === "pick") {
  const all = JSON.parse(readFileSync(join(outDir, "candidates.json"), "utf8"));
  const imagesDir = join(process.cwd(), "public", "images");
  const creditsPath = join(process.cwd(), "src", "lib", "data", "credits.ts");
  const credits = existsSync(creditsPath) ? JSON.parse((readFileSync(creditsPath, "utf8").match(/= (\[[\s\S]*\]) as const/) ?? [null, "[]"])[1]) : [];
  for (const arg of args) {
    const [slot, idx] = arg.split("=");
    const c = all[slot]?.[Number(idx)];
    if (!c) {
      console.error(`Candidat introuvable : ${arg}`);
      continue;
    }
    const width = slot === "hero-accueil" || slot === "final-noir-et-blanc" ? 2200 : 1800;
    const dest = join(imagesDir, `${slot}.jpg`);
    await download(thumbAt(c.url, Math.min(width, c.width - 1)), dest);
    const entry = { file: `${slot}.jpg`, title: c.title, author: c.author, license: c.license, url: c.pageUrl };
    const i = credits.findIndex((x) => x.file === entry.file);
    if (i >= 0) credits[i] = entry;
    else credits.push(entry);
    console.log(`${slot} ← ${c.title} (${c.license}, ${c.author})`);
  }
  writeFileSync(
    creditsPath,
    `/** Crédits des photos (généré par scripts/photos.mjs). Attribution requise par les licences Creative Commons. */\nexport const photoCredits = ${JSON.stringify(credits, null, 2)} as const;\n`,
  );
  console.log(`Crédits écrits dans ${creditsPath}`);
} else {
  console.log("Usage : node scripts/photos.mjs candidates [dossier] | pick slot=index …");
}
