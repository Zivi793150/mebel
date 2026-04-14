const http = require('http');

// Test different URL encodings
const testPaths = [
  // Test with actual Russian path
  '/catalog/5. %D0%94%D0%B5%D0%BA%D0%BE%D1%80%2C%20%D1%84%D1%83%D1%80%D0%BD%D0%B8%D1%82%D1%83%D1%80%D0%B0/50007.webp',
  // Test with simple path
  '/1step.webp',
  // Test icons folder
  '/%D0%98%D0%BA%D0%BE%D0%BD%D0%BA%D0%B8%20%D0%BA%D0%B0%D1%82%D0%B0%D0%BB%D0%BE%D0%B3/%D0%9F%D0%BE%D0%B4%D1%83%D1%88%D0%BA%D0%B8%20.webp',
];

async function checkUrl(urlPath) {
  return new Promise((resolve) => {
    const req = http.get(`http://localhost:3000${urlPath}`, (res) => {
      resolve({ status: res.statusCode, path: urlPath });
    });
    req.on('error', (e) => {
      resolve({ status: 'ERROR', path: urlPath, error: e.message });
    });
  });
}

async function main() {
  console.log('=== Testing static file access ===\n');
  
  for (const url of testPaths) {
    const result = await checkUrl(url);
    console.log(`${result.status}: ${url.substring(0, 60)}...`);
  }

  // Test if the issue is with encoding
  console.log('\n=== Testing with decoded paths ===');
  const russianPath = '/catalog/5. äåâî÷êà/50007.webp';
  
  // Test direct access
  const direct = await checkUrl(russianPath);
  console.log(`Direct: ${direct.status}`);
  
  // Test with encodeURIComponent on each segment
  const segments = russianPath.split('/').map(s => encodeURIComponent(s)).join('/');
  const encoded = await checkUrl(segments);
  console.log(`Encoded segments: ${encoded.status}`);
}

main().catch(console.error);
