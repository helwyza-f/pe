import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Zap,
  ShieldCheck,
  BarChart3,
  ArrowRight,
  CheckCircle2,
  MousePointerClick,
  Layers,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function LandingPage() {
  return (
    <div className="relative flex flex-col items-center overflow-x-hidden selection:bg-blue-500/30">
      {/* --- ELITE BACKGROUND SYSTEM --- */}
      <div className="fixed inset-0 -z-10 bg-white">
        {/* Modern Mesh Gradient */}
        <div className="absolute top-0 left-1/4 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-blue-100/50 blur-[120px]"></div>
        <div className="absolute bottom-0 right-1/4 h-[500px] w-[500px] translate-x-1/2 rounded-full bg-indigo-100/30 blur-[120px]"></div>
        {/* Subtle Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
      </div>

      {/* --- HERO SECTION --- */}
      <section className="container relative z-10 mx-auto flex flex-col items-center px-6 pt-24 pb-20 text-center md:pt-40 md:pb-32">
        <Badge
          variant="outline"
          className="mb-8 animate-fade-in rounded-full border-blue-200 bg-blue-50/50 px-5 py-2 text-sm font-semibold text-blue-700 shadow-sm backdrop-blur-md"
        >
          <Zap className="mr-2 h-4 w-4 fill-blue-600" />
          The New Standard for Booking Platforms
        </Badge>

        <h1 className="max-w-5xl animate-in fade-in slide-in-from-bottom-8 duration-1000 text-5xl font-black tracking-tight sm:text-7xl md:text-8xl lg:text-8xl">
          Satu Dashboard. <br />
          <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 bg-clip-text text-transparent">
            Tanpa Batas.
          </span>
        </h1>

        <p className="mt-10 max-w-2xl animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-200 text-md leading-relaxed text-slate-600 sm:text-xl md:text-2xl">
          Automasi scheduling, manajemen tenant, dan billing real-time dalam
          satu platform SaaS premium. Dirancang untuk performa, dibangun untuk
          skala besar.
        </p>

        <div className="mt-12 flex flex-col gap-5 sm:flex-row sm:space-x-4 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-500">
          <Link href="/register">
            <Button
              size="lg"
              className="h-16 px-12 text-lg font-bold rounded-2xl bg-blue-600 shadow-[0_20px_50px_rgba(59,130,246,0.3)] hover:bg-blue-700 hover:shadow-blue-500/40 transition-all hover:-translate-y-1 active:scale-95"
            >
              Mulai Sekarang — Gratis <ArrowRight className="ml-2 h-6 w-6" />
            </Button>
          </Link>
          <Link href="#features">
            <Button
              variant="outline"
              size="lg"
              className="h-16 px-12 text-lg font-bold rounded-2xl border-2 bg-white/50 backdrop-blur-md hover:bg-white transition-all shadow-sm"
            >
              Lihat Demo
            </Button>
          </Link>
        </div>

        {/* --- PRO DASHBOARD PREVIEW --- */}
        <div className="mt-20 w-full max-w-6xl animate-in zoom-in-95 duration-1000 delay-700">
          <div className="relative rounded-[2rem] border-8 border-slate-900/5 bg-slate-900/5 p-2 shadow-2xl backdrop-blur-sm">
            <div className="overflow-hidden rounded-2xl bg-white shadow-inner">
              <img
                src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=2426"
                alt="Dashboard Preview"
                className="w-full object-cover aspect-[16/10] opacity-90 hover:scale-105 transition-transform duration-700"
              />
            </div>
          </div>
        </div>
      </section>

      {/* --- INDUSTRIES / TRUST SECTION --- */}
      <section className="w-full border-y border-slate-100 bg-slate-50/50 py-16 backdrop-blur-md">
        <div className="container mx-auto px-6">
          <p className="mb-10 text-center text-sm font-bold uppercase tracking-[0.3em] text-slate-400">
            Trusted by diverse industries
          </p>
          <div className="flex flex-wrap justify-center gap-12 text-xl font-black text-slate-300 md:gap-24">
            <span className="hover:text-blue-500 transition-colors cursor-default">
              FUTSAL COURT
            </span>
            <span className="hover:text-blue-500 transition-colors cursor-default">
              PHOTO STUDIO
            </span>
            <span className="hover:text-blue-500 transition-colors cursor-default">
              GAMING HUB
            </span>
            <span className="hover:text-blue-500 transition-colors cursor-default">
              CO-WORKING
            </span>
          </div>
        </div>
      </section>

      {/* --- FEATURES GRID --- */}
      <section
        id="features"
        className="container mx-auto px-6 py-32 space-y-24"
      >
        <div className="mx-auto max-w-3xl text-center space-y-6">
          <h2 className="text-4xl font-black tracking-tight sm:text-6xl text-slate-900">
            Platform Canggih. <br /> Tanpa Kompleksitas.
          </h2>
          <p className="text-xl text-slate-500 leading-relaxed">
            Kami menangani infrastruktur yang rumit, sehingga Anda bisa fokus
            pada pertumbuhan bisnis.
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <FeatureCard
            icon={<Layers className="h-10 w-10 text-blue-600" />}
            title="Isolated Multi-Tenancy"
            desc="Setiap bisnis mendapatkan lingkungan terisolasi dengan performa tinggi dan keamanan tingkat bank."
            badge="Security"
          />
          <FeatureCard
            icon={<MousePointerClick className="h-10 w-10 text-indigo-600" />}
            title="Instant Subdomain"
            desc="URL eksklusif instan (bisnisanda.bookinaja.com) aktif dalam hitungan detik setelah registrasi."
            badge="Performance"
          />
          <FeatureCard
            icon={<CheckCircle2 className="h-10 w-10 text-emerald-600" />}
            title="Universal Integration"
            desc="Satu sistem untuk ribuan skenario. Futsal, Studio, Rental, hingga Ruang Rapat."
            badge="Universal"
          />
        </div>
      </section>

      {/* --- CTA SECTION --- */}
      <section className="container mx-auto px-6 pb-32">
        <div className="relative overflow-hidden rounded-[3rem] bg-slate-900 px-8 py-20 text-center shadow-2xl md:px-16">
          {/* Abstract Glow in CTA */}
          <div className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 h-64 w-64 bg-blue-500 rounded-full blur-[120px] opacity-20"></div>

          <div className="relative z-10 mx-auto max-w-3xl space-y-8">
            <h2 className="text-4xl font-bold text-white sm:text-6xl">
              Siap Mendominasi Pasar Lokal Anda?
            </h2>
            <p className="text-xl text-slate-400">
              Daftar sekarang dan nikmati gratis 14 hari paket Pro tanpa kartu
              kredit.
            </p>
            <div className="flex justify-center">
              <Button
                size="lg"
                className="h-16 px-12 text-lg font-bold rounded-2xl bg-white text-slate-900 hover:bg-slate-100 transition-all active:scale-95"
              >
                Daftar Bisnis Sekarang
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  desc,
  badge,
}: {
  icon: any;
  title: string;
  desc: string;
  badge: string;
}) {
  return (
    <div className="group relative flex flex-col justify-between overflow-hidden rounded-[2.5rem] border border-slate-100 bg-white p-10 transition-all hover:border-blue-200 hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.05)]">
      <div>
        <Badge
          variant="outline"
          className="mb-6 rounded-full border-slate-100 bg-slate-50 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-slate-400"
        >
          {badge}
        </Badge>
        <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-3xl bg-slate-50 transition-all group-hover:bg-blue-50 group-hover:scale-110 group-hover:rotate-3 duration-500">
          {icon}
        </div>
        <h3 className="mb-4 text-3xl font-black tracking-tight text-slate-900">
          {title}
        </h3>
        <p className="text-lg leading-relaxed text-slate-500 font-medium">
          {desc}
        </p>
      </div>
      {/* Subtle Hover Decoration */}
      <div className="absolute top-0 right-0 h-32 w-32 -translate-y-16 translate-x-16 rounded-full bg-blue-50/50 blur-3xl transition-opacity opacity-0 group-hover:opacity-100"></div>
    </div>
  );
}
