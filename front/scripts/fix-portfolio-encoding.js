const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'sections', 'PortfolioSlider.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// The corrupted text is UTF-8 bytes interpreted as Latin-1
// Need to replace with correct Russian "äåâî÷êà"
const correctFolder = 'äåâî÷êà';
const correctTitle = 'äåâî÷êà';

// Replace all instances of the corrupted folder name
// Pattern: any sequence that looks like the corrupted encoding
const corruptedPattern = /äåâî÷êà/g;

content = content.replace(corruptedPattern, correctFolder);

// Also fix the title
content = content.replace(/title: "äåâî÷êà"/, `title: "${correctTitle}"`);

fs.writeFileSync(filePath, content);
console.log('Fixed PortfolioSlider.tsx');
