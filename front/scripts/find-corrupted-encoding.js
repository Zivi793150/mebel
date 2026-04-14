const fs = require('fs');
const path = require('path');

const FRONT_DIR = path.join(__dirname, '..');

// Pattern for corrupted encoding (latin characters that look like mojibake)
const CORRUPTED_PATTERN = /[äåâî÷êàèìíîïðñòóôõöøùúûüýþÿÄÅÂÎÏ×ÊÀÈÌÍÎÏÐÑÒÓÔÕÖØÙÚÛÜÝÞß]/;

function findCorruptedFiles(dir, exts = ['.tsx', '.ts', '.jsx', '.js']) {
  const results = [];
  
  function walk(currentDir) {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);
      
      // Skip node_modules, .next, dist
      if (entry.name === 'node_modules' || entry.name === '.next' || entry.name === 'dist') continue;
      
      if (entry.isDirectory()) {
        walk(fullPath);
      } else if (entry.isFile() && exts.some(ext => entry.name.endsWith(ext))) {
        const content = fs.readFileSync(fullPath, 'utf8');
        const lines = content.split('\n');
        
        lines.forEach((line, idx) => {
          if (CORRUPTED_PATTERN.test(line)) {
            results.push({
              file: fullPath.replace(FRONT_DIR, ''),
              line: idx + 1,
              content: line.trim().substring(0, 100)
            });
          }
        });
      }
    }
  }
  
  walk(dir);
  return results;
}

console.log('=== Finding files with corrupted encoding ===\n');
const corrupted = findCorruptedFiles(FRONT_DIR);

if (corrupted.length === 0) {
  console.log('No corrupted files found!');
} else {
  console.log(`Found ${corrupted.length} lines with potential corrupted encoding:\n`);
  corrupted.forEach(r => {
    console.log(`${r.file}:${r.line}`);
    console.log(`  ${r.content}`);
    console.log('');
  });
}
