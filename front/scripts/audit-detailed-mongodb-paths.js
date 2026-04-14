const { MongoClient } = require("mongodb");
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

function isImagePath(p) {
  return /\.(webp|jpe?g|png|gif|avif)$/i.test(p);
}

function collectImagePaths(obj, paths = new Set()) {
  if (typeof obj === "string") {
    if (isImagePath(obj)) paths.add(obj);
    return paths;
  }
  if (Array.isArray(obj)) {
    obj.forEach((item) => collectImagePaths(item, paths));
    return paths;
  }
  if (obj && typeof obj === "object") {
    Object.values(obj).forEach((val) => collectImagePaths(val, paths));
  }
  return paths;
}

async function main() {
  const frontRoot = process.cwd();
  const publicDir = path.join(frontRoot, "public");

  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  const db = client.db("koenig");

  const collections = (await db.listCollections().toArray()).map((c) => c.name);
  
  const report = {
    totalCollections: collections.length,
    totalDocs: 0,
    totalImagePaths: 0,
    existingFiles: 0,
    missingFiles: 0,
    byCollection: {},
    missingDetails: [],
  };

  for (const collName of collections) {
    const col = db.collection(collName);
    const docs = await col.find({}).toArray();
    
    report.totalDocs += docs.length;
    
    const collReport = {
      docs: docs.length,
      imagePaths: 0,
      existing: 0,
      missing: 0,
      missingList: [],
    };

    for (const doc of docs) {
      const paths = collectImagePaths(doc);
      
      for (const imgPath of paths) {
        collReport.imagePaths++;
        report.totalImagePaths++;
        
        const cleanPath = stripQueryHash(decodePath(imgPath));
        const isLocal = cleanPath.startsWith("/");
        
        if (!isLocal) {
          // External URL - skip file check
          collReport.existing++;
          report.existingFiles++;
          continue;
        }
        
        const absPath = path.join(publicDir, cleanPath.replace(/^\//, "").split("/").join(path.sep));
        
        if (fs.existsSync(absPath)) {
          collReport.existing++;
          report.existingFiles++;
        } else {
          collReport.missing++;
          report.missingFiles++;
          
          const detail = {
            collection: collName,
            docId: String(doc._id),
            path: imgPath,
            field: findFieldWithValue(doc, imgPath),
          };
          
          collReport.missingList.push(detail);
          report.missingDetails.push(detail);
        }
      }
    }
    
    report.byCollection[collName] = collReport;
  }

  // Sort missing by collection
  report.missingDetails.sort((a, b) => {
    if (a.collection !== b.collection) return a.collection.localeCompare(b.collection);
    return a.path.localeCompare(b.path, "ru");
  });

  // Save report
  const outPath = path.join(frontRoot, "detailed-mongodb-audit.json");
  fs.writeFileSync(outPath, JSON.stringify(report, null, 2), "utf8");

  // Print summary
  console.log("\n=== MongoDB Image Paths Audit ===\n");
  console.log(`Collections: ${report.totalCollections}`);
  console.log(`Documents: ${report.totalDocs}`);
  console.log(`Image paths: ${report.totalImagePaths}`);
  console.log(`Existing files: ${report.existingFiles}`);
  console.log(`Missing files: ${report.missingFiles}`);
  
  console.log("\n=== By Collection ===");
  for (const [name, data] of Object.entries(report.byCollection)) {
    if (data.missing > 0) {
      console.log(`\n${name}:`);
      console.log(`  Missing: ${data.missing}/${data.imagePaths}`);
      data.missingList.slice(0, 10).forEach((m) => {
        console.log(`    - ${m.path}`);
      });
      if (data.missingList.length > 10) {
        console.log(`    ... and ${data.missingList.length - 10} more`);
      }
    }
  }
  
  console.log(`\n\nFull report saved to: ${outPath}`);
  
  await client.close();
}

function findFieldWithValue(obj, value, path = "") {
  if (typeof obj === "string") {
    return obj === value ? path : null;
  }
  if (Array.isArray(obj)) {
    for (let i = 0; i < obj.length; i++) {
      const result = findFieldWithValue(obj[i], value, `${path}[${i}]`);
      if (result) return result;
    }
    return null;
  }
  if (obj && typeof obj === "object") {
    for (const [key, val] of Object.entries(obj)) {
      const newPath = path ? `${path}.${key}` : key;
      const result = findFieldWithValue(val, value, newPath);
      if (result) return result;
    }
  }
  return null;
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
