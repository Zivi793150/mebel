const fs = require('fs');
const path = require('path');

const PUBLIC_DIR = path.join(__dirname, '..', 'public');

// Skip these directories completely
const SKIP_DIRS = [
  'for_designers',
  'node_modules',
  '.next',
  'dist'
];

const EXTENSIONS_TO_DELETE = ['.jpg', '.jpeg', '.png', '.JPG', '.JPEG', '.PNG'];

function shouldSkipDir(dirPath) {
  const relativePath = path.relative(PUBLIC_DIR, dirPath);
  return SKIP_DIRS.some(skip => relativePath.includes(skip));
}

function removeOriginalImages(dir) {
  if (shouldSkipDir(dir)) {
    console.log(`⏭️  Skipping: ${path.relative(PUBLIC_DIR, dir)}`);
    return;
  }

  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      removeOriginalImages(fullPath);
    } else {
      const ext = path.extname(entry.name);
      if (EXTENSIONS_TO_DELETE.includes(ext)) {
        // Check if webp version exists
        const webpPath = fullPath.replace(ext, '.webp');
        if (fs.existsSync(webpPath)) {
          fs.unlinkSync(fullPath);
          console.log(`🗑️  Deleted: ${path.relative(PUBLIC_DIR, fullPath)}`);
        } else {
          console.log(`⚠️  No WebP found, keeping: ${path.relative(PUBLIC_DIR, fullPath)}`);
        }
      }
    }
  }
}

console.log('🚀 Removing original images (keeping WebP only)...\n');
console.log('⚠️  Protected directories:', SKIP_DIRS.join(', '));
console.log('');

removeOriginalImages(PUBLIC_DIR);

console.log('\n✨ Cleanup complete!');
