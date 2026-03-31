"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
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
import { Plus, Loader2 } from "lucide-react";
import api from "@/lib/api";

export function AddResourceDialog({ onRefresh }: { onRefresh: () => void }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, reset } = useForm();

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      await api.post("/resources-all", data); // Menuju cfg.ResourceHandler.Create
      toast.success("Resource berhasil ditambahkan!");
      setOpen(false);
      reset();
      onRefresh();
    } catch (err) {
      toast.error("Gagal menambahkan resource");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="rounded-2xl h-12 bg-blue-600 font-bold px-6 shadow-lg shadow-blue-600/20">
          <Plus className="mr-2 h-5 w-5" /> Tambah Resource
        </Button>
      </DialogTrigger>
      <DialogContent className="rounded-[2rem] sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black uppercase italic tracking-tighter">
            New Resource
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pt-4">
          <div className="space-y-2">
            <Label className="font-bold text-slate-600">
              Nama (Contoh: Meja 01 / Studio A)
            </Label>
            <Input
              {...register("name", { required: true })}
              placeholder="Masukkan nama..."
              className="h-12 rounded-xl"
            />
          </div>
          <div className="space-y-2">
            <Label className="font-bold text-slate-600">
              Kategori (Contoh: VIP / Outdoor)
            </Label>
            <Input
              {...register("category")}
              placeholder="Contoh: Premium Room"
              className="h-12 rounded-xl"
            />
          </div>
          <Button
            type="submit"
            disabled={loading}
            className="w-full h-14 rounded-2xl bg-slate-900 font-black tracking-widest uppercase"
          >
            {loading ? <Loader2 className="animate-spin" /> : "CREATE RESOURCE"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
