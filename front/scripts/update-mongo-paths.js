const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');

const MONGODB_URI = 'mongodb://localhost:27017/koenig';
const MAPPINGS_FILE = path.join(__dirname, 'rename-mappings.json');

// Russian to Latin transliteration
function transliterate(str) {
  let result = '';
  for (let i = 0; i < str.length; i++) {
    const code = str.charCodeAt(i);
    if (code >= 0x0430 && code <= 0x044F) {
      const map = ['a','b','v','g','d','e','zh','z','i','y','k','l','m','n','o','p','r','s','t','u','f','h','c','ch','sh','sch','','y','','e','yu','ya'];
      result += map[code - 0x0430] || '';
    } else if (code >= 0x0410 && code <= 0x042F) {
      const map = ['A','B','V','G','D','E','Zh','Z','I','Y','K','L','M','N','O','P','R','S','T','U','F','H','C','Ch','Sh','Sch','','Y','','E','Yu','Ya'];
      result += map[code - 0x0410] || '';
    } else if (code === 0x0451) result += 'yo';
    else if (code === 0x0401) result += 'Yo';
    else if (/[a-zA-Z0-9\-_.]/.test(str[i])) result += str[i];
    else if (str[i] === ' ') result += '-';
    else result += '-';
  }
  return result.replace(/-+/g, '-').replace(/^-|-$/g, '').toLowerCase() || 'untitled';
}

// Convert Russian path to Latin
function convertPath(oldPath) {
  if (!oldPath || typeof oldPath !== 'string') return oldPath;
  if (oldPath.startsWith('http://') || oldPath.startsWith('https://')) return oldPath;
  
  const parts = oldPath.split('/');
  const newParts = parts.map(p => {
    if (/[\u0400-\u04FF]/.test(p)) {
      return transliterate(p);
    }
    return p;
  });
  return newParts.join('/');
}

async function main() {
  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  const db = client.db('koenig');

  console.log('=== Updating MongoDB paths ===\n');

  const collections = [
    'catalog_items',
    'decor_items',
    'bedding_items',
    'bedspreads_and_pillows',
    'curtain_types',
    'blinds_types',
    'cornices',
    'portfolio_items',
    'reviews',
    'team',
    'services',
  ];

  let totalUpdated = 0;

  for (const colName of collections) {
    const col = db.collection(colName);
    
    // Find all docs with Russian paths
    const docs = await col.find({
      $or: [
        { image: /[\u0400-\u04FF]/ },
        { images: /[\u0400-\u04FF]/ },
        { url: /[\u0400-\u04FF]/ },
        { large_url: /[\u0400-\u04FF]/ },
        { small_url: /[\u0400-\u04FF]/ },
        { thumb_url: /[\u0400-\u04FF]/ },
      ]
    }).toArray();

    if (docs.length === 0) continue;

    console.log(`Processing ${colName}: ${docs.length} docs`);

    for (const doc of docs) {
      const updates = {};
      
      // Check each field
      const fields = ['image', 'url', 'large_url', 'small_url', 'thumb_url'];
      for (const f of fields) {
        if (doc[f] && typeof doc[f] === 'string' && /[\u0400-\u04FF]/.test(doc[f])) {
          const newPath = convertPath(doc[f]);
          if (newPath !== doc[f]) {
            updates[f] = newPath;
            console.log(`  ${doc.slug || doc._id}: ${f} -> ${newPath}`);
          }
        }
      }
      
      // Check arrays
      if (doc.images && Array.isArray(doc.images)) {
        const newImages = doc.images.map(img => {
          if (typeof img === 'string' && /[\u0400-\u04FF]/.test(img)) {
            return convertPath(img);
          }
          return img;
        });
        if (JSON.stringify(newImages) !== JSON.stringify(doc.images)) {
          updates.images = newImages;
        }
      }
      
      // Check items array
      if (doc.items && Array.isArray(doc.items)) {
        let changed = false;
        const newItems = doc.items.map(item => {
          const newItem = { ...item };
          ['large_url', 'small_url', 'thumb_url', 'url'].forEach(f => {
            if (item[f] && typeof item[f] === 'string' && /[\u0400-\u04FF]/.test(item[f])) {
              newItem[f] = convertPath(item[f]);
              changed = true;
            }
          });
          return newItem;
        });
        if (changed) {
          updates.items = newItems;
        }
      }

      if (Object.keys(updates).length > 0) {
        await col.updateOne({ _id: doc._id }, { $set: updates });
        totalUpdated++;
      }
    }
  }

  console.log(`\n=== Done: ${totalUpdated} documents updated ===`);
  await client.close();
}

main().catch(console.error);
