const { MongoClient } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/koenig';

// Invalid path from detailed-mongodb-audit.json
// "/catalog/2.???\??*/?? 1 .webp" - file exists but is corrupted (unsupported image format)
// We need to remove this path from the images array

async function main() {
  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  console.log('Connected to MongoDB\n');

  const db = client.db('koenig');
  const collection = db.collection('blinds_types');

  // Find docId from audit: "69bd6473b5a191f2559e91cb"
  const doc = await collection.findOne({ 
    _id: new require('mongodb').ObjectId('69bd6473b5a191f2559e91cb')
  });

  if (!doc) {
    console.log('Document not found');
    await client.close();
    return;
  }

  console.log('Found document:', doc._id);
  console.log('Images before:', doc.images?.length);

  // Remove paths that match the corrupted file pattern
  // The path has double spaces: "??  1 .webp"
  const updatedImages = doc.images?.filter(img => {
    // Remove if it matches the corrupted file pattern
    if (img.includes('Derev') && img.match(/\s{2,}1\s+\.webp$/)) {
      console.log('Removing corrupted path:', img);
      return false;
    }
    return true;
  });

  console.log('Images after:', updatedImages?.length);

  if (updatedImages && updatedImages.length !== doc.images?.length) {
    await collection.updateOne(
      { _id: doc._id },
      { $set: { images: updatedImages } }
    );
    console.log('Updated successfully - removed corrupted image path');
  } else {
    console.log('No changes needed');
  }

  await client.close();
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
