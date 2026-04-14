const { MongoClient } = require('mongodb');
const http = require('http');
const https = require('https');

const MONGODB_URI = 'mongodb://localhost:27017/koenig';

async function main() {
  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  const db = client.db('koenig');

  console.log('=== Checking image URLs from MongoDB ===\n');

  const cols = [
    'catalog_items',
    'decor_items', 
    'bedding_items',
    'bedspreads_and_pillows',
  ];

  const allUrls = [];

  for (const colName of cols) {
    const col = db.collection(colName);
    const docs = await col.find({}).limit(10).toArray();
    
    docs.forEach(doc => {
      // Check various image fields
      const fields = ['image', 'large_url', 'small_url', 'thumb_url', 'url'];
      fields.forEach(f => {
        if (doc[f] && typeof doc[f] === 'string') {
          allUrls.push({ col: colName, slug: doc.slug, field: f, url: doc[f] });
        }
      });
      
      if (doc.images && Array.isArray(doc.images)) {
        doc.images.forEach((img, i) => {
          if (typeof img === 'string') {
            allUrls.push({ col: colName, slug: doc.slug, field: `images[${i}]`, url: img });
          }
        });
      }
      
      if (doc.items && Array.isArray(doc.items)) {
        doc.items.forEach((item, i) => {
          if (item.large_url) {
            allUrls.push({ col: colName, slug: doc.slug, field: `items[${i}].large_url`, url: item.large_url });
          }
        });
      }
    });
  }

  console.log(`Found ${allUrls.length} image URLs\n`);

  // Categorize URLs
  const localUrls = allUrls.filter(u => u.url.startsWith('/'));
  const externalUrls = allUrls.filter(u => u.url.startsWith('http'));

  console.log(`Local paths: ${localUrls.length}`);
  console.log(`External URLs: ${externalUrls.length}\n`);

  // Show sample external URLs
  if (externalUrls.length > 0) {
    console.log('=== Sample external URLs ===');
    externalUrls.slice(0, 10).forEach(u => {
      console.log(`  ${u.col}/${u.slug}: ${u.url.substring(0, 80)}`);
    });
  }

  // Show sample local URLs with Russian chars
  const russianUrls = localUrls.filter(u => /[\u0400-\u04FF]/.test(u.url));
  if (russianUrls.length > 0) {
    console.log('\n=== Local URLs with Russian characters ===');
    russianUrls.slice(0, 5).forEach(u => {
      console.log(`  ${u.col}/${u.slug}: ${u.url}`);
    });
  }

  await client.close();
}

main().catch(console.error);
