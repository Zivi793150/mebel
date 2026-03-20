import crypto from "crypto";

const COOKIE_NAME = "kr_admin";

export function getAdminCookieName() {
  return COOKIE_NAME;
}

function getSecret() {
  return process.env.ADMIN_COOKIE_SECRET || "";
}

export function isAdminConfigured() {
  return Boolean(process.env.ADMIN_LOGIN) && Boolean(process.env.ADMIN_PASSWORD) && Boolean(getSecret());
}

export function verifyCredentials(login: string, password: string) {
  return login === process.env.ADMIN_LOGIN && password === process.env.ADMIN_PASSWORD;
}

function sign(payload: string) {
  const secret = getSecret();
  const h = crypto.createHmac("sha256", secret);
  h.update(payload);
  return h.digest("hex");
}

export function buildAdminCookieValue() {
  const issuedAt = Date.now().toString();
  const payload = `v1.${issuedAt}`;
  const sig = sign(payload);
  return `${payload}.${sig}`;
}

export function verifyAdminCookieValue(value: string) {
  const parts = String(value || "").split(".");
  if (parts.length !== 3) return false;
  const [ver, issuedAt, sig] = parts;
  if (ver !== "v1") return false;
  if (!issuedAt || !sig) return false;
  const payload = `${ver}.${issuedAt}`;
  const expected = sign(payload);
  const ok = crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(sig));
  return ok;
}
