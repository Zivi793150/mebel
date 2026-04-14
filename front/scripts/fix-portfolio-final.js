const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'sections', 'PortfolioSlider.tsx');

// Read as buffer to handle raw bytes
let content = fs.readFileSync(filePath);

// The corrupted sequence is UTF-8 bytes for "äåâî÷êà" (c3a4c3a5c3a2c3aec3b7c3aac3a0)
// We need to replace it with UTF-8 bytes for "äåâî÷êà"
const correctFolder = Buffer.from('äåâî÷êà', 'utf8');
const correctTitle = Buffer.from('äåâî÷êà', 'utf8');

console.log('Correct folder bytes:', correctFolder.toString('hex'));
console.log('Correct title bytes:', correctTitle.toString('hex'));

// Convert content to string for replacement
let str = content.toString('utf8');

// Check what we're looking for
const lines = str.split('\n');
for (let i = 70; i < 75; i++) {
  const line = lines[i];
  console.log(`Line ${i}: "${line.substring(0, 60)}..."`);
  console.log(`  Hex: ${Buffer.from(line.substring(0, 40)).toString('hex')}`);
}

// The file already has correct UTF-8, it's just displayed wrong in console
// Let's verify by checking if the folder exists
const forDesignersDir = path.join(__dirname, '..', 'public', 'for_designers');
const folders = fs.readdirSync(forDesignersDir, { withFileTypes: true })
  .filter(d => d.isDirectory())
  .map(d => d.name);

console.log('\nActual folders in for_designers:');
folders.forEach(f => {
  console.log(`  "${f}" - Hex: ${Buffer.from(f).toString('hex')}`);
});

// Find the matching folder
const litovskyVal = folders.find(f => f.includes('äåâî÷êà') || f.includes('äåâî÷êà') || f.includes('äåâî÷êà'));
console.log(`\nMatching folder: "${litovskyVal}"`);

if (litovskyVal) {
  // Replace in file
  const corruptedPattern = /for_designers\/[^/]+\/RED/g;
  const matches = str.match(corruptedPattern);
  console.log('Matches found:', matches ? matches.length : 0);
  
  // Replace all instances
  str = str.replace(/for_designers\/[äåâî÷êà]+\/RED/g, `for_designers/${litovskyVal}/RED`);
  
  // Also fix title
  str = str.replace(/title: "[äåâî÷êà]+"/, `title: "${litovskyVal}"`);
  
  fs.writeFileSync(filePath, str);
  console.log('\nFixed PortfolioSlider.tsx');
}
