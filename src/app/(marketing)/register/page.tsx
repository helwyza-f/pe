"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { 
  Globe, ShieldCheck, Rocket, ArrowRight, Star, 
  Gamepad2, Palette, Briefcase, PartyPopper, Check 
} from "lucide-react";
import api from "@/lib/api";
import { cn } from "@/lib/utils";

const CATEGORIES = [
  { id: "gaming_hub", name: "Gaming Hub", icon: Gamepad2, desc: "Cocok untuk Rental PS & Warnet" },
  { id: "creative_space", name: "Creative Space", icon: Palette, desc: "Studio Foto & Coworking Space" },
  { id: "professional_service", name: "Professional", icon: Briefcase, desc: "Meeting Room & Jasa Konsultasi" },
  { id: "entertainment_hub", name: "Entertainment", icon: PartyPopper, desc: "Karaoke, Billiard & Wahana Main" },
];

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("gaming_hub");
  
  const { register, handleSubmit, watch } = useForm({
    defaultValues: {
      businessName: "",
      subdomain: "",
      fullName: "",
      email: "",
      password: "",
    }
  });

  const slugValue = watch("subdomain", "");

  const onSubmit = async (data: any) => {
    setLoading(true);
    
    const payload = {
      tenant_name: data.businessName,
      tenant_slug: data.subdomain.toLowerCase().trim(),
      business_category: selectedCategory,
      business_type: CATEGORIES.find(c => c.id === selectedCategory)?.name || "Universal Booking",
      admin_name: data.fullName,
      admin_email: data.email,
      admin_password: data.password,
    };

    const promise = api.post("/register", payload);

    toast.promise(promise, {
      loading: "Sedang mendaftarkan bisnis Anda...",
      success: (res) => {
        setTimeout(() => (window.location.href = res.data.login_url), 1500);
        return `Sukses! Mengalihkan ke Dashboard...`;
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
    <div className="flex-1 flex flex-col items-center justify-center w-full bg-white lg:bg-slate-50/50 lg:py-20 selection:bg-blue-500/30 font-sans">
      <div className="w-full lg:container lg:max-w-7xl lg:px-6">
        <div className="flex flex-col lg:flex-row overflow-hidden bg-white lg:rounded-[3rem] lg:border lg:border-slate-100 lg:shadow-[0_32px_64px_-15px_rgba(0,0,0,0.06)]">
          
          {/* --- LEFT SIDE: PITCH --- */}
          <div className="relative hidden lg:flex w-full flex-col justify-between bg-slate-950 p-12 text-white lg:max-w-xl">
            <div className="absolute inset-0 -z-0 opacity-40 bg-[radial-gradient(circle_at_top_left,#1e40af_0%,transparent_60%)]"></div>
            <div className="relative z-10">
              <Badge className="mb-6 bg-blue-500/10 text-blue-400 border border-blue-500/20 px-4 py-1.5 rounded-full font-bold uppercase tracking-widest text-[10px]">
                <Star className="mr-2 h-3.5 w-3.5 fill-blue-500" />
                Trusted by 100+ Batam Founders
              </Badge>
              <h2 className="text-5xl font-black leading-tight tracking-tighter italic">
                Ubah Cara <br /> 
                <span className="text-blue-500 underline decoration-blue-500/30 underline-offset-8">Berbisnis.</span>
              </h2>
              <ul className="mt-12 space-y-7">
                {[
                  { icon: Globe, text: "Subdomain Batam Eksklusif" },
                  { icon: ShieldCheck, text: "Sistem Cloud Terpusat" },
                  { icon: Rocket, text: "Dashboard Admin Mewah" },
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-4 group">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/5 border border-white/10 group-hover:bg-blue-600 group-hover:border-blue-500 transition-all">
                      <item.icon className="h-6 w-6 text-blue-400 group-hover:text-white" />
                    </div>
                    <p className="font-bold text-slate-200 text-lg uppercase italic tracking-tight">{item.text}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* --- RIGHT SIDE: FORM --- */}
          <div className="flex flex-1 items-center justify-center p-6 py-12 md:p-10 lg:p-16">
            <div className="w-full max-w-[520px] space-y-10">
              <div className="space-y-3">
                <Badge className="bg-blue-50 text-blue-600 font-black border-none uppercase tracking-tighter shadow-sm">Batam Market Edition</Badge>
                <h1 className="text-4xl font-black tracking-tighter text-slate-900 italic uppercase leading-none">Mulai Bisnis Anda</h1>
                <p className="text-slate-500 font-medium text-lg leading-snug">Satu sistem untuk semua kebutuhan reservasi.</p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                {/* PART 1: IDENTITY */}
                <div className="grid gap-5">
                  <div className="space-y-2">
                    <Label className="font-black text-slate-400 uppercase text-[10px] tracking-[0.2em] ml-1">Nama Bisnis</Label>
                    <Input placeholder="Contoh: Miniboss Gaming Hub" className="h-14 rounded-2xl border-slate-100 bg-slate-50/50 font-bold focus:bg-white transition-all px-5" {...register("businessName")} required />
                  </div>

                  <div className="space-y-2">
                    <Label className="font-black text-slate-400 uppercase text-[10px] tracking-[0.2em] ml-1">Subdomain Eksklusif</Label>
                    <div className="relative flex items-center group">
                      <Input 
                        placeholder="miniboss" 
                        className="h-14 rounded-2xl border-slate-100 bg-slate-50/50 font-bold focus:bg-white px-5 pr-36 lowercase transition-all" 
                        {...register("subdomain")} required pattern="[a-z0-9-]+" 
                      />
                      <span className="absolute right-5 text-sm font-black text-slate-400 group-focus-within:text-blue-600">.bookinaja.com</span>
                    </div>
                    {slugValue && (
                        <p className="text-[10px] font-black text-blue-600 tracking-widest px-2 mt-2 animate-pulse italic uppercase">
                            URL ANDA: {slugValue.toLowerCase()}.bookinaja.com
                        </p>
                    )}
                  </div>
                </div>

                {/* PART 2: CATEGORY SELECTION (Now in middle) */}
                <div className="space-y-4 pt-2">
                  <div className="flex items-center gap-3">
                     <div className="h-[2px] flex-1 bg-slate-100" />
                     <Label className="font-black text-slate-400 uppercase text-[10px] tracking-[0.2em] whitespace-nowrap">Langkah 2: Pilih Tema Bisnis</Label>
                     <div className="h-[2px] flex-1 bg-slate-100" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {CATEGORIES.map((cat) => (
                      <div 
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id)}
                        className={cn(
                          "relative cursor-pointer p-4 rounded-2xl border-2 transition-all flex flex-col items-center text-center gap-2 group",
                          selectedCategory === cat.id 
                            ? "border-blue-600 bg-blue-50/50 ring-4 ring-blue-600/5 shadow-lg shadow-blue-600/10" 
                            : "border-slate-50 bg-white hover:border-slate-200"
                        )}
                      >
                        {selectedCategory === cat.id && (
                          <div className="absolute top-2 right-2 bg-blue-600 rounded-full p-1 shadow-md">
                            <Check className="h-2 w-2 text-white stroke-[4]" />
                          </div>
                        )}
                        <cat.icon className={cn("h-6 w-6 transition-transform group-hover:scale-110", selectedCategory === cat.id ? "text-blue-600" : "text-slate-400")} />
                        <div>
                          <p className={cn("text-xs font-black uppercase tracking-tighter", selectedCategory === cat.id ? "text-blue-700" : "text-slate-600")}>{cat.name}</p>
                          <p className="text-[9px] text-slate-400 font-bold uppercase tracking-tight leading-tight mt-0.5">{cat.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* PART 3: ADMIN DATA */}
                <div className="grid gap-5 pt-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <Label className="font-black text-slate-400 uppercase text-[10px] tracking-[0.2em] ml-1">Nama Owner</Label>
                      <Input placeholder="Helwiza Fahry" className="h-14 rounded-2xl border-slate-100 bg-slate-50/50 font-bold" {...register("fullName")} required />
                    </div>
                    <div className="space-y-2">
                      <Label className="font-black text-slate-400 uppercase text-[10px] tracking-[0.2em] ml-1">Email Admin</Label>
                      <Input type="email" placeholder="admin@bisnis.com" className="h-14 rounded-2xl border-slate-100 bg-slate-50/50 font-bold" {...register("email")} required />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="font-black text-slate-400 uppercase text-[10px] tracking-[0.2em] ml-1">Password Dashboard</Label>
                    <Input type="password" placeholder="••••••••" className="h-14 rounded-2xl border-slate-100 bg-slate-50/50 font-bold" {...register("password")} required />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-20 rounded-[2rem] bg-blue-600 text-lg font-black italic uppercase tracking-widest shadow-[0_20px_50px_-15px_rgba(37,99,235,0.4)] hover:bg-blue-700 transition-all hover:-translate-y-1 active:scale-95 border-b-8 border-blue-800"
                >
                  {loading ? "Menyiapkan Akun..." : "Konfirmasi & Daftar"}
                  <ArrowRight className="ml-3 h-6 w-6 stroke-[3]" />
                </Button>
              </form>

              <p className="text-center text-sm text-slate-400 font-bold italic uppercase tracking-tighter">
                Sudah punya akses?{" "}
                <Link href="/login" className="text-blue-600 hover:underline">Masuk ke Dashboard</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}