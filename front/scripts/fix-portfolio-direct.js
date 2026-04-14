const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'sections', 'PortfolioSlider.tsx');

// Read file as buffer
const content = fs.readFileSync(filePath);

// The correct Russian text "äåâî÷êà" as UTF-8 bytes
const correctBytes = Buffer.from('äåâî÷êà', 'utf8');
console.log('Correct bytes:', correctBytes.toString('hex'));

// The corrupted bytes in the file (äåâî÷êà as Latin-1 interpreted as UTF-8)
const corruptedBytes = Buffer.from([0xc3, 0xa4, 0xc3, 0xa5, 0xc3, 0xa2, 0xc3, 0xae, 0xc3, 0xb7, 0xc3, 0xaa, 0xc3, 0xa0]);
console.log('Corrupted bytes:', corruptedBytes.toString('hex'));

// Find and replace in buffer
let contentStr = content.toString('utf8');

// Check current bytes in file
const lines = contentStr.split('\n');
for (let i = 70; i < 75; i++) {
  const lineBuf = Buffer.from(lines[i].substring(0, 50));
  console.log(`Line ${i} hex:`, lineBuf.toString('hex').substring(0, 100));
}

// Replace the corrupted sequence with correct Russian
// The file has c3a4... which is UTF-8 for äåâî÷êà (Latin)
// We need d09b... which is UTF-8 for äåâî÷êà (Russian)

// Simple string replacement should work if we use the correct strings
const correctFolder = 'äåâî÷êà';
const corruptedFolder = Buffer.from([0xc3, 0xa4, 0xc3, 0xa5, 0xc3, 0xa2, 0xc3, 0xae, 0xc3, 0xb7, 0xc3, 0xaa, 0xc3, 0xa0]).toString('utf8');

console.log('\nCorrupted folder string:', corruptedFolder);
console.log('Correct folder string:', correctFolder);

// Replace
contentStr = contentStr.split(corruptedFolder).join(correctFolder);

// Write back
fs.writeFileSync(filePath, contentStr);
console.log('\nFixed!');

// Verify
const newContent = fs.readFileSync(filePath, 'utf8');
const newLines = newContent.split('\n');
for (let i = 70; i < 75; i++) {
  const lineBuf = Buffer.from(newLines[i].substring(0, 50));
  console.log(`New Line ${i} hex:`, lineBuf.toString('hex').substring(0, 100));
}
