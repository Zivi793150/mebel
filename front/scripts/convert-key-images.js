const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const PUBLIC_DIR = path.join(__dirname, '..', 'public');

// Только ключевые изображения для конвертации
const KEY_FILES = [
  'Фоновая на главную 1.jpg',
  'logo.png',
  'Предлагаем/Дизайн штор_1238.JPG',
  'Предлагаем/Оформление текстилем -11.jpeg',
  'Предлагаем/Солнцзащит сист7390.jpg',
  'Предлагаем/Электрокарнизы .png',
  'химчистка/3. Установка на объекте .jpg',
  'химчистка/Чистка и восстановление 1 .jpg',
  'Порядок работы  .jpg',
  'Фото на кнопку 1 .jpg',
];

const CATALOG_ICONS = [
  'Шторы и ткани.jpg',
  'Жалюзи _121.jpg',
  'Римские шторы_907.jpg',
  'Декоративные карнизы _121.jpg',
  'Декор и фурнитура .jpg',
  'Постельное белье .jpg',
  'Ковры .jpg',
  'Подушки .jpg',
];

async function convertFile(inputPath, outputPath) {
  if (!fs.existsSync(inputPath)) {
    console.log(`⚠️  Not found: ${path.relative(PUBLIC_DIR, inputPath)}`);
    return;
  }
  
  // Skip if webp exists and is newer
  if (fs.existsSync(outputPath)) {
    const originalStat = fs.statSync(inputPath);
    const webpStat = fs.statSync(outputPath);
    if (webpStat.mtime >= originalStat.mtime) {
      console.log(`⏭️  Up to date: ${path.relative(PUBLIC_DIR, outputPath)}`);
      return;
    }
  }
  
  try {
    await sharp(inputPath)
      .webp({ quality: 85, effort: 6 })
      .toFile(outputPath);
    
    const originalSize = fs.statSync(inputPath).size;
    const webpSize = fs.statSync(outputPath).size;
    const savings = ((originalSize - webpSize) / originalSize * 100).toFixed(1);
    
    console.log(`✅ ${path.relative(PUBLIC_DIR, outputPath)} (${savings}% smaller)`);
  } catch (err) {
    console.error(`❌ Failed: ${path.relative(PUBLIC_DIR, inputPath)} - ${err.message}`);
  }
}

async function main() {
  console.log('🚀 Converting key images to WebP...\n');
  
  // Convert key files
  for (const file of KEY_FILES) {
    const inputPath = path.join(PUBLIC_DIR, file);
    const outputPath = inputPath.replace(/\.(jpg|jpeg|png|JPG|JPEG|PNG)$/i, '.webp');
    await convertFile(inputPath, outputPath);
  }
  
  // Convert catalog icons
  const iconsDir = path.join(PUBLIC_DIR, 'Иконки каталог');
  for (const file of CATALOG_ICONS) {
    const inputPath = path.join(iconsDir, file);
    const outputPath = inputPath.replace(/\.(jpg|jpeg|png)$/i, '.webp');
    await convertFile(inputPath, outputPath);
  }
  
  console.log('\n✨ Done!');
}

main().catch(console.error);
