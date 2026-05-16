const https = require('https');
const fs = require('fs');

// ID инфоблока из HTML: iblock 141, section 14177-14194
const elementIds = [14186, 14178, 14187, 14188, 14177, 14184, 14189, 14190, 14193, 14180, 14181, 14191, 14192, 14179, 14194, 14182, 14183, 14185];

// Функция для запроса к API
function fetchElement(id) {
  return new Promise((resolve, reject) => {
    // Пробуем разные endpoints Bitrix
    const endpoints = [
      `/api/elements/get.php?IBLOCK_ID=141&ID=${id}`,
      `/bitrix/services/main/ajax.php?action=iblock%3Aelement.get&id=${id}`,
      `/local/ajax/element.php?id=${id}`,
    ];
    
    const tryEndpoint = (index) => {
      if (index >= endpoints.length) {
        resolve({ id, error: 'No endpoint worked' });
        return;
      }
      
      const options = {
        hostname: 'centrshtor.ru',
        path: endpoints[index],
        method: 'GET',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept': 'application/json, text/html',
        },
        timeout: 10000,
      };

      const req = https.get(options, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          if (res.statusCode === 200 && data.length > 100) {
            try {
              const json = JSON.parse(data);
              resolve({ id, data: json, endpoint: endpoints[index] });
            } catch (e) {
              // HTML response, try next
              tryEndpoint(index + 1);
            }
          } else {
            tryEndpoint(index + 1);
          }
        });
      });

      req.on('error', () => tryEndpoint(index + 1));
      req.on('timeout', () => { req.destroy(); tryEndpoint(index + 1); });
    };

    tryEndpoint(0);
  });
}

// Проверим страницу детального просмотра элемента
async function checkDetailPage(id) {
  return new Promise((resolve) => {
    const options = {
      hostname: 'centrshtor.ru',
      path: `/elektrokarniz/${id}/`,
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
      timeout: 15000,
    };

    const req = https.get(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        // Ищем все фото в галерее
        const galleryMatches = [...data.matchAll(/<img[^>]+src="([^"]+)"[^>]*class="[^"]*(?:gallery|slider|thumb)[^"]*"/gi)];
        const allImages = [...data.matchAll(/\/upload\/[^"'\s>]+\.(jpg|png|jpeg)/gi)].map(m => m[0]);
        const unique = [...new Set(allImages)];
        
        resolve({ 
          id, 
          images: unique.slice(0, 10),
          hasGallery: galleryMatches.length > 0,
          status: res.statusCode
        });
      });
    });

    req.on('error', () => resolve({ id, error: true }));
    req.on('timeout', () => { req.destroy(); resolve({ id, error: 'timeout' }); });
  });
}

async function main() {
  console.log('Checking detail pages for additional photos...\n');
  
  for (const id of elementIds.slice(0, 3)) { // Проверим первые 3
    console.log(`Checking ID ${id}...`);
    const result = await checkDetailPage(id);
    console.log(`  Status: ${result.status}, Images found: ${result.images.length}`);
    if (result.images.length > 0) {
      result.images.forEach((img, i) => console.log(`    ${i+1}. ${img}`));
    }
    console.log();
  }
}

main().catch(console.error);
