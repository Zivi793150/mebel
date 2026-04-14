const { MongoClient } = require("mongodb");
const fs = require("fs");
const path = require("path");

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/koenig";

function looksLikeImagePath(s) {
  return /\.(webp|jpe?g|png|gif|avif)(\?[^#]*)?(#.*)?$/i.test(s);
}

function isRemote(s) {
  return /^https?:\/\//i.test(s);
}

function normalizeLocalPath(s) {
  if (!s) return null;
  const noQuery = s.split("?")[0].split("#")[0];
  if (!noQuery.startsWith("/")) return null;
  try {
    return decodeURI(noQuery);
  } catch {
    return noQuery;
  }
}

function walkStrings(value, out) {
  if (typeof value === "string") {
    out.push(value);
    return;
  }
  if (Array.isArray(value)) {
    for (const v of value) walkStrings(v, out);
    return;
  }
  if (value && typeof value === "object") {
    for (const v of Object.values(value)) walkStrings(v, out);
  }
}

async function main() {
  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  const db = client.db("koenig");

  const collections = (await db.listCollections().toArray()).map((c) => c.name);
  const publicDir = path.join(process.cwd(), "public");

  const report = {
    collections: collections.length,
    docs: 0,
    stringsScanned: 0,
    imageStrings: 0,
    nonWebpImageStrings: 0,
    localWebpStrings: 0,
    localWebpMissingFiles: 0,
    examples: {
      nonWebp: [],
      missingWebp: [],
    },
  };

  for (const name of collections) {
    const col = db.collection(name);
    const cursor = col.find({}, { projection: { _id: 1 } });
    const ids = await cursor.toArray();

    for (const { _id } of ids) {
      report.docs += 1;
      const doc = await col.findOne({ _id });
      if (!doc) continue;

      const strings = [];
      walkStrings(doc, strings);
      report.stringsScanned += strings.length;

      for (const s of strings) {
        if (!looksLikeImagePath(s)) continue;
        report.imageStrings += 1;

        const isWebp = /\.webp(\?[^#]*)?(#.*)?$/i.test(s);
        if (!isWebp) {
          report.nonWebpImageStrings += 1;
          if (report.examples.nonWebp.length < 50) {
            report.examples.nonWebp.push({ collection: name, _id: String(_id), value: s });
          }
        }

        const local = normalizeLocalPath(s);
        if (local && !isRemote(s) && isWebp) {
          report.localWebpStrings += 1;
          const fsPath = path.join(publicDir, local.replace(/^\//, ""));
          if (!fs.existsSync(fsPath)) {
            report.localWebpMissingFiles += 1;
            if (report.examples.missingWebp.length < 80) {
              report.examples.missingWebp.push({ collection: name, _id: String(_id), value: local });
            }
          }
        }
      }
    }
  }

  const outPath = path.join(process.cwd(), "audit-mongodb-image-paths.report.json");
  fs.writeFileSync(outPath, JSON.stringify(report, null, 2), "utf8");

  console.log(JSON.stringify(report, null, 2));
  console.log(`\nSaved report to: ${outPath}`);
  await client.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
