const { MongoClient } = require('mongodb');

const MONGODB_URI = 'mongodb://localhost:27017/koenig';

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

// Check if string has Russian chars
function hasRussian(str) {
  if (!str || typeof str !== 'string') return false;
  for (let i = 0; i < str.length; i++) {
    const code = str.charCodeAt(i);
    if ((code >= 0x0410 && code <= 0x042F) || (code >= 0x0430 && code <= 0x044F) || code === 0x0401 || code === 0x0451) {
      return true;
    }
  }
  return false;
}

// Convert Russian path to Latin
function convertPath(oldPath) {
  if (!oldPath || typeof oldPath !== 'string') return oldPath;
  if (oldPath.startsWith('http://') || oldPath.startsWith('https://')) return oldPath;
  
  const parts = oldPath.split('/');
  const newParts = parts.map(p => hasRussian(p) ? transliterate(p) : p);
  return newParts.join('/');
}

async function main() {
  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  const db = client.db('koenig');

  console.log('=== Updating MongoDB paths ===\n');

  const collections = [
    'catalog_items', 'decor_items', 'bedding_items', 'bedspreads_and_pillows',
    'curtain_types', 'blinds_types', 'cornices', 'portfolio_items', 'reviews', 'team', 'services'
  ];

  let totalUpdated = 0;

  for (const colName of collections) {
    const col = db.collection(colName);
    const docs = await col.find({}).toArray();
    
    let colUpdated = 0;
    
    for (const doc of docs) {
      const updates = {};
      
      const fields = ['image', 'url', 'large_url', 'small_url', 'thumb_url'];
      for (const f of fields) {
        if (doc[f] && hasRussian(doc[f])) {
          const newPath = convertPath(doc[f]);
          if (newPath !== doc[f]) {
            updates[f] = newPath;
          }
        }
      }
      
      if (doc.images && Array.isArray(doc.images)) {
        const newImages = doc.images.map(img => 
          typeof img === 'string' && hasRussian(img) ? convertPath(img) : img
        );
        if (JSON.stringify(newImages) !== JSON.stringify(doc.images)) {
          updates.images = newImages;
        }
      }
      
      if (doc.items && Array.isArray(doc.items)) {
        let changed = false;
        const newItems = doc.items.map(item => {
          const newItem = { ...item };
          ['large_url', 'small_url', 'thumb_url', 'url'].forEach(f => {
            if (item[f] && hasRussian(item[f])) {
              newItem[f] = convertPath(item[f]);
              changed = true;
            }
          });
          return newItem;
        });
        if (changed) updates.items = newItems;
      }

      if (Object.keys(updates).length > 0) {
        await col.updateOne({ _id: doc._id }, { $set: updates });
        colUpdated++;
      }
    }
    
    if (colUpdated > 0) {
      console.log(`${colName}: ${colUpdated} docs updated`);
      totalUpdated += colUpdated;
    }
  }

  console.log(`\n=== Done: ${totalUpdated} documents updated ===`);
  await client.close();
}

main().catch(console.error);
