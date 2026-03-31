"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
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
} from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";

export default function ResourceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  // State Form
  const [name, setName] = useState("");
  const [displayPrice, setDisplayPrice] = useState("");
  const [rawPrice, setRawPrice] = useState(0);
  const [isDefault, setIsDefault] = useState(false);

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

  useEffect(() => {
    fetchItems();
  }, []);

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
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name,
      price_per_hour: rawPrice,
      is_default: isDefault,
      item_type: "addon",
    };

    try {
      if (editingItem) {
        await api.put(`/resources-all/items/${editingItem.id}`, payload);
        toast.success("Item berhasil diperbarui");
      } else {
        await api.post(`/resources-all/${params.id}/items`, payload);
        toast.success("Item baru ditambahkan");
      }
      setOpen(false);
      fetchItems();
      resetForm();
    } catch (err) {
      toast.error("Gagal menyimpan data");
    }
  };

  const handleSetDefault = async (item: any) => {
    try {
      await api.put(`/resources-all/items/${item.id}`, {
        ...item,
        is_default: true,
      });
      toast.success(`${item.name} sekarang jadi Aset Utama`);
      fetchItems();
    } catch (err) {
      toast.error("Gagal mengubah status");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus barang ini?")) return;
    try {
      await api.delete(`/resources-all/items/${id}`);
      toast.success("Berhasil dihapus");
      fetchItems();
    } catch (err) {
      toast.error("Gagal hapus");
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20 animate-in fade-in duration-500">
      {/* HEADER */}
      <div className="flex justify-between items-center border-b border-slate-100 pb-8">
        <div className="space-y-2">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="font-black text-slate-400 uppercase text-[10px] tracking-widest p-0 h-auto hover:bg-transparent"
          >
            <ArrowLeft className="mr-1 h-3 w-3" /> Kembali
          </Button>
          <h1 className="text-4xl font-black italic uppercase tracking-tighter text-slate-900 leading-none">
            Inventory <span className="text-blue-600">Unit</span>
          </h1>
        </div>

        <Dialog
          open={open}
          onOpenChange={(v) => {
            setOpen(v);
            if (!v) resetForm();
          }}
        >
          <DialogTrigger asChild>
            <Button className="h-14 px-8 rounded-2xl bg-blue-600 font-black uppercase tracking-widest text-[11px] shadow-lg shadow-blue-200">
              <Plus className="mr-2 h-5 w-5 stroke-[3]" /> Tambah Barang
            </Button>
          </DialogTrigger>
          <DialogContent className="rounded-[2.5rem] p-10 sm:max-w-[450px]">
            <DialogHeader>
              <DialogTitle className="text-2xl font-black italic uppercase tracking-tighter">
                {editingItem ? "Edit Barang" : "Barang Baru"}
              </DialogTitle>
              <DialogDescription className="text-xs italic font-medium">
                Input detail fasilitas ruangan.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSave} className="space-y-6 pt-4">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase text-slate-400 px-1">
                  Nama Barang
                </Label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Contoh: PS5 Slim"
                  className="h-12 rounded-xl font-bold bg-slate-50 border-none"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase text-slate-400 px-1">
                  Harga per Jam
                </Label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-blue-600">
                    Rp
                  </span>
                  <Input
                    value={displayPrice}
                    onChange={(e) => handlePriceChange(e.target.value)}
                    placeholder="0"
                    className="h-12 pl-12 rounded-xl font-black text-lg bg-slate-50 border-none"
                    required
                  />
                </div>
              </div>
              <div className="flex items-center space-x-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <input
                  type="checkbox"
                  id="def"
                  checked={isDefault}
                  onChange={(e) => setIsDefault(e.target.checked)}
                  className="h-5 w-5 rounded-lg border-slate-300 text-blue-600"
                />
                <Label
                  htmlFor="def"
                  className="text-[11px] font-black uppercase text-slate-600 leading-none cursor-pointer"
                >
                  Jadikan Aset Utama
                </Label>
              </div>
              <Button className="w-full h-14 rounded-2xl bg-slate-900 font-black uppercase tracking-widest text-xs">
                SIMPAN DATA
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* LIST ITEMS - LEBIH COMPACT */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {loading ? (
          <div className="col-span-full h-40 flex items-center justify-center">
            <Loader2 className="animate-spin text-blue-600" />
          </div>
        ) : items.length > 0 ? (
          items.map((item) => (
            <Card
              key={item.id}
              className={`group rounded-3xl border-none p-5 transition-all duration-300 ${item.is_default ? "bg-white ring-2 ring-blue-600 shadow-xl shadow-blue-100" : "bg-slate-50 hover:bg-white hover:shadow-lg"}`}
            >
              <div className="flex items-start justify-between mb-4">
                <div
                  className={`h-12 w-12 rounded-2xl flex items-center justify-center ${item.is_default ? "bg-blue-600 text-white" : "bg-white text-slate-300"}`}
                >
                  {item.is_default ? (
                    <Layers className="h-6 w-6" />
                  ) : (
                    <Zap className="h-6 w-6" />
                  )}
                </div>
                <div className="flex gap-1">
                  {!item.is_default && (
                    <Button
                      onClick={() => handleSetDefault(item)}
                      variant="ghost"
                      className="h-8 w-8 p-0 text-slate-300 hover:text-yellow-500 rounded-lg"
                    >
                      <Star className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    onClick={() => {
                      setEditingItem(item);
                      setName(item.name);
                      setRawPrice(item.price_per_hour);
                      setDisplayPrice(formatIDR(item.price_per_hour));
                      setIsDefault(item.is_default);
                      setOpen(true);
                    }}
                    variant="ghost"
                    className="h-8 w-8 p-0 text-slate-300 hover:text-blue-600 rounded-lg"
                  >
                    <Edit3 className="h-4 w-4" />
                  </Button>
                  <Button
                    onClick={() => handleDelete(item.id)}
                    variant="ghost"
                    className="h-8 w-8 p-0 text-slate-300 hover:text-red-500 rounded-lg"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-black uppercase italic text-slate-900 truncate">
                    {item.name}
                  </h4>
                  {item.is_default && (
                    <Badge className="bg-blue-100 text-blue-700 text-[8px] font-black px-1.5 py-0">
                      UTAMA
                    </Badge>
                  )}
                </div>
                <p className="text-sm font-black text-blue-600">
                  Rp {formatIDR(item.price_per_hour)}{" "}
                  <span className="text-[10px] text-slate-400 italic">
                    / jam
                  </span>
                </p>
              </div>
            </Card>
          ))
        ) : (
          <div className="col-span-full py-20 text-center bg-slate-50 rounded-[2.5rem] border-2 border-dashed border-slate-100">
            <Package className="h-10 w-10 text-slate-200 mx-auto mb-2" />
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">
              Belum ada barang
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
