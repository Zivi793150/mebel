const COOKIE_NAME = "kr_admin";

export function getAdminCookieName() {
  return COOKIE_NAME;
}

function getSecret() {
  return process.env.ADMIN_COOKIE_SECRET || "";
}

function bytesToHex(bytes: Uint8Array) {
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function hmacSha256Hex(message: string, secret: string) {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(message));
  return bytesToHex(new Uint8Array(sig));
}

export async function verifyAdminCookieValueEdge(value: string) {
  const parts = String(value || "").split(".");
  if (parts.length !== 3) return false;
  const [ver, issuedAt, sig] = parts;
  if (ver !== "v1") return false;
  if (!issuedAt || !sig) return false;

  const secret = getSecret();
  if (!secret) return false;

  const payload = `${ver}.${issuedAt}`;
  const expected = await hmacSha256Hex(payload, secret);
  return expected === sig;
}
