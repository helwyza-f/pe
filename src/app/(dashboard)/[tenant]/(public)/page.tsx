"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  MapPin,
  Clock,
  Star,
  Loader2,
  ArrowRight,
  Image as ImageIcon,
  Gamepad2,
  Zap,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";
import api from "@/lib/api";
import { cn } from "@/lib/utils";

export default function TenantPublicLanding() {
  const params = useParams();
  const tenantSlug = (params.tenant as string).split(".")[0];

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get(`/public/landing?slug=${tenantSlug}`)
      .then((res) => {
        setData(res.data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [tenantSlug]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="relative">
          <div className="h-20 w-20 rounded-full border-4 border-blue-500/20 border-t-blue-500 animate-spin" />
          <Zap className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-6 w-6 text-blue-500 animate-pulse" />
        </div>
      </div>
    );

  if (!data || !data.profile)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-white">
        <div className="h-24 w-24 bg-slate-100 rounded-full flex items-center justify-center mb-6 shadow-inner">
          <ImageIcon className="h-10 w-10 text-slate-300" />
        </div>
        <h1 className="text-3xl font-black text-slate-900 uppercase italic tracking-tighter">
          Bisnis Tidak Ditemukan
        </h1>
        <p className="text-slate-500 mt-2 font-medium">
          Link salah atau bisnis belum terdaftar di bookinaja.com
        </p>
        <Link href="https://bookinaja.com" className="mt-8">
          <Button className="rounded-2xl h-14 px-8 font-black uppercase tracking-widest bg-slate-900">
            Kembali ke Beranda
          </Button>
        </Link>
      </div>
    );

  const { profile, resources } = data;
  const isGaming = profile.business_category === "gaming_hub";

  return (
    <div
      className={cn(
        "min-h-screen transition-colors duration-700",
        isGaming
          ? "bg-slate-950 text-white selection:bg-blue-500"
          : "bg-white text-slate-900",
      )}
    >
      {/* 1. HERO SECTION */}
      <section className="relative h-[85vh] flex items-center justify-center overflow-hidden">
        {/* Background Image with Dynamic Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src={
              profile.banner_url ||
              "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070"
            }
            className={cn(
              "w-full h-full object-cover transition-transform duration-1000 scale-105",
              isGaming
                ? "opacity-30 contrast-125 grayscale-[0.5]"
                : "opacity-40",
            )}
            alt="Banner"
          />
          <div
            className={cn(
              "absolute inset-0 bg-gradient-to-b",
              isGaming
                ? "from-transparent via-slate-950/50 to-slate-950"
                : "from-transparent to-white",
            )}
          />
        </div>

        <div className="relative z-10 container text-center px-6 mt-20">
          <Badge
            className={cn(
              "mb-6 px-6 py-2 rounded-full font-black uppercase tracking-[0.3em] text-[10px] animate-bounce shadow-xl",
              isGaming
                ? "bg-blue-600 text-white border-none"
                : "bg-slate-900 text-white",
            )}
          >
            <Zap className="mr-2 h-3 w-3 fill-current" />{" "}
            {profile.business_type || "Premium Spot"}
          </Badge>

          <h1
            className={cn(
              "text-6xl md:text-9xl font-black uppercase tracking-tighter mb-6 leading-none drop-shadow-2xl italic",
              isGaming
                ? "text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-white to-blue-600"
                : "text-slate-900",
            )}
          >
            {profile.name}
          </h1>

          <p
            className={cn(
              "max-w-2xl mx-auto text-lg md:text-2xl font-bold mb-12 italic opacity-90 tracking-tight",
              isGaming ? "text-blue-100/70" : "text-slate-500",
            )}
          >
            "{profile.slogan || "Experience the best service in Batam."}"
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/booking">
              <Button
                className={cn(
                  "h-20 px-12 text-lg font-black rounded-[2rem] shadow-2xl transition-all hover:scale-105 active:scale-95 uppercase tracking-widest italic",
                  isGaming
                    ? "bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/40"
                    : "bg-slate-900 hover:bg-black text-white shadow-slate-900/20",
                )}
              >
                BOOKING SEKARANG{" "}
                <ArrowRight className="ml-3 h-6 w-6 stroke-[3]" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 2. INFO BAR (Dynamic Theme) */}
      <div className="container mx-auto px-6 -translate-y-1/2 relative z-20">
        <div
          className={cn(
            "grid grid-cols-1 md:grid-cols-3 gap-10 rounded-[3rem] p-10 border shadow-2xl transition-all",
            isGaming
              ? "bg-slate-900 border-white/10 text-white"
              : "bg-white border-slate-100 text-slate-900",
          )}
        >
          <div className="flex items-center gap-6 md:border-r border-white/10">
            <div
              className={cn(
                "h-16 w-16 rounded-2xl flex items-center justify-center shadow-inner",
                isGaming
                  ? "bg-blue-500/10 text-blue-400"
                  : "bg-blue-50 text-blue-600",
              )}
            >
              <Clock className="h-8 w-8" />
            </div>
            <div>
              <p className="text-[10px] font-black opacity-50 uppercase tracking-[0.3em] mb-1">
                Jam Operasional
              </p>
              <p className="font-black text-xl italic tracking-tight">
                {profile.open_time} - {profile.close_time}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-6 md:border-r border-white/10">
            <div
              className={cn(
                "h-16 w-16 rounded-2xl flex items-center justify-center shadow-inner",
                isGaming
                  ? "bg-emerald-500/10 text-emerald-400"
                  : "bg-emerald-50 text-emerald-600",
              )}
            >
              <MapPin className="h-8 w-8" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-black opacity-50 uppercase tracking-[0.3em] mb-1">
                Lokasi Batam
              </p>
              <p className="font-bold text-sm leading-tight truncate">
                {profile.address || "Check out our location"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div
              className={cn(
                "h-16 w-16 rounded-2xl flex items-center justify-center shadow-inner",
                isGaming
                  ? "bg-yellow-500/10 text-yellow-400"
                  : "bg-yellow-50 text-yellow-500",
              )}
            >
              <Star className="h-8 w-8 fill-current" />
            </div>
            <div>
              <p className="text-[10px] font-black opacity-50 uppercase tracking-[0.3em] mb-1">
                Rating Bisnis
              </p>
              <p className="font-black text-xl italic tracking-tight underline decoration-yellow-500/30 decoration-4">
                4.9/5 EXCELLENT
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 3. GALLERY SECTION */}
      {profile.gallery && profile.gallery.length > 0 && (
        <section className="container mx-auto px-6 py-24">
          <div className="flex items-center gap-4 mb-12">
            <div
              className={cn(
                "h-1 w-20 rounded-full",
                isGaming ? "bg-blue-600" : "bg-slate-900",
              )}
            />
            <h2 className="text-3xl font-black uppercase italic tracking-tighter">
              Suasana Kami
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {profile.gallery.map((url: string, idx: number) => (
              <div
                key={idx}
                className={cn(
                  "aspect-[4/5] rounded-[2.5rem] overflow-hidden border transition-all duration-500 hover:scale-95",
                  isGaming ? "border-white/10" : "border-slate-100",
                )}
              >
                <img
                  src={url}
                  className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                  alt="Gallery"
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 4. RESOURCES LIST */}
      <section
        className={cn(
          "container mx-auto px-6 py-32 rounded-[5rem] mb-20 transition-colors",
          isGaming
            ? "bg-white/5 border border-white/5"
            : "bg-slate-50 border border-slate-100",
        )}
      >
        <div className="text-center mb-20 space-y-4">
          <h2 className="text-6xl font-black tracking-tighter uppercase italic leading-none">
            Pilih{" "}
            <span className={isGaming ? "text-blue-500" : "text-blue-600"}>
              Fasilitas
            </span>
          </h2>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">
            Pilih ruangan favoritmu di bawah ini
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {resources?.map((res: any) => (
            <div
              key={res.id}
              className={cn(
                "group relative rounded-[3.5rem] p-10 transition-all duration-500 overflow-hidden",
                isGaming
                  ? "bg-slate-900 border-white/5 hover:bg-blue-600"
                  : "bg-white border-slate-100 hover:shadow-2xl shadow-sm",
              )}
            >
              {isGaming && (
                <Gamepad2 className="absolute -right-8 -top-8 h-40 w-40 opacity-5 group-hover:rotate-12 transition-transform duration-700" />
              )}

              <div
                className={cn(
                  "h-16 w-16 rounded-[1.5rem] flex items-center justify-center mb-10 transition-colors duration-500 shadow-inner",
                  isGaming
                    ? "bg-white/5 text-blue-400 group-hover:bg-white group-hover:text-blue-600"
                    : "bg-blue-50 text-blue-600",
                )}
              >
                <Zap className="h-8 w-8 fill-current" />
              </div>

              <h3
                className={cn(
                  "text-3xl font-black uppercase italic tracking-tighter mb-2 transition-colors",
                  isGaming ? "group-hover:text-white" : "text-slate-900",
                )}
              >
                {res.name}
              </h3>
              <p
                className={cn(
                  "font-black uppercase tracking-widest text-[10px] mb-10 transition-opacity",
                  isGaming
                    ? "text-blue-400 group-hover:text-white/60"
                    : "text-slate-400",
                )}
              >
                {res.category || "PREMIUM UNIT"}
              </p>

              <Link href={`/booking/${res.id}`}>
                <Button
                  className={cn(
                    "w-full h-16 rounded-[1.5rem] font-black uppercase italic tracking-widest text-xs transition-all",
                    isGaming
                      ? "bg-white text-blue-600 hover:bg-slate-100"
                      : "bg-slate-900 hover:bg-blue-600 text-white",
                  )}
                >
                  PILIH & BOOKING{" "}
                  <ArrowRight className="ml-2 h-4 w-4 stroke-[3]" />
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-20 text-center opacity-40">
        <p className="text-[10px] font-black uppercase tracking-[0.5em]">
          Powered by bookinaja.com — Batam Tech Solutions
        </p>
      </footer>
    </div>
  );
}
