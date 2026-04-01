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
} from "lucide-react";
import api from "@/lib/api";
import { cn } from "@/lib/utils";

export default function BookingStatusPage() {
  const params = useParams();
  if (!params.token) return <div>Token tidak ditemukan</div>;
  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!params.token) return;

    // Mengambil data detail booking yang sudah di-join dari Backend Go
    api
      .get(`/guest/status/${params.token}`)
      .then((res) => {
        setBooking(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [params.token]);

  const formatIDR = (val: number) => new Intl.NumberFormat("id-ID").format(val);

  // Helper untuk hitung durasi dalam jam dari start_time ke end_time
  const getDuration = (start: string, end: string) => {
    const s = new Date(start);
    const e = new Date(end);
    return Math.round((e.getTime() - s.getTime()) / (1000 * 60 * 60));
  };

  if (loading)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white space-y-4">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
        <p className="font-black italic uppercase text-[10px] tracking-widest text-slate-400">
          Memverifikasi Tiket...
        </p>
      </div>
    );

  if (!booking)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-2xl font-black italic uppercase tracking-tighter text-slate-900">
          Tiket Tidak Ditemukan
        </h1>
        <p className="text-slate-500 text-sm mt-2 font-medium">
          Maaf, kode akses ini tidak terdaftar di sistem kami.
        </p>
      </div>
    );

  const isPending = booking.status === "pending";

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-20 selection:bg-blue-500/30">
      {/* TOP DECORATION */}
      <div className="h-64 bg-slate-950 w-full absolute top-0 left-0" />

      <main className="relative z-10 max-w-xl mx-auto pt-12 px-6 space-y-6">
        {/* STATUS CARD */}
        <Card className="rounded-[2.5rem] border-none shadow-2xl overflow-hidden bg-white animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div
            className={cn(
              "p-10 text-center space-y-4 transition-colors",
              isPending ? "bg-blue-600" : "bg-emerald-600",
            )}
          >
            <div className="h-20 w-20 bg-white/20 rounded-full flex items-center justify-center mx-auto backdrop-blur-md ring-8 ring-white/10">
              <CheckCircle2 className="h-10 w-10 text-white stroke-[3]" />
            </div>
            <div className="space-y-1">
              <h2 className="text-white font-black italic uppercase text-3xl tracking-tighter leading-none">
                {isPending ? "Booking Berhasil!" : "Pesanan Terkonfirmasi"}
              </h2>
              <p className="text-white/70 text-[9px] font-bold uppercase tracking-[0.3em]">
                Access Token: {params.token.toString().slice(0, 8)}...
              </p>
            </div>
          </div>

          <div className="p-8 space-y-8">
            {/* ALERT BOX */}
            {isPending && (
              <div className="bg-blue-50 border-2 border-blue-100 p-5 rounded-3xl flex gap-4 items-start">
                <Zap className="h-5 w-5 text-blue-600 shrink-0 mt-1 fill-blue-600 animate-pulse" />
                <div className="space-y-1">
                  <p className="font-black italic uppercase text-xs text-blue-900 leading-tight">
                    Selesaikan Pembayaran
                  </p>
                  <p className="text-[10px] font-bold text-blue-700/70 leading-relaxed uppercase">
                    Silahkan tunjukkan tiket ini ke kasir untuk aktivasi unit{" "}
                    {booking.resource_name}.
                  </p>
                </div>
              </div>
            )}

            {/* DETAIL SUMMARY */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                <ReceiptText className="h-5 w-5 text-slate-400" />
                <h3 className="font-black italic uppercase text-sm tracking-widest text-slate-900">
                  Rincian Tiket
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-y-8">
                <div className="space-y-1">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                    Penyewa
                  </p>
                  <p className="font-black italic text-slate-900 uppercase truncate pr-2">
                    {booking.customer_name}
                  </p>
                </div>
                <div className="space-y-1 text-right">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                    Ruangan / Unit
                  </p>
                  <Badge className="bg-slate-900 text-white border-none rounded-lg italic uppercase text-[10px]">
                    {booking.resource_name}
                  </Badge>
                </div>

                <div className="space-y-1">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                    Waktu Main
                  </p>
                  <p className="font-black italic text-slate-900 uppercase flex items-center gap-1.5 text-sm">
                    <Clock className="h-3.5 w-3.5 text-blue-600" />
                    {new Date(booking.start_time).toLocaleTimeString("id-ID", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}{" "}
                    WIB
                  </p>
                </div>
                <div className="space-y-1 text-right">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                    Durasi
                  </p>
                  <p className="font-black italic text-slate-900 uppercase underline decoration-blue-500 underline-offset-4 decoration-2">
                    {getDuration(booking.start_time, booking.end_time)} JAM SEWA
                  </p>
                </div>

                {/* LIST ITEMS / OPTIONS */}
                <div className="col-span-2 space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest text-center">
                    Fasilitas & Add-ons
                  </p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {booking.options?.map((opt: any) => (
                      <Badge
                        key={opt.id}
                        variant="secondary"
                        className="bg-white border-slate-200 text-slate-600 text-[9px] font-bold uppercase italic px-3 py-1"
                      >
                        {opt.item_name}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <Separator className="bg-slate-100" />

            {/* TOTAL PRICE AREA */}
            <div className="flex items-end justify-between">
              <div className="space-y-1">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">
                  Total Tagihan
                </p>
                <p className="text-4xl font-black italic tracking-tighter text-blue-600 leading-none">
                  Rp {formatIDR(booking.total_amount)}
                </p>
              </div>
              <div className="text-right">
                <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-none text-[8px] font-black uppercase py-1 px-3">
                  {booking.status}
                </Badge>
              </div>
            </div>
          </div>
        </Card>

        {/* ACTION BUTTONS */}
        <div className="grid grid-cols-2 gap-4 pt-2">
          <Button className="h-16 rounded-3xl bg-slate-900 hover:bg-black font-black uppercase italic tracking-widest text-[10px] gap-2 border-b-8 border-slate-700 active:translate-y-1 active:border-b-0 transition-all">
            <MessageSquare className="h-4 w-4 fill-white" /> Chat Admin
          </Button>
          <Button
            variant="outline"
            onClick={() => window.print()}
            className="h-16 rounded-3xl border-2 border-slate-200 bg-white hover:bg-slate-50 font-black uppercase italic tracking-widest text-[10px] gap-2 active:scale-95 transition-all"
          >
            <Share2 className="h-4 w-4" /> Simpan Tiket
          </Button>
        </div>

        <p className="text-center text-[9px] font-black uppercase tracking-[0.3em] text-slate-400 italic pt-6">
          BOOKINAJA.COM &bull; {new Date().getFullYear()}
        </p>
      </main>
    </div>
  );
}
