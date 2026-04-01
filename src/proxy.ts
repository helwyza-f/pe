import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(req: NextRequest) {
  const url = req.nextUrl;
  const hostname = req.headers.get("host") || "";

  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || "bookinaja.com";

  // 1. BYPASS UNTUK SUBDOMAIN API (api.bookinaja.com)
  if (hostname.startsWith(`api.`)) {
    return NextResponse.next();
  }

  // 2. LOGIKA ROOT DOMAIN (Marketing Page)
  if (
    hostname === rootDomain || 
    hostname === `www.${rootDomain}` || 
    hostname === "localhost:3000"
  ) {
    return NextResponse.next();
  }

  // 3. LOGIKA SUBDOMAIN (Tenant Page)
  const currentHost = hostname
    .replace(`.${rootDomain}`, "")
    .replace(":3000", "")
    .replace("www.", "");

  // Hanya rewrite jika benar-benar ada subdomain tenant (misal: 'minibos')
  if (currentHost && currentHost !== rootDomain) {
    const path = url.pathname === "/" ? "" : url.pathname;
    
    // Rewrite ke folder tenant: /minibos/admin atau /minibos/booking
    return NextResponse.rewrite(
      new URL(`/${currentHost}${path}${url.search}`, req.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match semua request KECUALI:
     * 1. /api atau /api/ (Abaikan semua request API)
     * 2. /_next (Next.js internals)
     * 3. /_static, /_vercel
     * 4. File dengan ekstensi (e.g. favicon.ico, logo.png)
     */
    "/((?!api|_next/|_static/|_vercel|[\\w-]+\\.\\w+).*)",
  ],
};