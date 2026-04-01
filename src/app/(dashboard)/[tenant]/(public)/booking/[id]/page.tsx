"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { format, isBefore, startOfToday, parse } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Clock,
  Gamepad2,
  PlusCircle,
  CheckCircle2,
  ChevronRight,
  Zap,
  ArrowLeft,
  Calendar as CalendarIcon,
  Loader2,
  User,
  ShieldCheck,
  ShieldAlert,
  Info,
} from "lucide-react";
import api from "@/lib/api";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

const TIME_SLOTS = [
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
  "20:00",
  "21:00",
  "22:00",
];

export default function ResourceBookingDetail() {
  const params = useParams();
  const router = useRouter();

  const [resource, setResource] = useState<any>(null);
  const [busySlots, setBusySlots] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [date, setDate] = useState<Date | undefined>(startOfToday());
  const [custName, setCustName] = useState("");
  const [custPhone, setCustPhone] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [duration, setDuration] = useState(1);
  const [selectedMainId, setSelectedMainId] = useState("");
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // WhatsApp Validation State
  const [isValidating, setIsValidating] = useState(false);
  const [phoneStatus, setPhoneStatus] = useState<"idle" | "valid" | "invalid">(
    "idle",
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resDetail = await api.get(`/public/resources/${params.id}`);
        setResource(resDetail.data);
        const def = resDetail.data.items?.find(
          (i: any) => i.is_default && i.item_type === "main",
        );
        if (def) setSelectedMainId(def.id);
      } catch (err) {
        toast.error("GAGAL MENGAMBIL DATA UNIT");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [params.id]);

  useEffect(() => {
    const validateWA = async (phone: string) => {
      if (phone.length < 10) {
        setPhoneStatus("idle");
        return;
      }
      setIsValidating(true);
      try {
        const res = await api.get(`/validate-phone?phone=${phone}`);
        setPhoneStatus(res.data.valid ? "valid" : "invalid");
      } catch (err) {
        setPhoneStatus("invalid");
      } finally {
        setIsValidating(false);
      }
    };
    const timer = setTimeout(() => {
      if (custPhone) validateWA(custPhone);
    }, 800);
    return () => clearTimeout(timer);
  }, [custPhone]);

  useEffect(() => {
    if (date) {
      const fetchBusy = async () => {
        try {
          const formattedDate = format(date, "yyyy-MM-dd");
          const resBusy = await api.get(
            `/guest/availability/${params.id}?date=${formattedDate}`,
          );
          const busyTimes =
            resBusy.data.busy_slots?.map((b: any) => {
              const d = new Date(b.start_time);
              return `${d.getUTCHours().toString().padStart(2, "0")}:00`;
            }) || [];
          setBusySlots(busyTimes);
          setSelectedTime("");
        } catch (err) {
          toast.error("GAGAL CEK JADWAL");
        }
      };
      fetchBusy();
    }
  }, [date, params.id]);

  const getMaxDuration = (startTime: string) => {
    const startIndex = TIME_SLOTS.indexOf(startTime);
    let count = 0;
    for (let i = startIndex; i < TIME_SLOTS.length; i++) {
      if (busySlots.includes(TIME_SLOTS[i])) break;
      count++;
    }
    return count > 5 ? 5 : count;
  };

  const calculateTotal = () => {
    if (!resource || !resource.items) return 0;
    const mainPrice =
      resource.items.find((i: any) => i.id === selectedMainId)
        ?.price_per_hour || 0;
    const addonsPrice = resource.items
      .filter((i: any) => selectedAddons.includes(i.id))
      .reduce((acc: number, curr: any) => acc + curr.price_per_hour, 0);
    return mainPrice * duration + addonsPrice * duration;
  };

  const handleBooking = async () => {
    if (
      !custName ||
      !custPhone ||
      !date ||
      !selectedTime ||
      phoneStatus !== "valid"
    ) {
      toast.error("LENGKAPI IDENTITAS DAN VALIDASI WHATSAPP");
      return;
    }
    setIsSubmitting(true);
    try {
      const startTimeISO = `${format(date, "yyyy-MM-dd")}T${selectedTime}:00Z`;
      const payload = {
        tenant_id: resource.tenant_id,
        customer_name: custName.toUpperCase(),
        customer_phone: custPhone,
        resource_id: resource.id,
        item_ids: [selectedMainId, ...selectedAddons],
        start_time: startTimeISO,
        duration: duration,
      };
      const res = await api.post("/public/bookings", payload);
      toast.success("BOOKING BERHASIL!");
      router.push(res.data.redirect_url);
    } catch (err: any) {
      toast.error(err.response?.data?.error || "GAGAL BOOKING");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
      </div>
    );

  return (
    <div className="min-h-screen bg-white md:bg-slate-50 font-sans pb-48 selection:bg-blue-600/30">
      {/* HEADER */}
      <div className="bg-slate-950 text-white p-6 md:p-12 rounded-b-[3.5rem] shadow-2xl relative overflow-hidden">
        <Zap className="absolute -right-10 -top-10 h-64 w-64 text-blue-600/10 rotate-12" />
        <div className="max-w-4xl mx-auto space-y-6 relative z-10">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="text-slate-400 hover:text-white p-0 h-auto font-black uppercase text-[10px] tracking-widest italic leading-none"
          >
            <ArrowLeft className="mr-2 h-4 w-4 stroke-[3]" /> KEMBALI
          </Button>
          <div className="space-y-1">
            <h1 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter leading-none">
              {resource?.name}
            </h1>
            <p className="text-blue-500 font-black uppercase text-[10px] tracking-[0.4em] italic leading-none mt-2">
              {resource?.category || "PREMIUM UNIT"}
            </p>
          </div>
        </div>
      </div>

      <main className="max-w-4xl mx-auto p-6 -translate-y-8">
        <Card className="rounded-[3rem] border-none shadow-2xl p-8 md:p-12 space-y-12 bg-white">
          {/* STEP 1: PILIH TANGGAL */}
          <section className="space-y-8">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-600/20">
                <CalendarIcon className="h-6 w-6" />
              </div>
              <h2 className="text-2xl font-black uppercase italic tracking-tight text-slate-950">
                Pilih Tanggal Main
              </h2>
            </div>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  className="h-16 w-full justify-start rounded-2xl bg-slate-50 border-none font-black italic px-6 text-xl uppercase tracking-tighter shadow-sm"
                >
                  <CalendarIcon className="mr-3 h-5 w-5 text-blue-600" />
                  {date
                    ? format(date, "EEEE, dd MMMM yyyy", { locale: idLocale })
                    : "KLIK UNTUK PILIH TANGGAL"}
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-auto p-0 border-none shadow-2xl rounded-[2rem] bg-white overflow-hidden"
                align="center"
              >
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  disabled={(d) => d < startOfToday()}
                  initialFocus
                  className="p-4 uppercase italic font-black"
                />
              </PopoverContent>
            </Popover>
          </section>

          {/* STEP 2: PILIH JAM (WARNA RACING) */}
          {date && (
            <section className="space-y-8 pt-10 border-t border-slate-50 animate-in fade-in slide-in-from-top-4 duration-500">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 bg-emerald-500 rounded-2xl flex items-center justify-center text-white shadow-xl">
                    <Clock className="h-6 w-6" />
                  </div>
                  <h2 className="text-2xl font-black uppercase italic tracking-tight text-slate-950">
                    Jam Mulai
                  </h2>
                </div>
                <div className="hidden sm:flex gap-3 text-[8px] font-black uppercase italic text-slate-400 tracking-widest">
                  <span className="flex items-center gap-1">
                    <div className="h-2 w-2 rounded-full bg-slate-200" /> Past
                  </span>
                  <span className="flex items-center gap-1">
                    <div className="h-2 w-2 rounded-full bg-red-500" /> Full
                  </span>
                  <span className="flex items-center gap-1">
                    <div className="h-2 w-2 rounded-full bg-blue-600" /> Ready
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                {TIME_SLOTS.map((time) => {
                  const now = new Date();
                  const slotTime = parse(time, "HH:mm", date);
                  const isPast = isBefore(slotTime, now);
                  const isBusy = busySlots.includes(time);
                  const isSelected = selectedTime === time;

                  return (
                    <button
                      key={time}
                      disabled={isPast || isBusy}
                      onClick={() => {
                        setSelectedTime(time);
                        setDuration(1);
                      }}
                      className={cn(
                        "h-14 rounded-2xl border-2 font-black transition-all text-sm uppercase italic",
                        isSelected
                          ? "border-blue-600 bg-blue-600 text-white shadow-xl scale-105 z-10"
                          : isPast
                            ? "bg-slate-100 border-slate-100 text-slate-300 opacity-40 cursor-not-allowed"
                            : isBusy
                              ? "bg-red-50 border-red-100 text-red-400 cursor-not-allowed"
                              : "bg-white border-slate-100 text-slate-900 hover:border-blue-600 hover:text-blue-600",
                      )}
                    >
                      {isPast ? "PAST" : isBusy ? "FULL" : time}
                    </button>
                  );
                })}
              </div>
            </section>
          )}

          {/* STEP 3: DURASI & UNIT */}
          {selectedTime && (
            <div className="space-y-12 animate-in slide-in-from-bottom-6 duration-500">
              <section className="space-y-6 pt-10 border-t border-slate-50">
                <h2 className="text-2xl font-black uppercase italic tracking-tight text-slate-950">
                  Durasi Sewa
                </h2>
                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                  {Array.from({ length: getMaxDuration(selectedTime) }).map(
                    (_, i) => (
                      <button
                        key={i}
                        onClick={() => setDuration(i + 1)}
                        className={cn(
                          "h-16 min-w-[110px] rounded-2xl border-2 font-black text-xl transition-all italic shrink-0",
                          duration === i + 1
                            ? "bg-blue-600 border-blue-600 text-white shadow-xl"
                            : "bg-white border-slate-100 text-slate-300 hover:border-slate-300",
                        )}
                      >
                        {i + 1} JAM
                      </button>
                    ),
                  )}
                </div>
              </section>

              <section className="space-y-6 pt-10 border-t border-slate-50">
                <h2 className="text-2xl font-black uppercase italic tracking-tight text-slate-950">
                  Pilih Mesin Utama
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {resource.items
                    ?.filter((i: any) => i.item_type === "main")
                    .map((item: any) => (
                      <button
                        key={item.id}
                        onClick={() => setSelectedMainId(item.id)}
                        className={cn(
                          "p-6 rounded-[2rem] border-4 text-left transition-all flex justify-between items-center",
                          selectedMainId === item.id
                            ? "border-blue-600 bg-blue-50/50"
                            : "border-slate-50 bg-slate-50/50 hover:bg-slate-50",
                        )}
                      >
                        <div className="space-y-1">
                          <p
                            className={cn(
                              "text-xl font-black uppercase italic tracking-tighter leading-none",
                              selectedMainId === item.id
                                ? "text-blue-600"
                                : "text-slate-900",
                            )}
                          >
                            {item.name}
                          </p>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic leading-none">
                            Rp {item.price_per_hour.toLocaleString()} / JAM
                          </p>
                        </div>
                        {selectedMainId === item.id && (
                          <CheckCircle2 className="h-7 w-7 text-blue-600" />
                        )}
                      </button>
                    ))}
                </div>
              </section>

              {/* STEP 4: ADDONS */}
              <section className="space-y-6 pt-10 border-t border-slate-50">
                <h2 className="text-2xl font-black uppercase italic tracking-tight text-slate-950">
                  Fasilitas Tambahan
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {resource.items
                    ?.filter((i: any) => i.item_type === "addon")
                    .map((item: any) => {
                      const isSel = selectedAddons.includes(item.id);
                      return (
                        <button
                          key={item.id}
                          onClick={() =>
                            setSelectedAddons((p) =>
                              isSel
                                ? p.filter((a) => a !== item.id)
                                : [...p, item.id],
                            )
                          }
                          className={cn(
                            "p-5 rounded-2xl border-2 transition-all flex flex-col gap-2 items-start text-left",
                            isSel
                              ? "border-purple-600 bg-purple-50 text-purple-700 shadow-lg"
                              : "border-slate-50 bg-slate-50/30 text-slate-400 hover:border-slate-200",
                          )}
                        >
                          <span className="font-black uppercase text-[10px] italic truncate w-full leading-none">
                            {item.name}
                          </span>
                          <span className="text-[9px] font-black italic opacity-70 leading-none">
                            + RP{item.price_per_hour.toLocaleString()}
                          </span>
                        </button>
                      );
                    })}
                </div>
              </section>

              {/* FINAL STEP: IDENTITAS PEMESAN (TARUH PALING BAWAH) */}
              <section className="space-y-8 pt-12 border-t-4 border-slate-950/5 animate-in fade-in zoom-in-95 duration-700">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-xl italic font-black leading-none">
                    ID
                  </div>
                  <div>
                    <h2 className="text-2xl font-black uppercase italic tracking-tight text-slate-950 leading-none">
                      Identitas Pemesan
                    </h2>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest italic mt-1">
                      Data Terakhir Sebelum Checkout
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1 italic">
                      Nama Lengkap
                    </Label>
                    <Input
                      placeholder="BUDI SANTOSO"
                      value={custName}
                      onChange={(e) =>
                        setCustName(e.target.value.toUpperCase())
                      }
                      className="h-16 rounded-2xl bg-slate-50 border-none font-black px-6 focus:ring-4 focus:ring-blue-600/10 text-lg uppercase italic"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1 italic">
                      WhatsApp Aktif
                    </Label>
                    <div className="relative">
                      <Input
                        placeholder="0812..."
                        value={custPhone}
                        onChange={(e) =>
                          setCustPhone(e.target.value.replace(/[^0-9]/g, ""))
                        }
                        className={cn(
                          "h-16 w-full rounded-2xl bg-slate-50 border-none font-black px-6 text-lg transition-all italic",
                          phoneStatus === "valid"
                            ? "ring-2 ring-emerald-500/50"
                            : phoneStatus === "invalid"
                              ? "ring-2 ring-red-500/50"
                              : "focus:ring-blue-600/10",
                        )}
                      />
                      <div className="absolute right-4 top-1/2 -translate-y-1/2">
                        {isValidating ? (
                          <Loader2 className="h-5 w-5 animate-spin text-slate-400" />
                        ) : phoneStatus === "valid" ? (
                          <ShieldCheck className="h-6 w-6 text-emerald-500" />
                        ) : phoneStatus === "invalid" ? (
                          <ShieldAlert className="h-6 w-6 text-red-500" />
                        ) : null}
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          )}
        </Card>
      </main>

      {/* FOOTER TOTAL */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-slate-950/95 backdrop-blur-2xl border-t border-white/10 z-50 shadow-[0_-20px_50px_rgba(0,0,0,0.3)]">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-6">
          <div className="space-y-1">
            <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em] leading-none italic">
              ESTIMASI TOTAL
            </p>
            <h3 className="text-4xl md:text-5xl font-black italic text-white tracking-tighter leading-none uppercase">
              Rp {calculateTotal().toLocaleString()}
            </h3>
          </div>
          <Button
            disabled={
              !selectedTime ||
              !selectedMainId ||
              isSubmitting ||
              !custName ||
              !custPhone ||
              phoneStatus !== "valid"
            }
            onClick={handleBooking}
            className="h-16 md:h-20 px-8 md:px-12 rounded-[2rem] bg-blue-600 hover:bg-blue-500 text-white font-black uppercase italic tracking-widest transition-all active:scale-95 border-b-8 border-blue-800 shadow-xl shadow-blue-600/20"
          >
            {isSubmitting ? (
              <Loader2 className="animate-spin" />
            ) : (
              <span className="flex items-center gap-2">
                CHECKOUT <ChevronRight className="h-6 w-6 stroke-[4]" />
              </span>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
