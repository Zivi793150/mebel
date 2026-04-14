const http = require('http');
const fs = require('fs');
const path = require('path');

const PUBLIC_DIR = path.join(__dirname, '..', 'public');

// Test real file access
async function checkUrl(urlPath) {
  return new Promise((resolve) => {
    const req = http.get(`http://localhost:3000${urlPath}`, (res) => {
      resolve({ status: res.statusCode, path: urlPath.substring(0, 80) });
    });
    req.on('error', (e) => {
      resolve({ status: 'ERROR', error: e.message });
    });
  });
}

async function main() {
  // Read actual folder name from disk
  const catalogDir = path.join(PUBLIC_DIR, 'catalog');
  const folders = fs.readdirSync(catalogDir, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name);
  
  console.log('=== Actual folder names ===');
  folders.forEach(f => {
    console.log(`  "${f}"`);
    console.log(`    Bytes: ${Buffer.from(f).toString('hex')}`);
  });

  // Find decor folder
  const decorFolder = folders.find(f => f.includes('5') && f.includes('äåâî÷êà'));
  console.log(`\nDecor folder: "${decorFolder}"`);

  // Test correct URL encoding
  if (decorFolder) {
    const encoded = encodeURIComponent(decorFolder);
    console.log(`Encoded: ${encoded}`);
    
    const testUrl = `/catalog/${encoded}/50007.webp`;
    console.log(`\nTesting: ${testUrl}`);
    const result = await checkUrl(testUrl);
    console.log(`Status: ${result.status}`);
  }

  // Test icons folder
  const iconsFolder = 'äåâî÷êà';
  const iconsEncoded = encodeURIComponent(iconsFolder);
  console.log(`\nIcons folder: "${iconsFolder}"`);
  console.log(`Encoded: ${iconsEncoded}`);
  
  const iconsUrl = `/${iconsEncoded}/äåâî÷êà.webp`;
  console.log(`Testing: ${iconsUrl}`);
  const iconsResult = await checkUrl(iconsUrl);
  console.log(`Status: ${iconsResult.status}`);
}

main().catch(console.error);
