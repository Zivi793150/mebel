import fs from "node:fs";
import path from "node:path";

const BASE = "https://centrshtor.ru";
const START = `${BASE}/types_curtains/`;

function uniq(arr) {
  return Array.from(new Set(arr));
}

function absUrl(u) {
  if (!u) return u;
  if (u.startsWith("http")) return u;
  if (u.startsWith("//")) return `https:${u}`;
  if (u.startsWith("/")) return `${BASE}${u}`;
  return `${BASE}/${u}`;
}

async function fetchText(url) {
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), 25000);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        "user-agent": "Mozilla/5.0 (compatible; CentrshtorScraper/1.0)",
        "accept-language": "ru-RU,ru;q=0.9,en;q=0.8",
      },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}: ${res.statusText}`);
    return await res.text();
  } finally {
    clearTimeout(t);
  }
}

async function fetchTextRetry(url, attempts = 3) {
  let lastErr;
  for (let i = 0; i < attempts; i++) {
    try {
      return await fetchText(url);
    } catch (e) {
      lastErr = e;
      const delayMs = 700 * Math.pow(2, i);
      await new Promise((r) => setTimeout(r, delayMs));
    }
  }
  throw lastErr;
}

function stripTags(s) {
  return String(s || "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;|&#160;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function replaceCity(text) {
  const s = String(text || "");
  return s
    .replace(/Новосибирск(е|а|у|ом)?/gi, (m) => {
      const lower = m.toLowerCase();
      if (lower === "новосибирске") return "Калининграде";
      if (lower === "новосибирска") return "Калининграда";
      if (lower === "новосибирску") return "Калининграду";
      if (lower === "новосибирском") return "Калининградом";
      return "Калининград";
    })
    .replace(/г\.?\s*Новосибирск/gi, "г. Калининград");
}

function extractImagesFromHtml(html) {
  const urls = [];

  const ogImage = /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["'][^>]*>/i.exec(html)?.[1];
  if (ogImage) urls.push(absUrl(ogImage));

  const imgRe = /<img[^>]+(?:src|data-src|data-lazy-src)=["']([^"']+)["'][^>]*>/gi;
  for (let m; (m = imgRe.exec(html)); ) {
    const u = absUrl(m[1]);
    if (u) urls.push(u);
  }

  const cleaned = urls
    .map((u) => String(u || "").trim())
    .filter(Boolean)
    .filter((u) => !u.startsWith("data:"))
    .filter((u) => !/\.(?:svg|gif)(?:\?|$)/i.test(u))
    .filter((u) => !/\/logo\b|\/icon\b|favicon/i.test(u))
    .filter((u) => !/\/local\/templates\//i.test(u))
    .filter((u) => !/logo_onviz/i.test(u));

  const centrshtorOnly = cleaned.filter((u) => {
    try {
      const parsed = new URL(u);
      return parsed.hostname.endsWith("centrshtor.ru");
    } catch {
      return false;
    }
  });

  const uniqUrls = Array.from(new Set(centrshtorOnly));

  const preferred = [];
  const others = [];
  for (const u of uniqUrls) {
    const isPreferred =
      /\/upload\//i.test(u) || /\/images\//i.test(u) || /\/files\//i.test(u) || /\/wp-content\//i.test(u);
    (isPreferred ? preferred : others).push(u);
  }

  return [...preferred, ...others].slice(0, 10);
}

function extractGalleryImages(html) {
  const out = [];

  // <a href="/upload/iblock/..." class="blog__item-image" style="background-image: url(/upload/resize_cache/...)" ...>
  const aRe = /<a[^>]+class=["'][^"']*blog__item-image[^"']*["'][^>]*>/gi;
  for (let m; (m = aRe.exec(html)); ) {
    const tag = m[0];
    const href = /href=["']([^"']+)["']/i.exec(tag)?.[1];
    const style = /style=["']([^"']+)["']/i.exec(tag)?.[1] || "";
    const bg = /background-image\s*:\s*url\(([^)]+)\)/i.exec(style)?.[1];

    const candidates = [];
    if (href) candidates.push(absUrl(href));
    if (bg) candidates.push(absUrl(bg.replace(/["']/g, "")));

    for (const u of candidates) {
      if (!u) continue;
      out.push(u);
    }
  }

  // keep only real images from centrshtor
  const filtered = out
    .map((u) => String(u || "").trim())
    .filter(Boolean)
    .filter((u) => !/\/local\/templates\//i.test(u))
    .filter((u) => !/logo_onviz/i.test(u))
    .filter((u) => !/\.(?:svg|gif)(?:\?|$)/i.test(u))
    .filter((u) => {
      try {
        const parsed = new URL(u);
        return parsed.hostname.endsWith("centrshtor.ru");
      } catch {
        return false;
      }
    });

  return Array.from(new Set(filtered)).slice(0, 20);
}

function extractCategoryCards(html) {
  // Heuristic parser: collect anchors under /types_curtains/ with nearby title/desc/img.
  const out = [];

  const aRe = /<a[^>]+href=["']((?:https?:\/\/[^"']+)?\/types_curtains\/[^"'#?]+\/?)["'][^>]*>([\s\S]{0,8000}?)<\/a>/gi;
  for (let m; (m = aRe.exec(html)); ) {
    const href = absUrl(m[1]);
    const chunk = m[2] || "";

    const img = /<img[^>]+src=["']([^"']+)["']/i.exec(chunk);
    const title = /<(?:h1|h2|h3|h4)[^>]*>([\s\S]{0,600}?)<\/(?:h1|h2|h3|h4)>/i.exec(chunk);
    const titleAlt = /<div[^>]*class=["'][^"']*(?:title|name|caption|heading)[^"']*["'][^>]*>([\s\S]{0,600}?)<\/div>/i.exec(chunk);
    const altTitle = /<img[^>]+alt=["']([^"']{3,200})["']/i.exec(chunk);
    const p = /<p[^>]*>([\s\S]{0,1200}?)<\/p>/i.exec(chunk);
    const descAlt = /<div[^>]*class=["'][^"']*(?:desc|descr|text|sub)[^"']*["'][^>]*>([\s\S]{0,1200}?)<\/div>/i.exec(chunk);

    const doc = {
      source: "centrshtor.ru",
      kind: "curtain_type",
      url: href,
      title: replaceCity(stripTags(title?.[1] || titleAlt?.[1] || altTitle?.[1] || "")),
      description: replaceCity(stripTags(p?.[1] || descAlt?.[1] || "")),
      image: img ? absUrl(img[1]) : undefined,
    };

    if (!doc.title && !doc.image) continue;
    out.push(doc);
  }

  // Deduplicate by url
  const byUrl = new Map();
  for (const d of out) {
    if (!d.url) continue;
    const prev = byUrl.get(d.url);
    byUrl.set(d.url, { ...prev, ...d });
  }

  return Array.from(byUrl.values());
}

function extractLinksWithTitles(htmlChunk) {
  const out = [];
  const aRe = /<a[^>]+href=["']((?:https?:\/\/[^"']+)?\/types_curtains\/[^"'#?]+\/?)["'][^>]*>([\s\S]{0,2000}?)<\/a>/gi;
  for (let m; (m = aRe.exec(htmlChunk)); ) {
    const url = absUrl(m[1]);
    const chunk = m[2] || "";
    const title =
      /<(?:h1|h2|h3|h4)[^>]*>([\s\S]{0,600}?)<\/(?:h1|h2|h3|h4)>/i.exec(chunk)?.[1] ||
      /<img[^>]+alt=["']([^"']{3,200})["']/i.exec(chunk)?.[1] ||
      /<span[^>]*>([\s\S]{0,200}?)<\/span>/i.exec(chunk)?.[1] ||
      /<div[^>]*>([\s\S]{0,200}?)<\/div>/i.exec(chunk)?.[1] ||
      "";
    out.push({ url, title: stripTags(title) });
  }
  const byUrl = new Map();
  for (const d of out) {
    if (!d.url) continue;
    byUrl.set(d.url, d);
  }
  return Array.from(byUrl.values());
}

function extractGroupedStartLinks(startHtml) {
  const GROUPS = ["ПОМЕЩЕНИЕ", "КОМНАТА", "СТИЛЬ"];
  const out = [];

  for (const g of GROUPS) {
    const blockRe = new RegExp(
      `<div[^>]*class=["'][^"']*big-menu__sub-title[^"']*["'][^>]*>\\s*${g}\\s*<\\/div>([\\s\\S]{0,40000}?)(?=<div[^>]*class=["'][^"']*big-menu__sub-title[^"']*["'][^>]*>|<\\/div>\\s*<\\/div>\\s*<\\/div>)`,
      "i"
    );
    const block = blockRe.exec(startHtml)?.[1];
    if (!block) continue;

    for (const it of extractLinksWithTitles(block)) {
      if (!it.url) continue;
      out.push({ ...it, group: g });
    }
  }

  // Fallback: if blocks were not found, try assigning by nearest heading text.
  if (out.length === 0) {
    const headings = [];
    const hRe = /(ПОМЕЩЕНИЕ|КОМНАТА|СТИЛЬ)/gi;
    for (let m; (m = hRe.exec(startHtml)); ) headings.push({ group: String(m[1]).toUpperCase(), idx: m.index });
    headings.sort((a, b) => a.idx - b.idx);

    const aRe = /<a[^>]+href=["']((?:https?:\/\/[^"']+)?\/types_curtains\/[^"'#?]+\/?)["'][^>]*>([\s\S]{0,2000}?)<\/a>/gi;
    for (let m; (m = aRe.exec(startHtml)); ) {
      const url = absUrl(m[1]);
      if (!url) continue;
      const idx = m.index;
      let gg = "";
      for (let i = headings.length - 1; i >= 0; i--) {
        if (headings[i].idx < idx) {
          gg = headings[i].group;
          break;
        }
      }
      if (!gg || !GROUPS.includes(gg)) continue;
      const chunk = m[2] || "";
      const title =
        /<(?:h1|h2|h3|h4)[^>]*>([\s\S]{0,600}?)<\/(?:h1|h2|h3|h4)>/i.exec(chunk)?.[1] ||
        /<img[^>]+alt=["']([^"']{3,200})["']/i.exec(chunk)?.[1] ||
        /<span[^>]*>([\s\S]{0,200}?)<\/span>/i.exec(chunk)?.[1] ||
        /<div[^>]*>([\s\S]{0,200}?)<\/div>/i.exec(chunk)?.[1] ||
        "";
      out.push({ url, title: stripTags(title), group: gg });
    }
  }

  const byUrl = new Map();
  for (const d of out) {
    if (!d.url) continue;
    const prev = byUrl.get(d.url);
    byUrl.set(d.url, prev ? { ...prev, ...d } : d);
  }
  return Array.from(byUrl.values());
}

