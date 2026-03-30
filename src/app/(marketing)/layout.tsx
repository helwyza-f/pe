import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col selection:bg-blue-500/30">
      {/* --- PRO HEADER --- */}
      <header className="sticky top-0 z-[100] w-full px-4 pt-4">
        <div className="container mx-auto max-w-7xl">
          <div className="flex h-16 items-center justify-between rounded-2xl border border-white/20 bg-white/70 px-6 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] backdrop-blur-xl md:h-20">
            {/* Logo */}
            <Link href="/" className="group flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 transition-transform group-hover:rotate-6">
                <span className="font-black text-white text-lg">B</span>
              </div>
              <span className="text-xl font-black tracking-tighter text-slate-900">
                bookinaja<span className="text-blue-600">.com</span>
              </span>
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-10">
              {["Fitur", "Pricing", "Industries", "FAQ"].map((item) => (
                <Link
                  key={item}
                  href={
                    item === "Pricing" ? "/pricing" : `/#${item.toLowerCase()}`
                  }
                  className="text-sm font-bold text-slate-600 transition-colors hover:text-blue-600"
                >
                  {item}
                </Link>
              ))}
            </nav>

            {/* CTA Actions */}
            <div className="flex items-center gap-3">
              <Link
                href="https://admin.bookinaja.com/login"
                className="hidden sm:block"
              >
                <Button
                  variant="ghost"
                  className="font-bold text-slate-600 hover:text-blue-600"
                >
                  Login
                </Button>
              </Link>
              <Link href="/register">
                <Button className="rounded-xl bg-slate-900 px-6 font-bold shadow-lg shadow-slate-900/20 transition-all hover:bg-blue-600 hover:shadow-blue-600/30 active:scale-95">
                  Mulai Bisnis
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 flex flex-col items-center w-full">
        {children}
      </main>

      {/* --- PRO FOOTER --- */}
      <footer className="border-t border-slate-100 bg-slate-50/50 pt-20 pb-10">
        <div className="container mx-auto max-w-7xl px-6">
          <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
            {/* Brand Column */}
            <div className="space-y-6">
              <Link href="/" className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
                  <span className="font-black text-white">B</span>
                </div>
                <span className="text-lg font-black tracking-tighter">
                  bookinaja.com
                </span>
              </Link>
              <p className="text-sm leading-relaxed text-slate-500 max-w-[240px]">
                Platform booking SaaS nomor 1 di Batam. Automasi bisnis Anda,
                fokus pada pertumbuhan.
              </p>
              <div className="flex items-center gap-3">
                <Badge
                  variant="outline"
                  className="rounded-md border-slate-200 text-slate-400 font-medium"
                >
                  Batam, Indonesia 🇮🇩
                </Badge>
              </div>
            </div>

            {/* Sitemap Columns */}
            <div>
              <h4 className="mb-6 text-sm font-black uppercase tracking-widest text-slate-900">
                Produk
              </h4>
              <ul className="space-y-4 text-sm font-medium text-slate-500">
                <li className="hover:text-blue-600">
                  <Link href="/#features">Fitur Utama</Link>
                </li>
                <li className="hover:text-blue-600">
                  <Link href="/pricing">Pricing Paket</Link>
                </li>
                <li className="hover:text-blue-600">
                  <Link href="/#pos">Point of Sale</Link>
                </li>
                <li className="hover:text-blue-600">
                  <Link href="/#guest">Guest Page</Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="mb-6 text-sm font-black uppercase tracking-widest text-slate-900">
                Industri
              </h4>
              <ul className="space-y-4 text-sm font-medium text-slate-500">
                <li className="hover:text-blue-600">
                  <Link href="#">Rental PS & Studio</Link>
                </li>
                <li className="hover:text-blue-600">
                  <Link href="#">Photo Studio</Link>
                </li>
                <li className="hover:text-blue-600">
                  <Link href="#">Sport Centers</Link>
                </li>
                <li className="hover:text-blue-600">
                  <Link href="#">Meeting Rooms</Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="mb-6 text-sm font-black uppercase tracking-widest text-slate-900">
                Perusahaan
              </h4>
              <ul className="space-y-4 text-sm font-medium text-slate-500">
                <li className="hover:text-blue-600">
                  <Link href="#">Tentang Kami</Link>
                </li>
                <li className="hover:text-blue-600">
                  <Link href="#">Bantuan (FAQ)</Link>
                </li>
                <li className="hover:text-blue-600">
                  <Link href="#">Kontak Marketing</Link>
                </li>
                <li className="hover:text-blue-600">
                  <Link href="#">Kebijakan Privasi</Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-20 flex flex-col items-center justify-between gap-6 border-t border-slate-100 pt-8 md:flex-row">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              © 2026 bookinaja.com. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-xs font-bold text-slate-400 uppercase tracking-widest">
              <Link href="#" className="hover:text-blue-600">
                Twitter
              </Link>
              <Link href="#" className="hover:text-blue-600">
                Instagram
              </Link>
              <Link href="#" className="hover:text-blue-600">
                LinkedIn
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
