const fs = require('fs');

// Все реальные фото в public/electro (только .jpg/.png)
const realPhotos = fs.readdirSync('front/public/electro')
  .filter(f => f.endsWith('.jpg') || f.endsWith('.png'))
  .filter(f => f.length > 20); // Исключаем иконки и системные файлы

// Главные фото 18 карточек (из оригинала)
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

// Остальные фото (возможно дополнительные)
const extraPhotos = realPhotos.filter(f => !mainPhotos.some(m => m.file === f));

console.log('=== ДОПОЛНИТЕЛЬНЫЕ ФОТО (всего ' + extraPhotos.length + ') ===');
extraPhotos.forEach((f, i) => {
  console.log(`${i+1}. ${f}`);
});

// Группируем по префиксу (первые символы)
const groups = {};
extraPhotos.forEach(f => {
  const prefix = f.substring(0, 2);
  if (!groups[prefix]) groups[prefix] = [];
  groups[prefix].push(f);
});

console.log('\n\n=== ГРУППИРОВКА ПО ПРЕФИКСУ ===');
Object.entries(groups)
  .sort((a, b) => b[1].length - a[1].length)
  .forEach(([prefix, files]) => {
    console.log(`\n${prefix} (${files.length}):`);
    files.forEach(f => console.log(`  ${f}`));
  });

// Сохраняем список
fs.writeFileSync('extra-photos-list.txt', extraPhotos.join('\n'));
