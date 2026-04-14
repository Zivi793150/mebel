const http = require('http');
const fs = require('fs');
const path = require('path');

const PUBLIC_DIR = path.join(__dirname, '..', 'public');

async function checkUrl(urlPath) {
  return new Promise((resolve) => {
    const req = http.get(`http://localhost:3000${urlPath}`, (res) => {
      resolve({ status: res.statusCode });
    });
    req.on('error', (e) => {
      resolve({ status: 'ERROR', error: e.message });
    });
  });
}

async function main() {
  // Get actual folder names
  const dirs = fs.readdirSync(PUBLIC_DIR, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name);
  
  // Find icons folder (contains "äåâî÷êà" or similar)
  const iconsFolder = dirs.find(d => d.includes('äåâî÷êà') || d.includes('äåâî÷êà'));
  console.log(`Icons folder: "${iconsFolder}"`);
  
  if (iconsFolder) {
    // Get files in icons folder
    const iconsFiles = fs.readdirSync(path.join(PUBLIC_DIR, iconsFolder))
      .filter(f => f.endsWith('.webp'));
    console.log(`Files: ${iconsFiles.slice(0, 3).join(', ')}...`);
    
    // Test correct URL
    const testFile = iconsFiles[0];
    const encodedFolder = encodeURIComponent(iconsFolder);
    const encodedFile = encodeURIComponent(testFile);
    const testUrl = `/${encodedFolder}/${encodedFile}`;
    
    console.log(`\nTesting URL: ${testUrl}`);
    const result = await checkUrl(testUrl);
    console.log(`Status: ${result.status}`);
    
    // Also test catalog folder
    const catalogDir = path.join(PUBLIC_DIR, 'catalog');
    const catalogFolders = fs.readdirSync(catalogDir, { withFileTypes: true })
      .filter(d => d.isDirectory())
      .map(d => d.name);
    
    const decorFolder = catalogFolders.find(f => f.includes('5') && f.includes('äåâî÷êà'));
    console.log(`\nDecor folder: "${decorFolder}"`);
    
    if (decorFolder) {
      const decorFiles = fs.readdirSync(path.join(catalogDir, decorFolder))
        .filter(f => f.endsWith('.webp'));
      const decorFile = decorFiles[0];
      
      const testUrl2 = `/catalog/${encodeURIComponent(decorFolder)}/${encodeURIComponent(decorFile)}`;
      console.log(`Testing: ${testUrl2.substring(0, 80)}...`);
      const result2 = await checkUrl(testUrl2);
      console.log(`Status: ${result2.status}`);
    }
  }
}

main().catch(console.error);
