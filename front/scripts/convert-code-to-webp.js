const fs = require("fs");
const path = require("path");

const SECTIONS_DIR = path.join(__dirname, "..", "sections");
const COMPONENTS_DIR = path.join(__dirname, "..", "components");
const APP_DIR = path.join(__dirname, "..", "app");

function processFile(filePath) {
  let content = fs.readFileSync(filePath, "utf8");
  const original = content;

  // Replace .jpg, .jpeg, .png with .webp in string literals (but not .webp itself)
  // Match patterns like "/path/to/file.jpg" or '/path/to/file.png'
  content = content.replace(
    /(["'])([^"']+?)\.(jpe?g|png)(\?[^"']*)?\1/gi,
    (match, quote, pathPart, ext, query) => {
      // Don't replace if it's already .webp or if it's a data URI
      if (pathPart.includes(".webp") || pathPart.startsWith("data:")) return match;
      return `${quote}${pathPart}.webp${query || ""}${quote}`;
    }
  );

  if (content !== original) {
    fs.writeFileSync(filePath, content, "utf8");
    console.log(`✅ Updated: ${filePath}`);
    return true;
  }
  return false;
}

function walkDir(dir, callback) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkDir(fullPath, callback);
    } else if (entry.isFile() && /\.(tsx?|jsx?)$/.test(entry.name)) {
      callback(fullPath);
    }
  }
}

function main() {
  let updated = 0;

  [SECTIONS_DIR, COMPONENTS_DIR, APP_DIR].forEach((dir) => {
    if (fs.existsSync(dir)) {
      walkDir(dir, (filePath) => {
        if (processFile(filePath)) updated++;
      });
    }
  });

  console.log(`\nDone. Updated ${updated} files.`);
}

main();
