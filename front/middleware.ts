import { NextResponse, type NextRequest } from "next/server";

import { getAdminCookieName, verifyAdminCookieValueEdge } from "@/lib/adminAuthEdge";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (!pathname.startsWith("/admin") && !pathname.startsWith("/api/admin")) {
    return NextResponse.next();
  }

  // Add cache-busting headers for all admin pages
  const addNoCache = (res: NextResponse) => {
    res.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0");
    res.headers.set("Pragma", "no-cache");
    res.headers.set("Expires", "0");
    return res;
  };

  if (pathname === "/admin/login" || pathname === "/api/admin/login") {
    return addNoCache(NextResponse.next());
  }

  const cookieName = getAdminCookieName();
  const val = req.cookies.get(cookieName)?.value;
  const ok = val ? await verifyAdminCookieValueEdge(val) : false;

  if (ok) {
    return addNoCache(NextResponse.next());
  }

  if (pathname.startsWith("/api/admin")) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const url = req.nextUrl.clone();
  url.pathname = "/admin/login";
  url.searchParams.set("next", pathname);
  return addNoCache(NextResponse.redirect(url));
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
