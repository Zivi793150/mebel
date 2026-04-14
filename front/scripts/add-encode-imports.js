const fs = require('fs');
const path = require('path');

const FRONT_DIR = path.join(__dirname, '..');

// Files that need the import
const FILES_TO_UPDATE = [
  'app/catalog/[slug]/page.tsx',
  'sections/Catalog.tsx',
  'sections/PortfolioSlider.tsx',
  'sections/AboutStory.tsx',
  'sections/AboutParallaxGallery.tsx',
  'sections/AboutHoverPreview.tsx',
  'sections/Services.tsx',
  'sections/Team.tsx',
  'sections/WorkSteps.tsx',
  'components/Footer.tsx',
  'sections/CTA.tsx',
  'app/designers/sections/DesignersBenefits.tsx',
  'app/designers/sections/DesignersContact.tsx',
];

// Check which files exist and need updating
FILES_TO_UPDATE.forEach(relPath => {
  const filePath = path.join(FRONT_DIR, relPath);
  if (!fs.existsSync(filePath)) {
    console.log('NOT FOUND:', relPath);
    return;
  }
  
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  
  // Check if already has the import
  if (content.includes('from "@/lib/encodeUrl"')) {
    console.log('ALREADY HAS IMPORT:', relPath);
    return;
  }
  
  // Add import at the top (after other imports)
  const importStatement = 'import { encodeUrlPath } from "@/lib/encodeUrl";\n';
  
  // Find the last import line
  const lines = content.split('\n');
  let lastImportIdx = 0;
  
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].startsWith('import ') || lines[i].match(/^import\s*{/)) {
      lastImportIdx = i;
    }
  }
  
  if (lastImportIdx > 0) {
    lines.splice(lastImportIdx + 1, 0, importStatement);
    content = lines.join('\n');
    modified = true;
  }
  
  if (modified) {
    fs.writeFileSync(filePath, content);
    console.log('UPDATED:', relPath);
  }
});

console.log('\nDone adding imports');
