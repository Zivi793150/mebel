const http = require('http');

// Test the fixed encoding
function normalizeImageUrl(url) {
  if (!url) return "";
  try {
    const parsed = new URL(url, "http://localhost");
    const encodedPath = parsed.pathname
      .split("/")
      .map((segment) => {
        const decoded = decodeURIComponent(segment);
        return encodeURIComponent(decoded);
      })
      .join("/");
    return encodedPath;
  } catch {
    return url;
  }
}

async function checkUrl(urlPath) {
  return new Promise((resolve) => {
    const req = http.get(`http://localhost:3000${urlPath}`, (res) => {
      resolve({ status: res.statusCode, path: urlPath.substring(0, 60) });
    });
    req.on('error', (e) => {
      resolve({ status: 'ERROR', path: urlPath.substring(0, 60), error: e.message });
    });
  });
}

async function main() {
  console.log('=== Testing fixed URL encoding ===\n');
  
  const testCases = [
    '/catalog/5. äåâî÷êà/50007.webp',
    '/catalog/8.äåâî÷êà/00509_089_äåâî÷êà_@maxiimov.webp',
    '/äåâî÷êà/äåâî÷êà.webp',
  ];

  for (const original of testCases) {
    const normalized = normalizeImageUrl(original);
    const result = await checkUrl(normalized);
    console.log(`Original: ${original.substring(0, 50)}...`);
    console.log(`Normalized: ${normalized.substring(0, 50)}...`);
    console.log(`Status: ${result.status}`);
    console.log('');
  }
}

main().catch(console.error);
