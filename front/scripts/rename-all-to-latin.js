const fs = require('fs');
const path = require('path');

const PUBLIC_DIR = path.join(__dirname, '..', 'public');
const FRONT_DIR = path.join(__dirname, '..');

// Transliteration map
const TRANS = {
  'äåâî÷êà': 'a', 'äåâî÷êà': 'b', 'äåâî÷êà': 'v', 'äåâî÷êà': 'g', 'äåâî÷êà': 'd', 'äåâî÷êà': 'e', 'äåâî÷êà': 'zh',
  'äåâî÷êà': 'z', 'äåâî÷êà': 'i', 'äåâî÷êà': 'y', 'äåâî÷êà': 'k', 'äåâî÷êà': 'l', 'äåâî÷êà': 'm', 'äåâî÷êà': 'n',
  'äåâî÷êà': 'o', 'äåâî÷êà': 'p', 'äåâî÷êà': 'r', 'äåâî÷êà': 's', 'äåâî÷êà': 't', 'äåâî÷êà': 'u', 'äåâî÷êà': 'f',
  'äåâî÷êà': 'h', 'äåâî÷êà': 'c', 'äåâî÷êà': 'ch', 'äåâî÷êà': 'sh', 'äåâî÷êà': 'sch', 'äåâî÷êà': '', 'äåâî÷êà': 'y',
  'äåâî÷êà': '', 'äåâî÷êà': 'e', 'äåâî÷êà': 'yu', 'äåâî÷êà': 'ya',
  'äåâî÷êà': 'A', 'äåâî÷êà': 'B', 'äåâî÷êà': 'V', 'äåâî÷êà': 'G', 'äåâî÷êà': 'D', 'äåâî÷êà': 'E', 'äåâî÷êà': 'Zh',
  'äåâî÷êà': 'Z', 'äåâî÷êà': 'I', 'äåâî÷êà': 'Y', 'äåâî÷êà': 'K', 'äåâî÷êà': 'L', 'äåâî÷êà': 'M', 'äåâî÷êà': 'N',
  'äåâî÷êà': 'O', 'äåâî÷êà': 'P', 'äåâî÷êà': 'R', 'äåâî÷êà': 'S', 'äåâî÷êà': 'T', 'äåâî÷êà': 'U', 'äåâî÷êà': 'F',
  'äåâî÷êà': 'H', 'äåâî÷êà': 'C', 'äåâî÷êà': 'Ch', 'äåâî÷êà': 'Sh', 'äåâî÷êà': 'Sch', 'äåâî÷êà': '', 'äåâî÷êà': 'Y',
  'äåâî÷êà': '', 'äåâî÷êà': 'E', 'äåâî÷êà': 'Yu', 'äåâî÷êà': 'Ya',
  'äåâî÷êà': 'y', 'äåâî÷êà': 'Y', 'äåâî÷êà': 'y', 'äåâî÷êà': 'Y',
  ' ': '-', ',': '', '(': '', ')': '', '.': '.', '_': '_'
};

function transliterate(str) {
  let result = '';
  for (let i = 0; i < str.length; i++) {
    const char = str[i];
    if (TRANS[char] !== undefined) {
      result += TRANS[char];
    } else if (char.match(/[a-zA-Z0-9\-_.]/)) {
      result += char;
    } else {
      result += '-';
    }
  }
  // Clean up multiple dashes and trailing/leading dashes
  result = result.replace(/-+/g, '-').replace(/^-|-$/g, '');
  return result.toLowerCase();
}

// Collect all items to rename
const renameMap = new Map();

function scan(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    if (entry.name === 'node_modules' || entry.name === '.next' || entry.name === 'dist') continue;
    
    const fullPath = path.join(dir, entry.name);
    
    if (/[\u0400-\u04FF]/.test(entry.name)) {
      const newName = transliterate(entry.name);
      renameMap.set(fullPath, { oldName: entry.name, newName: newName });
    }
    
    if (entry.isDirectory()) {
      scan(fullPath);
    }
  }
}

scan(PUBLIC_DIR);

console.log(`Found ${renameMap.size} items to rename\n`);

// Group by depth (rename deepest first)
const byDepth = {};
renameMap.forEach((val, key) => {
  const depth = key.split(/[/\\]/).length;
  if (!byDepth[depth]) byDepth[depth] = [];
  byDepth[depth].push({ path: key, ...val });
});

const depths = Object.keys(byDepth).map(Number).sort((a, b) => b - a);

// Rename files first (deepest), then folders
let renamed = 0;
depths.forEach(depth => {
  byDepth[depth].forEach(item => {
    const dir = path.dirname(item.path);
    const newPath = path.join(dir, item.newName);
    
    if (!fs.existsSync(newPath)) {
      fs.renameSync(item.path, newPath);
      console.log(`Renamed: ${item.oldName} -> ${item.newName}`);
      renamed++;
    } else {
      console.log(`SKIP (exists): ${item.newName}`);
    }
  });
});

console.log(`\nRenamed ${renamed} items`);

// Save mapping for code updates
const mapping = {};
renameMap.forEach((val, key) => {
  const relPath = key.replace(PUBLIC_DIR, '').replace(/[/\\]+/g, '/');
  const newRelPath = path.join(path.dirname(relPath), val.newName).replace(/[/\\]+/g, '/');
  mapping[relPath] = newRelPath;
});

fs.writeFileSync(path.join(__dirname, 'rename-mapping.json'), JSON.stringify(mapping, null, 2));
console.log('Saved mapping to rename-mapping.json');
