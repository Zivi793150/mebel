const { MongoClient } = require("mongodb");
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/koenig";

const COLLECTION_MAP = {
  curtains: ["curtain_types", "catalog_items"],
  blinds: ["blinds_types", "blinds_subcatalogs"],
  roman: ["curtain_types"],
  rails: ["cornices"],
  decor: ["decor_items"],
  bedding: ["bedding_items"],
  rugs: ["carpet_items"],
  pillows: ["bedspreads_and_pillows", "catalog_items"],
};

function isLocalPath(p) {
  return typeof p === "string" && p.startsWith("/");
}

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

async function main() {
  const category = process.argv[2];
  if (!category || !COLLECTION_MAP[category]) {
    console.log("Usage: node validate-specific-collection.js <category>");
    console.log("Categories:", Object.keys(COLLECTION_MAP).join(", "));
    process.exit(1);
  }

  const frontRoot = process.cwd();
  const publicDir = path.join(frontRoot, "public");
  const collections = COLLECTION_MAP[category];

  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  const db = client.db("koenig");

  const results = {
    category,
    collections: {},
    totalPaths: 0,
    existing: 0,
    missing: 0,
    invalid: 0,
  };

  for (const collName of collections) {
    const col = db.collection(collName);
    const docs = await col.find({}).toArray();
    
    const collResult = {
      docs: docs.length,
      paths: [],
      missing: [],
      invalid: [],
    };

    for (const doc of docs) {
      const strings = [];
      collectStrings(doc, strings);
      
      for (const s of strings) {
        if (!isLocalPath(s)) continue;
        if (!/\.(webp|jpe?g|png)$/i.test(s)) continue;
        
        results.totalPaths++;
        collResult.paths.push(s);
        
        const clean = decodePath(stripQueryHash(s));
        const absPath = path.join(publicDir, clean.replace(/^\//, "").split("/").join(path.sep));
        
        if (!fs.existsSync(absPath)) {
          results.missing++;
          collResult.missing.push(s);
          console.log(`❌ Missing: ${s}`);
          continue;
        }
        
        results.existing++;
        
        // Validate WebP
        try {
          await sharp(absPath).metadata();
        } catch (e) {
          results.invalid++;
          collResult.invalid.push({ path: s, error: e.message });
          console.log(`⚠️ Invalid: ${s} - ${e.message}`);
        }
      }
    }
    
    results.collections[collName] = collResult;
  }

  console.log("\n=== Summary ===");
  console.log(`Category: ${category}`);
  console.log(`Total paths: ${results.totalPaths}`);
  console.log(`Existing: ${results.existing}`);
  console.log(`Missing: ${results.missing}`);
  console.log(`Invalid: ${results.invalid}`);

  await client.close();
}

function collectStrings(obj, acc) {
  if (typeof obj === "string") {
    acc.push(obj);
    return;
  }
  if (Array.isArray(obj)) {
    obj.forEach((v) => collectStrings(v, acc));
    return;
  }
  if (obj && typeof obj === "object") {
    Object.values(obj).forEach((v) => collectStrings(v, acc));
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
