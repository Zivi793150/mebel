const fs = require('fs');
const path = require('path');

const FRONT_DIR = path.join(__dirname, '..');

// Mapping of corrupted to correct Russian names
const REPLACEMENTS = {
  // Folder names
  'äåâî÷êà': 'äåâî÷êà',
  'äåâî÷êà': 'äåâî÷êà',
  
  // File names - need to find actual files
  'ÔÎÒÎ ÍÀ ÇÀÌÅÍÓ ÑÀËÎÍ .webp': null, // Will be detected
  'Ôîòî íà êíîïêó 1 .webp': null,
};

// Get actual filenames from public
const PUBLIC_DIR = path.join(FRONT_DIR, 'public');
const actualFiles = [];

function collectFiles(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.isDirectory()) {
      collectFiles(path.join(dir, entry.name));
    } else {
      actualFiles.push(entry.name);
    }
  }
}

collectFiles(PUBLIC_DIR);

// Find files that match patterns
const photoFiles = actualFiles.filter(f => f.includes('äåâî÷êà') || f.includes('äåâî÷êà') || f.includes('äåâî÷êà'));
console.log('Photo files found:', photoFiles.slice(0, 5));

// Files to fix
const filesToFix = [
  'app/designers/sections/DesignersBenefits.tsx',
  'components/Footer.tsx', 
  'sections/CTA.tsx',
  'sections/PortfolioSlider.tsx',
  'app/catalog/[slug]/page.tsx',
];

// Fix each file
for (const relPath of filesToFix) {
  const filePath = path.join(FRONT_DIR, relPath);
  if (!fs.existsSync(filePath)) continue;
  
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  
  // Fix specific patterns
  const fixes = [
    // Corrupted "ÔÎÒÎ ÍÀ ÇÀÌÅÍÓ ÑÀËÎÍ" -> need to find actual file
    [/src="\/[^"]*Ô[^"]*\.webp"/g, (match) => {
      // Find matching file
      const name = actualFiles.find(f => f.includes('äåâî÷êà') || f.includes('äåâî÷êà'));
      if (name) {
        modified = true;
        return `src="/${name}"`;
      }
      return match;
    }],
    // Corrupted "Ôîòî íà êíîïêó" -> "äåâî÷êà"
    [/Ôîòî íà êíîïêó 1 \.webp/g, 'äåâî÷êà 1 .webp'],
    // Corrupted folder name "äåâî÷êà" -> "äåâî÷êà"
    [/äåâî÷êà/g, 'äåâî÷êà'],
    // Fix "äåâî÷êà" in folder paths
    [/for_designers\/äåâî÷êà/g, 'for_designers/äåâî÷êà'],
  ];
  
  for (const [pattern, replacement] of fixes) {
    if (typeof replacement === 'function') {
      content = content.replace(pattern, replacement);
    } else {
      const newContent = content.replace(pattern, replacement);
      if (newContent !== content) {
        modified = true;
        content = newContent;
      }
    }
  }
  
  if (modified) {
    fs.writeFileSync(filePath, content);
    console.log(`Fixed: ${relPath}`);
  }
}

console.log('\nDone!');
