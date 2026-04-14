const sharp = require('sharp');
const path = require('path');

const files = [
  'blinds.jpg',
  'roman.jpg', 
  'carnis.jpg',
  'rugs.jpg',
  'pillows.jpg'
];

const dir = path.join(__dirname, '..', 'public', 'catalog');

async function convert() {
  for (const file of files) {
    const input = path.join(dir, file);
    const output = path.join(dir, file.replace('.jpg', '.webp'));
    try {
      await sharp(input)
        .webp({ quality: 85 })
        .toFile(output);
      console.log('✓', file, '->', file.replace('.jpg', '.webp'));
    } catch (e) {
      console.error('✗', file, ':', e.message);
    }
  }
}

convert().catch(console.error);
