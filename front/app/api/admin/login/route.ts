import { NextResponse } from "next/server";

import {
  buildAdminCookieValue,
  getAdminCookieName,
  isAdminConfigured,
  verifyCredentials,
} from "@/lib/adminAuth";

export async function POST(req: Request) {
  if (!isAdminConfigured()) {
    return NextResponse.json({ error: "admin_not_configured" }, { status: 500 });
  }

  const body = (await req.json().catch(() => null)) as { login?: string; password?: string } | null;
  const login = String(body?.login || "").trim();
  const password = String(body?.password || "").trim();

  if (!verifyCredentials(login, password)) {
    return NextResponse.json({ error: "invalid_credentials" }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set({
    name: getAdminCookieName(),
    value: buildAdminCookieValue(),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  return res;
}
