const fs = require('fs');
const path = require('path');
const { MongoClient } = require('mongodb');

const PUBLIC_DIR = path.join(__dirname, '..', 'public');
const MONGODB_URI = 'mongodb://localhost:27017/koenig';

// Simulate the normalizeImageUrl function
function normalizeImageUrl(url) {
  if (!url) return "";
  try {
    const parsed = new URL(url, "http://localhost");
    const encodedPath = parsed.pathname
      .split("/")
      .map((segment) => encodeURIComponent(segment))
      .join("/");
    return encodedPath;
  } catch {
    return url;
  }
}

async function main() {
  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  const db = client.db('koenig');

  // Check bedspreads_and_pillows (pillows category)
  console.log('=== bedspreads_and_pillows_items ===');
  const pillowsItems = await db.collection('bedspreads_and_pillows').find({}).limit(3).toArray();
  for (const item of pillowsItems) {
    if (item.image) {
      const fullPath = path.join(PUBLIC_DIR, item.image);
      const exists = fs.existsSync(fullPath);
      const normalized = normalizeImageUrl(item.image);
      console.log(`\nOriginal:  ${item.image}`);
      console.log(`Normalized: ${normalized}`);
      console.log(`File exists: ${exists}`);
    }
  }

  // Check decor_items
  console.log('\n=== decor_items ===');
  const decorItems = await db.collection('decor_items').find({}).limit(3).toArray();
  for (const item of decorItems) {
    if (item.image) {
      const fullPath = path.join(PUBLIC_DIR, item.image);
      const exists = fs.existsSync(fullPath);
      const normalized = normalizeImageUrl(item.image);
      console.log(`\nOriginal:  ${item.image}`);
      console.log(`Normalized: ${normalized}`);
      console.log(`File exists: ${exists}`);
    }
  }

  // Check catalog_items for hero images
  console.log('\n=== catalog_items (pillows) ===');
  const catalogItem = await db.collection('catalog_items').findOne({ slug: 'interernye_pokryvala_i_podushki' });
  if (catalogItem?.items?.[0]) {
    const img = catalogItem.items[0].large_url;
    const fullPath = path.join(PUBLIC_DIR, img);
    const exists = fs.existsSync(fullPath);
    const normalized = normalizeImageUrl(img);
    console.log(`\nOriginal:  ${img}`);
    console.log(`Normalized: ${normalized}`);
    console.log(`File exists: ${exists}`);
  }

  await client.close();
}

main().catch(console.error);
