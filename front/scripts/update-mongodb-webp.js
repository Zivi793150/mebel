const { MongoClient } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/koenig';

async function main() {
  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  console.log('Connected to MongoDB');

  const db = client.db('koenig');

  // Update catalog_items collection
  const catalogCol = db.collection('catalog_items');
  const catalogDocs = await catalogCol.find({}).toArray();

  for (const doc of catalogDocs) {
    let updated = false;
    const update = { $set: {} };

    // Update items array
    if (doc.items && Array.isArray(doc.items)) {
      const newItems = doc.items.map(item => {
        if (item.large_url) {
          const newUrl = item.large_url.replace(/\.(jpg|jpeg|png)$/i, '.webp');
          if (newUrl !== item.large_url) {
            updated = true;
            console.log(`  Item ${item.index}: ${item.large_url} -> ${newUrl}`);
          }
          return { ...item, large_url: newUrl };
        }
        return item;
      });
      if (updated) update.$set.items = newItems;
    }

    // Update subcategories thumb_url
    if (doc.subcategories && Array.isArray(doc.subcategories)) {
      const newSubs = doc.subcategories.map(sub => {
        if (sub.thumb_url) {
          const newUrl = sub.thumb_url.replace(/\.(jpg|jpeg|png)$/i, '.webp');
          if (newUrl !== sub.thumb_url) {
            updated = true;
            console.log(`  Sub ${sub.slug}: ${sub.thumb_url} -> ${newUrl}`);
          }
          return { ...sub, thumb_url: newUrl };
        }
        return sub;
      });
      if (updated) update.$set.subcategories = newSubs;
    }

    if (updated) {
      await catalogCol.updateOne({ _id: doc._id }, update);
      console.log(`✅ Updated catalog: ${doc.slug}`);
    }
  }

  // Update portfolio_images collection if exists
  try {
    const portfolioCol = db.collection('portfolio_images');
    const portfolioDocs = await portfolioCol.find({}).toArray();

    for (const doc of portfolioDocs) {
      let updated = false;
      const update = { $set: {} };

      if (doc.url) {
        const newUrl = doc.url.replace(/\.(jpg|jpeg|png)$/i, '.webp');
        if (newUrl !== doc.url) {
          updated = true;
          update.$set.url = newUrl;
          console.log(`  Portfolio: ${doc.url} -> ${newUrl}`);
        }
      }

      if (updated) {
        await portfolioCol.updateOne({ _id: doc._id }, update);
        console.log(`✅ Updated portfolio: ${doc._id}`);
      }
    }
  } catch (e) {
    console.log('Portfolio collection not found or error:', e.message);
  }

  console.log('\n✨ MongoDB update complete!');
  await client.close();
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
