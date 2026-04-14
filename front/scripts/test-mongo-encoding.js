const http = require('http');
const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');

const PUBLIC_DIR = path.join(__dirname, '..', 'public');
const MONGODB_URI = 'mongodb://localhost:27017/koenig';

// Simulate encodeUrlPath
function encodeUrlPath(urlPath) {
  if (!urlPath) return "";
  return urlPath
    .split("/")
    .map((segment) => {
      try {
        const decoded = decodeURIComponent(segment);
        return encodeURIComponent(decoded);
      } catch {
        return encodeURIComponent(segment);
      }
    })
    .join("/");
}

async function main() {
  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  const db = client.db('koenig');

  console.log('=== Testing MongoDB image paths ===\n');

  // Test catalog_items
  const catalogItem = await db.collection('catalog_items').findOne({ slug: 'interernye_pokryvala_i_podushki' });
  if (catalogItem?.items?.[0]) {
    const img = catalogItem.items[0].large_url;
    console.log('MongoDB path:', img);
    
    // Check if file exists
    const fullPath = path.join(PUBLIC_DIR, img);
    const exists = fs.existsSync(fullPath);
    console.log('File exists:', exists);
    
    // Test encoded URL
    const encoded = encodeUrlPath(img);
    console.log('Encoded URL:', encoded.substring(0, 60) + '...');
    
    // Test HTTP
    const status = await new Promise(resolve => {
      http.get(`http://localhost:3001${encoded}`, res => resolve(res.statusCode))
        .on('error', () => resolve('ERROR'));
    });
    console.log('HTTP status:', status);
  }

  // Test decor_items
  const decorItem = await db.collection('decor_items').findOne({});
  if (decorItem?.image) {
    console.log('\nDecor path:', decorItem.image);
    const fullPath = path.join(PUBLIC_DIR, decorItem.image);
    console.log('File exists:', fs.existsSync(fullPath));
    
    const encoded = encodeUrlPath(decorItem.image);
    const status = await new Promise(resolve => {
      http.get(`http://localhost:3001${encoded}`, res => resolve(res.statusCode))
        .on('error', () => resolve('ERROR'));
    });
    console.log('HTTP status:', status);
  }

  // Test bedding_items
  const beddingItem = await db.collection('bedding_items').findOne({});
  if (beddingItem?.image) {
    console.log('\nBedding path:', beddingItem.image);
    const fullPath = path.join(PUBLIC_DIR, beddingItem.image);
    console.log('File exists:', fs.existsSync(fullPath));
    
    const encoded = encodeUrlPath(beddingItem.image);
    const status = await new Promise(resolve => {
      http.get(`http://localhost:3001${encoded}`, res => resolve(res.statusCode))
        .on('error', () => resolve('ERROR'));
    });
    console.log('HTTP status:', status);
  }

  await client.close();
}

main().catch(console.error);
