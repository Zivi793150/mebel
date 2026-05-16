const fs = require('fs');
const vm = require('vm');

const html = fs.readFileSync('electro/index.html', 'utf8');

// Берём именно desktop-инициализацию: InitHoverPreviewSliderCard([...])
const m = html.match(/InitHoverPreviewSliderCard\(\s*(\[[\s\S]*?\])\s*\)\s*;/);
if (!m) {
  console.error('InitHoverPreviewSliderCard([...]) not found');
  process.exit(1);
}

const arrayLiteral = m[1];

let elements;
try {
  elements = vm.runInNewContext(`(${arrayLiteral})`, {});
} catch (e) {
  console.error('Failed to eval elements array:', e);
  process.exit(1);
}

const byId = {};
for (const el of elements) {
  const id = String(el.strMainID || '');
  const numericId = id.split('_').pop();
  const filenames = (el.images || [])
    .map(img => (img && img.SRC ? String(img.SRC) : ''))
    .filter(Boolean)
    .map(src => {
      const parts = src.split('/');
      return parts[parts.length - 1];
    });

  byId[numericId] = {
    strMainID: id,
    filenames,
    src: (el.images || []).map(x => x.SRC),
  };
}

fs.writeFileSync('hover-preview-images.json', JSON.stringify(byId, null, 2));
console.log('Saved hover-preview-images.json with', Object.keys(byId).length, 'items');
