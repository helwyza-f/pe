"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Globe, ShieldCheck, Rocket, ArrowRight, Star } from "lucide-react";
import api from "@/lib/api";

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, watch } = useForm();
  const slugValue = watch("subdomain", "");

  const onSubmit = async (data: any) => {
    setLoading(true);
    const promise = api.post("/register", {
      tenant_name: data.businessName,
      tenant_slug: data.subdomain.toLowerCase().trim(),
      business_type: "universal_booking",
      admin_name: data.fullName,
      admin_email: data.email,
      admin_password: data.password,
    });

    toast.promise(promise, {
      loading: "Menyiapkan dashboard bisnis Anda...",
      success: (res) => {
        setTimeout(() => (window.location.href = res.data.login_url), 1500);
        return `Berhasil! Selamat datang di keluarga bookinaja.com`;
      },
      error: (err) => err.response?.data?.error || "Gagal mendaftar.",
    });

    try {
      await promise;
    } catch (e) {
      setLoading(false);
    }
  };

  return (
    // Body luar: Di mobile putih bersih, di desktop abu-abu halus
    <div className="flex-1 flex flex-col items-center justify-center w-full bg-white lg:bg-slate-50/50 lg:py-20 selection:bg-blue-500/30">
      {/* Kontainer Utama */}
      <div className="w-full lg:container lg:max-w-7xl lg:px-6">
        {/* Card: Di mobile no-border & no-rounded (Clean), di desktop Rounded Card + Shadow (Elite) */}
        <div className="flex flex-col lg:flex-row overflow-hidden bg-white lg:rounded-[2.5rem] lg:border lg:border-slate-100 lg:shadow-[0_32px_64px_-15px_rgba(0,0,0,0.05)]">
          {/* --- LEFT SIDE: PITCH (Desktop Only) --- */}
          <div className="relative hidden lg:flex w-full flex-col justify-between bg-slate-950 p-12 text-white lg:max-w-xl">
            <div className="absolute inset-0 -z-0 opacity-40 bg-[radial-gradient(circle_at_top_left,#1e40af_0%,transparent_60%)]"></div>

            <div className="relative z-10">
              <Badge className="mb-6 bg-blue-500/10 text-blue-400 border border-blue-500/20 px-4 py-1.5 rounded-full font-bold">
                <Star className="mr-2 h-3.5 w-3.5 fill-blue-500" />
                Join 100+ Founders
              </Badge>
              <h2 className="text-4xl font-black leading-tight tracking-tight">
                Ubah Cara Anda <br />{" "}
                <span className="text-blue-500">Mengelola Bisnis.</span>
              </h2>
              <ul className="mt-12 space-y-7">
                {[
                  { icon: Globe, text: "Subdomain Eksklusif Instan" },
                  { icon: ShieldCheck, text: "Data Terisolasi & Aman" },
                  { icon: Rocket, text: "Siap Pakai dalam 60 Detik" },
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/5 border border-white/10">
                      <item.icon className="h-6 w-6 text-blue-400" />
                    </div>
                    <p className="font-semibold text-slate-200 text-lg">
                      {item.text}
                    </p>
                  </li>
                ))}
              </ul>
            </div>

            <div className="relative z-10 rounded-3xl border border-white/10 bg-white/5 p-7 backdrop-blur-sm">
              <p className="italic text-slate-300 text-base leading-relaxed">
                "bookinaja.com membantu saya mengelola cabang di Batam tanpa
                pusing jadwal bentrok. Rapi banget!"
              </p>
              <div className="mt-4 flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center font-bold">
                  A
                </div>
                <p className="text-sm font-bold">
                  Aditya Pratama{" "}
                  <span className="block text-xs text-slate-500 font-medium font-sans italic">
                    SnapStudio
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* --- RIGHT SIDE: FORM (Wow on Mobile & Desktop) --- */}
          <div className="flex flex-1 items-center justify-center p-6 py-12 md:p-10 lg:p-16">
            <div className="w-full max-w-[460px] space-y-10">
              <div className="space-y-3">
                <Badge
                  variant="secondary"
                  className="bg-blue-50 text-blue-600 font-bold border-none"
                >
                  Free 14-Day Trial
                </Badge>
                <h1 className="text-3xl font-black tracking-tighter text-slate-900 md:text-4xl">
                  Daftarkan Bisnis
                </h1>
                <p className="text-slate-500 font-medium text-lg leading-snug">
                  Mulai kelola reservasi Anda secara profesional hari ini.
                </p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid gap-5">
                  <div className="space-y-2">
                    <Label className="font-bold text-slate-800 ml-1">
                      Nama Bisnis
                    </Label>
                    <Input
                      placeholder="Contoh: Miniboss Studio"
                      className="h-13 rounded-xl border-slate-200 focus:ring-blue-500 px-5"
                      {...register("businessName")}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="font-bold text-slate-800 ml-1">
                      Subdomain URL
                    </Label>
                    <div className="relative flex items-center">
                      <Input
                        placeholder="miniboss"
                        className="h-13 rounded-xl border-slate-200 focus:ring-blue-500 px-5 pr-36 lowercase"
                        {...register("subdomain")}
                        required
                        pattern="[a-z0-9-]+"
                      />
                      <span className="absolute right-5 text-base font-bold text-slate-400 pointer-events-none">
                        .bookinaja.com
                      </span>
                    </div>
                    {slugValue && (
                      <p className="text-[10px] font-black text-blue-600 tracking-widest px-2 animate-pulse">
                        Preview: {slugValue.toLowerCase()}.bookinaja.com
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-4 border-t border-slate-100">
                    <div className="space-y-2">
                      <Label className="font-bold text-slate-800 ml-1">
                        Nama Lengkap
                      </Label>
                      <Input
                        placeholder="Helwiza Fahry"
                        className="h-13 rounded-xl border-slate-200"
                        {...register("fullName")}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="font-bold text-slate-800 ml-1">
                        Email
                      </Label>
                      <Input
                        type="email"
                        placeholder="admin@bisnis.com"
                        className="h-13 rounded-xl border-slate-200"
                        {...register("email")}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="font-bold text-slate-800 ml-1">
                      Password
                    </Label>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      className="h-13 rounded-xl border-slate-200"
                      {...register("password")}
                      required
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-14 rounded-2xl bg-blue-600 text-lg font-bold shadow-2xl shadow-blue-600/30 hover:bg-blue-700 transition-all hover:-translate-y-1 active:scale-95"
                >
                  {loading ? "Menyiapkan..." : "Buat Akun Bisnis"}
                  <ArrowRight className="ml-3 h-5 w-5" />
                </Button>
              </form>

              <p className="text-center text-sm text-slate-500 font-medium">
                Sudah punya akun?{" "}
                <Link
                  href="/login"
                  className="text-blue-600 font-bold hover:underline"
                >
                  Login Dashboard
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
