#!/usr/bin/env node
/**
 * Скрипт для исправления путей к изображениям в JSON файлах:
 * 1. Удаляет дублирующиеся сегменты пути (2.zhalyuzi/2.zhalyuzi/ → 2.zhalyuzi/)
 * 2. Меняет .jfif на .webp
 */

const fs = require('fs');
const path = require('path');

const JSON_DIR = path.join(__dirname, '..', '..', 'back');

function dedupePathSegments(p) {
  if (!p || typeof p !== 'string') return p;
  const parts = p.split('/').filter(Boolean);
  const seen = new Set();
  const result = [];
  for (const part of parts) {
    if (!seen.has(part)) {
      seen.add(part);
      result.push(part);
    }
  }
  return '/' + result.join('/');
}

function fixImagePath(p) {
  if (!p || typeof p !== 'string') return p;
  // Fix duplicates
  let fixed = dedupePathSegments(p);
  // Fix extension
  fixed = fixed.replace(/\.jfif$/i, '.webp');
  return fixed;
}

function fixDoc(doc) {
  if (!doc || typeof doc !== 'object') return doc;
  const fixed = { ...doc };
  if (fixed.image) {
    fixed.image = fixImagePath(fixed.image);
  }
  if (Array.isArray(fixed.images)) {
    fixed.images = fixed.images.map(fixImagePath);
  }
  return fixed;
}

function processFile(filename) {
  const filepath = path.join(JSON_DIR, filename);
  if (!fs.existsSync(filepath)) {
    console.log(`Skip: ${filename} (not found)`);
    return;
  }
  
  console.log(`Processing: ${filename}`);
  const content = fs.readFileSync(filepath, 'utf-8');
  let data;
  try {
    data = JSON.parse(content);
  } catch (e) {
    console.error(`  Error parsing ${filename}:`, e.message);
    return;
  }
  
  if (!Array.isArray(data)) {
    console.log(`  Skip: not an array`);
    return;
  }
  
  const fixed = data.map(fixDoc);
  fs.writeFileSync(filepath, JSON.stringify(fixed, null, 2), 'utf-8');
  console.log(`  Fixed ${data.length} documents`);
}

const files = [
  'koenig.blinds_types.json',
  'koenig.bedding_items.json',
  'koenig.bedspreads_and_pillows.json',
  'koenig.carpet_items.json',
  'koenig.catalog_items.json',
  'koenig.cornices.json',
  'koenig.curtain_types.json',
  'koenig.decor_items.json',
  'koenig.blinds_subcatalogs.json'
];

console.log('Fixing JSON paths...\n');
files.forEach(processFile);
console.log('\nDone!');
