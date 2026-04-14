const { MongoClient } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/koenig';

// Collections that might contain image URLs
const IMAGE_COLLECTIONS = [
  'catalog_items',
  'bedding_items',
  'bedspreads_and_pillows',
  'blinds_subcatalogs',
  'blinds_types',
  'carpet_items',
  'cornices',
  'curtain_types',
  'decor_items',
  'portfolio_images',
  'reviews',
  'leads',
];

function updateImageUrls(obj) {
  if (typeof obj === 'string') {
    // Convert local/remote paths ending with .jpg/.jpeg/.png (any case) to .webp.
    // Preserves query string/hash and avoids double converting.
    // Examples:
    //  "/a/b/c.JPG" -> "/a/b/c.webp"
    //  "https://x/y.png?1" -> "https://x/y.webp?1"
    return obj.replace(/\.(jpe?g|png)(\?[^#]*)?(#.*)?$/gi, '.webp$2$3');
  }
  if (Array.isArray(obj)) {
    return obj.map(updateImageUrls);
  }
  if (obj && typeof obj === 'object') {
    const result = {};
    for (const [key, value] of Object.entries(obj)) {
      // Common image URL field names
      if (['url', 'image', 'imageUrl', 'thumb_url', 'large_url', 'cover', 'photo', 'src', 'avatar', 'icon', 'preview'].includes(key)) {
        result[key] = updateImageUrls(value);
      } else {
        result[key] = updateImageUrls(value);
      }
    }
    return result;
  }
  return obj;
}

async function processCollection(db, collectionName) {
  console.log(`\n📁 Processing: ${collectionName}`);

  try {
    const collection = db.collection(collectionName);
    const count = await collection.countDocuments();

    if (count === 0) {
      console.log(`   Empty collection, skipping`);
      return;
    }

    const docs = await collection.find({}).toArray();
    let updatedCount = 0;

    for (const doc of docs) {
      const updatedDoc = updateImageUrls(doc);

      // Check if any changes were made
      const hasChanges = JSON.stringify(doc) !== JSON.stringify(updatedDoc);

      if (hasChanges) {
        // Build update object
        const updateOps = {};
        for (const key of Object.keys(updatedDoc)) {
          if (key !== '_id' && JSON.stringify(doc[key]) !== JSON.stringify(updatedDoc[key])) {
            updateOps[key] = updatedDoc[key];
          }
        }

        if (Object.keys(updateOps).length > 0) {
          await collection.updateOne(
            { _id: doc._id },
            { $set: updateOps }
          );
          updatedCount++;
          console.log(`   ✅ Updated: ${doc._id || doc.slug || doc.name || 'document'}`);
        }
      }
    }

    console.log(`   📊 Total: ${count}, Updated: ${updatedCount}`);

  } catch (e) {
    console.log(`   ❌ Error: ${e.message}`);
  }
}

async function main() {
  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  console.log('Connected to MongoDB\n');

  const db = client.db('koenig');

  // Get all collections
  const collections = await db.listCollections().toArray();
  const collectionNames = collections.map(c => c.name);

  console.log('Found collections:', collectionNames.join(', '), '\n');

  // Process all collections
  for (const collName of collectionNames) {
    await processCollection(db, collName);
  }

  console.log('\n✨ All collections processed!');
  await client.close();
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
