const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'sections', 'PortfolioSlider.tsx');

// Read as buffer
let content = fs.readFileSync(filePath);

// Wrong bytes (Latin äåâî÷êà): c3a4c3a5c3a2c3aec3b7c3aac3a0
// Correct bytes (Russian äåâî÷êà): d09bd0b8d182d0bed0b2d181d0bad0b8d0b920d0b2d0b0d0bb

const wrongBytes = Buffer.from([0xc3, 0xa4, 0xc3, 0xa5, 0xc3, 0xa2, 0xc3, 0xae, 0xc3, 0xb7, 0xc3, 0xaa, 0xc3, 0xa0]);
const correctBytes = Buffer.from('äåâî÷êà', 'utf8');

console.log('Wrong bytes (Latin):', wrongBytes.toString('hex'));
console.log('Correct bytes (Russian):', correctBytes.toString('hex'));

// Find all occurrences
let idx = 0;
let count = 0;
while (true) {
  idx = content.indexOf(wrongBytes, idx);
  if (idx === -1) break;
  count++;
  console.log(`Found at position ${idx}`);
  idx++;
}

console.log(`Total occurrences: ${count}`);

// Replace
const wrongStr = wrongBytes.toString('utf8');
const correctStr = correctBytes.toString('utf8');

let contentStr = content.toString('utf8');
const before = contentStr.length;
contentStr = contentStr.split(wrongStr).join(correctStr);
const after = contentStr.length;

console.log(`Length before: ${before}, after: ${after}`);

fs.writeFileSync(filePath, contentStr);

// Verify
const newContent = fs.readFileSync(filePath);
console.log('\nVerification - first occurrence around line 71:');
const newStr = newContent.toString('utf8');
const line71Idx = newStr.indexOf('cover: enc');
if (line71Idx !== -1) {
  const snippet = newStr.substring(line71Idx, line71Idx + 60);
  console.log(snippet);
  console.log('Hex:', Buffer.from(snippet).toString('hex'));
}

console.log('\nDone!');
