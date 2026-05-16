const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const TARGET_DIR = path.join(__dirname, '..', 'public', 'for_designers', 'sokolniky');

async function convertFile(filePath) {
  const ext = path.extname(filePath);
  if (ext.toLowerCase() !== '.jpg') return;

  const webpPath = filePath.replace(ext, '.webp');
  
  try {
    // Delete if exists and 0 bytes
    if (fs.existsSync(webpPath)) {
      const stat = fs.statSync(webpPath);
      if (stat.size === 0) {
        fs.unlinkSync(webpPath);
      }
    }

    await sharp(filePath)
      .webp({ quality: 85, effort: 6 })
      .toFile(webpPath);
    
    console.log(`✅ Converted: ${path.basename(webpPath)}`);
  } catch (err) {
    console.error(`❌ Failed ${path.basename(filePath)}:`, err.message);
  }
}

async function main() {
  if (!fs.existsSync(TARGET_DIR)) {
    console.error('Directory not found:', TARGET_DIR);
    return;
  }
  const files = fs.readdirSync(TARGET_DIR);
  for (const file of files) {
    await convertFile(path.join(TARGET_DIR, file));
  }
}

main();
