const fs = require('fs');

// Get all real photos
const realFiles = fs.readdirSync('front/public/electro')
  .filter(f => f.endsWith('.jpg') || f.endsWith('.png'));

// Get currently used photos from TYPES in page.tsx
const pageContent = fs.readFileSync('front/app/electro/page.tsx', 'utf8');

// Extract the TYPES array
const typesMatch = pageContent.match(/const TYPES = \[([\s\S]*?)\];/);
if (!typesMatch) {
  console.log('Could not find TYPES array');
  process.exit(1);
}

// Extract all image paths from TYPES
const imageMatches = [...pageContent.matchAll(/"\/electro\/([^"]+)"/g)];
const usedPhotos = [...new Set(imageMatches.map(m => m[1]))];

console.log('=== REAL PHOTOS IN public/electro ===');
console.log(`Total: ${realFiles.length}`);

console.log('\n=== CURRENTLY USED IN TYPES ===');
console.log(`Total: ${usedPhotos.length}`);
usedPhotos.forEach((f, i) => {
  const exists = realFiles.includes(f);
  console.log(`${i+1}. ${f} ${exists ? '✓' : '❌ MISSING'}`);
});

// Find missing files
const missing = usedPhotos.filter(f => !realFiles.includes(f));
console.log('\n=== MISSING FILES ===');
if (missing.length > 0) {
  missing.forEach(f => console.log(`❌ ${f}`));
} else {
  console.log('All used files exist ✓');
}

// Find unused real photos (potential extras)
const unused = realFiles.filter(f => !usedPhotos.includes(f));
console.log('\n=== UNUSED PHOTOS (potential extras) ===');
console.log(`Total: ${unused.length}`);
unused.forEach((f, i) => console.log(`${i+1}. ${f}`));