function extractSubcategoryLinks(html) {
  // Find any nested /types_curtains/... links
  const re = /href=["']((?:https?:\/\/[^"']+)?\/types_curtains\/[^"'#?]+\/?)["']/gi;
  const out = [];
  for (let m; (m = re.exec(html)); ) out.push(absUrl(m[1]));
  return uniq(out);
}

function extractPageInfo(url, html) {
  const h1 = /<h1[^>]*>([\s\S]{0,800}?)<\/h1>/i.exec(html);
  const titleTag = /<title[^>]*>([\s\S]{0,800}?)<\/title>/i.exec(html);
  const metaDesc = /<meta[^>]+name=["']description["'][^>]+content=["']([^"']{0,600})["'][^>]*>/i.exec(html);

  // Try to find a meaningful first paragraph.
  const p = /<p[^>]*>([\s\S]{40,1200}?)<\/p>/i.exec(html);

  const title = replaceCity(stripTags(h1?.[1] || titleTag?.[1] || ""));
  const description = replaceCity(stripTags(metaDesc?.[1] || p?.[1] || ""));
  const galleryImages = extractGalleryImages(html);
  const otherImages = extractImagesFromHtml(html);
  const images = Array.from(new Set([...galleryImages, ...otherImages])).slice(0, 20);
  const image = galleryImages[0] || images[0];

  return {
    source: "centrshtor.ru",
    kind: "curtain_type",
    url,
    title,
    description,
    image,
    images,
  };
}

async function maybeUploadToMongo(docs) {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.log("MONGODB_URI is not set. Skipping Mongo upload.");
    return { uploaded: 0 };
  }
  if (!docs || docs.length === 0) return { uploaded: 0 };

  const { MongoClient } = await import("mongodb");
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db("koenig");
  const col = db.collection("curtain_types");

  const ops = docs
    .filter((d) => d.url)
    .map((d) => ({
      updateOne: {
        filter: { source: "centrshtor.ru", url: d.url },
        update: { $set: { ...d, updatedAt: new Date() } },
        upsert: true,
      },
    }));

  if (ops.length === 0) {
    await client.close();
    return { uploaded: 0 };
  }

  const res = await col.bulkWrite(ops, { ordered: false });
  await client.close();
  return { uploaded: res.upsertedCount + res.modifiedCount };
}

async function main() {
  const args = new Set(process.argv.slice(2));
  const debug = args.has("--debug");
  const maxPages = Number(process.env.MAX_PAGES || "0") || 40;

  console.log("Scrape centrshtor.ru types_curtains ...");

  const startHtml = await fetchTextRetry(START);
  const startCards = extractCategoryCards(startHtml);
  const startLinks = extractSubcategoryLinks(startHtml);
  const groupedStart = extractGroupedStartLinks(startHtml);
  const groupByUrl = new Map(groupedStart.map((d) => [d.url, d.group]));

  if (debug) {
    console.log("startCards:", startCards.length);
    console.log("startLinks:", startLinks.length);
    console.log("startGrouped:", groupedStart.length);
    const counts = groupedStart.reduce((acc, d) => {
      const k = d.group || "";
      acc[k] = (acc[k] || 0) + 1;
      return acc;
    }, {});
    console.log("startGroupedByGroup:", counts);
    console.log(startLinks.slice(0, 10));
  }

  const visited = new Set();
  const queue = [...startLinks];
  const docsByUrl = new Map(
    startCards.map((d) => {
      const group = d.url ? groupByUrl.get(d.url) : undefined;
      return [d.url, group ? { ...d, group } : d];
    })
  );

  while (queue.length && visited.size < maxPages) {
    const url = queue.shift();
    if (!url || visited.has(url)) continue;
    visited.add(url);

    if (debug) console.log("page:", url);

    let html;
    try {
      html = await fetchTextRetry(url);
    } catch (e) {
      console.error("Failed:", url);
      console.error(e);
      continue;
    }

    // Always add info about the current page.
    const pageDoc = extractPageInfo(url, html);
    if (pageDoc.title || pageDoc.description || pageDoc.image) {
      const prev = docsByUrl.get(url) || {};
      const group = groupByUrl.get(url) || prev.group;
      docsByUrl.set(url, group ? { ...prev, ...pageDoc, group } : { ...prev, ...pageDoc });
    }

    const cards = extractCategoryCards(html);
    for (const d of cards) {
      if (!d.url) continue;
      const prev = docsByUrl.get(d.url) || {};
      const group = groupByUrl.get(d.url) || prev.group;
      docsByUrl.set(d.url, group ? { ...prev, ...d, group } : { ...prev, ...d });
    }

    const links = extractSubcategoryLinks(html);
    for (const l of links) {
      if (!visited.has(l)) queue.push(l);
    }
  }

  const items = Array.from(docsByUrl.values()).sort((a, b) => String(a.title).localeCompare(String(b.title)));

  const outPath = path.join(process.cwd(), "public", "curtains", "centrshtor_types.json");
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, JSON.stringify({ generatedAt: new Date().toISOString(), items }, null, 2), "utf8");

  console.log(`Saved: ${outPath}`);
  console.log(`Items: ${items.length}`);

  if (args.has("--mongo")) {
    const res = await maybeUploadToMongo(items);
    console.log("Mongo uploaded:", res.uploaded);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
