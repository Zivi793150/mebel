const https = require('https');
const fs = require('fs');

const url = 'https://centrshtor.ru/elektrokarniz/';

https.get(url, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    // Извлекаем все карточки
    const items = [];
    
    // Ищем блоки karnizy-list__item
    const itemRegex = /<div class="karnizy-list__item[^"]*"[^>]*>([\s\S]*?)<\/div>\s*<\/div>/g;
    let match;
    
    while ((match = itemRegex.exec(data)) !== null) {
      const block = match[1];
      
      // Название
      const titleMatch = block.match(/<div class="karnizy-list__item-title">([^<]+)<\/div>/);
      const title = titleMatch ? titleMatch[1].trim() : '';
      
      // Ищем все img внутри слайдера
      const imgMatches = [...block.matchAll(/<img[^>]+src="([^"]+)"/g)];
      const images = imgMatches.map(m => m[1]).filter(src => src && !src.includes('data:image'));
      
      if (title && images.length > 0) {
        items.push({
          title,
          images: [...new Set(images)] // уникальные
        });
      }
    }
    
    console.log(`Найдено ${items.length} карточек`);
    items.forEach((item, i) => {
      console.log(`\n${i + 1}. ${item.title}`);
      console.log('   Фото:', item.images);
    });
    
    // Сохраняем в файл
    fs.writeFileSync('electro-data.json', JSON.stringify(items, null, 2));
    console.log('\n\nСохранено в electro-data.json');
  });
}).on('error', err => {
  console.error('Error:', err);
});
