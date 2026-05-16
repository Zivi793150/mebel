const fs = require('fs');

// Get all real photos in public/electro
const realFiles = fs.readdirSync('front/public/electro')
  .filter(f => f.endsWith('.jpg') || f.endsWith('.png'))
  .filter(f => f.length > 20); // Filter out icons

// Get currently used photos from page.tsx
const pageContent = fs.readFileSync('front/app/electro/page.tsx', 'utf8');
const usedMatches = [...pageContent.matchAll(/"\/electro\/([^"]+)"/g)];
const usedPhotos = [...new Set(usedMatches.map(m => m[1]))];

console.log('=== REAL PHOTOS IN public/electro ===');
console.log(`Total: ${realFiles.length}`);
realFiles.forEach((f, i) => console.log(`${i+1}. ${f}`));

console.log('\n\n=== CURRENTLY USED IN TYPES ===');
console.log(`Total: ${usedPhotos.length}`);
usedPhotos.forEach((f, i) => console.log(`${i+1}. ${f}`));

// Find missing (used but not exist)
const missing = usedPhotos.filter(f => !realFiles.includes(f));
console.log('\n\n=== MISSING FILES ===');
if (missing.length > 0) {
  missing.forEach(f => console.log(`❌ ${f}`));
} else {
  console.log('All used files exist ✓');
}

// Find unused (exist but not used)
const unused = realFiles.filter(f => !usedPhotos.includes(f));
console.log('\n\n=== UNUSED PHOTOS (can be added as extras) ===');
console.log(`Total: ${unused.length}`);
unused.forEach((f, i) => console.log(`${i+1}. ${f}`));
