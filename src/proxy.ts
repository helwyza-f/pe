import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(req: NextRequest) {
  const url = req.nextUrl;
  const hostname = req.headers.get("host") || "";

  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || "bookinaja.com";

  // 1. BYPASS UNTUK SUBDOMAIN API
  // Jika hostname adalah api.bookinaja.com, jangan di-rewrite.
  // Biarkan request ini langsung lari ke AWS EC2 kamu.
  if (hostname.startsWith(`api.`)) {
    return NextResponse.next();
  }

  // Ekstrak subdomain
  const currentHost = hostname
    .replace(`.${rootDomain}`, "")
    .replace(":3000", "")
    .replace("www.", "");

  // 2. JALUR MARKETING / LANDING PAGE GLOBAL
  // Jika akses bookinaja.com atau localhost:3000 tanpa subdomain
  if (
    currentHost === "" ||
    currentHost === rootDomain ||
    hostname === "localhost:3000"
  ) {
    return NextResponse.next();
  }

  // 3. JALUR TENANT (SUBDOMAIN REWRITE)
  // Contoh: miniboss.bookinaja.com/admin -> rewrite ke /miniboss/admin
  
  // Mencegah double slash jika pathname kosong
  const path = url.pathname === "/" ? "" : url.pathname;

  return NextResponse.rewrite(
    new URL(`/${currentHost}${path}${url.search}`, req.url),
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