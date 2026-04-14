#!/usr/bin/env node
/**
 * Convert images to WebP format
 * Usage: node scripts/convert-to-webp.mjs [--dry-run]
 */

import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const PUBLIC_DIR = path.join(process.cwd(), "public");

const EXTENSIONS = [".jpg", ".jpeg", ".png"];
const DRY_RUN = process.argv.includes("--dry-run");

async function* walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      yield* walk(fullPath);
    } else if (entry.isFile()) {
      yield fullPath;
    }
  }
}

async function convertToWebp(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (!EXTENSIONS.includes(ext)) return null;

  const webpPath = filePath.replace(/\.(jpg|jpeg|png)$/i, ".webp");
  
  // Skip if webp already exists
  if (fs.existsSync(webpPath)) {
    return { skipped: true, filePath };
  }

  if (DRY_RUN) {
    return { dryRun: true, filePath, webpPath };
  }

  try {
    await sharp(filePath)
      .webp({ quality: 85, effort: 4 })
      .toFile(webpPath);
    
    const originalSize = fs.statSync(filePath).size;
    const webpSize = fs.statSync(webpPath).size;
    const savings = ((1 - webpSize / originalSize) * 100).toFixed(1);
    
    return { converted: true, filePath, webpPath, savings, originalSize, webpSize };
  } catch (err) {
    return { error: true, filePath, message: err.message };
  }
}

async function main() {
  console.log("Converting images to WebP...");
  if (DRY_RUN) console.log("(DRY RUN - no files will be modified)\n");

  const stats = {
    converted: 0,
    skipped: 0,
    errors: 0,
    totalSaved: 0,
  };

  for await (const filePath of walk(PUBLIC_DIR)) {
    const result = await convertToWebp(filePath);
    if (!result) continue;

    if (result.skipped) {
      stats.skipped++;
    } else if (result.dryRun) {
      console.log(`[DRY] ${result.filePath} -> ${result.webpPath}`);
    } else if (result.converted) {
      stats.converted++;
      stats.totalSaved += result.originalSize - result.webpSize;
      console.log(`[OK] ${result.filePath} -> ${result.webpPath} (${result.savings}% smaller)`);
    } else if (result.error) {
      stats.errors++;
      console.error(`[ERR] ${result.filePath}: ${result.message}`);
    }
  }

  console.log("\n--- Summary ---");
  console.log(`Converted: ${stats.converted}`);
  console.log(`Skipped (WebP exists): ${stats.skipped}`);
  console.log(`Errors: ${stats.errors}`);
  if (!DRY_RUN && stats.totalSaved > 0) {
    console.log(`Total saved: ${(stats.totalSaved / 1024).toFixed(1)} KB`);
  }
}

main().catch(console.error);
