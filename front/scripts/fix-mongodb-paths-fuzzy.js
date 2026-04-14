const { MongoClient, ObjectId } = require("mongodb");
const fs = require("fs");
const path = require("path");

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/koenig";

function normalize(s) {
  return String(s || "")
    .toLowerCase()
    .replace(/[._\-\s]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
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

function similarity(a, b) {
  const na = normalize(a);
  const nb = normalize(b);
  if (na === nb) return 1;
  if (na.includes(nb) || nb.includes(na)) return 0.9;
  return 0;
}

function findBestMatch(targetPath, availableFiles) {
  const targetNorm = normalize(path.basename(targetPath));
  let best = null;
  let bestScore = 0;
  
  for (const file of availableFiles) {
    const score = similarity(targetPath, file);
    if (score > bestScore) {
      bestScore = score;
      best = file;
    }
  }
  
  return bestScore > 0.8 ? best : null;
}

async function scanDirectory(dir, base = "", files = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    const webPath = base + "/" + entry.name;
    
    if (entry.isDirectory()) {
      await scanDirectory(fullPath, webPath, files);
    } else if (entry.isFile() && /\.(webp|jpe?g|png)$/i.test(entry.name)) {
      files.push(webPath);
    }
  }
  
  return files;
}

async function main() {
  const frontRoot = process.cwd();
  const publicDir = path.join(frontRoot, "public");
  const catalogDir = path.join(publicDir, "catalog");
  
  console.log("Scanning available files...");
  const availableFiles = await scanDirectory(catalogDir, "/catalog");
  console.log(`Found ${availableFiles.length} image files in public/catalog`);
  
  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  const db = client.db("koenig");
  
  // Collections to check
  const collections = ["curtain_types", "blinds_types", "bedspreads_and_pillows", "decor_items", "cornices"];
  
  let totalFixed = 0;
  let totalMissing = 0;
  
  for (const collName of collections) {
    console.log(`\n--- Checking ${collName} ---`);
    const col = db.collection(collName);
    const docs = await col.find({}).toArray();
    
    for (const doc of docs) {
      const paths = collectImagePaths(doc);
      let docUpdated = false;
      let newDoc = { ...doc };
      
      for (const imgPath of paths) {
        const clean = decodePath(stripQueryHash(imgPath));
        const absPath = path.join(publicDir, clean.replace(/^\//, "").split("/").join(path.sep));
        
        if (fs.existsSync(absPath)) continue; // File exists, skip
        
        totalMissing++;
        console.log(`\nMissing: ${clean}`);
        
        // Try to find match
        const match = findBestMatch(clean, availableFiles);
        
        if (match) {
          console.log(`  -> Suggested: ${match}`);
          
          // Apply fix
          newDoc = replaceInDoc(newDoc, imgPath, match);
          docUpdated = true;
          totalFixed++;
        } else {
          console.log(`  -> No match found`);
        }
      }
      
      if (docUpdated) {
        delete newDoc._id;
        await col.updateOne({ _id: doc._id }, { $set: newDoc });
        console.log(`  Updated doc ${doc._id}`);
      }
    }
  }
  
  console.log(`\n=== Summary ===`);
  console.log(`Missing paths: ${totalMissing}`);
  console.log(`Fixed: ${totalFixed}`);
  
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

function replaceInDoc(obj, oldVal, newVal) {
  if (typeof obj === "string") {
    return obj === oldVal ? newVal : obj;
  }
  if (Array.isArray(obj)) {
    return obj.map((v) => replaceInDoc(v, oldVal, newVal));
  }
  if (obj && typeof obj === "object") {
    const result = {};
    for (const [k, v] of Object.entries(obj)) {
      result[k] = replaceInDoc(v, oldVal, newVal);
    }
    return result;
  }
  return obj;
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
