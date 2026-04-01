"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Layers,
  Settings2,
  Trash2,
  Loader2,
  Inbox,
  AlertCircle,
  Zap,
  Package,
  Gamepad2,
} from "lucide-react";
import { AddResourceDialog } from "@/components/resources/add-resources-dialog";
import api from "@/lib/api";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function ResourcesPage() {
  const [resources, setResources] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchResources = async () => {
    setError(false);
    try {
      const res = await api.get("/resources-all");
      setResources(res.data || []);
    } catch (err) {
      console.error("Fetch Error:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Hapus ${name} secara permanen?`)) return;
    try {
      await api.delete(`/resources-all/${id}`);
      toast.success(`${name} dihapus!`);
      fetchResources();
    } catch (err) {
      toast.error("Gagal menghapus resource");
    }
  };

  useEffect(() => {
    fetchResources();
  }, []);

  const formatIDR = (val: number) => new Intl.NumberFormat("id-ID").format(val);

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12 animate-in fade-in duration-500 px-4">
      {/* HEADER SECTION - MEDIUM SIZE */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b-2 border-slate-100 pb-8">
        <div className="space-y-1">
          <h1 className="text-4xl font-black tracking-tighter text-slate-900 uppercase italic">
            Manage <span className="text-blue-600">Resources</span>
          </h1>
          <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.2em] italic">
            Monitor ketersediaan & konfigurasi unit bisnis
          </p>
        </div>
        <AddResourceDialog onRefresh={fetchResources} />
      </div>

      {loading ? (
        <div className="h-80 flex flex-col items-center justify-center space-y-4">
          <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
          <p className="font-black text-slate-300 uppercase tracking-widest text-xs italic">Syncing Assets...</p>
        </div>
      ) : error ? (
        <div className="py-20 text-center bg-red-50/50 rounded-[2.5rem] border-2 border-dashed border-red-100">
          <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
          <h3 className="text-red-900 font-black uppercase text-base">Connection Error</h3>
          <Button onClick={fetchResources} variant="link" className="text-red-600 font-bold uppercase text-xs mt-1">Coba Lagi</Button>
        </div>
      ) : resources.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resources.map((res) => {
            // Pisahkan item berdasarkan Tipe
            const mainItems = res.items?.filter((i: any) => i.item_type === "main") || [];
            const addonItems = res.items?.filter((i: any) => i.item_type === "addon") || [];

            return (
              <Card
                key={res.id}
                className="group rounded-[2.5rem] border-none shadow-sm hover:shadow-2xl transition-all duration-500 bg-white overflow-hidden ring-1 ring-slate-100 hover:ring-blue-100 flex flex-col"
              >
                <CardContent className="p-7 flex-1 flex flex-col">
                  {/* Status & Icon */}
                  <div className="flex justify-between items-start mb-5">
                    <div className={cn(
                      "h-12 w-12 rounded-2xl flex items-center justify-center transition-all duration-500 shadow-inner",
                      res.status === "available" ? "bg-blue-50 text-blue-600" : "bg-slate-50 text-slate-300"
                    )}>
                      <Layers className="h-6 w-6 stroke-[2.5]" />
                    </div>
                    <Badge className={cn(
                      "border-none px-4 py-1 rounded-full font-black uppercase text-[9px] tracking-widest shadow-sm",
                      res.status === "available" ? "bg-emerald-100 text-emerald-700" : "bg-orange-100 text-orange-700"
                    )}>
                      {res.status}
                    </Badge>
                  </div>

                  {/* Title */}
                  <div className="mb-6">
                    <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter italic truncate">
                      {res.name}
                    </h3>
                    <p className="text-slate-400 font-bold text-[9px] uppercase tracking-[0.3em]">
                      {res.category || "PREMIUM UNIT"}
                    </p>
                  </div>

                  {/* INVENTORY OVERVIEW SECTION */}
                  <div className="flex-1 space-y-4 mb-8">
                    {/* List Semua Unit Utama (MAIN) */}
                    <div className="space-y-2">
                      <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest px-1 flex items-center gap-2">
                        <Gamepad2 className="h-3 w-3" /> Opsi Unit Utama
                      </p>
                      <div className="space-y-1.5">
                        {mainItems.length > 0 ? (
                          mainItems.map((item: any) => (
                            <div key={item.id} className={cn(
                                "flex items-center justify-between p-2.5 rounded-xl border transition-all",
                                item.is_default 
                                ? "bg-blue-50/50 border-blue-100 ring-1 ring-blue-100" 
                                : "bg-white border-slate-50 opacity-60"
                            )}>
                              <div className="flex items-center gap-2 overflow-hidden">
                                <Zap className={cn("h-3 w-3 shrink-0", item.is_default ? "text-blue-600 fill-blue-600" : "text-slate-300")} />
                                <span className="text-[11px] font-black text-slate-700 uppercase italic truncate">{item.name}</span>
                              </div>
                              <span className="text-[10px] font-black text-blue-600 italic whitespace-nowrap ml-2">Rp{formatIDR(item.price_per_hour)}</span>
                            </div>
                          ))
                        ) : (
                          <div className="p-3 rounded-xl bg-slate-50 border border-dashed border-slate-200 text-center">
                            <span className="text-[9px] font-bold text-slate-400 italic">Belum ada unit utama</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Add-ons List */}
                    <div className="px-1 space-y-2 pt-1">
                      <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                         <Package className="h-3 w-3" /> Fasilitas Tambahan
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {addonItems.length > 0 ? (
                          addonItems.slice(0, 4).map((item: any) => (
                            <Badge key={item.id} variant="secondary" className="bg-slate-50 border border-slate-100 text-[8px] font-black py-0.5 px-2 rounded-lg text-slate-500 uppercase">
                              + {item.name}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-[9px] font-bold text-slate-300 italic">No add-ons registered</span>
                        )}
                        {addonItems.length > 4 && (
                          <span className="text-[9px] font-black text-blue-600">+{addonItems.length - 4} MORE</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions Footer */}
                  <div className="flex gap-3 pt-6 border-t border-slate-50">
                    <Link href={`/resources/${res.id}`} className="flex-1">
                      <Button
                        variant="outline"
                        className="w-full h-11 rounded-xl font-black text-[10px] uppercase tracking-widest border-slate-200 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all active:scale-95 shadow-sm"
                      >
                        <Settings2 className="mr-2 h-4 w-4" />
                        MANAGE ITEMS
                      </Button>
                    </Link>

                    <Button
                      variant="ghost"
                      onClick={() => handleDelete(res.id, res.name)}
                      className="h-11 w-11 p-0 rounded-xl text-red-300 hover:text-red-600 hover:bg-red-50 transition-all border border-transparent hover:border-red-100"
                    >
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="py-32 text-center bg-slate-50/50 rounded-[4rem] border-4 border-dashed border-slate-100">
          <div className="relative h-20 w-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
            <Inbox className="h-10 w-10 text-slate-200" />
            <div className="absolute -top-1 -right-1 h-6 w-6 bg-blue-500 rounded-full border-4 border-white animate-bounce" />
          </div>
          <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter italic">Empty Inventory</h3>
          <p className="text-slate-400 font-medium text-xs mt-2 mb-8 uppercase tracking-widest">Belum ada meja atau ruangan terdaftar.</p>
          <AddResourceDialog onRefresh={fetchResources} />
        </div>
      )}
    </div>
  );
}