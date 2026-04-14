const { MongoClient, ObjectId } = require("mongodb");
const fs = require("fs");
const path = require("path");

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/koenig";

function stripQueryHash(p) {
  return String(p || "").split("?")[0].split("#")[0];
}

function decodePath(p) {
  try {
    return decodeURI(p);
  } catch {
    return p;
  }
}

function isLocalWebp(p) {
  const s = stripQueryHash(p);
  return s.startsWith("/") && /\.webp$/i.test(s);
}

function existsInPublic(publicDir, webPath) {
  const clean = stripQueryHash(webPath);
  const abs = path.join(publicDir, clean.replace(/^\//, "").split("/").join(path.sep));
  return fs.existsSync(abs);
}

function collectLocalWebps(value, acc) {
  if (typeof value === "string") {
    if (isLocalWebp(value)) acc.push(value);
    return;
  }
  if (Array.isArray(value)) {
    for (const v of value) collectLocalWebps(v, acc);
    return;
  }
  if (value && typeof value === "object") {
    for (const v of Object.values(value)) collectLocalWebps(v, acc);
  }
}

function removeStringEverywhere(value, toRemove) {
  if (typeof value === "string") {
    return value === toRemove ? null : value;
  }
  if (Array.isArray(value)) {
    let changed = false;
    const next = [];
    for (const v of value) {
      const r = removeStringEverywhere(v, toRemove);
      if (r !== v) changed = true;
      if (r === null) {
        changed = true;
        continue;
      }
      next.push(r);
    }
    return changed ? next : value;
  }
  if (value && typeof value === "object") {
    let changed = false;
    const next = {};
    for (const [k, v] of Object.entries(value)) {
      const r = removeStringEverywhere(v, toRemove);
      if (r !== v) changed = true;
      if (r === null) {
        // if a scalar field was exactly the missing string, drop the field
        changed = true;
        continue;
      }
      next[k] = r;
    }
    return changed ? next : value;
  }
  return value;
}

async function main() {
  const frontRoot = process.cwd();
  const publicDir = path.join(frontRoot, "public");
  const reportPath = path.join(frontRoot, "audit-mongodb-image-paths.report.json");

  if (!fs.existsSync(reportPath)) {
    console.error(`Report not found: ${reportPath}`);
    process.exit(1);
  }

  const report = JSON.parse(fs.readFileSync(reportPath, "utf8"));
  const missing = report?.examples?.missingWebp ?? [];

  if (!Array.isArray(missing) || missing.length === 0) {
    console.log("No missing webp paths in report.");
    return;
  }

  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  const db = client.db("koenig");

  let updatedDocs = 0;
  let removedRefs = 0;

  for (const entry of missing) {
    const collection = String(entry.collection || "").trim();
    const idStr = String(entry._id || "").trim();
    const raw = String(entry.value || "");

    if (!collection || !idStr || !raw) continue;

    const col = db.collection(collection);
    const _id = ObjectId.isValid(idStr) ? new ObjectId(idStr) : idStr;

    const doc = await col.findOne({ _id });
    if (!doc) continue;

    const decodedRaw = decodePath(raw);

    // If the file actually exists now (maybe fixed by another script), skip.
    if (isLocalWebp(decodedRaw) && existsInPublic(publicDir, decodedRaw)) continue;

    // Pick fallback existing local webp from the same doc
    const candidates = [];
    collectLocalWebps(doc, candidates);
    const fallback = candidates.find((p) => existsInPublic(publicDir, decodePath(p)));

    // Remove the missing reference everywhere (raw and decoded variants)
    let next = removeStringEverywhere(doc, raw);
    next = removeStringEverywhere(next, decodedRaw);

    // If doc has a top-level 'image' and it became missing (removed), ensure it exists
    if (fallback) {
      if (!next.image && doc.image && (doc.image === raw || decodePath(doc.image) === decodedRaw)) {
        next.image = fallback;
      }
      if (!next.url && doc.url && (doc.url === raw || decodePath(doc.url) === decodedRaw)) {
        next.url = fallback;
      }
    }

    const changed = JSON.stringify(doc) !== JSON.stringify(next);
    if (!changed) continue;

    await col.replaceOne({ _id }, next);
    updatedDocs += 1;
    removedRefs += 1;
    console.log(`✅ Cleaned: ${collection} ${idStr} removed missing: ${decodedRaw}${fallback ? ` (fallback: ${fallback})` : ""}`);
  }

  console.log(`\nDone. Updated docs: ${updatedDocs}, removed missing refs: ${removedRefs}`);
  await client.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
