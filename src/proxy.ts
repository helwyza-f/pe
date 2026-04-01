import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(req: NextRequest) {
  const url = req.nextUrl;
  const hostname = req.headers.get("host") || "";

  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || "bookinaja.com";

  // Ekstrak subdomain
  const currentHost = hostname
    .replace(`.${rootDomain}`, "")
    .replace(":3000", "")
    .replace("www.", "");

  // 1. Jalur Marketing / Landing Page Global
  // Jika akses bookinaja.com atau localhost:3000 tanpa subdomain
  if (
    currentHost === "" ||
    currentHost === rootDomain ||
    hostname === "localhost:3000"
  ) {
    // Jika user mencoba akses /admin di root domain, biarkan Next.js handle 404 atau redirect
    return NextResponse.next();
  }

  // 2. Jalur Tenant (Subdomain)
  // Contoh: minibos.localhost:3000/admin/bookings
  // akan di-rewrite ke /minibos/admin/bookings

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
     * 1. /api (API routes)
     * 2. /_next (Next.js internals)
     * 3. /_static (Static files)
     * 4. /_vercel (Vercel internals)
     * 5. File dengan ekstensi (e.g. favicon.ico, logo.png)
     */
    "/((?!api/|_next/|_static/|_vercel|[\\w-]+\\.\\w+).*)",
  ],
};
