/**
 * Script to initialize local MongoDB with empty collections
 * Run this on server: node scripts/init-local-mongodb.js
 */

const { MongoClient } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/koenig';

// Define all collections with their indexes
const COLLECTIONS = {
  catalog_items: {
    indexes: [
      { key: { slug: 1 }, unique: true },
      { key: { source: 1 } },
    ],
    schema: {
      source: 'string',
      slug: 'string',
      title: 'string',
      description: 'string',
      subcategories: 'array',
      items: 'array',
    }
  },
  bedding_items: {
    indexes: [{ key: { slug: 1 }, unique: true }],
  },
  bedspreads_and_pillows: {
    indexes: [{ key: { slug: 1 }, unique: true }],
  },
  blinds_subcatalogs: {
    indexes: [{ key: { slug: 1 }, unique: true }],
  },
  blinds_types: {
    indexes: [{ key: { slug: 1 }, unique: true }],
  },
  carpet_items: {
    indexes: [{ key: { slug: 1 }, unique: true }],
  },
  cornices: {
    indexes: [{ key: { slug: 1 }, unique: true }],
  },
  curtain_types: {
    indexes: [{ key: { slug: 1 }, unique: true }],
  },
  decor_items: {
    indexes: [{ key: { slug: 1 }, unique: true }],
  },
  portfolio_images: {
    indexes: [
      { key: { url: 1 } },
      { key: { project: 1 } },
    ],
  },
  reviews: {
    indexes: [{ key: { date: -1 } }],
  },
  leads: {
    indexes: [
      { key: { createdAt: -1 } },
      { key: { status: 1 } },
    ],
  },
  lead_contexts: {
    indexes: [{ key: { leadId: 1 }, unique: true }],
  },
};

async function main() {
  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  console.log('✅ Connected to MongoDB\n');

  const db = client.db('koenig');

  // Get existing collections
  const existingCollections = await db.listCollections().toArray();
  const existingNames = new Set(existingCollections.map(c => c.name));

  console.log('📁 Creating collections...\n');

  for (const [name, config] of Object.entries(COLLECTIONS)) {
    try {
      if (existingNames.has(name)) {
        console.log(`⏭️  Collection exists: ${name}`);
      } else {
        await db.createCollection(name);
        console.log(`✅ Created: ${name}`);
      }

      // Create indexes
      if (config.indexes) {
        const collection = db.collection(name);
        for (const index of config.indexes) {
          try {
            await collection.createIndex(index.key, { unique: index.unique || false });
          } catch (e) {
            // Index might already exist
          }
        }
      }
    } catch (e) {
      console.log(`❌ Error creating ${name}: ${e.message}`);
    }
  }

  console.log('\n📊 Current collections:');
  const finalCollections = await db.listCollections().toArray();
  finalCollections.forEach(c => console.log(`   - ${c.name}`));

  console.log('\n✨ Local MongoDB initialized!');
  console.log('\nNext steps:');
  console.log('1. Set MONGODB_URI=mongodb://localhost:27017/koenig in .env');
  console.log('2. Run: npm start');
  console.log('3. Admin panel: http://localhost:3000/admin');

  await client.close();
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
