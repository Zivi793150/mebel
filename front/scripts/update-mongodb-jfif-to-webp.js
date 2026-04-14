const { MongoClient } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/koenig';

const COLLECTIONS = [
  'catalog_items',
  'blinds_types',
  'blinds_subcatalogs',
  'curtain_types',
  'decor_items',
  'bedding_items',
  'bedspreads_and_pillows_items',
  'carpet_items',
  'cornices',
];

function updateJfifToWebp(obj) {
  if (typeof obj === 'string') {
    return obj.replace(/\.jfif$/gi, '.webp');
  }
  if (Array.isArray(obj)) {
    return obj.map(updateJfifToWebp);
  }
  if (obj && typeof obj === 'object') {
    const result = {};
    for (const [key, value] of Object.entries(obj)) {
      result[key] = updateJfifToWebp(value);
    }
    return result;
  }
  return obj;
}

async function main() {
  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  console.log('Connected to MongoDB\n');

  const db = client.db('koenig');

  for (const colName of COLLECTIONS) {
    const col = db.collection(colName);
    
    const docs = await col.find({}).toArray();
    let updated = 0;

    for (const doc of docs) {
      const originalStr = JSON.stringify(doc);
      const updatedDoc = updateJfifToWebp(doc);
      
      // Check if any changes
      if (originalStr !== JSON.stringify(updatedDoc)) {
        // Use $set to update only changed fields, preserving _id
        const updates = {};
        for (const key of Object.keys(doc)) {
          if (key === '_id') continue; // Skip immutable _id field
          if (JSON.stringify(doc[key]) !== JSON.stringify(updatedDoc[key])) {
            updates[key] = updatedDoc[key];
          }
        }
        if (Object.keys(updates).length > 0) {
          await col.updateOne({ _id: doc._id }, { $set: updates });
          updated++;
        }
      }
    }

    if (updated > 0) {
      console.log(`[UPDATED] ${colName}: ${updated} docs`);
    }
  }

  await client.close();
  console.log('\nDone!');
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
