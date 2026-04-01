"use client";

import { useState, useEffect } from "react";
import { format, isBefore, startOfToday, parse } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import api from "@/lib/api";
import { toast } from "sonner";
import {
  Loader2,
  Plus,
  Calendar as CalendarIcon,
  Clock,
  CheckCircle2,
  Gamepad2,
  PlusCircle,
  Zap,
  ShieldCheck,
  ShieldAlert,
} from "lucide-react";
import { cn } from "@/lib/utils";

const HOURS_RANGE = [
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

export function ManualBookingDialog({ onRefresh }: { onRefresh: () => void }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resources, setResources] = useState<any[]>([]);
  const [resourceDetail, setResourceDetail] = useState<any>(null);
  const [busySlots, setBusySlots] = useState<string[]>([]);

  const [isValidating, setIsValidating] = useState(false);
  const [phoneStatus, setPhoneStatus] = useState<"idle" | "valid" | "invalid">(
    "idle",
  );

  const [date, setDate] = useState<Date>();
  const [formData, setFormData] = useState({
    customer_name: "",
    customer_phone: "",
    resource_id: "",
    start_hour: "",
    duration: 1,
    selectedMainId: "",
    selectedAddons: [] as string[],
  });

  useEffect(() => {
    if (open) api.get("/resources-all").then((res) => setResources(res.data));
  }, [open]);

  useEffect(() => {
    const validateWA = async (phone: string) => {
      if (phone.length < 10) {
        setPhoneStatus("idle");
        return;
      }
      setIsValidating(true);
      try {
        const res = await api.get(`/validate-phone?phone=${phone}`);
        res.data.valid ? setPhoneStatus("valid") : setPhoneStatus("invalid");
      } catch (err) {
        setPhoneStatus("invalid");
      } finally {
        setIsValidating(false);
      }
    };
    const timer = setTimeout(() => {
      if (formData.customer_phone) validateWA(formData.customer_phone);
    }, 800);
    return () => clearTimeout(timer);
  }, [formData.customer_phone]);

  useEffect(() => {
    if (formData.resource_id) {
      api.get(`/public/resources/${formData.resource_id}`).then((res) => {
        setResourceDetail(res.data);
        const def = res.data.items?.find(
          (i: any) => i.is_default && i.item_type === "main",
        );
        if (def) setFormData((prev) => ({ ...prev, selectedMainId: def.id }));
      });
    }
  }, [formData.resource_id]);

  useEffect(() => {
    if (formData.resource_id && date) {
      const formattedDate = format(date, "yyyy-MM-dd");
      api
        .get(
          `/guest/availability/${formData.resource_id}?date=${formattedDate}`,
        )
        .then((res) => {
          const hours =
            res.data.busy_slots?.map((s: any) => {
              const d = new Date(s.start_time);
              return `${d.getUTCHours().toString().padStart(2, "0")}:00`;
            }) || [];
          setBusySlots(hours);
        });
    }
  }, [formData.resource_id, date]);

  const getMaxAllowedDuration = () => {
    if (!formData.start_hour) return 5;
    const startIndex = HOURS_RANGE.indexOf(formData.start_hour);
    let count = 0;
    for (let i = startIndex; i < HOURS_RANGE.length; i++) {
      if (busySlots.includes(HOURS_RANGE[i])) break;
      count++;
    }
    return count > 5 ? 5 : count;
  };

  const calculateTotal = () => {
    if (!resourceDetail?.items) return 0;
    const mainPrice =
      resourceDetail.items.find((i: any) => i.id === formData.selectedMainId)
        ?.price_per_hour || 0;
    const addonsPrice = resourceDetail.items
      .filter((i: any) => formData.selectedAddons.includes(i.id))
      .reduce((acc: number, curr: any) => acc + curr.price_per_hour, 0);
    return mainPrice * formData.duration + addonsPrice * formData.duration;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !formData.start_hour || phoneStatus !== "valid") return;
    setLoading(true);
    try {
      const isoTime = `${format(date, "yyyy-MM-dd")}T${formData.start_hour}:00Z`;
      await api.post("/bookings/manual", {
        tenant_id: resourceDetail?.tenant_id,
        customer_name: formData.customer_name.toUpperCase(),
        customer_phone: formData.customer_phone,
        resource_id: formData.resource_id,
        item_ids: [formData.selectedMainId, ...formData.selectedAddons],
        start_time: isoTime,
        duration: Number(formData.duration),
      });
      toast.success("BOOKING MANUAL BERHASIL");
      setOpen(false);
      onRefresh();
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Gagal booking");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-slate-950 hover:bg-black text-white font-black uppercase italic text-[10px] tracking-widest rounded-2xl px-8 h-14 shadow-xl border-b-4 border-slate-700 active:border-b-0 transition-all">
          <Plus className="mr-2 h-4 w-4 stroke-[4]" /> Manual Booking
        </Button>
      </DialogTrigger>
      <DialogContent className="rounded-[2.5rem] border-none sm:max-w-[700px] p-10 bg-white max-h-[95vh] overflow-y-auto scrollbar-hide">
        <DialogHeader>
          <DialogTitle className="text-3xl font-black italic uppercase tracking-tighter">
            Manual <span className="text-blue-600">Booking</span>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-8 pt-4">
          {/* IDENTITAS */}
          <section className="space-y-4">
            <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic">
              Identitas Pelanggan
            </Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                required
                placeholder="NAMA LENGKAP"
                className="h-16 rounded-2xl bg-slate-50 border-none font-black italic px-6 focus:ring-2 focus:ring-blue-600/20 uppercase"
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    customer_name: e.target.value.toUpperCase(),
                  })
                }
              />
              <div className="relative">
                <Input
                  required
                  placeholder="NO. WHATSAPP"
                  className={cn(
                    "h-16 w-full rounded-2xl bg-slate-50 border-none font-black italic px-6 transition-all",
                    phoneStatus === "valid"
                      ? "ring-2 ring-emerald-500/50"
                      : phoneStatus === "invalid"
                        ? "ring-2 ring-red-500/50"
                        : "focus:ring-blue-600/20",
                  )}
                  onChange={(e) =>
                    setFormData({ ...formData, customer_phone: e.target.value })
                  }
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                  {isValidating ? (
                    <Loader2 className="h-5 w-5 animate-spin text-slate-400" />
                  ) : phoneStatus === "valid" ? (
                    <ShieldCheck className="h-5 w-5 text-emerald-500 animate-in zoom-in" />
                  ) : phoneStatus === "invalid" ? (
                    <ShieldAlert className="h-5 w-5 text-red-500 animate-in zoom-in" />
                  ) : null}
                </div>
              </div>
            </div>
          </section>

          {/* UNIT & CALENDAR SHADCN */}
          <section className="space-y-4">
            <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic">
              Unit & Tanggal
            </Label>
            <div className="flex flex-row items-stretch gap-4 w-full">
              <div className="flex-1">
                <Select
                  onValueChange={(v) =>
                    setFormData({ ...formData, resource_id: v })
                  }
                >
                  <SelectTrigger className="h-16 w-full rounded-[1.25rem] bg-slate-50 border-none font-black italic px-6 text-sm uppercase">
                    <SelectValue placeholder="PILIH UNIT" />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl border-none shadow-2xl bg-white font-black italic p-2">
                    {resources.map((r) => (
                      <SelectItem
                        key={r.id}
                        value={r.id}
                        className="rounded-xl uppercase py-3"
                      >
                        {r.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="ghost"
                      className={cn(
                        "h-16 w-full justify-start rounded-[1.25rem] bg-slate-50 border-none font-black italic px-6 text-sm uppercase",
                        !date && "text-slate-400",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? (
                        format(date, "dd/MM/yyyy")
                      ) : (
                        <span>PILIH TANGGAL</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-auto p-0 border-none shadow-2xl rounded-2xl bg-white"
                    align="start"
                  >
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      disabled={(date) => date < startOfToday()}
                      initialFocus
                      className="rounded-2xl"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </section>

          {/* JAM MULAI (ANTI-PAST LOGIC) */}
          {formData.resource_id && date && (
            <section className="space-y-4 animate-in fade-in zoom-in-95">
              <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic flex items-center gap-2">
                <Clock className="h-3 w-3 text-blue-600" /> Jam Mulai (WIB)
              </Label>
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                {HOURS_RANGE.map((hour) => {
                  const now = new Date();
                  const slotTime = parse(hour, "HH:mm", date);
                  const isPast = isBefore(slotTime, now);
                  const isBusy = busySlots.includes(hour) || isPast;
                  const isSelected = formData.start_hour === hour;

                  return (
                    <button
                      key={hour}
                      type="button"
                      disabled={isBusy}
                      onClick={() =>
                        setFormData({ ...formData, start_hour: hour })
                      }
                      className={cn(
                        "h-12 rounded-xl text-[10px] font-black transition-all border-2 italic uppercase",
                        isBusy
                          ? "bg-slate-50 border-slate-50 text-slate-200"
                          : isSelected
                            ? "bg-blue-600 border-blue-600 text-white shadow-lg"
                            : "bg-white border-slate-100 text-slate-400 hover:border-blue-600",
                      )}
                    >
                      {isPast ? "PAST" : isBusy ? "FULL" : hour}
                    </button>
                  );
                })}
              </div>
            </section>
          )}

          {/* MAIN & ADDONS (UPPERCASE) */}
          {resourceDetail && (
            <>
              <section className="space-y-4">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic flex items-center gap-2">
                  <Gamepad2 className="h-3 w-3" /> Mesin Utama
                </Label>
                <div className="grid grid-cols-2 gap-3">
                  {resourceDetail.items
                    ?.filter((i: any) => i.item_type === "main")
                    .map((item: any) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() =>
                          setFormData({ ...formData, selectedMainId: item.id })
                        }
                        className={cn(
                          "p-5 rounded-[1.5rem] border-2 text-left transition-all",
                          formData.selectedMainId === item.id
                            ? "border-blue-600 bg-blue-50/50"
                            : "border-slate-50 bg-slate-50/30",
                        )}
                      >
                        <div className="flex justify-between items-start">
                          <p
                            className={cn(
                              "text-xs font-black uppercase italic",
                              formData.selectedMainId === item.id
                                ? "text-blue-600"
                                : "text-slate-900",
                            )}
                          >
                            {item.name}
                          </p>
                          {formData.selectedMainId === item.id && (
                            <CheckCircle2 className="h-4 w-4 text-blue-600" />
                          )}
                        </div>
                        <p className="text-[9px] font-black text-slate-400 mt-1 italic uppercase">
                          Rp {item.price_per_hour.toLocaleString()}/H
                        </p>
                      </button>
                    ))}
                </div>
              </section>

              <section className="space-y-4">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic flex items-center gap-2">
                  <PlusCircle className="h-3 w-3" /> Tambahan (Add-ons)
                </Label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {resourceDetail.items
                    ?.filter((i: any) => i.item_type === "addon")
                    .map((item: any) => {
                      const isSelected = formData.selectedAddons.includes(
                        item.id,
                      );
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() =>
                            setFormData((prev) => ({
                              ...prev,
                              selectedAddons: isSelected
                                ? prev.selectedAddons.filter(
                                    (a) => a !== item.id,
                                  )
                                : [...prev.selectedAddons, item.id],
                            }))
                          }
                          className={cn(
                            "p-4 rounded-2xl border-2 text-left transition-all",
                            isSelected
                              ? "border-purple-600 bg-purple-50 text-purple-700 shadow-md"
                              : "border-slate-50 bg-slate-50/20 text-slate-400",
                          )}
                        >
                          <p className="text-[9px] font-black uppercase italic leading-none truncate">
                            {item.name}
                          </p>
                          <p
                            className={cn(
                              "text-[8px] font-bold mt-1.5 italic uppercase",
                              isSelected ? "text-purple-500" : "text-slate-300",
                            )}
                          >
                            +Rp{item.price_per_hour.toLocaleString()}
                          </p>
                        </button>
                      );
                    })}
                </div>
              </section>
            </>
          )}

          {/* BILLING */}
          {formData.start_hour && (
            <div className="bg-slate-950 p-8 rounded-[2.5rem] text-white flex flex-col sm:flex-row justify-between items-center gap-6 shadow-2xl">
              <div className="space-y-4 w-full sm:w-auto text-center sm:text-left">
                <Label className="text-[9px] font-black uppercase tracking-[0.4em] text-blue-500">
                  Durasi Main
                </Label>
                <div className="flex gap-2 justify-center sm:justify-start">
                  {Array.from({ length: getMaxAllowedDuration() }).map(
                    (_, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() =>
                          setFormData({ ...formData, duration: i + 1 })
                        }
                        className={cn(
                          "h-12 w-12 rounded-xl font-black text-xs transition-all italic border-2 uppercase",
                          formData.duration === i + 1
                            ? "bg-blue-600 border-blue-600 text-white shadow-lg scale-110"
                            : "bg-white/5 border-white/10 text-white/30 hover:bg-white/10",
                        )}
                      >
                        {i + 1}H
                      </button>
                    ),
                  )}
                </div>
              </div>
              <div className="text-center sm:text-right border-t sm:border-t-0 sm:border-l border-white/10 pt-6 sm:pt-0 sm:pl-8 w-full sm:w-auto">
                <p className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em] leading-none mb-2">
                  Total Estimasi
                </p>
                <p className="text-4xl font-black italic tracking-tighter text-blue-500 leading-none uppercase">
                  Rp {calculateTotal().toLocaleString()}
                </p>
              </div>
            </div>
          )}

          <Button
            disabled={
              loading ||
              !formData.start_hour ||
              !formData.selectedMainId ||
              phoneStatus !== "valid"
            }
            className="w-full h-20 rounded-[2rem] bg-blue-600 hover:bg-blue-500 text-white font-black uppercase italic tracking-widest border-b-8 border-blue-800 shadow-xl shadow-blue-600/20 transition-all active:translate-y-1 active:border-b-0 disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="animate-spin mx-auto" />
            ) : (
              <span className="flex items-center gap-2 uppercase">
                Konfirmasi Booking <Zap className="h-5 w-5 fill-white" />
              </span>
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
