const { MongoClient } = require("mongodb");
const fs = require("fs");
const path = require("path");

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/koenig";

function normalizeFolderName(name) {
  return String(name || "")
    .toLowerCase()
    .replace(/[._]+/g, " ")  // dots and underscores to space
    .replace(/\s+/g, " ")     // multiple spaces to single
    .replace(/\s*\/\s*/g, "/") // normalize slashes
    .trim();
}

function extractFolderNames(mongoPath) {
  const clean = String(mongoPath || "").split("?")[0].split("#")[0];
  if (!clean.startsWith("/catalog/")) return [];
  
  const parts = clean.replace("/catalog/", "").split("/");
  return parts.slice(0, -1); // exclude filename
}

function getAllRealFolders(catalogDir) {
  const folders = [];
  
  function scan(dir, base = "") {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isDirectory()) {
        const fullPath = base ? `${base}/${entry.name}` : entry.name;
        folders.push(fullPath);
        scan(path.join(dir, entry.name), fullPath);
      }
    }
  }
  
  scan(catalogDir);
  return folders;
}

async function main() {
  // Script runs from mebel root, not front/
  const frontRoot = path.join(process.cwd(), "front");
  const publicDir = path.join(frontRoot, "public");
  const catalogDir = path.join(publicDir, "catalog");
  
  console.log("Front root:", frontRoot);
  console.log("Catalog dir:", catalogDir);
  console.log("Exists:", require("fs").existsSync(catalogDir));
  
  if (!require("fs").existsSync(catalogDir)) {
    console.error("ERROR: Catalog directory not found!");
    process.exit(1);
  }
  
  console.log("\nScanning real folder structure...");
  const realFolders = getAllRealFolders(catalogDir);
  console.log(`Found ${realFolders.length} folders`);
  
  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  const db = client.db("koenig");
  
  const collections = ["curtain_types", "blinds_types", "bedspreads_and_pillows"];
  
  const mongoFolders = new Set();
  const mismatches = [];
  
  for (const collName of collections) {
    const col = db.collection(collName);
    const docs = await col.find({}).toArray();
    
    for (const doc of docs) {
      const paths = collectImagePaths(doc);
      for (const p of paths) {
        const folders = extractFolderNames(p);
        folders.forEach((f) => mongoFolders.add(f));
      }
    }
  }
  
  console.log(`\nFound ${mongoFolders.size} unique folder paths in MongoDB`);
  
  // Check each MongoDB folder against real folders
  for (const mongoFolder of mongoFolders) {
    const normMongo = normalizeFolderName(mongoFolder);
    
    // Check if exact path exists
    const fullPath = path.join(catalogDir, ...mongoFolder.split("/"));
    if (fs.existsSync(fullPath)) continue;
    
    // Try to find similar folder
    let bestMatch = null;
    let bestScore = 0;
    
    for (const realFolder of realFolders) {
      const normReal = normalizeFolderName(realFolder);
      
      if (normMongo === normReal) {
        bestMatch = realFolder;
        bestScore = 1;
        break;
      }
      
      // Check if one contains the other
      if (normMongo.includes(normReal) || normReal.includes(normMongo)) {
        const score = 0.8;
        if (score > bestScore) {
          bestScore = score;
          bestMatch = realFolder;
        }
      }
    }
    
    if (bestMatch && bestScore >= 0.8) {
      mismatches.push({
        mongo: mongoFolder,
        real: bestMatch,
        score: bestScore,
      });
    } else {
      mismatches.push({
        mongo: mongoFolder,
        real: null,
        score: 0,
      });
    }
  }
  
  console.log("\n=== Folder Mismatches ===");
  for (const m of mismatches.sort((a, b) => b.score - a.score)) {
    if (m.real) {
      console.log(`\nMongoDB: ${m.mongo}`);
      console.log(`Real:    ${m.real}`);
      console.log(`Score:   ${m.score.toFixed(2)}`);
    } else {
      console.log(`\nNOT FOUND: ${m.mongo}`);
    }
  }
  
  console.log(`\nTotal mismatches: ${mismatches.length}`);
  console.log(`Fixable: ${mismatches.filter((m) => m.real).length}`);
  
  await client.close();
}

function collectImagePaths(obj, paths = []) {
  if (typeof obj === "string") {
    if (/\.(webp|jpe?g|png)$/i.test(obj)) paths.push(obj);
    return paths;
  }
  if (Array.isArray(obj)) {
    obj.forEach((v) => collectImagePaths(v, paths));
    return paths;
  }
  if (obj && typeof obj === "object") {
    Object.values(obj).forEach((v) => collectImagePaths(v, paths));
  }
  return paths;
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
