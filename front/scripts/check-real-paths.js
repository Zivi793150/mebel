const fs = require('fs');
const path = require('path');
const { MongoClient } = require('mongodb');

const PUBLIC_DIR = path.join(__dirname, '..', 'public');
const MONGODB_URI = 'mongodb://localhost:27017/koenig';

async function main() {
  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  const db = client.db('koenig');

  // Get actual paths from MongoDB
  console.log('=== Real MongoDB paths ===');
  
  const decorItem = await db.collection('decor_items').findOne({});
  console.log('decor_items image:', decorItem?.image);
  
  const beddingItem = await db.collection('bedding_items').findOne({});
  console.log('bedding_items image:', beddingItem?.image);

  // Check if files exist
  console.log('\n=== File existence check ===');
  if (decorItem?.image) {
    const fullPath = path.join(PUBLIC_DIR, decorItem.image);
    console.log('Path:', fullPath);
    console.log('Exists:', fs.existsSync(fullPath));
  }

  // List actual catalog folder structure
  console.log('\n=== Catalog folder structure ===');
  const catalogDir = path.join(PUBLIC_DIR, 'catalog');
  const catalogFolders = fs.readdirSync(catalogDir, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name);
  console.log('Folders in catalog:');
  catalogFolders.forEach(f => console.log(`  ${f}`));

  // Check decor folder specifically
  console.log('\n=== Decor folder contents ===');
  const decorFolders = catalogFolders.filter(f => f.includes('5') || f.includes('äåâî÷êà'));
  decorFolders.forEach(folder => {
    const fullPath = path.join(catalogDir, folder);
    const files = fs.readdirSync(fullPath).slice(0, 5);
    console.log(`\n${folder}:`);
    files.forEach(f => console.log(`  ${f}`));
  });

  await client.close();
}

main().catch(console.error);
