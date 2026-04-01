"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  CheckCircle2,
  Clock,
  ReceiptText,
  MessageSquare,
  Share2,
  Loader2,
  Zap,
  Calendar,
  Gamepad2,
  User,
  MapPin,
  PlusCircle,
} from "lucide-react";
import api from "@/lib/api";
import { cn } from "@/lib/utils";

export default function BookingStatusPage() {
  const params = useParams();
  if(!params.token) return <div>Tidak ditemukan</div>
  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!params.token) return;
    api
      .get(`/guest/status/${params.token}`)
      .then((res) => {
        setBooking(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [params.token]);

  const formatIDR = (val: number) => new Intl.NumberFormat("id-ID").format(val);

  const getDuration = (start: string, end: string) => {
    const s = new Date(start);
    const e = new Date(end);
    return Math.round((e.getTime() - s.getTime()) / (1000 * 60 * 60));
  };

  if (loading)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white p-6">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600 mb-4" />
        <p className="font-black italic uppercase text-[10px] tracking-widest text-slate-400">Verifikasi Tiket...</p>
      </div>
    );

  if (!booking)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-2xl font-black italic uppercase tracking-tighter text-slate-900">Tiket Tidak Ditemukan</h1>
        <p className="text-slate-500 text-sm mt-2">Maaf, kode akses ini tidak valid.</p>
      </div>
    );

  const isPending = booking.status === "pending";
  const durationInHours = getDuration(booking.start_time, booking.end_time);

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-10 selection:bg-blue-600/30 overflow-x-hidden">
      {/* HEADER BACKGROUND */}
      <div className="h-60 bg-slate-950 w-full absolute top-0 left-0" />

      <main className="relative z-10 max-w-lg mx-auto pt-6 px-4 sm:px-6 space-y-4">
        
        {/* TICKET MAIN CARD */}
        <Card className="rounded-[2.5rem] border-none shadow-2xl overflow-hidden bg-white">
          
          {/* HEADER STATUS */}
          <div className={cn("p-8 text-center space-y-3 transition-colors", isPending ? "bg-blue-600" : "bg-emerald-600")}>
            <div className="h-16 w-16 bg-white/20 rounded-full flex items-center justify-center mx-auto backdrop-blur-md ring-4 ring-white/10">
              <CheckCircle2 className="h-8 w-8 text-white stroke-[3]" />
            </div>
            <div className="space-y-1">
              <h2 className="text-white font-black italic uppercase text-2xl tracking-tighter leading-none">
                {isPending ? "Booking Berhasil!" : "Siap Bermain!"}
              </h2>
              <p className="text-white/60 text-[8px] font-black uppercase tracking-[0.2em]">
                Token: {params.token.toString().slice(0, 12).toUpperCase()}
              </p>
            </div>
          </div>

          <div className="p-6 sm:p-8 space-y-8">
            {/* SCHEDULE BLOCK */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-slate-400">
                 <Calendar className="h-3 w-3" />
                 <p className="text-[9px] font-black uppercase tracking-widest italic">
                    {new Date(booking.start_time).toLocaleDateString("id-ID", { weekday: 'long', day: 'numeric', month: 'long' })}
                 </p>
              </div>
              
              <div className="bg-slate-50 rounded-3xl p-6 flex items-center justify-between border border-slate-100">
                <div className="text-center">
                   <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Mulai</p>
                   <p className="text-2xl font-black italic text-slate-900 leading-none">
                     {new Date(booking.start_time).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}
                   </p>
                </div>

                <div className="flex-1 px-4">
                   <div className="h-[1px] w-full bg-slate-200 relative">
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-600 text-white text-[7px] font-black px-2 py-0.5 rounded-full uppercase italic whitespace-nowrap shadow-md">
                        {durationInHours}H
                      </div>
                   </div>
                </div>

                <div className="text-center">
                   <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Selesai</p>
                   <p className="text-2xl font-black italic text-slate-900 leading-none">
                     {new Date(booking.end_time).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}
                   </p>
                </div>
              </div>
            </div>

            {/* INFO GRID */}
            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-1">
                  <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1"><User className="h-2.5 w-2.5"/> Pemesan</p>
                  <p className="font-black italic text-slate-900 uppercase text-xs truncate">{booking.customer_name}</p>
               </div>
               <div className="space-y-1 text-right">
                  <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest flex items-center justify-end gap-1"><MapPin className="h-2.5 w-2.5"/> Unit</p>
                  <p className="font-black italic text-blue-600 uppercase text-xs">{booking.resource_name}</p>
               </div>
            </div>

            {/* ITEMS DETAIL */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <ReceiptText className="h-3.5 w-3.5 text-slate-400" />
                <h3 className="font-black italic uppercase text-[10px] tracking-widest text-slate-900">Rincian Layanan</h3>
              </div>
              
              <div className="space-y-2">
                {booking.options?.map((opt: any) => {
                  const isMain = opt.item_type === 'main';
                  return (
                    <div key={opt.id} className="flex justify-between items-center bg-slate-50/50 p-3 rounded-2xl border border-slate-100">
                      <div className="flex items-center gap-3">
                        <div className={cn("h-7 w-7 rounded-lg flex items-center justify-center", isMain ? "bg-slate-900 text-white" : "bg-white text-purple-600 border border-purple-100")}>
                          {isMain ? <Gamepad2 className="h-3.5 w-3.5" /> : <PlusCircle className="h-3.5 w-3.5" />}
                        </div>
                        <div>
                          <p className="font-black italic text-[10px] text-slate-900 uppercase leading-none">{opt.item_name}</p>
                          <p className="text-[7px] font-bold text-slate-400 uppercase mt-1 leading-none">{isMain ? 'Sewa Per Jam' : 'Add-on (Flat)'}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-black italic text-[10px] text-slate-900">Rp {formatIDR(opt.price_at_booking)}</p>
                        {isMain && (
                           <p className="text-[7px] font-bold text-slate-300 uppercase leading-none mt-1">Total {durationInHours} Jam</p>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            <Separator className="bg-slate-100" />

            {/* BILLING */}
            <div className="flex items-center justify-between bg-slate-950 p-6 rounded-[2rem] shadow-xl relative overflow-hidden">
               <Zap className="absolute right-0 bottom-0 h-16 w-16 text-white/5 -rotate-12 translate-x-2 translate-y-2" />
               <div className="space-y-0.5 z-10">
                  <p className="text-[8px] font-black text-blue-500 uppercase tracking-widest">Total Bayar</p>
                  <p className="text-3xl font-black italic text-white tracking-tighter leading-none">Rp {formatIDR(booking.total_amount)}</p>
               </div>
               <div className="z-10">
                  <Badge className={cn("border-none text-[8px] font-black uppercase py-1 px-3 rounded-full italic shadow-lg", isPending ? "bg-orange-500 text-white" : "bg-emerald-500 text-white")}>
                    {booking.status}
                  </Badge>
               </div>
            </div>
          </div>
        </Card>

        {/* MOBILE ACTIONS */}
        <div className="grid grid-cols-2 gap-3">
          <Button className="h-14 rounded-2xl bg-slate-900 hover:bg-black font-black uppercase italic tracking-widest text-[9px] gap-2 border-b-4 border-slate-700 active:translate-y-1 active:border-b-0 transition-all">
            <MessageSquare className="h-3.5 w-3.5 fill-white" /> WhatsApp
          </Button>
          <Button
            variant="outline"
            onClick={() => window.print()}
            className="h-14 rounded-2xl border-2 border-slate-200 bg-white hover:bg-slate-50 font-black uppercase italic tracking-widest text-[9px] gap-2 active:scale-95 transition-all shadow-sm"
          >
            <Share2 className="h-3.5 w-3.5" /> Simpan
          </Button>
        </div>

        <p className="text-center text-[8px] font-black uppercase tracking-[0.3em] text-slate-400 italic pt-4 opacity-50">
          POWERED BY BATAM ENGINE V1.0
        </p>
      </main>
    </div>
  );
}