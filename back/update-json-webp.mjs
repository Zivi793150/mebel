#!/usr/bin/env node
/**
 * Update image paths in JSON backup files to webp
 */

import fs from "node:fs";
import path from "node:path";

const BACK_DIR = path.join(process.cwd(), "back");

const JSON_FILES = [
  "koenig.bedding_items.json",
  "koenig.bedspreads_and_pillows.json",
  "koenig.blinds_subcatalogs.json",
  "koenig.blinds_types.json",
  "koenig.carpet_items.json",
  "koenig.cornices.json",
  "koenig.curtain_types.json",
  "koenig.decor_items.json",
];

function updateImageUrls(obj) {
  if (typeof obj === "string") {
    return obj.replace(/\.(jpe?g|png)(\?[^#]*)?(#.*)?$/gi, ".webp$2$3");
  }
  if (Array.isArray(obj)) {
    return obj.map(updateImageUrls);
  }
  if (obj && typeof obj === "object") {
    const result = {};
    for (const [key, value] of Object.entries(obj)) {
      result[key] = updateImageUrls(value);
    }
    return result;
  }
  return obj;
}

function processFile(filename) {
  const filePath = path.join(BACK_DIR, filename);
  
  if (!fs.existsSync(filePath)) {
    console.log(`[SKIP] ${filename} - file not found`);
    return;
  }
  
  const raw = fs.readFileSync(filePath, "utf8");
  const docs = JSON.parse(raw);
  
  if (!Array.isArray(docs)) {
    console.log(`[SKIP] ${filename} - not an array`);
    return;
  }
  
  const updated = docs.map(updateImageUrls);
  
  if (JSON.stringify(docs) === JSON.stringify(updated)) {
    console.log(`[OK] ${filename} - no changes needed`);
    return;
  }
  
  fs.writeFileSync(filePath, JSON.stringify(updated, null, 2), "utf8");
  console.log(`[UPDATED] ${filename}`);
}

console.log("Updating JSON backup files to webp paths...\n");

for (const file of JSON_FILES) {
  processFile(file);
}

console.log("\nDone!");
