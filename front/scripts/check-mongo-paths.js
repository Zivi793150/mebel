const fs = require('fs');
const path = require('path');
const { MongoClient } = require('mongodb');

const PUBLIC_DIR = path.join(__dirname, '..', 'public');
const MONGODB_URI = 'mongodb://localhost:27017/koenig';

async function main() {
  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  const db = client.db('koenig');

  // Check decor_items
  console.log('=== Checking decor_items ===');
  const decorItems = await db.collection('decor_items').find({}).limit(5).toArray();
  for (const item of decorItems) {
    if (item.image) {
      const fullPath = path.join(PUBLIC_DIR, item.image);
      const exists = fs.existsSync(fullPath);
      console.log(`${exists ? 'OK' : '404'}: ${item.image}`);
    }
  }

  // Check bedding_items
  console.log('\n=== Checking bedding_items ===');
  const beddingItems = await db.collection('bedding_items').find({}).limit(5).toArray();
  for (const item of beddingItems) {
    if (item.image) {
      const fullPath = path.join(PUBLIC_DIR, item.image);
      const exists = fs.existsSync(fullPath);
      console.log(`${exists ? 'OK' : '404'}: ${item.image}`);
    }
  }

  // Check bedspreads_and_pillows_items
  console.log('\n=== Checking bedspreads_and_pillows_items ===');
  const pillowsItems = await db.collection('bedspreads_and_pillows_items').find({}).limit(5).toArray();
  for (const item of pillowsItems) {
    if (item.image) {
      const fullPath = path.join(PUBLIC_DIR, item.image);
      const exists = fs.existsSync(fullPath);
      console.log(`${exists ? 'OK' : '404'}: ${item.image}`);
    }
  }

  await client.close();
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
