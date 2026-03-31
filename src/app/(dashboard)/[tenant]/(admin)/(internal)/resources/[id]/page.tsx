"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  ArrowLeft,
  Plus,
  Trash2,
  Loader2,
  Zap,
  Layers,
  Package,
  Edit3,
  Star,
  Gamepad2,
  PlusCircle,
} from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";
import { cn } from "@/lib/utils";

export default function ResourceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  const [name, setName] = useState("");
  const [displayPrice, setDisplayPrice] = useState("");
  const [rawPrice, setRawPrice] = useState(0);
  const [isDefault, setIsDefault] = useState(false);
  const [itemType, setItemType] = useState("main");

  const fetchItems = async () => {
    try {
      const res = await api.get(`/resources-all/${params.id}/items`);
      setItems(res.data || []);
    } catch (err) {
      toast.error("Gagal sinkron data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchItems(); }, []);

  const formatIDR = (val: number) => new Intl.NumberFormat("id-ID").format(val);

  const handlePriceChange = (val: string) => {
    const numeric = parseInt(val.replace(/\D/g, "")) || 0;
    setRawPrice(numeric);
    setDisplayPrice(formatIDR(numeric));
  };

  const resetForm = () => {
    setEditingItem(null);
    setName("");
    setDisplayPrice("");
    setRawPrice(0);
    setIsDefault(false);
    setItemType("main");
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name: name.toUpperCase(),
      price_per_hour: rawPrice,
      is_default: itemType === "addon" ? false : isDefault,
      item_type: itemType,
    };

    try {
      if (editingItem) {
        await api.put(`/resources-all/items/${editingItem.id}`, payload);
        toast.success("BERHASIL UPDATE!");
      } else {
        await api.post(`/resources-all/${params.id}/items`, payload);
        toast.success("BERHASIL TAMBAH!");
      }
      setOpen(false);
      fetchItems();
      resetForm();
    } catch (err) {
      toast.error("GAGAL SIMPAN");
    }
  };

  const handleSetDefault = async (item: any) => {
    try {
      await api.put(`/resources-all/items/${item.id}`, { ...item, is_default: true });
      toast.success("DEFAULT UPDATED");
      fetchItems();
    } catch (err) {
      toast.error("GAGAL UPDATE");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus barang?")) return;
    try {
      await api.delete(`/resources-all/items/${id}`);
      toast.success("DIHAPUS");
      fetchItems();
    } catch (err) {
      toast.error("GAGAL");
    }
  };

  const mainItems = items.filter(i => i.item_type === "main");
  const addonItems = items.filter(i => i.item_type === "addon");

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-10 animate-in fade-in duration-500 font-sans px-4">
      
      {/* HEADER: Downscaled height & spacing */}
      <div className="flex justify-between items-center border-b border-slate-100 pb-6">
        <div className="space-y-1">
          <Button variant="ghost" onClick={() => router.back()} className="font-black text-slate-400 uppercase text-[9px] tracking-widest p-0 h-auto hover:bg-transparent hover:text-blue-600">
            <ArrowLeft className="mr-1 h-3 w-3" /> KEMBALI
          </Button>
          <h1 className="text-3xl font-black italic uppercase tracking-tighter text-slate-900 leading-none">
            KONFIGURASI <span className="text-blue-600 font-black">UNIT</span>
          </h1>
        </div>

        <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) resetForm(); }}>
          <DialogTrigger asChild>
            <Button className="h-12 px-6 rounded-xl bg-blue-600 font-black uppercase tracking-widest text-[10px] shadow-lg shadow-blue-100 transition-all hover:scale-105 active:scale-95">
              <Plus className="mr-2 h-4 w-4 stroke-[3]" /> TAMBAH BARANG
            </Button>
          </DialogTrigger>
          <DialogContent className="rounded-[2rem] p-8 sm:max-w-[420px] border-none shadow-2xl">
            <DialogHeader className="space-y-2">
              <DialogTitle className="text-2xl font-black italic uppercase tracking-tighter">DATA <span className="text-blue-600">BARANG</span></DialogTitle>
              <DialogDescription className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">Input informasi aset inventaris.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSave} className="space-y-5 pt-4">
              <div className="space-y-1.5">
                <Label className="text-[9px] font-black uppercase tracking-widest text-slate-400 px-1 italic">NAMA BARANG</Label>
                <Input value={name} onChange={(e) => setName(e.target.value.toUpperCase())} placeholder="PS5 SLIM" className="h-12 rounded-xl font-bold bg-slate-50 border-none px-4 text-sm" required />
              </div>

              <div className="space-y-3">
                <Label className="text-[9px] font-black uppercase tracking-widest text-slate-400 px-1 italic">TIPE BARANG</Label>
                <RadioGroup value={itemType} onValueChange={setItemType} className="grid grid-cols-2 gap-3">
                  <div className="relative">
                    <RadioGroupItem value="main" id="main" className="peer sr-only" />
                    <Label htmlFor="main" className="flex flex-col items-center justify-center rounded-2xl border-2 border-slate-50 bg-slate-50 p-3 hover:bg-slate-100 peer-data-[state=checked]:border-blue-600 peer-data-[state=checked]:bg-blue-50 transition-all cursor-pointer">
                      <Gamepad2 className={cn("mb-1 h-5 w-5", itemType === 'main' ? "text-blue-600" : "text-slate-300")} />
                      <span className="text-[9px] font-black uppercase">UTAMA</span>
                    </Label>
                  </div>
                  <div className="relative">
                    <RadioGroupItem value="addon" id="addon" className="peer sr-only" />
                    <Label htmlFor="addon" className="flex flex-col items-center justify-center rounded-2xl border-2 border-slate-50 bg-slate-50 p-3 hover:bg-slate-100 peer-data-[state=checked]:border-orange-500 peer-data-[state=checked]:bg-orange-50 transition-all cursor-pointer">
                      <PlusCircle className={cn("mb-1 h-5 w-5", itemType === 'addon' ? "text-orange-500" : "text-slate-300")} />
                      <span className="text-[9px] font-black uppercase">TAMBAHAN</span>
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-1.5">
                <Label className="text-[9px] font-black uppercase tracking-widest text-slate-400 px-1 italic">HARGA PER JAM</Label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-blue-600 italic text-sm">Rp</span>
                  <Input value={displayPrice} onChange={(e) => handlePriceChange(e.target.value)} placeholder="0" className="h-12 pl-12 rounded-xl font-black text-base bg-slate-50 border-none shadow-inner" required />
                </div>
              </div>

              <div className={cn("flex items-center space-x-3 p-3.5 rounded-2xl border-2 border-dashed transition-all", itemType === 'addon' ? "opacity-30 bg-slate-50" : "bg-blue-50/50 border-blue-100")}>
                <input type="checkbox" id="def" disabled={itemType === 'addon'} checked={isDefault && itemType === 'main'} onChange={(e) => setIsDefault(e.target.checked)} className="h-4 w-4 rounded-md border-slate-300 text-blue-600" />
                <Label htmlFor="def" className="text-[10px] font-black uppercase italic tracking-tight text-slate-700 cursor-pointer leading-none">SET DEFAULT BOOKING</Label>
              </div>

              <Button className="w-full h-12 rounded-2xl bg-slate-900 hover:bg-black font-black uppercase tracking-widest text-[10px] shadow-lg transition-all active:scale-95">SIMPAN DATA</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* SEKSI 1: UTAMA */}
      <div className="space-y-5">
        <div className="flex items-center gap-3 px-2">
            <div className="h-1.5 w-10 bg-blue-600 rounded-full" />
            <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-900 italic">MAIN ASSETS</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mainItems.map((item) => (
                <Card key={item.id} className={cn("group rounded-[2rem] border-none p-5 transition-all duration-300", item.is_default ? "bg-white ring-2 ring-blue-600 shadow-xl shadow-blue-50" : "bg-white border border-slate-100 hover:shadow-lg")}>
                    <div className="flex items-start justify-between mb-4">
                        <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center shadow-inner", item.is_default ? "bg-blue-600 text-white rotate-2" : "bg-slate-50 text-slate-300")}>
                            <Layers className="h-5 w-5 stroke-[2.5]" />
                        </div>
                        <div className="flex gap-1.5">
                            {!item.is_default && (
                                <Button onClick={() => handleSetDefault(item)} variant="ghost" className="h-8 w-8 p-0 text-slate-300 hover:text-yellow-500 bg-slate-50/50 rounded-lg"><Star className="h-4 w-4" /></Button>
                            )}
                            <Button onClick={() => {
                                setEditingItem(item); setName(item.name); setItemType(item.item_type); setRawPrice(item.price_per_hour); setDisplayPrice(formatIDR(item.price_per_hour)); setIsDefault(item.is_default); setOpen(true);
                            }} variant="ghost" className="h-8 w-8 p-0 text-slate-300 hover:text-blue-600 bg-slate-50/50 rounded-lg"><Edit3 className="h-4 w-4" /></Button>
                            <Button onClick={() => handleDelete(item.id)} variant="ghost" className="h-8 w-8 p-0 text-slate-300 hover:text-red-500 bg-slate-50/50 rounded-lg"><Trash2 className="h-4 w-4" /></Button>
                        </div>
                    </div>
                    <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                            <h4 className="text-lg font-black uppercase italic tracking-tighter text-slate-900 truncate">{item.name}</h4>
                            {item.is_default && <Badge className="bg-blue-600 text-white border-none text-[7px] font-black px-1.5 py-0.5 rounded-md">MAIN</Badge>}
                        </div>
                        <p className="text-sm font-black text-blue-600 italic">Rp {formatIDR(item.price_per_hour)} <span className="text-[9px] text-slate-400 uppercase tracking-widest font-bold">/ JAM</span></p>
                    </div>
                </Card>
            ))}
        </div>
      </div>

      {/* SEKSI 2: TAMBAHAN */}
      <div className="space-y-5 pt-2">
        <div className="flex items-center gap-3 px-2">
            <div className="h-1.5 w-10 bg-orange-500 rounded-full" />
            <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-900 italic">ADD-ONS</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {addonItems.map((item) => (
                <Card key={item.id} className="group rounded-[2rem] border border-slate-100 p-5 bg-slate-50/30 hover:bg-white hover:shadow-lg transition-all duration-300">
                    <div className="flex items-start justify-between mb-4">
                        <div className="h-10 w-10 rounded-xl flex items-center justify-center bg-white text-slate-200 group-hover:text-orange-500 transition-colors shadow-inner">
                            <Zap className="h-5 w-5 stroke-[2.5]" />
                        </div>
                        <div className="flex gap-1.5">
                            <Button onClick={() => {
                                setEditingItem(item); setName(item.name); setItemType(item.item_type); setRawPrice(item.price_per_hour); setDisplayPrice(formatIDR(item.price_per_hour)); setIsDefault(item.is_default); setOpen(true);
                            }} variant="ghost" className="h-8 w-8 p-0 text-slate-300 hover:text-blue-600 bg-white rounded-lg"><Edit3 className="h-4 w-4" /></Button>
                            <Button onClick={() => handleDelete(item.id)} variant="ghost" className="h-8 w-8 p-0 text-slate-300 hover:text-red-500 bg-white rounded-lg"><Trash2 className="h-4 w-4" /></Button>
                        </div>
                    </div>
                    <div className="space-y-0.5">
                        <h4 className="text-lg font-black uppercase italic tracking-tighter text-slate-900 truncate">{item.name}</h4>
                        <p className="text-sm font-black text-orange-600 italic">Rp {formatIDR(item.price_per_hour)} <span className="text-[9px] text-slate-400 uppercase tracking-widest font-bold">/ JAM</span></p>
                    </div>
                </Card>
            ))}
        </div>
      </div>
    </div>
  );
}