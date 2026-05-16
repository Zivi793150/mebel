const fs = require('fs');

// Все файлы в public/electro
const allFiles = fs.readdirSync('front/public/electro')
  .filter(f => f.endsWith('.jpg') || f.endsWith('.png'))
  .filter(f => !f.startsWith('icon') && !f.startsWith('bg') && !f.startsWith('Vector') && !f.includes('banner') && !f.includes('pattern'));

// Главные фото 18 карточек
const mainPhotos = [
  "zpf541bl644etsvmvqu8x5101f1fwjqf.jpg", // 1. Раздвижной наклонный
  "cj1yslfwwrw97eoz3mwlr9ooq322yzb3.jpg", // 2. Раздвижной прямой
  "d26trwzyg56pm5qsw5dwfqrjsl4ub9f0.jpg", // 3. Раздвижной угловой
  "e4vvaub4qyq8lbeatdergktn89vfbnfb.jpg", // 4. Раздвижной радиальный
  "1o3bysw2k7990ir6z5kaor4o0316b0ci.jpg", // 5. Раздвижной на люверсах
  "n1szfwy3h7bjh185fguzcsifxq69m1dp.jpg", // 6. Римский
  "janr06n307vnsaikabt3tquoq2wm5dwq.jpg", // 7. Римский день-ночь
  "w8w0qhhjz1asugmb2ck5tu6lzxrbjc6a.jpg", // 8. Римский наклонный
  "ecujr9pjg6z2493790j47qeu0zn515nd.jpg", // 9. Рулонный с соединителем
  "y0kts07ljazvqlv5oe1be1bhskjijbbz.png", // 10. Рулонный UNI2
  "qtdx2hb7kh7z831q2fl1zew3uvvtkm9b.jpg", // 11. Рулонный открытый
  "9ly0rcdxw0lv83pk4ntvrg3rs5fl0a0l.jpg", // 12. Рулонный день-ночь
  "87dftq9sroixbke0bdo4g23hp8qu8j18.jpg", // 13. Рулонный зебра в коробе
  "2cxzcnwpb2pbec67lhut5dk0tfr1jpdj.jpg", // 14. Горизонтальные жалюзи
  "bpdkjbcq6bw5d2sduk4wsssqrrao7axn.jpg", // 15. Вертикальные жалюзи
  "grvtvg899kzl5bcsmeftyl93m7aft8u2.jpg", // 16. Плиссе
  "308a0bfrbag3qjn00dl87rd0n735kqz9.jpg", // 17. Перголы
  "zf56d1c6163bk26r6tmx33e8quu27ez8.jpg", // 18. Лифт-система
];

// Остальные фото (дополнительные)
const extraPhotos = allFiles.filter(f => !mainPhotos.includes(f));

console.log('Всего фото:', allFiles.length);
console.log('Главных фото:', mainPhotos.length);
console.log('Дополнительных фото:', extraPhotos.length);
console.log('\nДополнительные фото:');
extraPhotos.forEach((f, i) => {
  console.log(`${i+1}. ${f}`);
});

// Попробуем сгруппировать по типу карниза на основе схожести имен
const cards = [
  { id: 1, name: "Раздвижной наклонный", main: "zpf541bl644etsvmvqu8x5101f1fwjqf.jpg", extra: [] },
  { id: 2, name: "Раздвижной прямой", main: "cj1yslfwwrw97eoz3mwlr9ooq322yzb3.jpg", extra: [] },
  { id: 3, name: "Раздвижной угловой", main: "d26trwzyg56pm5qsw5dwfqrjsl4ub9f0.jpg", extra: [] },
  { id: 4, name: "Раздвижной радиальный", main: "e4vvaub4qyq8lbeatdergktn89vfbnfb.jpg", extra: [] },
  { id: 5, name: "Раздвижной на люверсах", main: "1o3bysw2k7990ir6z5kaor4o0316b0ci.jpg", extra: [] },
  { id: 6, name: "Римский", main: "n1szfwy3h7bjh185fguzcsifxq69m1dp.jpg", extra: [] },
  { id: 7, name: "Римский день-ночь", main: "janr06n307vnsaikabt3tquoq2wm5dwq.jpg", extra: [] },
  { id: 8, name: "Римский наклонный", main: "w8w0qhhjz1asugmb2ck5tu6lzxrbjc6a.jpg", extra: [] },
  { id: 9, name: "Рулонный с соединителем", main: "ecujr9pjg6z2493790j47qeu0zn515nd.jpg", extra: [] },
  { id: 10, name: "Рулонный UNI2", main: "y0kts07ljazvqlv5oe1be1bhskjijbbz.png", extra: [] },
  { id: 11, name: "Рулонный открытый", main: "qtdx2hb7kh7z831q2fl1zew3uvvtkm9b.jpg", extra: [] },
  { id: 12, name: "Рулонный день-ночь", main: "9ly0rcdxw0lv83pk4ntvrg3rs5fl0a0l.jpg", extra: [] },
  { id: 13, name: "Рулонный зебра в коробе", main: "87dftq9sroixbke0bdo4g23hp8qu8j18.jpg", extra: [] },
  { id: 14, name: "Горизонтальные жалюзи", main: "2cxzcnwpb2pbec67lhut5dk0tfr1jpdj.jpg", extra: [] },
  { id: 15, name: "Вертикальные жалюзи", main: "bpdkjbcq6bw5d2sduk4wsssqrrao7axn.jpg", extra: [] },
  { id: 16, name: "Плиссе", main: "grvtvg899kzl5bcsmeftyl93m7aft8u2.jpg", extra: [] },
  { id: 17, name: "Перголы", main: "308a0bfrbag3qjn00dl87rd0n735kqz9.jpg", extra: [] },
  { id: 18, name: "Лифт-система", main: "zf56d1c6163bk26r6tmx33e8quu27ez8.jpg", extra: [] },
];

// Распределяем доп фото по карточкам
// Простое распределение - по 2-3 фото на карточку
for (let i = 0; i < extraPhotos.length && i < cards.length * 2; i++) {
  const cardIndex = Math.floor(i / 2);
  if (cardIndex < cards.length) {
    cards[cardIndex].extra.push(extraPhotos[i]);
  }
}

console.log('\n\n=== Распределение фото по карточкам ===');
cards.forEach(c => {
  console.log(`\n${c.id}. ${c.name}`);
  console.log(`   Главное: ${c.main}`);
  if (c.extra.length > 0) {
    console.log(`   Дополнительные: ${c.extra.join(', ')}`);
  }
});

fs.writeFileSync('photo-distribution.json', JSON.stringify(cards, null, 2));
