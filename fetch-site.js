const https = require('https');
const fs = require('fs');

const url = 'https://centrshtor.ru/elektrokarniz/';

https.get(url, {
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
  }
}, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    fs.writeFileSync('site-electro.html', data);
    console.log('Сохранено site-electro.html, размер:', data.length);
    
    // Поиск картинок
    const imgMatches = [...data.matchAll(/images\/([a-z0-9]+\.(?:jpg|png))/g)];
    const unique = [...new Set(imgMatches.map(m => m[1]))];
    console.log('\nНайдено картинок:', unique.length);
    unique.forEach(f => console.log(f));
  });
}).on('error', err => {
  console.error('Error:', err.message);
});
