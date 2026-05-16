#!/usr/bin/env node
/**
 * Скрипт для проверки структуры папок catalog и сопоставления с путями в JSON
 */

const fs = require('fs');
const path = require('path');

const CATALOG_DIR = path.join(__dirname, '..', 'public', 'catalog');
const JSON_DIR = path.join(__dirname, '..', '..', 'back');

function getAllFiles(dir, basePath = '') {
  const files = [];
  const items = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const item of items) {
    const fullPath = path.join(dir, item.name);
    const relativePath = basePath ? `${basePath}/${item.name}` : item.name;
    
    if (item.isDirectory()) {
      files.push(...getAllFiles(fullPath, relativePath));
    } else {
      files.push(relativePath.replace(/\\/g, '/'));
    }
  }
  return files;
}

function extractPathsFromJSON() {
  const jsonFiles = [
    'koenig.blinds_types.json',
    'koenig.bedding_items.json',
    'koenig.bedspreads_and_pillows.json',
    'koenig.carpet_items.json',
    'koenig.catalog_items.json',
    'koenig.cornices.json',
    'koenig.curtain_types.json',
    'koenig.decor_items.json'
  ];
  
  const allPaths = new Set();
  
  for (const filename of jsonFiles) {
    const filepath = path.join(JSON_DIR, filename);
    if (!fs.existsSync(filepath)) continue;
    
    const data = JSON.parse(fs.readFileSync(filepath, 'utf-8'));
    if (!Array.isArray(data)) continue;
    
    for (const doc of data) {
      if (doc.image) allPaths.add(doc.image.replace(/^\//, ''));
      if (Array.isArray(doc.images)) {
        doc.images.forEach(img => allPaths.add(img.replace(/^\//, '')));
      }
    }
  }
  
  return allPaths;
}

console.log('=== Checking Catalog Structure ===\n');

// 1. List all files in catalog
console.log('Files in public/catalog:');
const catalogFiles = getAllFiles(CATALOG_DIR);
catalogFiles.forEach(f => console.log(`  ${f}`));

console.log('\n=== Checking JSON Paths ===\n');

// 2. Check paths from JSON
const jsonPaths = extractPathsFromJSON();
const missing = [];
const found = [];

for (const p of jsonPaths) {
  const cleanPath = p.replace(/^catalog\//, '');
  const exists = catalogFiles.some(f => 
    f === cleanPath || 
    f.toLowerCase() === cleanPath.toLowerCase()
  );
  if (exists) {
    found.push(p);
  } else {
    missing.push(p);
  }
}

console.log(`Found: ${found.length} files`);
console.log(`Missing: ${missing.length} files`);

if (missing.length > 0) {
  console.log('\nMissing files:');
  missing.forEach(p => console.log(`  ❌ ${p}`));
}

console.log('\n=== Subfolder Analysis ===');
const subdirs = fs.readdirSync(CATALOG_DIR, { withFileTypes: true })
  .filter(d => d.isDirectory())
  .map(d => d.name);

for (const subdir of subdirs) {
  const subPath = path.join(CATALOG_DIR, subdir);
  const files = getAllFiles(subPath, subdir);
  const directFiles = files.filter(f => !f.includes('/'));
  const nestedFiles = files.filter(f => f.includes('/'));
  
  console.log(`\n${subdir}:`);
  console.log(`  Direct files: ${directFiles.length}`);
  console.log(`  In subfolders: ${nestedFiles.length}`);
  if (directFiles.length > 0) {
    console.log('  Files in root:');
    directFiles.forEach(f => console.log(`    - ${f}`));
  }
}
