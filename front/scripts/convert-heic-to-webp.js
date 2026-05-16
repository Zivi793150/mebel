const fs = require('fs').promises;
const path = require('path');
const convert = require('heic-convert');

const TARGET_DIR = path.join(__dirname, '..', 'public', 'for_designers', 'sokolniky');

async function main() {
  try {
    const files = await fs.readdir(TARGET_DIR);
    const heicFiles = files.filter(f => f.toLowerCase().endsWith('.heic'));
    
    console.log(`🚀 Found ${heicFiles.length} HEIC files to convert...`);

    for (const file of heicFiles) {
      const inputPath = path.join(TARGET_DIR, file);
      const outputPath = inputPath.replace(/\.heic$/i, '.webp');
      
      try {
        const inputBuffer = await fs.readFile(inputPath);
        const outputBuffer = await convert({
          buffer: inputBuffer,
          format: 'JPEG', // Convert to JPEG first as intermediary for sharp if needed, or directly to JPEG then sharp to webp
          quality: 1
        });

        // Use sharp to convert the resulting buffer to a high-quality webp
        const sharp = require('sharp');
        await sharp(outputBuffer)
          .webp({ quality: 85 })
          .toFile(outputPath);

        console.log(`✅ Converted: ${file} -> ${path.basename(outputPath)}`);
      } catch (err) {
        console.error(`❌ Failed ${file}:`, err.message);
      }
    }
    console.log('\n✨ Conversion complete!');
  } catch (err) {
    console.error('Fatal error:', err.message);
  }
}

main();
