const { MongoClient } = require("mongodb");
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/koenig";

function stripQueryHash(p) {
  return String(p || "").split("?")[0].split("#")[0];
}

function isLocalWebp(p) {
  const s = stripQueryHash(p);
  return s.startsWith("/") && /\.webp$/i.test(s);
}

function decodePath(p) {
  try {
    return decodeURI(p);
  } catch {
    return p;
  }
}

function collectStrings(value, acc) {
  if (typeof value === "string") {
    acc.push(value);
    return;
  }
  if (Array.isArray(value)) {
    for (const v of value) collectStrings(v, acc);
    return;
  }
  if (value && typeof value === "object") {
    for (const v of Object.values(value)) collectStrings(v, acc);
  }
}

async function main() {
  const frontRoot = process.cwd();
  const publicDir = path.join(frontRoot, "public");

  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  const db = client.db("koenig");

  const collections = (await db.listCollections().toArray()).map((c) => c.name);
  const urls = new Set();

  for (const name of collections) {
    const col = db.collection(name);
    const docs = await col.find({}, { projection: { _id: 0 } }).toArray();
    for (const doc of docs) {
      const strings = [];
      collectStrings(doc, strings);
      for (const s of strings) {
        if (!isLocalWebp(s)) continue;
        urls.add(decodePath(stripQueryHash(s)));
      }
    }
  }

  const list = Array.from(urls).sort((a, b) => a.localeCompare(b, "ru"));
  console.log(`Found ${list.length} unique local .webp paths in MongoDB`);

  const invalid = [];
  const missing = [];

  for (const webPath of list) {
    const abs = path.join(publicDir, webPath.replace(/^\//, "").split("/").join(path.sep));
    if (!fs.existsSync(abs)) {
      missing.push(webPath);
      continue;
    }

    try {
      await sharp(abs).metadata();
    } catch (e) {
      invalid.push({ path: webPath, error: String(e && e.message ? e.message : e) });
    }
  }

  const report = {
    total: list.length,
    missingCount: missing.length,
    invalidCount: invalid.length,
    missing: missing.slice(0, 100),
    invalid: invalid.slice(0, 100),
  };

  const outPath = path.join(frontRoot, "validate-mongodb-webp-files.report.json");
  fs.writeFileSync(outPath, JSON.stringify(report, null, 2), "utf8");

  console.log(JSON.stringify(report, null, 2));
  console.log(`Saved report to: ${outPath}`);

  await client.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
