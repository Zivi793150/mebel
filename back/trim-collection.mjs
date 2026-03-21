import fs from "node:fs";
import path from "node:path";

function usage() {
  console.log("Usage: node back/trim-collection.mjs <collectionName> <limit> [--inplace] [--sort=updatedAtDesc|file]");
  process.exit(1);
}

function parseLimit(v) {
  const n = Number(v);
  if (!Number.isFinite(n) || n <= 0) return null;
  return Math.floor(n);
}

function getDateValue(doc) {
  const u = doc?.updatedAt;
  if (!u) return null;
  if (typeof u === "string") return u;
  if (typeof u === "object" && typeof u.$date === "string") return u.$date;
  return null;
}

function getOidValue(doc) {
  const id = doc?._id;
  if (!id) return "";
  if (typeof id === "string") return id;
  if (typeof id === "object" && typeof id.$oid === "string") return id.$oid;
  return "";
}

function main() {
  const args = process.argv.slice(2);
  if (args.length < 2) usage();

  const collectionName = args[0];
  const limit = parseLimit(args[1]);
  if (!collectionName || !limit) usage();

  const flags = new Set(args.slice(2));
  const sortFlag = args.find((a) => a.startsWith("--sort="));
  const sortMode = sortFlag ? sortFlag.slice("--sort=".length) : "updatedAtDesc";

  const inPlace = flags.has("--inplace");

  const inFile = path.join(process.cwd(), "back", `koenig.${collectionName}.json`);
  if (!fs.existsSync(inFile)) {
    throw new Error(`File not found: ${inFile}`);
  }

  const raw = fs.readFileSync(inFile, "utf8");
  const docs = JSON.parse(raw);
  if (!Array.isArray(docs)) {
    throw new Error(`Expected JSON array in ${inFile}`);
  }

  let nextDocs = docs;

  if (sortMode === "updatedAtDesc") {
    nextDocs = [...docs].sort((a, b) => {
      const da = getDateValue(a);
      const db = getDateValue(b);
      if (da && db) {
        if (da > db) return -1;
        if (da < db) return 1;
      } else if (da && !db) {
        return -1;
      } else if (!da && db) {
        return 1;
      }

      const oa = getOidValue(a);
      const ob = getOidValue(b);
      if (oa < ob) return -1;
      if (oa > ob) return 1;
      return 0;
    });
  } else if (sortMode === "file") {
    nextDocs = docs;
  } else {
    throw new Error(`Unknown --sort mode: ${sortMode}`);
  }

  const trimmed = nextDocs.slice(0, limit);

  const outFile = inPlace
    ? inFile
    : path.join(process.cwd(), "back", `koenig.${collectionName}.trimmed.${limit}.json`);

  fs.writeFileSync(outFile, JSON.stringify(trimmed, null, 2), "utf8");

  console.log(JSON.stringify({ collectionName, inFile, outFile, before: docs.length, after: trimmed.length }, null, 2));
}

main();
