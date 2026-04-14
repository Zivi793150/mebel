#!/usr/bin/env node
/**
 * Convert ALL .jfif files to webp in public folder
 */

import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const PUBLIC_DIR = path.join(process.cwd(), "front", "public");

let converted = 0;
let skipped = 0;
let errors = 0;

async function convertJfifToWebp(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    
    if (entry.isDirectory()) {
      await convertJfifToWebp(fullPath);
    } else if (entry.isFile() && entry.name.toLowerCase().endsWith(".jfif")) {
      const webpPath = fullPath.replace(/\.jfif$/i, ".webp");
      
      if (fs.existsSync(webpPath)) {
        skipped++;
        continue;
      }
      
      try {
        await sharp(fullPath)
          .webp({ quality: 85 })
          .toFile(webpPath);
        converted++;
      } catch (err) {
        console.error(`[ERROR] ${fullPath}: ${err.message}`);
        errors++;
      }
    }
  }
}

console.log("Converting ALL .jfif files to webp...\n");

await convertJfifToWebp(PUBLIC_DIR);

console.log(`\nDone! Converted: ${converted}, Skipped: ${skipped}, Errors: ${errors}`);
