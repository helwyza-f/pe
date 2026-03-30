import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Update: Nama fungsi harus 'proxy' di Next.js 16.2
export function proxy(req: NextRequest) {
  const url = req.nextUrl;
  const hostname = req.headers.get("host") || "";

  // Tentukan domain utama
  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || "bookinaja.com";

  // Ekstrak subdomain
  // Kita handle localhost:3000 dan domain produksi
  const currentHost = hostname
    .replace(`.${rootDomain}`, "")
    .replace(":3000", "")
    .replace("www.", "");

  // 1. Jalur Marketing / Landing Page
  // Jika hostname sama dengan root domain atau localhost tanpa subdomain
  if (
    hostname === rootDomain ||
    hostname === `www.${rootDomain}` ||
    hostname === "localhost:3000"
  ) {
    return NextResponse.next();
  }

  // 2. Jalur Tenant Dashboard
  // Rewrite secara internal ke folder [tenant]
  return NextResponse.rewrite(
    new URL(`/${currentHost}${url.pathname}${url.search}`, req.url),
  );
}

// Konfigurasi Matcher tetap sama
export const config = {
  matcher: ["/((?!api/|_next/|_static/|_vercel|[\\w-]+\\.\\w+).*)"],
};
