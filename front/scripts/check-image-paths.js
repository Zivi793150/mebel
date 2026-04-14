const fs = require('fs');
const path = require('path');

const PUBLIC_DIR = path.join(__dirname, '..', 'public');

// Paths from Services.tsx
const servicesPaths = [
  '/äåâî÷êà/äåâî÷êà_1238.webp',
  '/äåâî÷êà/äåâî÷êà -11.webp',
  '/äåâî÷êà/äåâî÷êà .webp',
  '/äåâî÷êà/äåâî÷êà7390.webp',
  '/äåâî÷êà/3. äåâî÷êà .webp',
  '/äåâî÷êà/äåâî÷êà 1 .webp',
];

// Paths from WorkSteps.tsx
const workStepsPaths = [
  '/äåâî÷êà .webp',
  '/äåâî÷êà 1 .webp',
];

console.log('Checking image paths...\n');

console.log('=== Services.tsx paths ===');
for (const p of servicesPaths) {
  const fullPath = path.join(PUBLIC_DIR, p);
  const exists = fs.existsSync(fullPath);
  console.log(`${exists ? 'OK' : 'MISSING'}: ${p}`);
}

console.log('\n=== WorkSteps.tsx paths ===');
for (const p of workStepsPaths) {
  const fullPath = path.join(PUBLIC_DIR, p);
  const exists = fs.existsSync(fullPath);
  console.log(`${exists ? 'OK' : 'MISSING'}: ${p}`);
}

// List all files in äåâî÷êà and äåâî÷êà directories
console.log('\n=== Files in äåâî÷êà directory ===');
const predDir = path.join(PUBLIC_DIR, 'äåâî÷êà');
if (fs.existsSync(predDir)) {
  const files = fs.readdirSync(predDir);
  files.forEach(f => console.log(f));
} else {
  console.log('Directory not found');
}

console.log('\n=== Files in äåâî÷êà directory ===');
const himDir = path.join(PUBLIC_DIR, 'äåâî÷êà');
if (fs.existsSync(himDir)) {
  const files = fs.readdirSync(himDir);
  files.forEach(f => console.log(f));
} else {
  console.log('Directory not found');
}
