import fs from "node:fs";
import path from "node:path";

function usage() {
  console.log("Usage: node front/scripts/trim-rugs-json.mjs <limit> [--inplace]");
  process.exit(1);
}

function parseLimit(v) {
  const n = Number(v);
  if (!Number.isFinite(n) || n <= 0) return null;
  return Math.floor(n);
}

function main() {
  const args = process.argv.slice(2);
  if (args.length < 1) usage();

  const limit = parseLimit(args[0]);
  if (!limit) usage();

  const inPlace = args.includes("--inplace");

  const inFile = path.join(
    process.cwd(),
    "front",
    "public",
    "catalog",
    "6. Ковры",
    "koenigcarpet_rugs.json",
  );

  const raw = fs.readFileSync(inFile, "utf8");
  const data = JSON.parse(raw);

  if (!data || typeof data !== "object" || Array.isArray(data)) {
    throw new Error(`Expected object JSON in ${inFile}`);
  }

  if (!Array.isArray(data.items)) {
    throw new Error(`Expected data.items to be an array in ${inFile}`);
  }

  const before = data.items.length;
  const next = { ...data, items: data.items.slice(0, limit) };

  const outFile = inPlace
    ? inFile
    : path.join(
        process.cwd(),
        "front",
        "public",
        "catalog",
        "6. Ковры",
        `koenigcarpet_rugs.trimmed.${limit}.json`,
      );

  fs.writeFileSync(outFile, JSON.stringify(next, null, 2), "utf8");

  console.log(JSON.stringify({ inFile, outFile, before, after: next.items.length }, null, 2));
}

main();
