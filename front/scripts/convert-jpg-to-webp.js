const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const CATALOG_DIR = path.join(__dirname, '..', 'public', 'catalog');

async function convertToWebP(inputPath, outputPath) {
  try {
    await sharp(inputPath)
      .webp({ quality: 85 })
      .toFile(outputPath);
    return true;
  } catch (e) {
    console.error(`Failed to convert ${inputPath}:`, e.message);
    return false;
  }
}

async function main() {
  console.log('Converting JPG/PNG to WebP...\n');
  
  let converted = 0;
  let skipped = 0;
  
  async function processDir(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        await processDir(fullPath);
      } else {
        const ext = path.extname(fullPath).toLowerCase();
        if (['.jpg', '.jpeg', '.png', '.jfif'].includes(ext)) {
          const webpPath = fullPath.replace(/\.[^.]+$/, '.webp');
          
          // Skip if webp already exists
          if (fs.existsSync(webpPath)) {
            skipped++;
            continue;
          }
          
          if (await convertToWebP(fullPath, webpPath)) {
            console.log(`✓ ${path.relative(CATALOG_DIR, fullPath)} -> .webp`);
            converted++;
          }
        }
      }
    }
  }
  
  await processDir(CATALOG_DIR);
  console.log(`\nConverted: ${converted}, Skipped: ${skipped}`);
}

main().catch(console.error);
