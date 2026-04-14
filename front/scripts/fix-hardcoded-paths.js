const fs = require('fs');
const path = require('path');

const FRONT_DIR = path.join(__dirname, '..');

// Find all tsx/ts files with hardcoded Russian paths
function findFiles(dir) {
  const results = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    if (entry.name === 'node_modules' || entry.name === '.next' || entry.name === 'dist') continue;
    
    const fullPath = path.join(dir, entry.name);
    
    if (entry.isDirectory()) {
      results.push(...findFiles(fullPath));
    } else if (entry.name.endsWith('.tsx') || entry.name.endsWith('.ts')) {
      const content = fs.readFileSync(fullPath, 'utf8');
      // Check for Russian characters in imageSrc or src paths
      if (content.match(/(imageSrc|src)=["'][^"']*[\u0400-\u04FF][^"']*["']/)) {
        results.push(fullPath);
      }
    }
  }
  
  return results;
}

const files = findFiles(FRONT_DIR);
console.log('Files with hardcoded Russian paths:', files.length);
files.forEach(f => console.log('  ' + f.replace(FRONT_DIR, '')));

// For each file, wrap paths with encodeUrlPath
files.forEach(filePath => {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  
  // Pattern: imageSrc: "/path/with/russian/chars"
  content = content.replace(/(imageSrc|src):\s*["']([^"']*[\u0400-\u04FF][^"]*)["']/g, (match, attr, path) => {
    modified = true;
    return `${attr}: encodeUrlPath("${path}")`;
  });
  
  // Pattern: imageSrc="/path/with/russian/chars" (in JSX)
  content = content.replace(/(imageSrc|src)=["']([^"']*[\u0400-\u04FF][^"']*)["']/g, (match, attr, path) => {
    modified = true;
    return `${attr}={encodeUrlPath("${path}")}`;
  });
  
  if (modified) {
    // Check if already has import
    if (!content.includes('from "@/lib/encodeUrl"')) {
      // Add import after last import
      const lines = content.split('\n');
      let lastImportIdx = 0;
      for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes('import ') && lines[i].includes('from')) {
          lastImportIdx = i;
        }
      }
      lines.splice(lastImportIdx + 1, 0, 'import { encodeUrlPath } from "@/lib/encodeUrl";');
      content = lines.join('\n');
    }
    
    fs.writeFileSync(filePath, content);
    console.log('Fixed:', filePath.replace(FRONT_DIR, ''));
  }
});

console.log('\nDone!');
