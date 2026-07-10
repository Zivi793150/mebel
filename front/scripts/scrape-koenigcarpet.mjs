import fs from "node:fs";
import path from "node:path";

const BASE = "https://koenigcarpet.ru";
const START = `${BASE}/ru/all-rugs`;

const DEFAULT_MAX_PAGES = 120;
const DEFAULT_MAX_TARGETS = 0; // 0 = no limit
const MAX_ITEMS_PER_FILTER = 18; // limit carpets per filter

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
  const res = await fetch(url, {
    headers: {
      "user-agent": "Mozilla/5.0 (compatible; KoenigCarpetScraper/1.0)",
      "accept-language": "ru-RU,ru;q=0.9,en;q=0.8",
    },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}: ${res.statusText}`);
  return await res.text();
}

/**
 * Parse the RSC (React Server Components) payload from the page
 * to extract product data with proper URLs.
 */
function extractProductsFromRsc(html) {
  // Extract all RSC payload chunks
  const scriptRe = /<script>self\.__next_f\.push\(\[([\s\S]*?)\]\)<\/script>/g;
  let m;
  let allRaw = "";
  while ((m = scriptRe.exec(html))) {
    allRaw += m[1] + "\n";
  }

  if (!allRaw) return null;

  // Normalize: decode escape sequences
  const decoded = allRaw
    .replace(/\\u002F/g, '/')
    .replace(/\\u0022/g, '"')
    .replace(/\\n/g, ' ')
    .replace(/\\"/g, '"');

  // Find rugs array in the decoded RSC payload
  // Pattern: "rugs":[{...product_data...}]
  const rugsMatch = decoded.match(/"rugs":(\[[\s\S]*?\])\s*,\s*"rugsCount"/);
  if (!rugsMatch) return null;

  try {
    const rugs = JSON.parse(rugsMatch[1]);
    return rugs.map((rug) => {
      const collectionValue = rug.collection?.value || "";
      const productCode = rug.product_code || "";
      const title = rug.product_name?.ru || rug.product_name?.en || "";
      const price = rug.price ? `${parseFloat(rug.price).toFixed(0)} ₽` : "";

      // Image: use the first one from the images array, construct full URL
      const image = rug.images?.[0]
        ? absUrl(rug.images[0].startsWith("/") ? rug.images[0] : `/${rug.images[0]}`)
        : null;

      // Style, collection, color
      const styleValue = rug.style?.value || "";
      const colorValue = rug.color?.value || "";

      // Construct product page URL:
      // Since items don't have individual pages (they open in modal),
      // link to the collection listing page filtered by collection
      // e.g. https://koenigcarpet.ru/ru/collection/{collectionSlug}
      let url = null;
      if (collectionValue) {
        url = `${BASE}/ru/collection/${collectionValue}`;
      }

      return {
        key: `${encodeURIComponent(title)}::${image || ""}`,
        title,
        url,
        image,
        priceText: price,
        style: styleValue,
        collection: collectionValue,
        color: colorValue,
      };
    });
  } catch {
    return null;
  }
}

function extractStyleUrls(html) {
  const re = /href=["'](\/ru\/style\/[a-z0-9_\-]+)["']/gi;
  const out = [];
  for (let m; (m = re.exec(html)); ) out.push(absUrl(m[1]));
  return uniq(out);
}

function extractCollectionUrls(html) {
  const re = /href=["'](\/ru\/collection\/[a-z0-9_\-]+)["']/gi;
  const out = [];
  for (let m; (m = re.exec(html)); ) out.push(absUrl(m[1]));
  return uniq(out);
}

function extractColorUrls(html) {
  const re = /href=["'](\/ru\/color\/[a-z0-9_\-]+)["']/gi;
  const out = [];
  for (let m; (m = re.exec(html)); ) out.push(absUrl(m[1]));
  return uniq(out);
}

function extractProductLinks(html) {
  // Product pages are commonly under /ru/product/...
  // Keep a broad allow-list and exclude obvious non-product sections.
  const reHref = /href=["']((?:https?:\/\/[^"']+)?\/ru\/(?!(?:style|color|collection|all-rugs|rugs-in-stock|new-rugs|runners|vr|atelier|designer|faq|contact|about|feedback|search|cart|checkout)(?:\/|["']))[^"']+)["']/gi;
  const reData = /data-(?:href|url)=["']([^"']+)["']/gi;
  const out = [];
  for (let m; (m = reHref.exec(html)); ) {
    const href = String(m[1] || "");
    if (!href) continue;
    if (href.includes("#")) continue;
    // allow querystring on product pages, but skip obvious filters
    if (href.includes("?page=")) {
      // ignore
    } else if (href.includes("?")) {
      continue;
    }
    const normalized = href.startsWith("http") ? href : absUrl(href);
    const parts = normalized.split("/").filter(Boolean);
    // exclude short section links like /ru/something
    if (parts.length < 3) continue;
    out.push(normalized);
  }

  for (let m; (m = reData.exec(html)); ) {
    const raw = String(m[1] || "");
    if (!raw) continue;
    if (!raw.includes("/ru/")) continue;
    if (raw.includes("#")) continue;
    const normalized = raw.startsWith("http") ? raw : absUrl(raw);
    out.push(normalized);
  }
  return uniq(out);
}

function extractProductLinksFromJson(html) {
  // Many ecommerce templates embed URLs in JSON-LD or inline JSON.
  const out = [];
  const re = /"url"\s*:\s*"([^"]+)"/gi;
  for (let m; (m = re.exec(html)); ) {
    const raw = String(m[1] || "");
    if (!raw) continue;
    if (!raw.includes("/ru/")) continue;
    if (raw.includes("/style/") || raw.includes("/collection/") || raw.includes("/color/")) continue;
    out.push(raw.startsWith("http") ? raw : absUrl(raw));
  }
  return uniq(out);
}

function extractTitlesPricesLoose(html) {
  // Very loose fallback: look for patterns like ">NAME</h3> ... 12 345 ₽ / руб.
  const out = [];
  const re = /<h3[^>]*>([^<]{3,160})<\/h3>[\s\S]{0,600}?(\d[\d\s\u00A0&;#]{0,40}(?:₽|руб\.?|р\.?))/gi;
  for (let m; (m = re.exec(html)); ) {
    const title = m[1].replace(/\s+/g, " ").trim();
    const priceText = m[2].replace(/\s+/g, " ").trim();
    if (title && priceText) out.push({ title, priceText });
  }
  return out;
}

function extractListingCards(html) {
  // Matches the listing card snippet structure:
  // <a href="..."><img ... src="..."> ... <h3 ...>TITLE</h3> ... <p ...>PRICE ₽</p></a>
  const out = [];

  // Avoid heavy regex on large HTML: split into probable card chunks.
  const chunks = html.split('<div class="group');
  for (let i = 1; i < chunks.length; i += 1) {
    const chunk = chunks[i];
    if (!chunk) continue;
    // Keep chunk size bounded
    const s = chunk.slice(0, 20000);

    // Extract product URL from <a href> wrapping the card
    const urlMatch = /<a[^>]+href=["']([^"']+)["']/i.exec(s);

    const imgMatch = /<img[^>]+src=["']([^"']+)["']/i.exec(s);
    const titleMatch = /<h3[^>]*>([^<]{3,200})<\/h3>/i.exec(s);
    // Try multiple price patterns
    const priceMatch = /<p[^>]*>([\s\S]{0,120}?₽)<\/p>/i.exec(s) ||
                       /<span[^>]*class=["'][^"']*price[^"']*["'][^>]*>([\s\S]{0,120}?₽)<\/span>/i.exec(s) ||
                       /<div[^>]*class=["'][^"']*price[^"']*["'][^>]*>([\s\S]{0,120}?₽)<\/div>/i.exec(s);

    const url = urlMatch ? absUrl(String(urlMatch[1] || "").trim()) : null;
    const image = imgMatch ? absUrl(String(imgMatch[1] || "").trim()) : null;
    const title = titleMatch ? String(titleMatch[1] || "").replace(/\s+/g, " ").trim() : null;
    const priceText = priceMatch
      ? String(priceMatch[1] || "")
          .replace(/<[^>]+>/g, " ")
          .replace(/&nbsp;|&#160;/g, " ")
          .replace(/\s+/g, " ")
          .trim()
      : null;

    if (!title && !image) continue;

    // Skip if URL looks like a CMS page (not a product)
    if (url) {
      const urlPath = new URL(url).pathname.toLowerCase();
      const nonProductPaths = /^\/(ru\/)?(bestsellers|sold-rugs|dealers|delivery-return|demonstration|partners|our-projects|vr|faq|contact|about|feedback|search|cart|checkout|him|all-rugs|rugs-in-stock|new-rugs|runners|atelier|designer)/i;
      if (urlPath.length < 5 || nonProductPaths.test(urlPath)) {
        // Parseable data but non-product URL — still keep the item but don't trust the URL
        out.push({ title, priceText, image, url: null });
        continue;
      }
    }

    out.push({ title, priceText, image, url });
  }

  return out;
}

function extractImages(html) {
  // Collect from preload links and from img tags (src/data-src)
  const rePreload = /<link[^>]+as=\"image\"[^>]+href=\"([^\"]+)\"/gi;
  const reImg = /<img[^>]+(?:src|data-src|data-lazy)=\"([^\"]+)\"/gi;
  const out = [];
  for (let m; (m = rePreload.exec(html)); ) out.push(absUrl(m[1]));
  for (let m; (m = reImg.exec(html)); ) out.push(absUrl(m[1]));
  return uniq(out);
}

function slugFromUrl(url) {
  try {
    const u = new URL(url);
    const p = u.pathname.replace(/\/+$/, "");
    return p.split("/").pop() || p;
  } catch {
    return url;
  }
}

/**
 * Try to extract product data from the RSC (React Server Components) payload.
 * Returns an array of items with properly formatted URLs, or null if not found.
 */
function extractProductDataFromRsc(html) {
  // Extract all RSC payload chunks
  const scriptRe = /<script>self\.__next_f\.push\(\[([\s\S]*?)\]\)<\/script>/g;
  let m;
  let allRaw = "";
  while ((m = scriptRe.exec(html))) {
    allRaw += m[1] + "\n";
  }

  if (!allRaw) return null;

  // Normalize escape sequences
  const decoded = allRaw
    .replace(/\\u002F/g, '/')
    .replace(/\\u0022/g, '"')
    .replace(/\\n/g, ' ')
    .replace(/\\"/g, '"');

  // Find the rugs array with their data
  // Pattern: "rugs":[{"id":...,"product_code":"...",...
  const rugsMatch = decoded.match(/"rugs":(\[[\s\S]*?\])\s*,\s*"rugsCount"/);
  if (!rugsMatch) return null;

  try {
    const rugs = JSON.parse(rugsMatch[1]);
    return rugs.map((rug) => {
      const collectionValue = rug.collection?.value || "";
      const productCode = rug.product_code || "";
      const title = rug.product_name?.ru || rug.product_name?.en || "";
      const price = rug.price ? `${parseFloat(rug.price).toFixed(0)} ₽` : "";

      // Use first image, construct full URL
      const firstImg = rug.images?.[0];
      const image = firstImg ? absUrl(firstImg.startsWith("/") ? firstImg : `/${firstImg}`) : null;

      const styleValue = rug.style?.value || "";
      const colorValue = rug.color?.value || "";

      // Build product URL pointing to the collection page on koenigcarpet.ru
      const url = collectionValue ? `${BASE}/ru/collection/${collectionValue}` : null;

      return {
        source: "koenigcarpet.ru",
        kind: "rug",
        key: `${title}::${image || ""}`,
        url,
        title,
        priceText: price,
        image,
        style: styleValue,
        collection: collectionValue,
        color: colorValue,
      };
    });
  } catch {
    return null;
  }
}

async function maybeUploadToMongo(docs) {
  const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/koenig";
  if (!uri) {
    console.log("MONGODB_URI is not set. Skipping Mongo upload.");
    return { uploaded: 0 };
  }

  if (!docs || docs.length === 0) return { uploaded: 0 };

  const { MongoClient } = await import("mongodb");
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db("koenig");
  const col = db.collection("carpet_items");

  // upsert by url
  const ops = docs.map((d) => {
    const setDoc = {
      source: "koenigcarpet.ru",
      updatedAt: new Date(),
      kind: d.kind,
      key: d.key,
      url: d.url,
      title: d.title,
      priceText: d.priceText,
      image: d.image,
      style: d.style,
      collection: d.collection,
      color: d.color,
      page: d.page,
    };

    for (const k of Object.keys(setDoc)) {
      if (setDoc[k] == null || setDoc[k] === "") delete setDoc[k];
    }

    return {
      updateOne: {
        filter: { source: "koenigcarpet.ru", key: d.key },
        update: { $set: setDoc },
        upsert: true,
      },
    };
  });

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
  const limitStyles = Number(process.env.LIMIT_STYLES || "0") || 0;
  const maxPages = Number(process.env.MAX_PAGES || "0") || DEFAULT_MAX_PAGES;
  const maxTargets = Number(process.env.MAX_TARGETS || "0") || DEFAULT_MAX_TARGETS;

  console.log("Scrape koenigcarpet.ru ...");

  // Build filter lists by crawling multiple pages.
  const seedPages = [START, `${START}?page=1`, `${START}?page=2`, `${START}?page=3`];
  const seedHtmls = [];
  for (const u of seedPages) {
    try {
      seedHtmls.push(await fetchText(u));
    } catch (e) {
      if (debug) {
        console.error("Failed to fetch seed:", u);
        console.error(e);
      }
    }
  }

  let styles = [];
  let collections = [];
  let colors = [];
  for (const html of seedHtmls) {
    styles = styles.concat(extractStyleUrls(html));
    collections = collections.concat(extractCollectionUrls(html));
    colors = colors.concat(extractColorUrls(html));
  }
  styles = uniq(styles);
  collections = uniq(collections);
  colors = uniq(colors);

  // Expand once more: sometimes filter lists appear only on filter pages.
  const expandFrom = uniq([...
    styles.slice(0, 25),
    collections.slice(0, 25),
    colors.slice(0, 25),
  ]);
  for (const u of expandFrom) {
    try {
      const html = await fetchText(u);
      styles = uniq(styles.concat(extractStyleUrls(html)));
      collections = uniq(collections.concat(extractCollectionUrls(html)));
      colors = uniq(colors.concat(extractColorUrls(html)));
    } catch {
      // ignore
    }
  }

  const styleList = limitStyles > 0 ? styles.slice(0, limitStyles) : styles;
  const collectionList = limitStyles > 0 ? collections.slice(0, limitStyles) : collections;
  const colorList = limitStyles > 0 ? colors.slice(0, limitStyles) : colors;

  console.log(`Filters: styles=${styleList.length} collections=${collectionList.length} colors=${colorList.length}`);

  if (debug) {
    console.log("styles:", styleList.length);
    console.log(styleList.slice(0, 10));
    console.log("collections:", collectionList.length);
    console.log(collectionList.slice(0, 10));
    console.log("colors:", colorList.length);
    console.log(colorList.slice(0, 10));
  }

  const map = new Map();
  const filterCounts = new Map(); // track count per filter

  const targets = [
    ...styleList.map((u) => ({ type: "style", url: u })),
    ...collectionList.map((u) => ({ type: "collection", url: u })),
    ...colorList.map((u) => ({ type: "color", url: u })),
  ];

  const targetsLimited = maxTargets > 0 ? targets.slice(0, maxTargets) : targets;

  for (const target of targetsLimited) {
    const valueSlug = slugFromUrl(target.url);
    const filterKey = `${target.type}:${valueSlug}`;
    filterCounts.set(filterKey, 0);
    console.log(`Target: ${filterKey}`);

    // Try pagination: ?page=1..N until no new images/titles are found
    let page = 1;
    let emptyStreak = 0;

    while (page <= maxPages && emptyStreak < 2) {
      // Check if we already have enough items for this filter
      if (filterCounts.get(filterKey) >= MAX_ITEMS_PER_FILTER) {
        console.log(`  Reached limit of ${MAX_ITEMS_PER_FILTER} items for ${filterKey}`);
        break;
      }

      const url = `${target.url}?page=${page}`;
      if (!debug && page % 5 === 0) console.log(`  page ${page}`);
      let html;
      try {
        html = await fetchText(url);
      } catch (e) {
        console.error(`  Failed: ${url}`);
        console.error(e);
        emptyStreak += 1;
        page += 1;
        continue;
      }

      // Try to extract product data from RSC payload first (most reliable)
      const rscItems = extractProductDataFromRsc(html);

      if (rscItems && rscItems.length > 0) {
        if (debug) {
          console.log(`  RSC extracted ${rscItems.length} items`);
        }

        for (const item of rscItems) {
          if (filterCounts.get(filterKey) >= MAX_ITEMS_PER_FILTER) break;

          const key = item.key;
          const prev = map.get(key) || { ...item };
          map.set(key, {
            ...prev,
            url: prev.url || item.url,
            style: prev.style || (target.type === "style" ? valueSlug : null) || item.style,
            collection: prev.collection || (target.type === "collection" ? valueSlug : null) || item.collection,
            color: prev.color || (target.type === "color" ? valueSlug : null) || item.color,
          });
          filterCounts.set(filterKey, filterCounts.get(filterKey) + 1);
        }
      } else {
        // Fallback to HTML parsing methods
        const images = extractImages(html);
        const loose = extractTitlesPricesLoose(html);
        const links = uniq([...extractProductLinks(html), ...extractProductLinksFromJson(html)]);
        const cards = extractListingCards(html);

        if (!debug && page === 1) {
          console.log(
            `  found: links=${links.length} images=${images.length} titles=${loose.length} cards=${cards.length}`,
          );
        }

        if (debug) {
          console.log(
            `[${target.type}:${valueSlug}] page ${page}: images=${images.length} loose=${loose.length} links=${links.length}`,
          );
        }

        if (images.length === 0 && loose.length === 0 && links.length === 0 && cards.length === 0) {
          emptyStreak += 1;
          page += 1;
          continue;
        }

        emptyStreak = 0;

        const count = Math.max(cards.length, loose.length, images.length, links.length);
        for (let i = 0; i < count; i += 1) {
          // Skip if we already have enough items for this filter
          if (filterCounts.get(filterKey) >= MAX_ITEMS_PER_FILTER) {
            break;
          }

          const card = cards[i];
          const row = loose[i];
          const urlValue = card?.url || links[i] || null;
          const imageValue = card?.image || images[i] || null;
          const titleValue = card?.title || row?.title || null;
          const priceValue = card?.priceText || row?.priceText || null;
          const key = urlValue || `${titleValue || ""}::${imageValue || ""}`;

          // Skip items without title or image (likely garbage)
          if (!titleValue && !imageValue) continue;
          // Skip logo images
          if (imageValue && (imageValue.includes("logo") || imageValue.includes("static"))) continue;

          const prev = map.get(key) || {
            source: "koenigcarpet.ru",
            kind: "rug",
            key,
            url: urlValue,
            title: titleValue,
            priceText: priceValue,
            image: imageValue,
            style: null,
            collection: null,
            color: null,
            page,
          };

          const next = {
            ...prev,
            key: prev.key || key,
            url: prev.url || urlValue,
            title: prev.title || titleValue,
            priceText: prev.priceText || priceValue,
            image: prev.image || imageValue,
            page: prev.page || page,
            style: prev.style || (target.type === "style" ? valueSlug : null),
            collection: prev.collection || (target.type === "collection" ? valueSlug : null),
            color: prev.color || (target.type === "color" ? valueSlug : null),
          };

          map.set(key, next);
          filterCounts.set(filterKey, filterCounts.get(filterKey) + 1);
        }
      }

      page += 1;
    }
  }

  // compact & remove empty
  const docs = Array.from(map.values())
    .map((d) => ({
      ...d,
      key: d.key || d.url || d.image || d.title,
      title: d.title?.trim() || undefined,
      priceText: d.priceText?.trim() || undefined,
      image: d.image || undefined,
      url: d.url || undefined,
      style: d.style || undefined,
      collection: d.collection || undefined,
      color: d.color || undefined,
    }))
    .filter((d) => d.key && (d.title || d.image || d.priceText));

  const outPath = path.join(process.cwd(), "public", "carpets", "koenigcarpet_rugs.json");
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, JSON.stringify({ generatedAt: new Date().toISOString(), items: docs }, null, 2), "utf8");

  console.log(`Saved: ${outPath}`);
  console.log(`Items: ${docs.length}`);
  if (docs.length === 0) {
    console.log("No items parsed. Most likely the site markup changed or the link/price heuristics are too strict.");
  }

  if (args.has("--mongo")) {
    const res = await maybeUploadToMongo(docs);
    console.log("Mongo uploaded:", res.uploaded);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});