const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const PUBLIC_DIR = path.join(__dirname, '..', 'public');

const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.JPG', '.JPEG', '.PNG'];

async function convertToWebp(filePath) {
  const ext = path.extname(filePath);
  if (!ALLOWED_EXTENSIONS.includes(ext)) return;
  
  const webpPath = filePath.replace(ext, '.webp');
  
  // Skip if webp already exists and is newer
  if (fs.existsSync(webpPath)) {
    const originalStat = fs.statSync(filePath);
    const webpStat = fs.statSync(webpPath);
    if (webpStat.mtime >= originalStat.mtime) {
      console.log(`⏭️  Skipping (up to date): ${path.relative(PUBLIC_DIR, webpPath)}`);
      return;
    }
  }
  
  try {
    await sharp(filePath)
      .webp({ quality: 85, effort: 6 })
      .toFile(webpPath);
    
    const originalSize = fs.statSync(filePath).size;
    const webpSize = fs.statSync(webpPath).size;
    const savings = ((originalSize - webpSize) / originalSize * 100).toFixed(1);
    
    console.log(`✅ ${path.relative(PUBLIC_DIR, webpPath)} (${savings}% smaller)`);
  } catch (err) {
    console.error(`❌ Failed to convert ${filePath}:`, err.message);
  }
}

async function processDirectory(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    
    if (entry.isDirectory()) {
      await processDirectory(fullPath);
    } else {
      await convertToWebp(fullPath);
    }
  }
}

async function main() {
  console.log('🚀 Converting images to WebP...\n');
  await processDirectory(PUBLIC_DIR);
  console.log('\n✨ Done!');
}

main().catch(console.error);
