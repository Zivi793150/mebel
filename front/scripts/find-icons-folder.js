const fs = require('fs');
const path = require('path');

const PUBLIC_DIR = path.join(__dirname, '..', 'public');

// List all directories
console.log('=== All directories ===');
const dirs = fs.readdirSync(PUBLIC_DIR, { withFileTypes: true })
  .filter(d => d.isDirectory())
  .map(d => d.name);
dirs.forEach(d => console.log(d));

// Find folder with webp files that could be icons
console.log('\n=== Folders with few webp files (potential icons) ===');
dirs.forEach(d => {
  const fullPath = path.join(PUBLIC_DIR, d);
  try {
    const files = fs.readdirSync(fullPath).filter(f => f.endsWith('.webp'));
    if (files.length > 0 && files.length <= 15) {
      console.log(`\n${d} (${files.length} webp files):`);
      files.forEach(f => console.log(`  ${f}`));
    }
  } catch {}
});
