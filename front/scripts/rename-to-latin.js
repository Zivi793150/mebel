const fs = require('fs');
const path = require('path');

const PUBLIC_DIR = path.join(__dirname, '..', 'public');

// Mapping of Russian to Latin names
const RENAME_MAP = {
  // Root folders
  'äåâî÷êà': 'icons',
  'äåâî÷êà': 'offers', 
  'äåâî÷êà': 'examples',
  'äåâî÷êà': 'tasks',
  'äåâî÷êà': 'reels',
  'äåâî÷êà': 'photos',
  'äåâî÷êà': 'cleaning',
  'äåâî÷êà': 'timeline',
  
  // Catalog folders
  '1.äåâî÷êà': '1-curtains',
  '2.äåâî÷êà': '2-blinds',
  '3.äåâî÷êà': '3-roman',
  '4.äåâî÷êà': '4-rails',
  '5. äåâî÷êà': '5-decor',
  '6. äåâî÷êà': '6-rugs',
  '7.äåâî÷êà': '7-bedding',
  '8.äåâî÷êà': '8-pillows',
  
  // for_designers folders
  '5 äåâî÷êà': 'project-5',
  '6 äåâî÷êà': 'project-6',
  'äåâî÷êà': 'apartments',
  'äåâî÷êà': 'harmony',
  'äåâî÷êà äåâî÷êà': 'zhk-belinskogo',
  'äåâî÷êà': 'litovsky-val',
  'äåâî÷êà äåâî÷êà': 'german-fund',
  'äåâî÷êà äåâî÷êà': 'quiet-luxury',
  
  // Root files
  'äåâî÷êà äåâî÷êà.webp': 'designer-girl.webp',
  'äåâî÷êà äåâî÷êà.webp': 'order-work.webp',
  'äåâî÷êà äåâî÷êà.webp': 'cleaning-btn.webp',
  'äåâî÷êà äåâî÷êà.webp': 'main-designers.webp',
  'äåâî÷êà äåâî÷êà 1 .webp': 'photo-btn-1.webp',
  'äåâî÷êà äåâî÷êà äåâî÷êà.webp': 'photo-replace-salon.webp',
  'äåâî÷êà äåâî÷êà äåâî÷êà.webp': 'photo-replace-design.webp',
  'äåâî÷êà äåâî÷êà 1.webp': 'bg-main-1.webp',
  'äåâî÷êà äåâî÷êà.webp': 'bg-cleaning.webp',
  
  // Icons folder files
  'äåâî÷êà.webp': 'curtains.webp',
  'äåâî÷êà _121.webp': 'blinds.webp',
  'äåâî÷êà_907.webp': 'roman.webp',
  'äåâî÷êà _121.webp': 'rails.webp',
  'äåâî÷êà .webp': 'decor.webp',
  'äåâî÷êà .webp': 'bedding.webp',
  'äåâî÷êà .webp': 'rugs.webp',
  'äåâî÷êà .webp': 'pillows.webp',
};

// First, let's list all files/folders with Russian names
console.log('=== Finding items with Russian names ===\n');

function hasRussian(str) {
  return /[\u0400-\u04FF]/.test(str);
}

const toRename = [];

function scan(dir, base = '') {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    if (entry.name === 'node_modules' || entry.name === '.next' || entry.name === 'dist') continue;
    
    const fullPath = path.join(dir, entry.name);
    const relPath = base ? `${base}/${entry.name}` : entry.name;
    
    if (hasRussian(entry.name)) {
      toRename.push({
        type: entry.isDirectory() ? 'dir' : 'file',
        path: fullPath,
        relPath: relPath,
        name: entry.name
      });
    }
    
    if (entry.isDirectory()) {
      scan(fullPath, relPath);
    }
  }
}

scan(PUBLIC_DIR);

console.log(`Found ${toRename.length} items to rename:\n`);
toRename.forEach(item => {
  console.log(`[${item.type}] ${item.relPath}`);
});

// Save list for manual review
fs.writeFileSync(
  path.join(__dirname, 'rename-list.json'),
  JSON.stringify(toRename, null, 2)
);
console.log('\nSaved to rename-list.json');
