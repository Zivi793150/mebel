const fs = require('fs');

// Load current data
const data = JSON.parse(fs.readFileSync('./back/koenig.cornices.json', 'utf8'));

// Load the better-structured ceiling data
const ceilingImport = JSON.parse(fs.readFileSync('./front/potolochnye-karnizy-import.json', 'utf8'));

// ============================================================
// STEP 1: Remove the 6 generic "Профиль 1-6" items from profilnye
// These duplicate the proper sub-collections (Отель, Универсал, etc.)
// ============================================================
console.log('=== STEP 1: Remove generic profile items ===');

const genericTitles = ['профиль 1', 'профиль 2', 'профиль 3', 'профиль 4', 'профиль 5', 'профиль 6'];

let removedCount = 0;
const afterStep1 = data.filter(item => {
  const title = (item.title || '').toLowerCase().trim();
  if (item.kind === 'cornice_item' && item.collectionSlug === 'profilnye' && genericTitles.includes(title)) {
    removedCount++;
    return false;
  }
  return true;
});
console.log(`Removed ${removedCount} generic profile items`);

// ============================================================
// STEP 2: Restructure ceiling cornices
// Replace flat structure with import's sub-collection structure
// ============================================================
console.log('\n=== STEP 2: Restructure ceiling cornices ===');

// Find old ceiling items that have meaningful names (not "Вариант X")
const oldCeilingItems = data.filter(i => i.type === 'потолочные' && i.kind === 'cornice_item');
const importItemTitles = new Set(
  ceilingImport.filter(i => i.kind === 'cornice_item').map(i => i.title.toLowerCase().trim())
);

// Keep old items that have real names (not "Вариант X" and not in import)
const extraItems = oldCeilingItems.filter(i => {
  const title = (i.title || '').toLowerCase().trim();
  if (/^вариант\s+\d+$/.test(title)) return false;
  if (importItemTitles.has(title)) return false;
  return true;
});

console.log(`Extra ceiling items to preserve: ${extraItems.length}`);
extraItems.forEach(i => console.log(`  - ${i.title}: ${i.image?.split('/').pop()}`));

// Remove all old ceiling items & collections
const afterStep2 = afterStep1.filter(item => item.type !== 'потолочные');

// Add import structure (includes both collections and their items)
const result = [...afterStep2, ...ceilingImport];

// ============================================================
// STEP 3: Preserve extra items by mapping them to new collections
// ============================================================
console.log('\n=== STEP 3: Map extra items to collections ===');

extraItems.forEach(item => {
  const title = (item.title || '').toLowerCase().trim();

  // Map to known collection slugs
  let targetSlug = null;
  let targetTitle = null;

  if (title.includes('однорядный пластиковый')) {
    targetSlug = 'profil-odnoryadnyy-plastik';
    targetTitle = 'Однорядный пластиковый';
  } else if (title.includes('универсальный белый')) {
    targetSlug = 'profil-universal-white';
    targetTitle = 'Универсальный белый';
  }

  if (targetSlug) {
    result.push({
      ...item,
      collectionSlug: targetSlug,
      collectionTitle: targetTitle
    });
    console.log(`  Added "${item.title}" → ${targetTitle}`);
  } else {
    // Fallback - shouldn't happen
    result.push(item);
    console.log(`  Kept "${item.title}" (unmapped)`);
  }
});

// ============================================================
// STEP 4: Create new collections for extra items if needed
// ============================================================
console.log('\n=== STEP 4: Create missing collections ===');

const existingColSlugs = new Set(
  result.filter(i => i.kind === 'cornice_collection').map(i => i.collectionSlug)
);

// Check and create "Однорядный пластиковый" collection
if (!existingColSlugs.has('profil-odnoryadnyy-plastik')) {
  const plasticItems = extraItems.filter(i =>
    (i.title || '').toLowerCase().includes('однорядный пластиковый')
  );
  if (plasticItems.length > 0) {
    result.push({
      source: 'koenig_room',
      kind: 'cornice_collection',
      type: 'потолочные',
      collectionSlug: 'profil-odnoryadnyy-plastik',
      title: 'Однорядный пластиковый',
      description: 'Потолочный однорядный пластиковый профиль для штор.',
      image: plasticItems[0].image || '',
      images: plasticItems.map(i => i.image).filter(Boolean)
    });
    console.log('Created "Однорядный пластиковый" collection');
  }
}

// Check and create "Универсальный белый" collection
if (!existingColSlugs.has('profil-universal-white')) {
  const whiteItem = extraItems.find(i =>
    (i.title || '').toLowerCase().includes('универсальный белый')
  );
  if (whiteItem) {
    result.push({
      source: 'koenig_room',
      kind: 'cornice_collection',
      type: 'потолочные',
      collectionSlug: 'profil-universal-white',
      title: 'Универсальный белый',
      description: 'Потолочный универсальный белый профиль для штор.',
      image: whiteItem.image || '',
      images: [whiteItem.image].filter(Boolean)
    });
    console.log('Created "Универсальный белый" collection');
  }
}

// ============================================================
// STEP 5: Clean up - remove invalid data
// ============================================================
console.log('\n=== STEP 5: Cleanup ===');

const finalData = result.filter(item => {
  if (item.image && String(item.image).includes('undefined')) return false;
  if (item.images && Array.isArray(item.images)) {
    item.images = item.images.filter(img => img && !String(img).includes('undefined'));
  }
  return true;
});

// ============================================================
// Write result
// ============================================================
fs.writeFileSync('./back/koenig.cornices.json', JSON.stringify(finalData, null, 2), 'utf8');
console.log(`\nOriginal count: ${data.length}`);
console.log(`Final count: ${finalData.length}`);
console.log('Done! back/koenig.cornices.json updated');

// Print summary
console.log('\n=== NEW STRUCTURE SUMMARY ===');
const types = [...new Set(finalData.map(i => i.type).filter(Boolean))];
types.forEach(t => {
  const cols = finalData.filter(i => i.type === t && i.kind === 'cornice_collection');
  const items = finalData.filter(i => i.type === t && i.kind === 'cornice_item');
  console.log(`\n${t}: ${cols.length} collections, ${items.length} items`);
  cols.forEach(c => {
    const subItems = items.filter(i => i.collectionSlug === c.collectionSlug);
    console.log(`  ${c.title} (${c.collectionSlug}) - ${subItems.length} items`);
  });
});