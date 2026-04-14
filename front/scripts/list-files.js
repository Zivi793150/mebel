const fs = require('fs');
const path = require('path');

const PUBLIC_DIR = path.join(__dirname, '..', 'public');

// List files in äåâî÷êà (Predlagam) directory
console.log('=== Files in äåâî÷êà (Predlagam) ===');
const predDir = path.join(PUBLIC_DIR, 'äåâî÷êà');
if (fs.existsSync(predDir)) {
  const files = fs.readdirSync(predDir);
  files.forEach(f => console.log(f));
}

// List files in äåâî÷êà (Himchistka) directory  
console.log('\n=== Files in äåâî÷êà (Himchistka) ===');
const himDir = path.join(PUBLIC_DIR, 'äåâî÷êà');
if (fs.existsSync(himDir)) {
  const files = fs.readdirSync(himDir);
  files.forEach(f => console.log(f));
}

// List root webp files
console.log('\n=== Root webp files ===');
const rootFiles = fs.readdirSync(PUBLIC_DIR)
  .filter(f => f.endsWith('.webp'));
rootFiles.forEach(f => console.log(f));
