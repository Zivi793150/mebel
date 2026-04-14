const fs = require('fs');
const path = require('path');

const SRC_DIR = path.join(__dirname, '..', 'app');
const COMPONENTS_DIR = path.join(__dirname, '..', 'components');
const SECTIONS_DIR = path.join(__dirname, '..', 'sections');

const EXTENSIONS = ['.tsx', '.ts', '.jsx', '.js'];

// Skip these directories
const SKIP_DIRS = ['node_modules', '.next', 'dist'];

function shouldProcessFile(filePath) {
  const ext = path.extname(filePath);
  return EXTENSIONS.includes(ext);
}

function shouldSkipDir(dirPath) {
  return SKIP_DIRS.some(skip => dirPath.includes(skip));
}

function updateImagePaths(content) {
  let updated = content;
  let changes = [];

  // Pattern to match image paths in strings
  const patterns = [
    // /path/to/image.jpg or /path/to/image.jpeg or /path/to/image.png
    { regex: /(["'])(\/[^"']+\.(jpg|jpeg|png|JPG|JPEG|PNG))\1/g, replacer: (m, q, p) => `${q}${p.replace(/\.(jpg|jpeg|png|JPG|JPEG|PNG)$/, '.webp')}${q}` },
  ];

  for (const { regex, replacer } of patterns) {
    updated = updated.replace(regex, (match, quote, path) => {
      const newPath = path.replace(/\.(jpg|jpeg|png|JPG|JPEG|PNG)$/i, '.webp');
      if (newPath !== path) {
        changes.push(`${path} -> ${newPath}`);
        return `${quote}${newPath}${quote}`;
      }
      return match;
    });
  }

  return { content: updated, changes };
}

function processFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const { content: updated, changes } = updateImagePaths(content);

  if (changes.length > 0) {
    fs.writeFileSync(filePath, updated, 'utf-8');
    console.log(`✅ ${path.relative(path.join(__dirname, '..'), filePath)}`);
    changes.forEach(c => console.log(`   ${c}`));
    return true;
  }
  return false;
}

function walkDir(dir) {
  if (shouldSkipDir(dir)) return 0;

  const entries = fs.readdirSync(dir, { withFileTypes: true });
  let updatedCount = 0;

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      updatedCount += walkDir(fullPath);
    } else if (shouldProcessFile(fullPath)) {
      if (processFile(fullPath)) {
        updatedCount++;
      }
    }
  }

  return updatedCount;
}

console.log('🚀 Updating image paths to WebP in code...\n');

let total = 0;
total += walkDir(SRC_DIR);
total += walkDir(COMPONENTS_DIR);
total += walkDir(SECTIONS_DIR);

console.log(`\n✨ Updated ${total} files!`);
