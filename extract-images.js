const fs = require('fs');

const html = fs.readFileSync('site-electro.html', 'utf8');

// Извлекаем все карточки с фото
const items = [];
const itemRegex = /<div class="karnizy-list__item[^"]*"[^>]*id="bx_\d+_(\d+)"[^>]*>([\s\S]*?)<\/div>\s*<\/div>/g;

let match;
while ((match = itemRegex.exec(html)) !== null) {
  const id = match[1];
  const block = match[2];
  
  // Название
  const titleMatch = block.match(/<div class="karnizy-list__item-title">([^<]+)<\/div>/);
  const title = titleMatch ? titleMatch[1].trim() : '';
  
  // Главное фото
  const imgMatch = block.match(/<img[^>]+src="([^"]+)"/);
  const mainImage = imgMatch ? imgMatch[1] : '';
  
  // Имя файла
  const filename = mainImage.split('/').pop();
  
  items.push({ id, title, filename, fullPath: mainImage });
}

console.log('Найдено карточек:', items.length);
items.forEach((item, i) => {
  console.log(`${i + 1}. ${item.title}`);
  console.log(`   Файл: ${item.filename}`);
});

// Сохраняем
fs.writeFileSync('electro-cards.json', JSON.stringify(items, null, 2));

// Список всех уникальных фото
const allImages = [...new Set(items.map(i => i.filename))];
console.log('\n\nУникальных фото:', allImages.length);
allImages.forEach(f => console.log(f));
