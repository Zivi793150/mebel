const { MongoClient } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/koenig';

function dedupePathSegments(url) {
  if (!url || typeof url !== 'string') return url;
  if (url.startsWith('http')) return url;
  
  const parts = url.split('/');
  const deduped = [];
  
  for (const part of parts) {
    if (part !== deduped[deduped.length - 1]) {
      deduped.push(part);
    }
  }
  
  return deduped.join('/');
}

async function fixDuplicatedPaths() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db('koenig');
    const collection = db.collection('curtain_types');
    
    // Find all documents with duplicated path segments
    const docs = await collection.find({
      source: 'koenig_room',
      kind: 'curtain_type'
    }).toArray();
    
    console.log(`Found ${docs.length} documents to check`);
    
    let fixedCount = 0;
    const updates = [];
    
    for (const doc of docs) {
      let needsUpdate = false;
      const updateFields = {};
      
      // Fix main image
      if (doc.image && typeof doc.image === 'string') {
        const fixedImage = dedupePathSegments(doc.image);
        if (fixedImage !== doc.image) {
          updateFields.image = fixedImage;
          needsUpdate = true;
          console.log(`Fixing image: ${doc.image} -> ${fixedImage}`);
        }
      }
      
      // Fix images array
      if (doc.images && Array.isArray(doc.images)) {
        const fixedImages = doc.images.map(dedupePathSegments);
        const hasChanges = fixedImages.some((img, idx) => img !== doc.images[idx]);
        
        if (hasChanges) {
          updateFields.images = fixedImages;
          needsUpdate = true;
          console.log(`Fixing images array for: ${doc.title || doc.url}`);
        }
      }
      
      if (needsUpdate) {
        updates.push({
          updateOne: {
            filter: { _id: doc._id },
            update: { $set: updateFields }
          }
        });
        fixedCount++;
      }
    }
    
    if (updates.length > 0) {
      const result = await collection.bulkWrite(updates);
      console.log(`\nFixed ${result.modifiedCount} documents`);
    } else {
      console.log('\nNo documents needed fixing');
    }
    
    console.log('\nDone!');
    
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  } finally {
    await client.close();
  }
}

fixDuplicatedPaths();
