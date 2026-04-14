const fs = require('fs');
const path = require('path');

const PUBLIC_DIR = path.join(__dirname, '..', 'public');

// List all directories
console.log('=== Directories in public ===');
const dirs = fs.readdirSync(PUBLIC_DIR, { withFileTypes: true })
  .filter(d => d.isDirectory())
  .map(d => d.name);
console.log(dirs.join('\n'));

// Find directories that match Russian names
const predDir = dirs.find(d => d.includes('äåâî÷êà') || d.includes('äåâî÷êà') || d.includes('äåâî÷êà'));
const himDir = dirs.find(d => d.includes('äåâî÷êà') || d.includes('äåâî÷êà') || d.includes('x'));

console.log('\n=== Predlag directory ===');
if (predDir) {
  const files = fs.readdirSync(path.join(PUBLIC_DIR, predDir));
  files.forEach(f => console.log(f));
} else {
  console.log('Not found, listing all dirs with webp files:');
  dirs.forEach(d => {
    const fullPath = path.join(PUBLIC_DIR, d);
    try {
      const files = fs.readdirSync(fullPath, { withFileTypes: true });
      const webpFiles = files.filter(f => f.isFile() && f.name.endsWith('.webp'));
      if (webpFiles.length > 0) {
        console.log(`\n${d}: ${webpFiles.length} webp files`);
      }
    } catch {}
  });
}

console.log('\n=== Himchistka directory ===');
if (himDir) {
  const files = fs.readdirSync(path.join(PUBLIC_DIR, himDir));
  files.forEach(f => console.log(f));
}

// Check specific files from Services.tsx
console.log('\n=== Checking Services.tsx paths ===');
const servicesImages = [
  'äåâî÷êà_1238.webp',
  'äåâî÷êà -11.webp',
  'äåâî÷êà .webp',
  'äåâî÷êà7390.webp',
];

servicesImages.forEach(name => {
  const found = dirs.some(d => {
    const fullPath = path.join(PUBLIC_DIR, d, name);
    return fs.existsSync(fullPath);
  });
  console.log(`${found ? 'FOUND' : 'NOT FOUND'}: ${name}`);
});
