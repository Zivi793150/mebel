const { MongoClient, ObjectId } = require("mongodb");
const fs = require("fs");
const path = require("path");

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/koenig";

function decodePath(p) {
  try {
    return decodeURI(p);
  } catch {
    return p;
  }
}

function stripQueryHash(p) {
  return p.split("?")[0].split("#")[0];
}

function basename(p) {
  const clean = stripQueryHash(p).replace(/\\/g, "/");
  const idx = clean.lastIndexOf("/");
  return idx >= 0 ? clean.slice(idx + 1) : clean;
}

function replaceInDoc(value, oldStr, newStr) {
  if (typeof value === "string") {
    return value === oldStr ? newStr : value;
  }
  if (Array.isArray(value)) {
    let changed = false;
    const next = value.map((v) => {
      const r = replaceInDoc(v, oldStr, newStr);
      if (r !== v) changed = true;
      return r;
    });
    return changed ? next : value;
  }
  if (value && typeof value === "object") {
    let changed = false;
    const next = {};
    for (const [k, v] of Object.entries(value)) {
      const r = replaceInDoc(v, oldStr, newStr);
      if (r !== v) changed = true;
      next[k] = r;
    }
    return changed ? next : value;
  }
  return value;
}

function findFileByBasename(publicDir, fileBase) {
  // BFS walk limited to public/catalog for speed
  const root = path.join(publicDir, "catalog");
  const queue = [root];
  const matches = [];

  while (queue.length) {
    const dir = queue.pop();
    let entries;
    try {
      entries = fs.readdirSync(dir, { withFileTypes: true });
    } catch {
      continue;
    }

    for (const e of entries) {
      const full = path.join(dir, e.name);
      if (e.isDirectory()) {
        queue.push(full);
      } else if (e.isFile()) {
        if (e.name === fileBase) matches.push(full);
      }
    }

    if (matches.length > 10) break;
  }

  if (matches.length === 1) return matches[0];
  return null;
}

function toWebPath(publicDir, absFilePath) {
  const rel = path.relative(publicDir, absFilePath).split(path.sep).join("/");
  return "/" + rel;
}

async function main() {
  const repoFront = process.cwd();
  const publicDir = path.join(repoFront, "public");
  const reportPath = path.join(repoFront, "audit-mongodb-image-paths.report.json");

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

  let fixed = 0;
  let unresolved = 0;

  for (const item of missing) {
    const collectionName = String(item.collection || "").trim();
    const idStr = String(item._id || "").trim();
    const oldValRaw = String(item.value || "");
    const oldVal = decodePath(oldValRaw);

    if (!collectionName || !idStr || !oldVal) continue;

    const col = db.collection(collectionName);
    const _id = ObjectId.isValid(idStr) ? new ObjectId(idStr) : idStr;
    const doc = await col.findOne({ _id });
    if (!doc) continue;

    // 1) Known typo fixes
    let newVal = oldVal;
    newVal = newVal.replace("Металлические карниезы", "Металлические карнизы");

    // If still missing, try locate file by basename
    const cleanNew = stripQueryHash(newVal);
    const absTry = path.join(publicDir, cleanNew.replace(/^\//, "").split("/").join(path.sep));

    if (!fs.existsSync(absTry)) {
      const fileBase = basename(newVal);
      const absFound = findFileByBasename(publicDir, fileBase);
      if (absFound) {
        newVal = toWebPath(publicDir, absFound);
      }
    }

    const cleanFinal = stripQueryHash(newVal);
    const absFinal = path.join(publicDir, cleanFinal.replace(/^\//, "").split("/").join(path.sep));

    if (!fs.existsSync(absFinal)) {
      unresolved += 1;
      console.log(`❌ Unresolved: ${collectionName} ${idStr} ${oldVal}`);
      continue;
    }

    const updatedDoc = replaceInDoc(doc, oldValRaw, newVal);
    const changed = JSON.stringify(doc) !== JSON.stringify(updatedDoc);
    if (!changed) {
      // Try also replacing decoded value variant
      const updatedDoc2 = replaceInDoc(doc, oldVal, newVal);
      const changed2 = JSON.stringify(doc) !== JSON.stringify(updatedDoc2);
      if (!changed2) {
        unresolved += 1;
        console.log(`❌ Could not replace in doc: ${collectionName} ${idStr} ${oldVal}`);
        continue;
      }

      await col.replaceOne({ _id }, updatedDoc2);
      fixed += 1;
      console.log(`✅ Fixed: ${collectionName} ${idStr} ${oldVal} -> ${newVal}`);
      continue;
    }

    await col.replaceOne({ _id }, updatedDoc);
    fixed += 1;
    console.log(`✅ Fixed: ${collectionName} ${idStr} ${oldValRaw} -> ${newVal}`);
  }

  console.log(`\nDone. Fixed: ${fixed}, Unresolved: ${unresolved}`);
  await client.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
