const fs = require('fs');
const data = JSON.parse(fs.readFileSync('./back/koenig.cornices.json', 'utf8'));

// Remove the empty parent 'profilnye' collection
const result = data.filter(i => !(i.collectionSlug === 'profilnye' && i.kind === 'cornice_collection'));

fs.writeFileSync('./back/koenig.cornices.json', JSON.stringify(result, null, 2), 'utf8');
console.log(`Removed profilnye parent collection. Count: ${data.length} -> ${result.length}`);