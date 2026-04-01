"use client";

import { useEffect, useState } from "react";
import {
  Search,
  Filter,
  MoreVertical,
  CheckCircle2,
  XCircle,
  Clock,
  Calendar as CalendarIcon,
  User,
  Loader2,
  PlayCircle,
  CheckCircle,
  Zap,
  ReceiptText,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import api from "@/lib/api";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { ManualBookingDialog } from "./manual-booking-dialog";

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  // State untuk Detail Sheet
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const statusParam =
        filterStatus !== "All" ? `?status=${filterStatus.toLowerCase()}` : "";
      const res = await api.get(`/bookings${statusParam}`);
      // Pastikan data yang masuk adalah array
      setBookings(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      toast.error("Gagal mengambil data booking");
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [filterStatus]);

  const handleShowDetail = async (id: string) => {
    try {
      const res = await api.get(`/bookings/${id}`);
      setSelectedBooking(res.data);
      setIsDetailOpen(true);
    } catch (err) {
      toast.error("Gagal memuat detail booking");
    }
  };

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      await api.put(`/bookings/${id}/status`, { status: newStatus });
      toast.success(`Status diperbarui ke ${newStatus.toUpperCase()}`);
      if (isDetailOpen) setIsDetailOpen(false);
      fetchBookings();
    } catch (err) {
      toast.error("Gagal memperbarui status");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "confirmed":
        return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "ongoing":
        return "bg-orange-100 text-orange-700 border-orange-200";
      case "cancelled":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  // Safe filtering dengan Optional Chaining
  const filteredData = (bookings || []).filter(
    (b) =>
      b?.customer_name?.toLowerCase()?.includes(searchQuery.toLowerCase()) ||
      b?.customer_phone?.includes(searchQuery),
  );

  return (
    <div className="p-8 space-y-8 max-w-[1600px] mx-auto font-sans selection:bg-blue-500/30">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black italic uppercase tracking-tighter text-slate-950">
            Booking <span className="text-blue-600">Management</span>
          </h1>
          <p className="text-slate-500 font-bold text-[10px] uppercase tracking-widest italic flex items-center gap-2">
            <span className="h-1.5 w-1.5 bg-blue-600 rounded-full animate-pulse" />
            Live Dashboard &bull; Monitoring Unit
          </p>
        </div>
        <ManualBookingDialog onRefresh={fetchBookings} />
      </div>

      {/* FILTER & SEARCH */}
      <Card className="p-4 rounded-[2rem] border-none shadow-sm flex flex-col md:flex-row gap-4 items-center bg-white">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Cari Nama Pelanggan..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 h-14 rounded-2xl bg-slate-50 border-none font-bold text-sm focus:ring-4 focus:ring-blue-600/5 transition-all"
          />
        </div>
        <div className="flex gap-1 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
          {["All", "Pending", "Confirmed", "Ongoing", "Cancelled"].map((f) => (
            <Button
              key={f}
              onClick={() => setFilterStatus(f)}
              variant={filterStatus === f ? "default" : "ghost"}
              className={cn(
                "rounded-2xl h-14 px-6 font-black uppercase italic text-[10px] tracking-widest transition-all",
                filterStatus === f
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
                  : "text-slate-400 hover:text-blue-600 hover:bg-blue-50",
              )}
            >
              {f}
            </Button>
          ))}
        </div>
      </Card>

      {/* TABLE DATA */}
      <Card className="rounded-[2.5rem] border-none shadow-2xl overflow-hidden bg-white">
        <Table>
          <TableHeader className="bg-slate-50/50">
            <TableRow className="border-none">
              <TableHead className="font-black uppercase italic text-[10px] tracking-widest h-20 px-8">
                Customer
              </TableHead>
              <TableHead className="font-black uppercase italic text-[10px] tracking-widest h-20">
                Resource
              </TableHead>
              <TableHead className="font-black uppercase italic text-[10px] tracking-widest h-20 text-center">
                Schedule
              </TableHead>
              <TableHead className="font-black uppercase italic text-[10px] tracking-widest h-20 text-center">
                Status
              </TableHead>
              <TableHead className="font-black uppercase italic text-[10px] tracking-widest h-20 text-right">
                Total Amount
              </TableHead>
              <TableHead className="h-20 px-8"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-64 text-center">
                  <Loader2 className="h-10 w-10 animate-spin mx-auto text-blue-600" />
                </TableCell>
              </TableRow>
            ) : filteredData.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="h-64 text-center text-slate-300 font-black italic uppercase"
                >
                  No Data Found
                </TableCell>
              </TableRow>
            ) : (
              // Tambahkan Optional Chaining pada mapping
              filteredData.map((b) => (
                <TableRow
                  key={b?.id}
                  className="border-slate-50 hover:bg-slate-50/50 transition-all group cursor-pointer"
                  onClick={() => b?.id && handleShowDetail(b.id)}
                >
                  <TableCell className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 font-black italic text-lg border border-blue-100 group-hover:scale-110 transition-transform">
                        {b?.customer_name?.[0] || "?"}
                      </div>
                      <div>
                        <p className="font-black italic uppercase text-sm tracking-tight text-slate-900 leading-none mb-1">
                          {b?.customer_name || "UNKNOWN"}
                        </p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                          <Zap className="h-2 w-2 fill-emerald-500 text-emerald-500" />{" "}
                          {b?.customer_phone || "-"}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className="bg-slate-950 text-white rounded-lg px-3 py-1 font-black uppercase italic text-[9px] border-none tracking-widest">
                      {b?.resource_name || "N/A"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="inline-flex flex-col items-center bg-slate-50 px-4 py-2 rounded-2xl border border-slate-100">
                      <p className="font-black italic text-sm text-slate-900 leading-none mb-1">
                        {b?.start_time
                          ? new Date(b.start_time).toLocaleTimeString("id-ID", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : "--:--"}
                      </p>
                      <p className="text-[9px] font-black text-blue-600 uppercase tracking-tighter italic">
                        {b?.start_time
                          ? new Date(b.start_time).toLocaleDateString("id-ID", {
                              day: "numeric",
                              month: "short",
                            })
                          : "---"}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge
                      className={cn(
                        "rounded-xl border-2 px-4 py-1.5 font-black uppercase italic text-[9px] tracking-widest",
                        getStatusColor(b?.status),
                      )}
                    >
                      {b?.status || "UNKNOWN"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <p className="font-black italic text-base text-slate-900 leading-none mb-1">
                      Rp{" "}
                      {new Intl.NumberFormat("id-ID").format(
                        b?.total_amount || 0,
                      )}
                    </p>
                    <p className="text-[8px] font-black text-emerald-500 uppercase italic">
                      Paid in Full
                    </p>
                  </TableCell>
                  <TableCell
                    className="px-8 text-right"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="rounded-full hover:bg-white hover:shadow-xl"
                        >
                          <MoreVertical className="h-5 w-5 text-slate-400" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="w-56 rounded-2xl p-2 bg-white shadow-2xl border-none"
                      >
                        <DropdownMenuLabel className="font-black uppercase italic text-[9px] text-slate-400 px-4 py-2">
                          Ubah Status
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator className="bg-slate-50" />
                        <DropdownMenuItem
                          onClick={() => updateStatus(b.id, "confirmed")}
                          className="rounded-xl px-4 py-3 cursor-pointer group"
                        >
                          <CheckCircle className="h-4 w-4 mr-2 text-emerald-500" />
                          <span className="font-bold text-xs uppercase italic">
                            Confirm Booking
                          </span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => updateStatus(b.id, "ongoing")}
                          className="rounded-xl px-4 py-3 cursor-pointer group text-orange-600"
                        >
                          <PlayCircle className="h-4 w-4 mr-2" />
                          <span className="font-bold text-xs uppercase italic">
                            Start Session
                          </span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => updateStatus(b.id, "cancelled")}
                          className="rounded-xl px-4 py-3 cursor-pointer text-red-600"
                        >
                          <XCircle className="h-4 w-4 mr-2" />
                          <span className="font-bold text-xs uppercase italic">
                            Cancel Booking
                          </span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      {/* --- SHEET DETAIL BOOKING --- */}
      <Sheet open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <SheetContent className="w-full sm:max-w-md border-none shadow-2xl p-0 overflow-y-auto bg-white">
          {selectedBooking ? (
            <div className="flex flex-col h-full">
              <div className="bg-slate-950 p-8 text-white">
                <SheetHeader>
                  <p className="text-[10px] font-black uppercase text-blue-500 tracking-[0.3em] mb-2 leading-none">
                    Detail Booking
                  </p>
                  <SheetTitle className="text-3xl font-black italic uppercase tracking-tighter text-white">
                    {selectedBooking?.customer_name || "UNKNOWN"}
                  </SheetTitle>
                </SheetHeader>
              </div>

              <div className="p-8 space-y-8">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                      Resource
                    </p>
                    <p className="font-black italic uppercase text-slate-900">
                      {selectedBooking?.resource_name || "N/A"}
                    </p>
                  </div>
                  <div className="space-y-1 text-right">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                      Status
                    </p>
                    <Badge
                      className={cn(
                        "rounded-lg border px-3 py-1 font-black uppercase italic text-[9px]",
                        getStatusColor(selectedBooking?.status),
                      )}
                    >
                      {selectedBooking?.status || "UNKNOWN"}
                    </Badge>
                  </div>
                </div>

                <Separator className="bg-slate-100" />

                <div className="space-y-4">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <ReceiptText className="h-3 w-3" /> Items & Fasilitas
                  </p>
                  <div className="space-y-3">
                    {selectedBooking?.options?.map((opt: any) => (
                      <div
                        key={opt.id}
                        className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-100"
                      >
                        <p className="text-[10px] font-black uppercase italic text-slate-700">
                          {opt?.item_name || "ITEM"}
                        </p>
                        <p className="text-[10px] font-bold text-slate-400">
                          Rp {(opt?.price_at_booking || 0).toLocaleString()}
                        </p>
                      </div>
                    ))}
                    {(!selectedBooking?.options ||
                      selectedBooking.options.length === 0) && (
                      <p className="text-[10px] italic text-slate-400">
                        Tidak ada item tambahan.
                      </p>
                    )}
                  </div>
                </div>

                <div className="bg-blue-600 p-6 rounded-[2rem] text-white flex justify-between items-end shadow-xl shadow-blue-200">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-70">
                      Total Pembayaran
                    </p>
                    <p className="text-3xl font-black italic tracking-tighter leading-none">
                      Rp {(selectedBooking?.total_amount || 0).toLocaleString()}
                    </p>
                  </div>
                  <Badge className="bg-white/20 text-white border-none uppercase text-[8px] font-black italic">
                    Paid
                  </Badge>
                </div>

                <div className="pt-6 grid grid-cols-2 gap-3">
                  <Button
                    onClick={() =>
                      updateStatus(selectedBooking.id, "confirmed")
                    }
                    className="rounded-2xl h-14 bg-emerald-600 hover:bg-emerald-700 text-white font-black uppercase italic text-[10px] tracking-widest"
                  >
                    Confirm
                  </Button>
                  <Button
                    onClick={() =>
                      updateStatus(selectedBooking.id, "cancelled")
                    }
                    variant="outline"
                    className="rounded-2xl h-14 border-slate-200 text-red-500 font-black uppercase italic text-[10px] tracking-widest hover:bg-red-50"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex h-full items-center justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
          )}
        </SheetContent>
      </Sheet>

      <p className="text-center text-[9px] font-black uppercase tracking-[0.4em] text-slate-300 italic pt-6">
        Bookinaja Admin System &bull; Batam Engine v1.0
      </p>
    </div>
  );
}
