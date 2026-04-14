const fs = require('fs');
const path = require('path');

const FRONT_DIR = path.join(__dirname, '..');

// Russian to Latin transliteration
function transliterate(str) {
  let result = '';
  for (let i = 0; i < str.length; i++) {
    const code = str.charCodeAt(i);
    if (code >= 0x0430 && code <= 0x044F) {
      const map = ['a','b','v','g','d','e','zh','z','i','y','k','l','m','n','o','p','r','s','t','u','f','h','c','ch','sh','sch','','y','','e','yu','ya'];
      result += map[code - 0x0430] || '';
    } else if (code >= 0x0410 && code <= 0x042F) {
      const map = ['A','B','V','G','D','E','Zh','Z','I','Y','K','L','M','N','O','P','R','S','T','U','F','H','C','Ch','Sh','Sch','','Y','','E','Yu','Ya'];
      result += map[code - 0x0410] || '';
    } else if (code === 0x0451) result += 'yo';
    else if (code === 0x0401) result += 'Yo';
    else if (/[a-zA-Z0-9\-_.]/.test(str[i])) result += str[i];
    else if (str[i] === ' ') result += '-';
    else result += '-';
  }
  return result.replace(/-+/g, '-').replace(/^-|-$/g, '').toLowerCase() || 'untitled';
}

// Convert Russian path to Latin
function convertPathInString(str) {
  // Find paths like "/..." with Russian chars
  return str.replace(/"(\/[^"]*[\u0400-\u04FF][^"]*)"/g, (match, p1) => {
    const parts = p1.split('/');
    const newParts = parts.map(p => {
      if (/[\u0400-\u04FF]/.test(p)) {
        return transliterate(p);
      }
      return p;
    });
    return '"' + newParts.join('/') + '"';
  });
}

// Files to process
const dirs = ['app', 'components', 'sections', 'lib'];
const extensions = ['.ts', '.tsx', '.js', '.jsx'];

let totalFiles = 0;
let totalChanges = 0;

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  const original = content;
  
  // Convert paths in strings
  content = convertPathInString(content);
  
  // Also handle template literals
  content = content.replace(/`(\/[^`]*[\u0400-\u04FF][^`]*)`/g, (match, p1) => {
    const parts = p1.split('/');
    const newParts = parts.map(p => {
      if (/[\u0400-\u04FF]/.test(p)) {
        return transliterate(p);
      }
      return p;
    });
    return '`' + newParts.join('/') + '`';
  });
  
  if (content !== original) {
    fs.writeFileSync(filePath, content);
    const changes = (content.match(/[\u0400-\u04FF]/g) || []).length - (original.match(/[\u0400-\u04FF]/g) || []).length;
    console.log(`Updated: ${path.relative(FRONT_DIR, filePath)}`);
    totalFiles++;
    totalChanges++;
  }
}

function scanDir(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (!['node_modules', '.next', 'public'].includes(entry.name)) {
        scanDir(fullPath);
      }
    } else if (extensions.some(ext => entry.name.endsWith(ext))) {
      processFile(fullPath);
    }
  }
}

console.log('=== Updating hardcoded paths in code ===\n');

for (const dir of dirs) {
  const fullPath = path.join(FRONT_DIR, dir);
  if (fs.existsSync(fullPath)) {
    scanDir(fullPath);
  }
}

console.log(`\n=== Done: ${totalFiles} files updated ===`);
