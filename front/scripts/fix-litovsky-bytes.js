const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'sections', 'PortfolioSlider.tsx');

// Read file
let content = fs.readFileSync(filePath);

// Latin "äåâî÷êà" bytes (WRONG)
const latinBytes = Buffer.from([0xc3, 0xa4, 0xc3, 0xa5, 0xc3, 0xa2, 0xc3, 0xae, 0xc3, 0xb7, 0xc3, 0xaa, 0xc3, 0xa0]);

// Russian "äåâî÷êà" bytes (CORRECT)
const russianBytes = Buffer.from('äåâî÷êà', 'utf8');

console.log('Latin bytes:', latinBytes.toString('hex'));
console.log('Russian bytes:', russianBytes.toString('hex'));
console.log('Are they same?', latinBytes.equals(russianBytes));

// They ARE the same! The file has UTF-8 encoded Latin characters
// We need to replace with actual Russian "äåâî÷êà"

const correctRussian = 'äåâî÷êà';
const wrongLatin = 'äåâî÷êà';

console.log('\nWrong (Latin):', wrongLatin);
console.log('Correct (Russian):', correctRussian);
console.log('Wrong hex:', Buffer.from(wrongLatin).toString('hex'));
console.log('Correct hex:', Buffer.from(correctRussian).toString('hex'));

// Now replace in content
let contentStr = content.toString('utf8');

// Count before
const matchesBefore = (contentStr.match(/for_designers\/[^\x00-\x7F\/]+\/RED/g) || []).length;
console.log('\nMatches before:', matchesBefore);

// Replace the Latin folder name with Russian
contentStr = contentStr.replace(/for_designers\/[^\x00-\x7F\/]+\/RED/g, `for_designers/${correctRussian}/RED`);

// Replace title
contentStr = contentStr.replace(/title: "[^\x00-\x7F]+",/g, (m) => {
  if (m.includes('äåâî÷êà') || m.includes('äåâî÷êà')) {
    return `title: "${correctRussian}",`;
  }
  return m;
});

// Write
fs.writeFileSync(filePath, contentStr);

// Verify
const newContent = fs.readFileSync(filePath, 'utf8');
const lines = newContent.split('\n');
console.log('\nVerification:');
for (let i = 70; i < 75; i++) {
  console.log(`Line ${i}: ${lines[i].substring(0, 60)}`);
  console.log(`  Hex: ${Buffer.from(lines[i].substring(0, 50)).toString('hex')}`);
}
