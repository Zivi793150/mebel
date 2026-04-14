const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'sections', 'PortfolioSlider.tsx');

// Read file
let content = fs.readFileSync(filePath, 'utf8');

// The corrupted bytes c3a4c3a5c3a2c3aec3b7c3aac3a0 need to be replaced
// with correct Russian "äåâî÷êà" (d09bd0b8d182d0bed0b2d181d0bad0b8d0b920d0b2d0b0d0bb)

// Replace using buffer manipulation
const correctFolder = 'äåâî÷êà';
const correctTitle = 'äåâî÷êà';

// Count occurrences
const matches = content.match(/for_designers\/[^\x00-\x7F]+\/RED/g);
console.log('Found', matches ? matches.length : 0, 'potential matches');

// Replace the corrupted folder name with correct one
// The pattern matches non-ASCII characters in the path
content = content.replace(/for_designers\/[^\x00-\x7F]+\/RED/g, (match) => {
  console.log('Replacing:', match);
  return `for_designers/${correctFolder}/RED`;
});

// Also fix title
content = content.replace(/title: "[^\x00-\x7F]+",/g, (match) => {
  if (match.includes('äåâî÷êà') || match.includes('äåâî÷êà')) {
    console.log('Replacing title:', match);
    return `title: "${correctTitle}",`;
  }
  return match;
});

fs.writeFileSync(filePath, content);
console.log('\nFixed PortfolioSlider.tsx');
