const fs = require('fs');

// Главные фото 18 карточек
const mainPhotos = [
  { id: 1, name: "Раздвижной наклонный", file: "zpf541bl644etsvmvqu8x5101f1fwjqf.jpg" },
  { id: 2, name: "Раздвижной прямой", file: "cj1yslfwwrw97eoz3mwlr9ooq322yzb3.jpg" },
  { id: 3, name: "Раздвижной угловой", file: "d26trwzyg56pm5qsw5dwfqrjsl4ub9f0.jpg" },
  { id: 4, name: "Раздвижной радиальный", file: "e4vvaub4qyq8lbeatdergktn89vfbnfb.jpg" },
  { id: 5, name: "Раздвижной на люверсах", file: "1o3bysw2k7990ir6z5kaor4o0316b0ci.jpg" },
  { id: 6, name: "Римский", file: "n1szfwy3h7bjh185fguzcsifxq69m1dp.jpg" },
  { id: 7, name: "Римский день-ночь", file: "janr06n307vnsaikabt3tquoq2wm5dwq.jpg" },
  { id: 8, name: "Римский наклонный", file: "w8w0qhhjz1asugmb2ck5tu6lzxrbjc6a.jpg" },
  { id: 9, name: "Рулонный с соединителем", file: "ecujr9pjg6z2493790j47qeu0zn515nd.jpg" },
  { id: 10, name: "Рулонный UNI2", file: "y0kts07ljazvqlv5oe1be1bhskjijbbz.png" },
  { id: 11, name: "Рулонный открытый", file: "qtdx2hb7kh7z831q2fl1zew3uvvtkm9b.jpg" },
  { id: 12, name: "Рулонный день-ночь", file: "9ly0rcdxw0lv83pk4ntvrg3rs5fl0a0l.jpg" },
  { id: 13, name: "Рулонный зебра в коробе", file: "87dftq9sroixbke0bdo4g23hp8qu8j18.jpg" },
  { id: 14, name: "Горизонтальные жалюзи", file: "2cxzcnwpb2pbec67lhut5dk0tfr1jpdj.jpg" },
  { id: 15, name: "Вертикальные жалюзи", file: "bpdkjbcq6bw5d2sduk4wsssqrrao7axn.jpg" },
  { id: 16, name: "Плиссе", file: "grvtvg899kzl5bcsmeftyl93m7aft8u2.jpg" },
  { id: 17, name: "Перголы", file: "308a0bfrbag3qjn00dl87rd0n735kqz9.jpg" },
  { id: 18, name: "Лифт-система", file: "zf56d1c6163bk26r6tmx33e8quu27ez8.jpg" },
];

// Все фото
const allPhotos = fs.readdirSync('front/public/electro')
  .filter(f => f.endsWith('.jpg') || f.endsWith('.png'));

// Фильтруем только реальные фото товаров (исключаем иконки, фоны, баннеры)
const productPhotos = allPhotos.filter(f => {
  const isSystem = f.startsWith('icon') || 
                   f.startsWith('bg') || 
                   f.startsWith('banner') || 
                   f.startsWith('Vector') ||
                   f.startsWith('arrow') ||
                   f.startsWith('menu') ||
                   f.startsWith('sprite') ||
                   f.startsWith('popup') ||
                   f.startsWith('bx-') ||
                   f.startsWith('cart') ||
                   f.startsWith('callback') ||
                   f.startsWith('command') ||
                   f.startsWith('consult') ||
                   f.startsWith('design') ||
                   f.startsWith('lead') ||
                   f.startsWith('onviz') ||
                   f.startsWith('promo') ||
                   f.startsWith('beaty') ||
                   f.startsWith('loader') ||
                   f.startsWith('loading') ||
                   f.startsWith('logo') ||
                   f.startsWith('miler') ||
                   f.startsWith('needle') ||
                   f.startsWith('roulette') ||
                   f.startsWith('svideo') ||
                   f.startsWith('whatsapp') ||
                   f.startsWith('checkbox') ||
                   f.startsWith('close') ||
                   f.startsWith('cres') ||
                   f.startsWith('phone') ||
                   f.startsWith('pin') ||
                   f.startsWith('plus') ||
                   f.startsWith('minus') ||
                   f.startsWith('chevron') ||
                   f.startsWith('angle') ||
                   f.startsWith('search') ||
                   f.startsWith('table') ||
                   f.startsWith('edit') ||
                   f.startsWith('del') ||
                   f.startsWith('copy') ||
                   f.startsWith('create') ||
                   f.startsWith('new') ||
                   f.startsWith('file') ||
                   f.startsWith('folder') ||
                   f.startsWith('page') ||
                   f.startsWith('param') ||
                   f.startsWith('pencil') ||
                   f.startsWith('key') ||
                   f.startsWith('user') ||
                   f.startsWith('nav') ||
                   f.startsWith('comp') ||
                   f.startsWith('font') ||
                   f.startsWith('jyuc') ||
                   f.startsWith('m8wy') ||
                   f.startsWith('otdt') ||
                   f.startsWith('pm_logo') ||
                   f.startsWith('favicon') ||
                   f === 'image16.png' ||
                   f === 'image16-1.png' ||
                   f === 'image16-2.png';
  return !isSystem;
});

console.log('=== РЕАЛЬНЫЕ ФОТО ТОВАРОВ ===');
console.log(`Всего: ${productPhotos.length}`);

// Фото не являющиеся главными
const extraPhotos = productPhotos.filter(f => !mainPhotos.some(m => m.file === f));

console.log('\n=== ДОПОЛНИТЕЛЬНЫЕ ФОТО (не главные) ===');
console.log(`Всего: ${extraPhotos.length}`);
extraPhotos.forEach((f, i) => {
  console.log(`${i+1}. ${f}`);
});

// Пытаемся сопоставить по первым символам имени
console.log('\n=== ПОПЫТКА СОПОСТАВЛЕНИЯ ===');
mainPhotos.forEach(main => {
  const prefix = main.file.substring(0, 3);
  const similar = extraPhotos.filter(ex => ex.startsWith(prefix));
  if (similar.length > 0) {
    console.log(`\n${main.name} (${main.file}):`);
    similar.forEach(s => console.log(`  → ${s}`));
  }
});
