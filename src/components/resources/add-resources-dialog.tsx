"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Loader2, Info } from "lucide-react";
import api from "@/lib/api";
import { Badge } from "../ui/badge";

export function AddResourceDialog({ onRefresh }: { onRefresh: () => void }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const { register, handleSubmit, reset, setValue } = useForm({
    defaultValues: {
      name: "",
      category: ""
    }
  });

  const onSubmit = async (data: any) => {
    setLoading(true);
    // Memastikan data yang dikirim ke API juga uppercase
    const payload = {
      name: data.name.toUpperCase(),
      category: data.category ? data.category.toUpperCase() : ""
    };

    try {
      await api.post("/resources-all", payload);
      toast.success("RESOURCE BERHASIL DITAMBAHKAN!");
      setOpen(false);
      reset();
      onRefresh();
    } catch (err) {
      toast.error("GAGAL MENAMBAHKAN RESOURCE");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="rounded-2xl h-12 bg-blue-600 font-black px-8 shadow-xl shadow-blue-600/20 transition-all hover:scale-105 active:scale-95 uppercase italic tracking-widest text-[11px]">
          <Plus className="mr-2 h-4 w-4 stroke-[3]" /> TAMBAH RESOURCE
        </Button>
      </DialogTrigger>
      <DialogContent className="rounded-[2.5rem] sm:max-w-[450px] border-none p-10 shadow-2xl">
        <DialogHeader className="space-y-2">
          <DialogTitle className="text-3xl font-black uppercase italic tracking-tighter leading-none">
            REGISTER <span className="text-blue-600">UNIT</span>
          </DialogTitle>
          <DialogDescription className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">
            Tambahkan aset fisik baru ke sistem reservasi Anda.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 pt-6">
          {/* INPUT NAMA */}
          <div className="space-y-3">
            <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 px-1 italic">
              NAMA UNIT / RUANGAN
            </Label>
            <Input
              {...register("name", { required: true })}
              placeholder="CONTOH: MEJA 01 / STUDIO A"
              onChange={(e) => setValue("name", e.target.value.toUpperCase())}
              className="h-14 rounded-2xl bg-slate-50 border-none font-black text-slate-900 px-6 focus:ring-4 focus:ring-blue-600/10 text-lg tracking-tight transition-all"
              required
            />
          </div>

          {/* INPUT KATEGORI - OPTIONAL */}
          <div className="space-y-3">
            <div className="flex justify-between items-center px-1">
              <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 italic">
                KATEGORI UNIT
              </Label>
              <Badge variant="outline" className="text-[8px] font-black uppercase border-slate-200 text-slate-400 px-2 py-0">
                OPSIONAL
              </Badge>
            </div>
            <Input
              {...register("category")}
              placeholder="CONTOH: VIP / OUTDOOR / REGULER"
              onChange={(e) => setValue("category", e.target.value.toUpperCase())}
              className="h-14 rounded-2xl bg-slate-50 border-none font-black text-slate-900 px-6 focus:ring-4 focus:ring-blue-600/10 text-lg tracking-tight transition-all"
            />
            <p className="text-[9px] text-slate-400 italic px-2 flex items-center gap-1">
              <Info className="h-3 w-3 text-blue-500" /> Gunakan kategori untuk mengelompokkan aset serupa.
            </p>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-16 rounded-[2rem] bg-slate-900 hover:bg-black font-black tracking-[0.2em] uppercase italic text-xs shadow-2xl transition-all active:scale-95 border-b-8 border-slate-700"
          >
            {loading ? (
              <Loader2 className="animate-spin h-6 w-6" />
            ) : (
              "CREATE NEW RESOURCE"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}