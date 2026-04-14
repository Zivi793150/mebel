#!/usr/bin/env node
/**
 * Convert .jfif files to webp in for_designers folder
 */

import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const FOR_DESIGNERS_DIR = path.join(process.cwd(), "front", "public", "for_designers");

async function convertJfifToWebp(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    
    if (entry.isDirectory()) {
      await convertJfifToWebp(fullPath);
    } else if (entry.isFile() && entry.name.toLowerCase().endsWith(".jfif")) {
      const webpPath = fullPath.replace(/\.jfif$/i, ".webp");
      
      if (fs.existsSync(webpPath)) {
        console.log(`[SKIP] ${entry.name} - webp already exists`);
        continue;
      }
      
      try {
        await sharp(fullPath)
          .webp({ quality: 85 })
          .toFile(webpPath);
        
        const origSize = fs.statSync(fullPath).size;
        const webpSize = fs.statSync(webpPath).size;
        const savings = ((1 - webpSize / origSize) * 100).toFixed(1);
        
        console.log(`[CONVERTED] ${entry.name} -> ${path.basename(webpPath)} (${savings}% smaller)`);
      } catch (err) {
        console.error(`[ERROR] ${entry.name}: ${err.message}`);
      }
    }
  }
}

console.log("Converting .jfif files to webp in for_designers...\n");

try {
  await convertJfifToWebp(FOR_DESIGNERS_DIR);
  console.log("\nDone!");
} catch (err) {
  console.error("Error:", err.message);
  process.exit(1);
}
