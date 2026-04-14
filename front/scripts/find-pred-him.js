const fs = require('fs');
const path = require('path');

const PUBLIC_DIR = path.join(__dirname, '..', 'public');

// Find directories by looking at all dirs
const dirs = fs.readdirSync(PUBLIC_DIR, { withFileTypes: true })
  .filter(d => d.isDirectory())
  .map(d => d.name);

// Find the directories we need
dirs.forEach(dirName => {
  const fullPath = path.join(PUBLIC_DIR, dirName);
  const files = fs.readdirSync(fullPath);
  
  // Check if this is the Predlagam directory (has webp files)
  const webpFiles = files.filter(f => f.endsWith('.webp'));
  if (webpFiles.length > 0 && webpFiles.length <= 10) {
    console.log(`\n=== ${dirName} (${webpFiles.length} webp files) ===`);
    webpFiles.forEach(f => console.log(f));
  }
});

// Also check root for specific files
console.log('\n=== Root webp files matching patterns ===');
const rootFiles = fs.readdirSync(PUBLIC_DIR)
  .filter(f => f.endsWith('.webp'));
rootFiles.forEach(f => {
  if (f.includes('äåâî÷êà') || f.includes('äåâî÷êà') || f.includes('äåâî÷êà') || f.includes('äåâî÷êà')) {
    console.log(f);
  }
});

// Check for specific file patterns
console.log('\n=== Looking for specific Services.tsx files ===');
const patterns = ['1238', '-11', '7390', 'äåâî÷êà', 'äåâî÷êà'];
patterns.forEach(p => {
  const found = rootFiles.find(f => f.includes(p));
  if (found) console.log(`Found pattern "${p}": ${found}`);
});
