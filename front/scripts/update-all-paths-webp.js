const fs = require('fs');
const path = require('path');

const DIRS_TO_PROCESS = [
  path.join(__dirname, '..', 'app'),
  path.join(__dirname, '..', 'components'),
  path.join(__dirname, '..', 'sections'),
];

// ONLY skip dizayneram, process everything else including for_designers
const SKIP_DIRS = ['node_modules', '.next', 'dist', 'dizayneram'];

const EXTENSIONS = ['.tsx', '.ts', '.jsx', '.js'];

function shouldSkipDir(dirPath) {
  return SKIP_DIRS.some(skip => dirPath.includes(skip));
}

function shouldProcessFile(filePath) {
  return EXTENSIONS.includes(path.extname(filePath));
}

function updateImagePaths(content) {
  // Replace .jpg, .jpeg, .png with .webp in image paths
  return content.replace(
    /(["'])(\/[^"']+?)\.(jpg|jpeg|png)(["'])/gi,
    (match, q1, path, ext, q2) => `${q1}${path}.webp${q2}`
  );
}

function processFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const updated = updateImagePaths(content);

  if (updated !== content) {
    fs.writeFileSync(filePath, updated, 'utf-8');
    console.log(`✅ ${path.relative(path.join(__dirname, '..'), filePath)}`);
    return true;
  }
  return false;
}

function walkDir(dir) {
  if (shouldSkipDir(dir)) {
    console.log(`⏭️  Skipping: ${path.basename(dir)}`);
    return 0;
  }

  const entries = fs.readdirSync(dir, { withFileTypes: true });
  let count = 0;

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      count += walkDir(fullPath);
    } else if (shouldProcessFile(fullPath)) {
      if (processFile(fullPath)) count++;
    }
  }
  return count;
}

console.log('🚀 Updating ALL image paths to WebP (dizayneram skipped)...\n');

let total = 0;
for (const dir of DIRS_TO_PROCESS) {
  if (fs.existsSync(dir)) {
    total += walkDir(dir);
  }
}

console.log(`\n✨ Updated ${total} files!`);
