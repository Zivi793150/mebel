const fs = require('fs');
const path = require('path');

const PUBLIC_DIR = path.join(__dirname, '..', 'public');

// Check icons folder
console.log('=== Files in icons folder ===');
const iconsDir = path.join(PUBLIC_DIR, 'äåâî÷êà');
if (fs.existsSync(iconsDir)) {
  const files = fs.readdirSync(iconsDir);
  files.forEach(f => console.log(f));
} else {
  // Find the correct folder
  const dirs = fs.readdirSync(PUBLIC_DIR, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name);
  
  console.log('Looking for icons folder...');
  dirs.forEach(d => {
    if (d.includes('äåâî÷êà') || d.includes('äåâî÷êà') || d.toLowerCase().includes('icon') || d.includes('äåâî÷êà')) {
      console.log(`\nFound: ${d}`);
      const files = fs.readdirSync(path.join(PUBLIC_DIR, d));
      files.forEach(f => console.log(`  ${f}`));
    }
  });
}

// Check specific files
console.log('\n=== Checking specific icon files ===');
const iconFiles = [
  'äåâî÷êà.webp',
  'äåâî÷êà _121.webp',
  'äåâî÷êà_907.webp',
  'äåâî÷êà _121.webp',
  'äåâî÷êà .webp',
  'äåâî÷êà .webp',
  'äåâî÷êà .webp',
  'äåâî÷êà .webp',
];

iconFiles.forEach(f => {
  const fullPath = path.join(PUBLIC_DIR, 'äåâî÷êà', f);
  console.log(`${fs.existsSync(fullPath) ? 'OK' : 'MISSING'}: /äåâî÷êà/${f}`);
});
