const https = require('https');
const fs = require('fs');

// ID элементов из HTML
const elements = [
  { id: 14186, title: "Раздвижной наклонный электрокарниз", main: "zpf541bl644etsvmvqu8x5101f1fwjqf.jpg" },
  { id: 14178, title: "Раздвижной прямой электрокарниз", main: "cj1yslfwwrw97eoz3mwlr9ooq322yzb3.jpg" },
  { id: 14187, title: "Раздвижной угловой электрокарниз", main: "d26trwzyg56pm5qsw5dwfqrjsl4ub9f0.jpg" },
  { id: 14188, title: "Раздвижной радиальный электрокарниз", main: "e4vvaub4qyq8lbeatdergktn89vfbnfb.jpg" },
  { id: 14177, title: "Раздвижной прямой электрокарниз на люверсах", main: "1o3bysw2k7990ir6z5kaor4o0316b0ci.jpg" },
  { id: 14184, title: "Римский электрокарниз с электроприводом", main: "n1szfwy3h7bjh185fguzcsifxq69m1dp.jpg" },
  { id: 14189, title: "Римский электрокарниз день-ночь с электроприводом", main: "janr06n307vnsaikabt3tquoq2wm5dwq.jpg" },
  { id: 14190, title: "Римский наклонный электрокарниз с электроприводом", main: "w8w0qhhjz1asugmb2ck5tu6lzxrbjc6a.jpg" },
  { id: 14193, title: "Рулонный электрокарниз с соединителем и электроприводом", main: "ecujr9pjg6z2493790j47qeu0zn515nd.jpg" },
  { id: 14180, title: "Рулонный электрокарниз UNI2 с электроприводом", main: "y0kts07ljazvqlv5oe1be1bhskjijbbz.png" },
  { id: 14181, title: "Рулонный электрокарниз открытого типа с электроприводом", main: "qtdx2hb7kh7z831q2fl1zew3uvvtkm9b.jpg" },
  { id: 14191, title: "Рулонный электрокарниз день-ночь с электроприводом", main: "9ly0rcdxw0lv83pk4ntvrg3rs5fl0a0l.jpg" },
  { id: 14192, title: "Рулонный электрокарниз зебра в коробе с электроприводом", main: "87dftq9sroixbke0bdo4g23hp8qu8j18.jpg" },
  { id: 14179, title: "Электрокарниз для горизонтальных жалюзи с электроприводом", main: "2cxzcnwpb2pbec67lhut5dk0tfr1jpdj.jpg" },
  { id: 14194, title: "Электрокарниз для вертикальных жалюзи с электроприводом", main: "bpdkjbcq6bw5d2sduk4wsssqrrao7axn.jpg" },
  { id: 14182, title: "Электрокарниз для штор плиссе", main: "grvtvg899kzl5bcsmeftyl93m7aft8u2.jpg" },
  { id: 14183, title: "Электрокарниз для пергол с электроприводом", main: "308a0bfrbag3qjn00dl87rd0n735kqz9.jpg" },
  { id: 14185, title: "Подъёмный механизм лифт-система", main: "zf56d1c6163bk26r6tmx33e8quu27ez8.jpg" },
];

async function fetchElementAjax(id) {
  return new Promise((resolve) => {
    const postData = `IBLOCK_ID=141&ID=${id}&GET_PROPERTIES=Y`;
    const options = {
      hostname: 'centrshtor.ru',
      path: '/bitrix/components/bitrix/iblock.element.add/templates/.default/ajax.php',
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'X-Requested-With': 'XMLHttpRequest',
      },
      timeout: 10000,
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve({ id, data: json });
        } catch (e) {
          resolve({ id, error: 'parse', data: data.substring(0, 200) });
        }
      });
    });

    req.on('error', () => resolve({ id, error: 'request' }));
    req.on('timeout', () => { req.destroy(); resolve({ id, error: 'timeout' }); });
    req.write(postData);
    req.end();
  });
}

// Попробуем получить через стандартный REST API Bitrix
async function fetchRestApi(id) {
  return new Promise((resolve) => {
    const options = {
      hostname: 'centrshtor.ru',
      path: `/rest/iblock.element.get.json?filter[ID]=${id}&select[]=ID&select[]=NAME&select[]=PROPERTY_MORE_PHOTO`,
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
      timeout: 10000,
    };

    const req = https.get(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve({ id, data: json });
        } catch (e) {
          resolve({ id, error: 'parse', status: res.statusCode });
        }
      });
    });

    req.on('error', () => resolve({ id, error: 'request' }));
    req.on('timeout', () => { req.destroy(); resolve({ id, error: 'timeout' }); });
  });
}

async function main() {
  console.log('Trying to get additional photos...\n');
  
  // Попробуем REST API
  console.log('Testing REST API for element 14186...');
  const result = await fetchRestApi(14186);
  console.log('Result:', JSON.stringify(result, null, 2));
  
  // Проверим есть ли другие фото в локальной папке с похожими именами
  console.log('\n\nChecking local images for patterns...');
  const localDir = 'electro/images';
  const files = fs.readdirSync(localDir).filter(f => f.endsWith('.jpg') || f.endsWith('.png'));
  
  // Группируем по префиксам (первые символы имени)
  const groups = {};
  files.forEach(f => {
    const prefix = f.substring(0, 4);
    if (!groups[prefix]) groups[prefix] = [];
    groups[prefix].push(f);
  });
  
  // Показываем группы с более чем 1 файлом
  Object.entries(groups)
    .filter(([_, files]) => files.length > 1)
    .forEach(([prefix, files]) => {
      console.log(`\nPrefix '${prefix}' (${files.length} files):`);
      files.forEach(f => console.log(`  - ${f}`));
    });
}

main().catch(console.error);
