import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(req: NextRequest) {
  const url = req.nextUrl;
  const hostname = req.headers.get("host") || "";

  // Ambil root domain dari env atau default
  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || "bookinaja.com";

  // 1. BYPASS UNTUK API
  if (hostname.startsWith(`api.`)) {
    return NextResponse.next();
  }

  // 2. LOGIKA ROOT DOMAIN (Marketing Page)
  // Jika hostname ADALAH bookinaja.com atau www.bookinaja.com
  // Kita TIDAK mau melakukan rewrite ke folder [tenant]
  if (
    hostname === rootDomain || 
    hostname === `www.${rootDomain}` || 
    hostname === "localhost:3000"
  ) {
    return NextResponse.next();
  }

  // 3. LOGIKA SUBDOMAIN (Tenant Page)
  // Ekstrak subdomain (contoh: 'miniboss' dari 'miniboss.bookinaja.com')
  const currentHost = hostname
    .replace(`.${rootDomain}`, "")
    .replace(":3000", "")
    .replace("www.", "");

  // Jika setelah dibersihkan ternyata masih ada isinya (berarti itu subdomain)
  if (currentHost && currentHost !== rootDomain) {
    const path = url.pathname === "/" ? "" : url.pathname;
    
    // Rewrite ke folder tenant: /miniboss/admin atau /miniboss/booking
    return NextResponse.rewrite(
      new URL(`/${currentHost}${path}${url.search}`, req.url)
    );
  }

  // Default: Biarkan Next.js handle normal
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match semua request kecuali file statis dan internal Next.js
     */
    "/((?!api/|_next/|_static/|_vercel|[\\w-]+\\.\\w+).*)",
  ],
};