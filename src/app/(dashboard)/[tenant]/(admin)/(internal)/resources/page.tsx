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
  PlusCircle,
} from "lucide-react";
import { AddResourceDialog } from "@/components/resources/add-resources-dialog";
import api from "@/lib/api";
import { toast } from "sonner";

export default function ResourcesPage() {
  const [resources, setResources] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchResources = async () => {
    setError(false);
    try {
      // Kita asumsikan API backend mengembalikan data resource include items-nya
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
      toast.success(`${name} berhasil dihapus!`);
      fetchResources();
    } catch (err) {
      toast.error("Gagal menghapus resource");
    }
  };

  useEffect(() => {
    fetchResources();
  }, []);

  return (
    <div className="max-w-6xl space-y-10 pb-20 animate-in fade-in duration-500">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tighter text-slate-900 uppercase italic">
            Manage Resources
          </h1>
          <p className="text-slate-500 font-medium tracking-tight">
            Monitor dan atur ketersediaan aset bisnismu secara real-time.
          </p>
        </div>
        <AddResourceDialog onRefresh={fetchResources} />
      </div>

      {loading ? (
        <div className="h-96 flex flex-col items-center justify-center space-y-4">
          <div className="relative">
            <div className="h-16 w-16 rounded-full border-4 border-slate-100 border-t-blue-600 animate-spin" />
            <Layers className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-6 w-6 text-blue-600" />
          </div>
          <p className="font-black text-slate-400 uppercase tracking-widest text-xs italic">
            Loading Assets...
          </p>
        </div>
      ) : error ? (
        <div className="py-20 text-center bg-red-50 rounded-[3rem] border-2 border-dashed border-red-100">
          <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
          <h3 className="text-red-900 font-black uppercase italic">
            Connection Error
          </h3>
          <Button
            onClick={fetchResources}
            variant="link"
            className="text-red-600 font-bold uppercase text-xs mt-2"
          >
            Coba Lagi
          </Button>
        </div>
      ) : resources.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {resources.map((res) => {
            // Pisahkan item default dan addons untuk overview
            const defaultItem = res.items?.find((i: any) => i.is_default);
            const addons = res.items?.filter((i: any) => !i.is_default) || [];

            return (
              <Card
                key={res.id}
                className="group rounded-[2.5rem] border-none shadow-sm hover:shadow-2xl transition-all duration-500 bg-white overflow-hidden ring-1 ring-slate-100 hover:ring-blue-100 flex flex-col"
              >
                <CardContent className="p-8 flex-1 flex flex-col">
                  {/* Header Card */}
                  <div className="flex justify-between items-start mb-6">
                    <div className="h-14 w-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 group-hover:scale-110 group-hover:rotate-3">
                      <Layers className="h-7 w-7" />
                    </div>
                    <Badge
                      className={`border-none px-4 py-1 rounded-full font-black uppercase text-[9px] tracking-widest shadow-sm ${
                        res.status === "available"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-orange-100 text-orange-700"
                      }`}
                    >
                      {res.status}
                    </Badge>
                  </div>

                  {/* Title Section */}
                  <div className="mb-6">
                    <h3 className="text-2xl font-black text-slate-900 mb-1 uppercase tracking-tighter italic">
                      {res.name}
                    </h3>
                    <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em]">
                      {res.category || "General Resource"}
                    </p>
                  </div>

                  {/* QUICK INVENTORY OVERVIEW */}
                  <div className="flex-1 space-y-4 mb-8">
                    {/* Main Asset (Default) */}
                    <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 group-hover:border-blue-100 group-hover:bg-blue-50/30 transition-colors">
                      <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1.5 px-1">
                        Main Asset
                      </p>
                      {defaultItem ? (
                        <div className="flex items-center gap-2 px-1">
                          <Zap className="h-3 w-3 text-blue-600 fill-blue-600" />
                          <span className="text-[11px] font-black text-slate-700 uppercase italic truncate">
                            {defaultItem.name}
                          </span>
                        </div>
                      ) : (
                        <span className="text-[10px] font-bold text-slate-300 italic px-1">
                          No main asset set
                        </span>
                      )}
                    </div>

                    {/* Addons List */}
                    <div className="px-1">
                      <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-2">
                        Available Add-ons
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {addons.length > 0 ? (
                          addons.slice(0, 3).map((item: any) => (
                            <Badge
                              key={item.id}
                              variant="secondary"
                              className="bg-white border border-slate-200 text-[9px] font-bold py-0.5 rounded-lg text-slate-600"
                            >
                              + {item.name}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-[9px] font-bold text-slate-300 italic">
                            No add-ons
                          </span>
                        )}
                        {addons.length > 3 && (
                          <span className="text-[9px] font-black text-blue-600">
                            +{addons.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Footer Action */}
                  <div className="flex gap-3 pt-6 border-t border-slate-50">
                    <Link href={`/resources/${res.id}`} className="flex-1">
                      <Button
                        variant="outline"
                        className="w-full h-12 rounded-xl font-black text-xs uppercase tracking-widest border-slate-100 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-all active:scale-95 shadow-sm"
                      >
                        <Settings2 className="mr-2 h-4 w-4" />
                        MANAGE
                      </Button>
                    </Link>

                    <Button
                      variant="ghost"
                      onClick={() => handleDelete(res.id, res.name)}
                      className="h-12 w-12 p-0 rounded-xl text-red-300 hover:text-red-600 hover:bg-red-50 transition-all active:scale-90"
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
          <div className="relative h-24 w-24 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
            <Inbox className="h-10 w-10 text-slate-200" />
            <div className="absolute -top-1 -right-1 h-6 w-6 bg-blue-500 rounded-full border-4 border-white animate-bounce" />
          </div>
          <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter italic">
            Empty Inventory
          </h3>
          <p className="text-slate-400 font-medium text-sm mt-2 mb-8 italic">
            Belum ada meja atau ruangan yang terdaftar.
          </p>
          <AddResourceDialog onRefresh={fetchResources} />
        </div>
      )}
    </div>
  );
}
