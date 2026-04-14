const fs = require('fs');
const path = require('path');

const PUBLIC_DIR = path.join(__dirname, '..', 'public');
const MAPPINGS_FILE = path.join(__dirname, 'rename-mappings.json');

// Read mappings
const { renames } = JSON.parse(fs.readFileSync(MAPPINGS_FILE, 'utf8'));

console.log(`Processing ${renames.length} renames...\n`);

// Sort: files first, then deepest dirs first (rename children before parents)
renames.sort((a, b) => {
  if (a.isDir !== b.isDir) return a.isDir ? 1 : -1; // files first
  return b.oldPath.split(/[\/\\]/).length - a.oldPath.split(/[\/\\]/).length;
});

let success = 0;
let failed = 0;

for (const item of renames) {
  try {
    // Check if source exists
    if (!fs.existsSync(item.oldPath)) {
      console.log('SKIP (not found):', item.oldRelative);
      continue;
    }
    
    // Check if target already exists
    if (fs.existsSync(item.newPath)) {
      console.log('SKIP (exists):', item.newRelative);
      continue;
    }
    
    // Rename
    fs.renameSync(item.oldPath, item.newPath);
    console.log('OK:', item.oldRelative, '->', item.newRelative);
    success++;
  } catch (e) {
    console.log('FAIL:', item.oldRelative, '-', e.message);
    failed++;
  }
}

console.log(`\n=== Done ===`);
console.log(`Success: ${success}`);
console.log(`Failed: ${failed}`);
console.log(`Skipped: ${renames.length - success - failed}`);
