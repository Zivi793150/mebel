const { MongoClient } = require('mongodb');
const MONGODB_URI = 'mongodb://localhost:27017/koenig';

const BAD_PATTERNS = [
  '1site.eu',
  'https%3A',
  'https%3a',
  'koenigroom.ru/images/upload',
];

const COLLECTIONS = [
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

async function main() {
  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  const db = client.db('koenig');

  console.log('=== Checking MongoDB for problematic URLs ===\n');

  const findings = [];

  for (const colName of COLLECTIONS) {
    const col = db.collection(colName);
    
    for (const pattern of BAD_PATTERNS) {
      // Find documents containing the pattern in any field
      const docs = await col.find({
        $or: [
          { image: { $regex: pattern, $options: 'i' } },
          { images: { $regex: pattern, $options: 'i' } },
          { url: { $regex: pattern, $options: 'i' } },
          { large_url: { $regex: pattern, $options: 'i' } },
          { small_url: { $regex: pattern, $options: 'i' } },
          { thumb_url: { $regex: pattern, $options: 'i' } },
          { src: { $regex: pattern, $options: 'i' } },
          { content: { $regex: pattern, $options: 'i' } },
        ]
      }).toArray();

      if (docs.length > 0) {
        docs.forEach(doc => {
          findings.push({
            collection: colName,
            pattern,
            _id: doc._id,
            slug: doc.slug,
            title: doc.title,
            fields: extractBadFields(doc, pattern)
          });
        });
      }
    }
  }

  if (findings.length === 0) {
    console.log('No problematic URLs found in MongoDB.\n');
  } else {
    console.log(`Found ${findings.length} problematic documents:\n`);
    findings.forEach((f, i) => {
      console.log(`${i+1}. Collection: ${f.collection}`);
      console.log(`   Pattern: ${f.pattern}`);
      console.log(`   _id: ${f._id}`);
      if (f.slug) console.log(`   slug: ${f.slug}`);
      if (f.title) console.log(`   title: ${f.title}`);
      console.log(`   Bad fields:`);
      f.fields.forEach(field => {
        console.log(`     - ${field.path}: "${field.value.substring(0, 80)}..."`);
      });
      console.log('');
    });
  }

  // Summary
  console.log('\n=== Summary ===');
  const byPattern = {};
  findings.forEach(f => {
    byPattern[f.pattern] = (byPattern[f.pattern] || 0) + 1;
  });
  Object.entries(byPattern).forEach(([p, count]) => {
    console.log(`  ${p}: ${count} documents`);
  });

  await client.close();
}

function extractBadFields(obj, pattern, path = '') {
  const results = [];
  
  for (const [key, value] of Object.entries(obj)) {
    if (key === '_id') continue;
    
    const currentPath = path ? `${path}.${key}` : key;
    
    if (typeof value === 'string') {
      if (value.toLowerCase().includes(pattern.toLowerCase())) {
        results.push({ path: currentPath, value });
      }
    } else if (Array.isArray(value)) {
      value.forEach((item, idx) => {
        if (typeof item === 'string' && item.toLowerCase().includes(pattern.toLowerCase())) {
          results.push({ path: `${currentPath}[${idx}]`, value: item });
        }
      });
    }
  }
  
  return results;
}

main().catch(console.error);
