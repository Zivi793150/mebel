/**
 * Скрипт для исправления URL ковров в MongoDB.
 * Старые записи имеют неправильные URL (demonstration, him, dealers и т.д.)
 * Правильный URL формируется из коллекции: https://koenigcarpet.ru/ru/collection/{collection}
 */
import { MongoClient } from 'mongodb';

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017';

async function main() {
  const client = new MongoClient(MONGO_URI);
  await client.connect();
  const db = client.db('koenig');
  const col = db.collection('carpet_items');

  const docs = await col.find({
    source: 'koenigcarpet.ru',
    kind: 'rug',
  }).toArray();

  console.log(`Found ${docs.length} carpet items\n`);

  let fixed = 0;
  let skipped = 0;
  let noCollection = 0;

  for (const doc of docs) {
    const collection = doc.collection || '';
    const currentUrl = doc.url || '';
    const title = (doc.title || '').slice(0, 50);

    // Skip if already has a good URL
    if (currentUrl && currentUrl.startsWith('https://koenigcarpet.ru/ru/collection/')) {
      skipped++;
      continue;
    }

    // Build correct URL from collection + title-based slug
    if (collection) {
      // Try to build a product-specific URL
      // The site uses: /ru/{collectionSlug}/{productCode}
      // or fallback to collection page
      let newUrl;
      if (doc.product_code) {
        newUrl = `https://koenigcarpet.ru/ru/${collection}/${doc.product_code.toLowerCase()}`;
      } else {
        newUrl = `https://koenigcarpet.ru/ru/collection/${collection}`;
      }
      await col.updateOne(
        { _id: doc._id },
        { $set: { url: newUrl } }
      );
      console.log(`  ✓ Fixed: ${title}`);
      console.log(`    was: ${currentUrl || '(empty)'}`);
      console.log(`    now: ${newUrl}`);
      fixed++;
    } else {
      noCollection++;
      console.log(`  ✗ SKIP (no collection): ${title}`);
    }
  }

  console.log(`\n---`);
  console.log(`Fixed: ${fixed}`);
  console.log(`Skipped (already correct): ${skipped}`);
  console.log(`No collection field: ${noCollection}`);
  console.log(`\nDone.`);
  
  await client.close();
}

main().catch(e => {
  console.error('Error:', e.message);
  process.exit(1);
});