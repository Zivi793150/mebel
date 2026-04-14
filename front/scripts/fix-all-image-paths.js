const fs = require('fs');
const path = require('path');

const FRONT_DIR = path.join(__dirname, '..');

// Files to fix
const files = [
  'sections/AboutStory.tsx',
  'sections/AboutParallaxGallery.tsx',
  'sections/AboutHoverPreview.tsx',
  'sections/PortfolioSlider.tsx',
  'sections/Hero.tsx',
  'sections/Team.tsx',
  'sections/WorkSteps.tsx',
  'sections/Services.tsx',
  'components/Header.tsx',
  'components/CurtainTypesList.tsx',
  'components/BlindsTypesCatalog.tsx',
  'components/BeddingCatalog.tsx',
  'components/CornicesCatalog.tsx',
  'components/RailsVariantsCatalog.tsx',
  'components/RugsStyleCatalog.tsx',
];

let totalFixed = 0;

files.forEach(relPath => {
  const filePath = path.join(FRONT_DIR, relPath);
  if (!fs.existsSync(filePath)) return;
  
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  
  // Pattern: src="..." or src={...} with Russian characters
  // Fix: src={encodeUrlPath("...")}
  
  // Pattern 1: src="/path" -> src={encodeUrlPath("/path")}
  content = content.replace(/src="([^"]*[\u0400-\u04FF][^"]*)"/g, (match, p1) => {
    modified = true;
    totalFixed++;
    return `src={encodeUrlPath("${p1}")}`;
  });
  
  // Pattern 2: src={variable} - need to wrap with encodeUrlPath if not already
  // Check if already wrapped
  content = content.replace(/src=\{([^{}]*[\u0400-\u04FF][^{}]*)\}/g, (match, p1) => {
    if (p1.includes('encodeUrlPath')) return match;
    modified = true;
    totalFixed++;
    return `src={encodeUrlPath(${p1})}`;
  });
  
  // Pattern 3: imageSrc: "/path" -> imageSrc: encodeUrlPath("/path")
  content = content.replace(/imageSrc:\s*"([^"]*[\u0400-\u04FF][^"]*)"/g, (match, p1) => {
    modified = true;
    totalFixed++;
    return `imageSrc: encodeUrlPath("${p1}")`;
  });
  
  if (modified) {
    // Ensure import exists
    if (!content.includes('from "@/lib/encodeUrl"')) {
      // Find last import
      const lines = content.split('\n');
      let lastImportIdx = 0;
      for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes('import ') && (lines[i].includes('from') || lines[i].includes('"'))) {
          lastImportIdx = i;
        }
      }
      lines.splice(lastImportIdx + 1, 0, 'import { encodeUrlPath } from "@/lib/encodeUrl";');
      content = lines.join('\n');
    }
    
    fs.writeFileSync(filePath, content);
    console.log('Fixed:', relPath);
  }
});

console.log(`\nTotal fixes: ${totalFixed}`);
