// Test encodeURI behavior
const testPaths = [
  '/catalog/5. äåâî÷êà/50007.webp',
  '/catalog/7.äåâî÷êà/00553_095_2_@maxiimov.webp',
  '/äåâî÷êà/äåâî÷êà.webp',
];

console.log('=== Testing encodeURI ===');
testPaths.forEach(p => {
  const encoded = encodeURI(p);
  console.log(`Original: ${p}`);
  console.log(`Encoded:  ${encoded}`);
  console.log('');
});

// Check if files are accessible via HTTP
const http = require('http');

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
  console.log('=== Testing HTTP access ===');
  
  // Test with encoded and non-encoded paths
  const testUrls = [
    '/catalog/5. äåâî÷êà/50007.webp',
    encodeURI('/catalog/5. äåâî÷êà/50007.webp'),
    '/äåâî÷êà/äåâî÷êà.webp',
    encodeURI('/äåâî÷êà/äåâî÷êà.webp'),
  ];

  for (const url of testUrls) {
    const result = await checkUrl(url);
    console.log(`${result.status}: ${url}`);
  }
}

main().catch(console.error);
