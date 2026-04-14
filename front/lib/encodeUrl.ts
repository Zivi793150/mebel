/**
 * Encode URL path for proper handling of Russian characters
 * Splits path into segments and encodes each segment
 */
export function encodeUrlPath(urlPath: string): string {
  if (!urlPath) return "";

  // If it's an external URL (or already-encoded external URL), return as is.
  // This prevents turning `https://...` into `https%3A/...` in the browser.
  try {
    const decodedOnce = decodeURIComponent(urlPath);
    if (decodedOnce.startsWith("http://") || decodedOnce.startsWith("https://")) {
      return decodedOnce;
    }
  } catch {
    // ignore
  }
  if (urlPath.startsWith("http://") || urlPath.startsWith("https://")) {
    return urlPath;
  }
  
  // Split by / and encode each segment
  return urlPath
    .split("/")
    .map((segment) => {
      // Decode first to avoid double encoding, then encode
      try {
        const decoded = decodeURIComponent(segment);
        return encodeURIComponent(decoded);
      } catch {
        return encodeURIComponent(segment);
      }
    })
    .join("/");
}

/**
 * Check if URL contains placeholder GUID like {0F350DBD-FBA9-220B-632C-253F105ACCE0}
 * These are malformed URLs from old site that should be rejected
 */
function hasPlaceholderGuid(url: string): boolean {
  return /\{[A-F0-9-]+\}/i.test(url);
}

/**
 * Normalize image URL from MongoDB or hardcoded path
 * Ensures proper URL encoding for Russian characters
 * Rejects malformed external URLs with placeholder GUIDs
 */
export function normalizeImageUrl(url: string | null | undefined): string {
  if (!url) return "";

  // If it's an external URL, check for placeholder GUIDs and reject if found
  if (url.startsWith("http://") || url.startsWith("https://")) {
    if (hasPlaceholderGuid(url)) {
      return ""; // Return empty to trigger fallback
    }
    return url;
  }

  return encodeUrlPath(url);
}
