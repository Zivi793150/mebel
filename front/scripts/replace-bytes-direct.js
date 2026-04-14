const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'sections', 'PortfolioSlider.tsx');

// Read as buffer
let content = fs.readFileSync(filePath);

// WRONG: Latin "äåâî÷êà" = c3a4c3a5c3a2c3aec3b7c3aac3a0
const wrongBytes = Buffer.from([0xc3, 0xa4, 0xc3, 0xa5, 0xc3, 0xa2, 0xc3, 0xae, 0xc3, 0xb7, 0xc3, 0xaa, 0xc3, 0xa0]);

// CORRECT: Russian "äåâî÷êà" = d09bd0b8d182d0bed0b2d181d0bad0b8d0b920d0b2d0b0d0bb
const correctBytes = Buffer.from('äåâî÷êà', 'utf8');

console.log('Wrong (Latin äåâî÷êà):', wrongBytes.toString('hex'));
console.log('Correct (Russian äåâî÷êà):', correctBytes.toString('hex'));
console.log('Length: wrong=%d, correct=%d', wrongBytes.length, correctBytes.length);

// Find and replace
let idx = 0;
let replacements = 0;
const chunks = [];

while (idx < content.length) {
  const foundIdx = content.indexOf(wrongBytes, idx);
  if (foundIdx === -1) {
    chunks.push(content.slice(idx));
    break;
  }
  
  chunks.push(content.slice(idx, foundIdx));
  chunks.push(correctBytes);
  idx = foundIdx + wrongBytes.length;
  replacements++;
}

if (replacements > 0) {
  const newContent = Buffer.concat(chunks);
  fs.writeFileSync(filePath, newContent);
  console.log(`\nReplaced ${replacements} occurrences`);
  
  // Verify
  const verify = fs.readFileSync(filePath, 'utf8');
  const lines = verify.split('\n');
  console.log('\nVerification:');
  for (let i = 70; i < 75; i++) {
    console.log(`Line ${i}: ${lines[i].substring(0, 60)}`);
  }
} else {
  console.log('No occurrences found');
}
