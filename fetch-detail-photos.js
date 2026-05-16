const https = require('https');
const fs = require('fs');

const elements = [
  { id: 14186, name: "razdvizhnoy-naklonnyy-elektrokarniz", main: "zpf541bl644etsvmvqu8x5101f1fwjqf" },
  { id: 14178, name: "razdvizhnoy-pryamoy-elektrokarniz", main: "cj1yslfwwrw97eoz3mwlr9ooq322yzb3" },
  { id: 14187, name: "razdvizhnoy-uglovoy-elektrokarniz", main: "d26trwzyg56pm5qsw5dwfqrjsl4ub9f0" },
  { id: 14188, name: "razdvizhnoy-radialnyy-elektrokarniz", main: "e4vvaub4qyq8lbeatdergktn89vfbnfb" },
  { id: 14177, name: "razdvizhnoy-pryamoy-elektrokarniz-na-lyuversakh", main: "1o3bysw2k7990ir6z5kaor4o0316b0ci" },
  { id: 14184, name: "rimskiy-elektrokarniz-s-elektroprivodom", main: "n1szfwy3h7bjh185fguzcsifxq69m1dp" },
  { id: 14189, name: "rimskiy-elektrokarniz-den-noch-s-elektroprivodom", main: "janr06n307vnsaikabt3tquoq2wm5dwq" },
  { id: 14190, name: "rimskiy-naklonnyy-elektrokarniz-s-elektroprivodom", main: "w8w0qhhjz1asugmb2ck5tu6lzxrbjc6a" },
  { id: 14193, name: "rulonnyy-elektrokarniz-s-soedinitelem-i-elektroprivodom", main: "ecujr9pjg6z2493790j47qeu0zn515nd" },
  { id: 14180, name: "rulonnyy-elektrokarniz-uni2-s-elektroprivodom", main: "y0kts07ljazvqlv5oe1be1bhskjijbbz" },
  { id: 14181, name: "rulonnyy-elektrokarniz-otkrytogo-tipa-s-elektroprivodom", main: "qtdx2hb7kh7z831q2fl1zew3uvvtkm9b" },
  { id: 14191, name: "rulonnyy-elektrokarniz-den-noch-s-elektroprivodom", main: "9ly0rcdxw0lv83pk4ntvrg3rs5fl0a0l" },
  { id: 14192, name: "rulonnyy-elektrokarniz-zebra-v-korobe-s-elektroprivodom", main: "87dftq9sroixbke0bdo4g23hp8qu8j18" },
  { id: 14179, name: "elektrokarniz-dlya-gorizontalnykh-zhalyuzi-s-elektroprivodom", main: "2cxzcnwpb2pbec67lhut5dk0tfr1jpdj" },
  { id: 14194, name: "elektrokarniz-dlya-vertikalnykh-zhalyuzi-s-elektroprivodom", main: "bpdkjbcq6bw5d2sduk4wsssqrrao7axn" },
  { id: 14182, name: "elektrokarniz-dlya-shtor-plisse", main: "grvtvg899kzl5bcsmeftyl93m7aft8u2" },
  { id: 14183, name: "elektrokarniz-dlya-pergol-s-elektroprivodom", main: "308a0bfrbag3qjn00dl87rd0n735kqz9" },
  { id: 14185, name: "podyomnyy-mekhanizm-lift-sistema", main: "zf56d1c6163bk26r6tmx33e8quu27ez8" },
];

async function fetchDetailPage(name) {
  return new Promise((resolve) => {
    const options = {
      hostname: 'centrshtor.ru',
      path: `/elektrokarniz/${name}/`,
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
      timeout: 15000,
    };

    const req = https.get(options, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        resolve({ redirect: res.headers.location, status: res.statusCode });
        return;
      }
      
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        // Ищем все фото /upload/
        const allImages = [...data.matchAll(/\/upload\/iblock\/[^"'\s>]+\.(?:jpg|jpeg|png)/gi)]
          .map(m => m[0])
          .filter((v, i, a) => a.indexOf(v) === i);
        
        resolve({ 
          name, 
          status: res.statusCode,
          images: allImages,
        });
      });
    });

    req.on('error', (e) => resolve({ name, error: e.message }));
    req.on('timeout', () => { req.destroy(); resolve({ name, error: 'timeout' }); });
  });
}

async function main() {
  const results = [];
  
  for (const el of elements.slice(0, 5)) {
    console.log(`Fetching ${el.name}...`);
    const result = await fetchDetailPage(el.name);
    
    if (result.images && result.images.length > 0) {
      console.log(`  Found ${result.images.length} images:`);
      result.images.forEach((img, i) => {
        const filename = img.split('/').pop();
        console.log(`    ${i+1}. ${filename}`);
      });
      
      results.push({
        id: el.id,
        name: el.name,
        images: result.images.map(p => p.split('/').pop()),
      });
    } else {
      console.log(`  No images found (status: ${result.status}, error: ${result.error || 'none'})`);
    }
    
    // Пауза между запросами
    await new Promise(r => setTimeout(r, 1000));
  }
  
  fs.writeFileSync('detail-photos.json', JSON.stringify(results, null, 2));
  console.log('\nSaved to detail-photos.json');
}

main().catch(console.error);
