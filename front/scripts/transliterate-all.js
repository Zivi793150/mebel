const fs = require('fs');
const path = require('path');

const PUBLIC_DIR = path.join(__dirname, '..', 'public');

// Russian to Latin transliteration map
const TRANS = {
  'á': 'a', 'Á': 'A', 'â': 'a', 'Â': 'A', 'ã': 'a', 'Ã': 'A',
  'ä': 'a', 'Ä': 'A', 'å': 'a', 'Å': 'A', 'æ': 'ae', 'Æ': 'AE',
  'ç': 'c', 'Ç': 'C', 'è': 'e', 'È': 'E', 'é': 'e', 'É': 'E',
  'ê': 'e', 'Ê': 'E', 'ë': 'e', 'Ë': 'E', 'ì': 'i', 'Ì': 'I',
  'í': 'i', 'Í': 'I', 'î': 'i', 'Î': 'I', 'ï': 'i', 'Ï': 'I',
  'ð': 'd', 'Ð': 'D', 'ñ': 'n', 'Ñ': 'N', 'ò': 'o', 'Ò': 'O',
  'ó': 'o', 'Ó': 'O', 'ô': 'o', 'Ô': 'O', 'õ': 'o', 'Õ': 'O',
  'ö': 'o', 'Ö': 'O', 'ø': 'o', 'Ø': 'O', 'ù': 'u', 'Ù': 'U',
  'ú': 'u', 'Ú': 'U', 'û': 'u', 'Û': 'U', 'ü': 'u', 'Ü': 'U',
  'ý': 'y', 'Ý': 'Y', 'ÿ': 'y', 'ß': 'ss', 'þ': 'th', 'Þ': 'TH',
  'à': 'a', 'À': 'A', 'å': 'a', 'Å': 'A',
  // Russian letters
  'à': 'a', 'á': 'b', 'â': 'v', 'ã': 'g', 'ä': 'd', 'å': 'e',
  'æ': 'zh', 'ç': 'z', 'è': 'i', 'é': 'y', 'ê': 'k', 'ë': 'l',
  'ì': 'm', 'í': 'n', 'î': 'o', 'ï': 'p', 'ð': 'r', 'ñ': 's',
  'ò': 't', 'ó': 'u', 'ô': 'f', 'õ': 'h', 'ö': 'c', '÷': 'ch',
  'ø': 'sh', 'ù': 'sch', 'ú': '', 'û': 'y', 'ü': '', 'ý': 'e',
  'þ': 'yu', 'ÿ': 'ya',
  'À': 'A', 'Á': 'B', 'Â': 'V', 'Ã': 'G', 'Ä': 'D', 'Å': 'E',
  'Æ': 'Zh', 'Ç': 'Z', 'È': 'I', 'É': 'Y', 'Ê': 'K', 'Ë': 'L',
  'Ì': 'M', 'Í': 'N', 'Î': 'O', 'Ï': 'P', 'Ð': 'R', 'Ñ': 'S',
  'Ò': 'T', 'Ó': 'U', 'Ô': 'F', 'Õ': 'H', 'Ö': 'C', '×': 'Ch',
  'Ø': 'Sh', 'Ù': 'Sch', 'Ú': '', 'Û': 'Y', 'Ü': '', 'Ý': 'E',
  'Þ': 'Yu', 'ß': 'Ya',
  // Additional Russian letters (different encoding)
  'Ð°': 'a', 'Ð±': 'b', 'Ð²': 'v', 'Ð³': 'g', 'Ð´': 'd', 'Ðµ': 'e',
  'Ñ': 'zh', 'Ð·': 'z', 'Ð¸': 'i', 'Ð¹': 'y', 'Ðº': 'k', 'Ð»': 'l',
  'Ð¼': 'm', 'Ð½': 'n', 'Ð¾': 'o', 'Ð¿': 'p', 'Ñ\x80': 'r', 'Ñ\x81': 's',
  'Ñ\x82': 't', 'Ñ\x83': 'u', 'Ñ\x84': 'f', 'Ñ\x85': 'h', 'Ñ\x86': 'c', 'Ñ\x87': 'ch',
  'Ñ\x88': 'sh', 'Ñ\x89': 'sch', 'Ñ\x8a': '', 'Ñ\x8b': 'y', 'Ñ\x8c': '', 'Ñ\x8d': 'e',
  'Ñ\x8e': 'yu', 'Ñ\x8f': 'ya',
};

function transliterate(str) {
  let result = '';
  for (let i = 0; i < str.length; i++) {
    const char = str[i];
    if (TRANS[char] !== undefined) {
      result += TRANS[char];
    } else if (/[a-zA-Z0-9\-_.]/.test(char)) {
      result += char;
    } else if (/\s/.test(char)) {
      result += '-';
    } else {
      // Try to detect Russian letters by code
      const code = str.charCodeAt(i);
      if (code >= 0x0410 && code <= 0x042F) {
        // Russian uppercase
        const upperMap = 'ABVGDEZHZIJKLMNOPRSTUFHCCHSHSHCH__YEYUYA';
        const idx = code - 0x0410;
        result += upperMap[idx] || '';
      } else if (code >= 0x0430 && code <= 0x044F) {
        // Russian lowercase
        const lowerMap = 'abvgdezhzijklmnoprstufhcchshshch__yeyuya';
        const idx = code - 0x0430;
        result += lowerMap[idx] || '';
      } else if (code === 0x0401) {
        result += 'Yo';
      } else if (code === 0x0451) {
        result += 'yo';
      } else {
        result += '-';
      }
    }
  }
  // Clean up
  result = result.replace(/-+/g, '-').replace(/^-|-$/g, '');
  if (!result || result === '-') result = 'untitled';
  return result.toLowerCase();
}

// Collect all files and folders to rename
const renames = [];

function scan(dir, base = '') {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const oldName = entry.name;
    const oldPath = path.join(dir, oldName);
    const relativePath = base ? `${base}/${oldName}` : oldName;
    
    // Check if needs transliteration
    const needsRename = /[\u0400-\u04FF]/.test(oldName) || /[^\x00-\x7F]/.test(oldName);
    
    if (needsRename) {
      const newName = transliterate(oldName);
      const newPath = path.join(dir, newName);
      renames.push({
        oldPath,
        newPath,
        oldRelative: relativePath,
        newRelative: base ? `${base}/${newName}` : newName,
        isDir: entry.isDirectory()
      });
    }
    
    if (entry.isDirectory()) {
      scan(oldPath, needsRename ? transliterate(oldName) : relativePath);
    }
  }
}

console.log('Scanning public directory...\n');
scan(PUBLIC_DIR);

console.log(`Found ${renames.length} items to rename:\n`);

// Sort: folders first, deepest first (to rename children before parents)
renames.sort((a, b) => {
  if (a.isDir !== b.isDir) return a.isDir ? -1 : 1;
  return b.oldPath.split(/[\/\\]/).length - a.oldPath.split(/[\/\\]/).length;
});

// Show preview
renames.slice(0, 20).forEach(r => {
  console.log(`${r.isDir ? 'DIR ' : 'FILE'}: ${r.oldRelative}`);
  console.log(`  -> ${r.newRelative}`);
});

if (renames.length > 20) {
  console.log(`\n... and ${renames.length - 20} more`);
}

// Save renames to file for next step
fs.writeFileSync(
  path.join(__dirname, 'renames-map.json'),
  JSON.stringify(renames, null, 2)
);

console.log(`\nSaved renames map to renames-map.json`);
console.log('Run rename-execute.js to apply changes.');
