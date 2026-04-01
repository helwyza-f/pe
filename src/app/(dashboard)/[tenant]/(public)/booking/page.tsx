"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Zap,
  Gamepad2,
  ChevronRight,
  Loader2,
  ArrowRight,
  LayoutGrid,
  PlusCircle,
} from "lucide-react";
import api from "@/lib/api";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export default function PublicResourceCatalog() {
  const params = useParams();
  const [resources, setResources] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCatalog = async () => {
      setLoading(true);
      try {
        const host = typeof window !== "undefined" ? window.location.hostname : "";
        const slug = params.tenant || host.split(".")[0];

        const res = await api.get(`/public/landing?slug=${slug}`);
        
        const rawResources = Array.isArray(res.data.resources) ? res.data.resources : [];
        const decodedResources = rawResources.map((res: any) => {
          let parsedItems = [];
          if (typeof res.items === "string") {
            try {
              parsedItems = JSON.parse(atob(res.items));
            } catch (e) {
              console.error("Gagal parse items untuk:", res.name);
            }
          } else if (Array.isArray(res.items)) {
            parsedItems = res.items;
          }
          return { ...res, items: parsedItems };
        });

        setResources(decodedResources);
      } catch (err) {
        console.error(err);
        toast.error("GAGAL MEMUAT KATALOG UNIT");
      } finally {
        setLoading(false);
      }
    };
    fetchCatalog();
  }, [params.tenant]);

  // FIX: Hanya ambil harga termurah dari item tipe 'main'
  const getCheapestMainPrice = (items: any[]) => {
    if (!items || items.length === 0) return 0;
    const mainItems = items.filter((i: any) => i.item_type === "main");
    if (mainItems.length === 0) return 0;
    
    const prices = mainItems.map((i: any) => i.price_per_hour || 0);
    return Math.min(...prices);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 italic">Racing to Load...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 font-sans pb-20 selection:bg-blue-600/30">
      {/* HEADER */}
      <div className="bg-slate-950 text-white pt-20 pb-32 px-6 rounded-b-[4rem] relative overflow-hidden shadow-2xl">
        <Zap className="absolute -right-20 -top-20 h-96 w-96 text-blue-600/10 rotate-12" />
        <div className="max-w-6xl mx-auto relative z-10 text-center space-y-4">
          <Badge className="bg-blue-600 text-white border-none px-4 py-1 rounded-full font-black italic uppercase text-[10px] tracking-[0.3em]">
            Booking Catalog
          </Badge>
          <h1 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter leading-none">
            PILIH <span className="text-blue-600">UNIT</span> MAINMU
          </h1>
        </div>
      </div>

      {/* GRID KATALOG */}
      <main className="max-w-6xl mx-auto p-6 -translate-y-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {resources.map((res: any) => {
            const mainItems = res.items?.filter((i: any) => i.item_type === "main") || [];
            const addonItems = res.items?.filter((i: any) => i.item_type === "addon") || [];

            return (
              <Link key={res.id} href={`/booking/${res.id}`}>
                <Card className="group relative rounded-[2.5rem] border-none bg-white shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden flex flex-col h-full">
                  
                  {/* Visual Header */}
                  <div className="h-32 bg-slate-100 flex items-center justify-center relative overflow-hidden group-hover:bg-blue-600 transition-colors duration-500">
                    <div className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity">
                      <LayoutGrid className="w-full h-full scale-150 -rotate-12" />
                    </div>
                    <Gamepad2 className="h-12 w-12 text-slate-300 group-hover:text-white transition-all duration-500 group-hover:scale-125" />
                    <div className="absolute top-6 right-6">
                      <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center shadow-lg group-hover:bg-blue-500 group-hover:text-white transition-all">
                        <ArrowRight className="h-5 w-5" />
                      </div>
                    </div>
                  </div>

                  <div className="p-8 space-y-6 flex-1 flex flex-col">
                    <div className="space-y-1">
                      <p className="text-blue-600 font-black uppercase text-[9px] tracking-[0.3em]">
                        {res.category || "PREMIUM UNIT"}
                      </p>
                      <h2 className="text-3xl font-black italic uppercase tracking-tighter text-slate-950 group-hover:text-blue-600 transition-colors leading-none">
                        {res.name}
                      </h2>
                    </div>

                    {/* Section: Mesin Utama */}
                    <div className="space-y-2">
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic flex items-center gap-2">
                        <Gamepad2 className="h-3 w-3" /> Unit Utama:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {mainItems.length > 0 ? (
                          mainItems.map((item: any) => (
                            <Badge 
                              key={item.id} 
                              variant="secondary"
                              className="rounded-lg bg-slate-900 text-white text-[9px] font-bold uppercase italic py-1 px-3 border-none"
                            >
                              {item.name}
                            </Badge>
                          ))
                        ) : (
                          <p className="text-[9px] font-bold text-slate-300 uppercase italic">Tidak ada mesin</p>
                        )}
                      </div>
                    </div>

                    {/* Section: Addons */}
                    <div className="space-y-2 flex-1">
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic flex items-center gap-2">
                        <PlusCircle className="h-3 w-3" /> Tambahan:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {addonItems.length > 0 ? (
                          addonItems.slice(0, 3).map((item: any) => (
                            <Badge 
                              key={item.id} 
                              variant="outline" 
                              className="rounded-lg border-slate-100 bg-slate-50/50 text-[9px] font-bold uppercase italic py-1 px-3 text-slate-600 group-hover:border-blue-100 transition-colors"
                            >
                              {item.name}
                            </Badge>
                          ))
                        ) : (
                          <p className="text-[9px] font-bold text-slate-300 uppercase italic">Standar Only</p>
                        )}
                        {addonItems.length > 3 && (
                          <span className="text-[9px] font-black text-slate-300 flex items-center italic">+ {addonItems.length - 3} LAINNYA</span>
                        )}
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="pt-6 border-t border-slate-50 flex items-center justify-between mt-auto">
                      <div>
                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1 italic">Mulai Dari</p>
                        <p className="text-xl font-black italic tracking-tighter text-slate-900 leading-none">
                          Rp {getCheapestMainPrice(res.items).toLocaleString()}
                          <span className="text-[10px] font-bold text-slate-400 lowercase italic"> /jam</span>
                        </p>
                      </div>
                      <div className="h-12 w-12 rounded-2xl bg-slate-950 flex items-center justify-center text-white group-hover:bg-blue-600 transition-all shadow-lg group-hover:shadow-blue-200">
                        <ChevronRight className="h-5 w-5 stroke-[3]" />
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      </main>

      <footer className="text-center text-[9px] font-black uppercase tracking-[0.4em] text-slate-300 italic pt-10">
        © 2026 {params.tenant || "SAAS"} SYSTEM &bull; BATAM RACING ENGINE
      </footer>
    </div>
  );
}