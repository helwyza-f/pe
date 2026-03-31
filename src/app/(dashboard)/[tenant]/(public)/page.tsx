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
} from "lucide-react";
import Link from "next/link";
import api from "@/lib/api";

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
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
      </div>
    );

  // --- EMPTY STATE / NOT FOUND ---
  if (!data || !data.profile)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <div className="h-24 w-24 bg-slate-100 rounded-full flex items-center justify-center mb-6">
          <ImageIcon className="h-10 w-10 text-slate-300" />
        </div>
        <h1 className="text-2xl font-black text-slate-900">
          Bisnis Tidak Ditemukan
        </h1>
        <p className="text-slate-500 mt-2">
          Maaf, halaman yang Anda cari tidak tersedia atau belum dikonfigurasi.
        </p>
        <Link href="https://bookinaja.com" className="mt-8">
          <Button variant="outline" className="rounded-xl font-bold">
            Kembali ke Beranda
          </Button>
        </Link>
      </div>
    );

  const { profile, resources } = data;

  return (
    <div className="min-h-screen bg-white">
      {/* 1. HERO & BANNER */}
      <section className="relative h-[75vh] flex items-center justify-center bg-slate-900 overflow-hidden">
        <img
          src={
            profile.banner_url ||
            "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069"
          }
          className="absolute inset-0 w-full h-full object-cover opacity-40 scale-105"
          alt="Banner"
        />
        <div className="relative z-10 container text-center text-white px-6">
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
            <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">
              Open Now
            </span>
          </div>
          <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter mb-4 drop-shadow-2xl">
            {profile.name}
          </h1>
          <p className="max-w-2xl mx-auto text-xl text-slate-200 font-medium mb-12 italic opacity-80">
            {profile.slogan || "Experience the best service in town."}
          </p>
          <Link href="/booking">
            <Button
              size="lg"
              className="h-16 px-10 text-lg font-black rounded-2xl bg-blue-600 hover:bg-blue-700 shadow-2xl shadow-blue-600/40 transition-all hover:scale-105 active:scale-95"
            >
              BOOK AN APPOINTMENT <ArrowRight className="ml-2 h-6 w-6" />
            </Button>
          </Link>
        </div>
      </section>

      {/* 2. INFO BAR */}
      <div className="container mx-auto px-6 -translate-y-1/2">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 bg-white border border-slate-100 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] rounded-[3rem] p-10">
          <div className="flex items-center gap-5 md:border-r border-slate-100">
            <div className="h-14 w-14 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
              <Clock className="h-7 w-7" />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Business Hours
              </p>
              <p className="font-bold">
                {profile.open_time} - {profile.close_time}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-5 md:border-r border-slate-100">
            <div className="h-14 w-14 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600">
              <MapPin className="h-7 w-7" />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Location
              </p>
              <p className="font-bold leading-tight">
                {profile.address || "Check our map"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-5">
            <div className="h-14 w-14 rounded-2xl bg-yellow-50 flex items-center justify-center text-yellow-500">
              <Star className="h-7 w-7 fill-current" />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Rating
              </p>
              <p className="font-bold">4.9 Star Services</p>
            </div>
          </div>
        </div>
      </div>

      {/* 3. GALLERY (New Feature) */}
      {profile.gallery && profile.gallery.length > 0 && (
        <section className="container mx-auto px-6 py-20">
          <h2 className="text-3xl font-black text-slate-900 mb-10 uppercase tracking-tight">
            Our Gallery
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {profile.gallery.map((url: string, idx: number) => (
              <div
                key={idx}
                className="aspect-square rounded-[2rem] overflow-hidden border"
              >
                <img
                  src={url}
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                  alt="Gallery"
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 4. SERVICES LIST */}
      <section className="container mx-auto px-6 py-20 bg-slate-50/50 rounded-[4rem] mb-20">
        <div className="text-center mb-16 space-y-2">
          <h2 className="text-4xl font-black tracking-tight text-slate-900 uppercase">
            Our Services
          </h2>
          <p className="text-slate-500 font-medium">
            Select a resource to start your booking
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {resources && resources.length > 0 ? (
            resources.map((res: any) => (
              <div
                key={res.id}
                className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm hover:shadow-xl transition-all"
              >
                <div className="h-12 w-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 mb-6 font-bold tracking-tighter">
                  B
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-2">
                  {res.name}
                </h3>
                <p className="text-slate-400 text-sm font-bold uppercase mb-6">
                  {res.category}
                </p>
                <Link href={`/booking?resource=${res.id}`}>
                  <Button className="w-full rounded-xl font-bold bg-slate-900 hover:bg-blue-600 transition-colors">
                    Select & Book
                  </Button>
                </Link>
              </div>
            ))
          ) : (
            <div className="col-span-full py-20 text-center border-2 border-dashed rounded-[3rem] border-slate-200">
              <p className="text-slate-400 font-bold uppercase tracking-widest">
                No services available yet
              </p>
            </div>
          )}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-10 text-center border-t border-slate-100">
        <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em]">
          Managed by bookinaja.com
        </p>
      </footer>
    </div>
  );
}
