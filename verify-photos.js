const fs = require('fs');

// Все файлы в public/electro
const realFiles = fs.readdirSync('front/public/electro')
  .filter(f => f.endsWith('.jpg') || f.endsWith('.png'));

console.log('=== РЕАЛЬНЫЕ ФАЙЛЫ В public/electro ===');
console.log('Всего:', realFiles.length);
realFiles.forEach(f => console.log(`  ${f}`));

// Текущие пути из TYPES (извлекаем из page.tsx)
const pageContent = fs.readFileSync('front/app/electro/page.tsx', 'utf8');
const imageMatches = [...pageContent.matchAll(/"\/electro\/([^"]+)"/g)];
const usedImages = [...new Set(imageMatches.map(m => m[1]))];

console.log('\n\n=== ИСПОЛЬЗУЕМЫЕ ФОТО В TYPES ===');
console.log('Всего:', usedImages.length);
usedImages.forEach(f => console.log(`  ${f}`));

// Проверяем какие используемые файлы отсутствуют
const missing = usedImages.filter(f => !realFiles.includes(f));
console.log('\n\n=== ОТСУТСТВУЮЩИЕ ФАЙЛЫ ===');
if (missing.length > 0) {
  missing.forEach(f => console.log(`  ❌ ${f}`));
} else {
  console.log('  Все файлы на месте');
}

// Проверяем какие реальные файлы не используются
const unused = realFiles.filter(f => !usedImages.includes(f) && !f.startsWith('icon') && !f.startsWith('bg') && !f.includes('banner') && !f.includes('pattern') && !f.includes('Vector') && f.length > 20);
console.log('\n\n=== НЕИСПОЛЬЗУЕМЫЕ ФОТО (возможно дополнительные) ===');
console.log('Всего:', unused.length);
unused.forEach(f => console.log(`  ${f}`));
