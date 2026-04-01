import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const hostname = req.headers.get("host") || "";

  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || "bookinaja.com";

  // 1. PROTEKSI: Jika hostname adalah api.bookinaja.com, biarkan lewat (Bypass)
  // Karena API dihandle oleh AWS EC2, bukan Vercel rewrite
  if (hostname.startsWith("api.")) {
    return NextResponse.next();
  }

  // Ekstrak subdomain
  const currentHost = hostname
    .replace(`.${rootDomain}`, "")
    .replace(":3000", "")
    .replace("www.", "");

  // 2. Jalur Marketing / Landing Page Global
  if (
    currentHost === "" || 
    currentHost === rootDomain || 
    hostname === "localhost:3000"
  ) {
    return NextResponse.next();
  }

  // 3. Jalur Tenant (Subdomain) Rewrite
  // Contoh: minibos.bookinaja.com/admin -> rewrite ke /minibos/admin
  const path = url.pathname === "/" ? "" : url.pathname;

  return NextResponse.rewrite(
    new URL(`/${currentHost}${path}${url.search}`, req.url)
  );
}

export const config = {
  matcher: [
    /*
     * Match semua request kecuali:
     * 1. /api (Next.js Internal API routes)
     * 2. /_next (Next.js internals)
     * 3. /_static (Static files)
     * 4. /_vercel (Vercel internals)
     * 5. File dengan ekstensi (e.g. favicon.ico, logo.png)
     */
    "/((?!api/|_next/|_static/|_vercel|[\\w-]+\\.\\w+).*)",
  ],
};