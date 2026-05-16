const https = require('https');
const fs = require('fs');

// Попробуем получить данные через bitrix API
const options = {
  hostname: 'centrshtor.ru',
  path: '/bitrix/components/bitrix/iblock.element.add/json.php?IBLOCK_ID=141&SECTION_ID=14186',
  method: 'GET',
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
  }
};

https.get(options, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('Status:', res.statusCode);
    console.log('Response:', data.substring(0, 500));
    
    // Также попробуем найти в HTML data-атрибуты с фото
    const html = fs.readFileSync('site-electro.html', 'utf8');
    
    // Ищем data-атрибуты с путями к картинкам
    const dataMatches = [...html.matchAll(/data-[^=]*=["']([^"']*(?:jpg|png)[^"]*)["']/gi)];
    console.log('\nData-attributes with images:', dataMatches.length);
    dataMatches.slice(0, 20).forEach(m => console.log(m[0]));
    
    // Ищем все пути /upload/
    const uploadMatches = [...html.matchAll(/\/upload\/[^"'\s>]+/g)];
    const unique = [...new Set(uploadMatches.map(m => m[0]))].filter(p => p.includes('.jpg') || p.includes('.png'));
    console.log('\n\nUnique upload paths:', unique.length);
    unique.forEach(p => console.log(p));
    
    fs.writeFileSync('upload-paths.txt', unique.join('\n'));
  });
}).on('error', err => {
  console.error('Error:', err.message);
});
