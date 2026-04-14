const { MongoClient } = require('mongodb');
const MONGODB_URI = 'mongodb://localhost:27017/koenig';

async function main() {
  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  const db = client.db('koenig');

  console.log('=== All collections in koenig DB ===\n');

  const collections = await db.listCollections().toArray();
  console.log('Collections:', collections.map(c => c.name).join(', '));

  console.log('\n=== Checking for external URLs in ALL collections ===\n');

  for (const colInfo of collections) {
    const colName = colInfo.name;
    const col = db.collection(colName);
    
    // Find any document with external URLs
    const docs = await col.find({
      $or: [
        { $text: { $search: "http" } },
        { image: /http/i },
        { images: /http/i },
        { url: /http/i },
        { large_url: /http/i },
        { small_url: /http/i },
        { thumb_url: /http/i },
        { src: /http/i },
        { video: /http/i },
        { content: /http/i },
      ]
    }).limit(5).toArray();

    if (docs.length > 0) {
      console.log(`\n--- ${colName} (${docs.length} sample docs with http) ---`);
      docs.forEach(doc => {
        console.log(`  _id: ${doc._id}`);
        if (doc.slug) console.log(`  slug: ${doc.slug}`);
        if (doc.title) console.log(`  title: ${doc.title}`);
        
        // Show fields with http
        for (const [key, value] of Object.entries(doc)) {
          if (typeof value === 'string' && value.includes('http')) {
            console.log(`  ${key}: "${value.substring(0, 100)}..."`);
          } else if (Array.isArray(value)) {
            value.forEach((v, i) => {
              if (typeof v === 'string' && v.includes('http')) {
                console.log(`  ${key}[${i}]: "${v.substring(0, 100)}..."`);
              }
            });
          }
        }
      });
    }
  }

  await client.close();
  console.log('\n=== Done ===');
}

main().catch(console.error);
