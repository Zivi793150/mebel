const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const dbName = 'koenig';

const client = new MongoClient(uri);

async function fixPaths() {
  try {
    await client.connect();
    const db = client.db(dbName);
    
    // Collections that might have image paths
    const collections = [
      'catalog_items',
      'curtain_types', 
      'blinds_types',
      'cornices',
      'bedding_items',
      'bedspreads_and_pillows',
      'decor_items',
      'carpet_items'
    ];
    
    for (const collName of collections) {
      const coll = db.collection(collName);
      
      // Find documents with .webp in large_url or thumb_url or image fields
      const docs = await coll.find({
        $or: [
          { 'items.large_url': { $regex: '\.webp' } },
          { 'items.thumb_url': { $regex: '\.webp' } },
          { 'subcategories.thumb_url': { $regex: '\.webp' } },
          { 'image': { $regex: '\.webp' } },
          { 'images': { $regex: '\.webp' } },
          { 'large_url': { $regex: '\.webp' } },
          { 'thumb_url': { $regex: '\.webp' } }
        ]
      }).toArray();
      
      console.log(`Collection ${collName}: found ${docs.length} documents with .webp paths`);
      
      for (const doc of docs) {
        let updated = false;
        
        // Fix items array
        if (doc.items && Array.isArray(doc.items)) {
          for (const item of doc.items) {
            if (item.large_url && item.large_url.includes('.webp')) {
              item.large_url = item.large_url.replace(/\.webp$/g, '.jpg');
              updated = true;
            }
            if (item.thumb_url && item.thumb_url.includes('.webp')) {
              item.thumb_url = item.thumb_url.replace(/\.webp$/g, '.jpg');
              updated = true;
            }
          }
        }
        
        // Fix subcategories array
        if (doc.subcategories && Array.isArray(doc.subcategories)) {
          for (const sub of doc.subcategories) {
            if (sub.thumb_url && sub.thumb_url.includes('.webp')) {
              sub.thumb_url = sub.thumb_url.replace(/\.webp$/g, '.jpg');
              updated = true;
            }
          }
        }
        
        // Fix image field
        if (doc.image && doc.image.includes('.webp')) {
          doc.image = doc.image.replace(/\.webp$/g, '.jpg');
          updated = true;
        }
        
        // Fix images array
        if (doc.images && Array.isArray(doc.images)) {
          for (let i = 0; i < doc.images.length; i++) {
            if (doc.images[i] && doc.images[i].includes('.webp')) {
              doc.images[i] = doc.images[i].replace(/\.webp$/g, '.jpg');
              updated = true;
            }
          }
        }
        
        // Fix large_url and thumb_url at root level
        if (doc.large_url && doc.large_url.includes('.webp')) {
          doc.large_url = doc.large_url.replace(/\.webp$/g, '.jpg');
          updated = true;
        }
        if (doc.thumb_url && doc.thumb_url.includes('.webp')) {
          doc.thumb_url = doc.thumb_url.replace(/\.webp$/g, '.jpg');
          updated = true;
        }
        
        if (updated) {
          await coll.updateOne(
            { _id: doc._id },
            { $set: doc }
          );
          console.log(`  Updated document ${doc._id}`);
        }
      }
    }
    
    console.log('\nDone! MongoDB image paths updated from .webp to .jpg');
    
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await client.close();
  }
}

fixPaths();
