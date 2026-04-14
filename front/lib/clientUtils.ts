/**
 * Client-side utilities for data normalization
 */

/**
 * Remove duplicated path segments from URL
 * Example: /catalog/2.zhalyuzi/2.zhalyuzi/derevyannye/ -> /catalog/2.zhalyuzi/derevyannye/
 */
export function dedupePathSegments(url: string): string {
  if (!url || url.startsWith("http")) return url;
  const parts = url.split("/");
  const deduped: string[] = [];
  for (const part of parts) {
    if (part === "" && deduped.length > 0 && deduped[deduped.length - 1] === "") {
      continue;
    }
    if (part !== "" && deduped[deduped.length - 1] === part) {
      continue;
    }
    deduped.push(part);
  }
  return deduped.join("/");
}

/**
 * Normalize image URL for client-side use
 * - Removes duplicate path segments
 * - Preserves external URLs
 */
export function normalizeClientImageUrl(url: string | null | undefined): string {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }
  return dedupePathSegments(url);
}
