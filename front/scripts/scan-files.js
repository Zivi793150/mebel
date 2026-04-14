const fs = require('fs');
const path = require('path');

const PUBLIC_DIR = path.join(__dirname, '..', 'public');

// Russian to Latin transliteration
const RUS_TO_LAT = {
  'à': 'a', 'á': 'b', 'â': 'v', 'ã': 'g', 'ä': 'd', 'å': 'e', 'æ': 'zh', 'ç': 'z',
  'è': 'i', 'é': 'y', 'ê': 'k', 'ë': 'l', 'ì': 'm', 'í': 'n', 'î': 'o', 'ï': 'p',
  'ð': 'r', 'ñ': 's', 'ò': 't', 'ó': 'u', 'ô': 'f', 'õ': 'h', 'ö': 'c', '÷': 'ch',
  'ø': 'sh', 'ù': 'sch', 'ú': '', 'û': 'y', 'ü': '', 'ý': 'e', 'þ': 'yu', 'ÿ': 'ya',
  'À': 'A', 'Á': 'B', 'Â': 'V', 'Ã': 'G', 'Ä': 'D', 'Å': 'E', 'Æ': 'Zh', 'Ç': 'Z',
  'È': 'I', 'É': 'Y', 'Ê': 'K', 'Ë': 'L', 'Ì': 'M', 'Í': 'N', 'Î': 'O', 'Ï': 'P',
  'Ð': 'R', 'Ñ': 'S', 'Ò': 'T', 'Ó': 'U', 'Ô': 'F', 'Õ': 'H', 'Ö': 'C', '×': 'Ch',
  'Ø': 'Sh', 'Ù': 'Sch', 'Ú': '', 'Û': 'Y', 'Ü': '', 'Ý': 'E', 'Þ': 'Yu', 'ß': 'Ya',
  '¸': 'yo', '¨': 'Yo'
};

function transliterate(str) {
  let result = '';
  for (let i = 0; i < str.length; i++) {
    const char = str[i];
    const code = str.charCodeAt(i);
    
    // Russian lowercase (0x0430-0x044F): áâãäåæçèéêëìíîïðñòóôõö÷øùúûüýþÿ
    if (code >= 0x0430 && code <= 0x044F) {
      const idx = code - 0x0430;
      const map = ['a','b','v','g','d','e','zh','z','i','y','k','l','m','n','o','p','r','s','t','u','f','h','c','ch','sh','sch','','y','','e','yu','ya'];
      result += map[idx] || '';
    }
    // Russian uppercase (0x0410-0x042F)
    else if (code >= 0x0410 && code <= 0x042F) {
      const idx = code - 0x0410;
      const map = ['A','B','V','G','D','E','Zh','Z','I','Y','K','L','M','N','O','P','R','S','T','U','F','H','C','Ch','Sh','Sch','','Y','','E','Yu','Ya'];
      result += map[idx] || '';
    }
    // Yo
    else if (code === 0x0451) result += 'yo';
    else if (code === 0x0401) result += 'Yo';
    // Latin/numbers
    else if (/[a-zA-Z0-9\-_.]/.test(char)) {
      result += char;
    }
    // Space to dash
    else if (char === ' ') {
      result += '-';
    }
    // Other - dash
    else {
      result += '-';
    }
  }
  
  // Cleanup
  result = result.replace(/-+/g, '-').replace(/^-|-$/g, '');
  if (!result) result = 'untitled';
  return result.toLowerCase();
}

// Scan and collect renames
const renames = [];
const pathMappings = []; // old path -> new path for MongoDB update

function scanDir(dir, relativeBase = '') {
  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const oldName = entry.name;
      const oldPath = path.join(dir, oldName);
      const oldRelative = relativeBase ? `${relativeBase}/${oldName}` : oldName;
      
      // Check if has Russian characters
      const hasRussian = /[\u0400-\u04FF]/.test(oldName);
      
      if (hasRussian) {
        const newName = transliterate(oldName);
        const newRelative = relativeBase ? `${relativeBase}/${newName}` : newName;
        const newPath = path.join(dir, newName);
        
        renames.push({
          oldPath,
          newPath,
          oldRelative,
          newRelative,
          isDir: entry.isDirectory()
        });
        
        pathMappings.push({
          oldPath: '/' + oldRelative,
          newPath: '/' + newRelative
        });
        
        // If directory, scan with new name for children
        if (entry.isDirectory()) {
          scanDir(oldPath, newRelative);
        }
      } else if (entry.isDirectory()) {
        scanDir(oldPath, oldRelative);
      }
    }
  } catch (e) {
    console.error('Error scanning:', dir, e.message);
  }
}

console.log('Scanning public directory...\n');
scanDir(PUBLIC_DIR);

console.log(`Found ${renames.length} items with Russian names\n`);

// Show sample
renames.slice(0, 15).forEach(r => {
  console.log(`${r.isDir ? 'DIR' : 'FILE'}: ${r.oldRelative}`);
  console.log(`  -> ${r.newRelative}`);
});

if (renames.length > 15) {
  console.log(`\n... and ${renames.length - 15} more`);
}

// Save mappings
fs.writeFileSync(
  path.join(__dirname, 'rename-mappings.json'),
  JSON.stringify({ renames, pathMappings }, null, 2)
);

console.log(`\nSaved ${pathMappings.length} path mappings to rename-mappings.json`);
console.log('\nNext step: run rename-execute.js to rename files');
