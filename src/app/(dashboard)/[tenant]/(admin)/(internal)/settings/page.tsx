"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Save,
  MapPin,
  Clock,
  Camera,
  Loader2,
  X,
  Plus,
  ImageIcon,
  Smartphone,
  CheckCircle2,
} from "lucide-react";
import api from "@/lib/api";
import { uploadImage } from "@/lib/upload";
import { LandingPreview } from "@/components/dashboard/landing-preview";

export default function SettingsPage() {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState<string | null>(null);

  const { register, handleSubmit, reset, setValue, watch } = useForm({
    defaultValues: {
      name: "",
      slogan: "",
      address: "",
      open_time: "09:00",
      close_time: "21:00",
      logo_url: "",
      banner_url: "",
      gallery: [],
    },
  });

  // Watch semua data untuk dilempar ke LandingPreview
  const allData = watch();

  useEffect(() => {
    api.get("/admin/profile").then((res) => reset(res.data));
  }, [reset]);

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    field: string,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(field);
    try {
      const url = await uploadImage(file);
      setValue(field as any, url);
      toast.success("Gambar berhasil diupload ke S3!");
    } catch (err) {
      toast.error("Gagal upload gambar");
    } finally {
      setUploading(null);
    }
  };

  const handleAddGallery = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading("gallery");
    try {
      const url = await uploadImage(file);
      const currentGallery = watch("gallery") || [];
      setValue("gallery", [...currentGallery, url] as any);
    } catch (err) {
      toast.error("Gagal upload galeri");
    } finally {
      setUploading(null);
    }
  };

  const removeGalleryItem = (index: number) => {
    const currentGallery = watch("gallery") || [];
    setValue("gallery", currentGallery.filter((_, i) => i !== index) as any);
  };

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      await api.put("/admin/profile", data);
      toast.success("Profil Bisnis berhasil diperbarui secara permanen!");
    } catch (err) {
      toast.error("Gagal menyimpan profil");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto pb-20 animate-in fade-in duration-700">
      <div className="flex flex-col xl:flex-row gap-12 items-start">
        {/* SEKSI KIRI: FORM EDIT (70%) */}
        <div className="flex-1 space-y-10 w-full">
          <div className="flex justify-between items-center bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <div>
              <h1 className="text-4xl font-black tracking-tighter">
                Branding Editor
              </h1>
              <p className="text-slate-500 font-medium mt-1">
                Sesuaikan tampilan landing page publik Anda.
              </p>
            </div>
            <Button
              onClick={handleSubmit(onSubmit)}
              disabled={loading}
              className="rounded-2xl h-14 px-8 bg-blue-600 hover:bg-blue-700 font-black text-lg shadow-xl shadow-blue-600/20 active:scale-95 transition-all"
            >
              {loading ? (
                <Loader2 className="animate-spin mr-2" />
              ) : (
                <Save className="mr-2 h-6 w-6" />
              )}
              PUBLISH CHANGES
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* LOGO & BANNER */}
            <Card className="rounded-[2.5rem] border-none shadow-sm p-8 bg-white">
              <CardTitle className="text-xl font-black mb-6 uppercase tracking-widest text-blue-600">
                Assets
              </CardTitle>
              <div className="space-y-8">
                <div className="space-y-4">
                  <Label className="font-bold text-slate-700">
                    Logo Bisnis
                  </Label>
                  <div className="relative group h-32 w-32 rounded-[2rem] bg-slate-50 border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden transition-all hover:border-blue-400">
                    {allData.logo_url ? (
                      <img
                        src={allData.logo_url}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <Camera className="text-slate-300 h-8 w-8" />
                    )}
                    <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer text-white text-[10px] font-black uppercase tracking-widest">
                      {uploading === "logo_url"
                        ? "Uploading..."
                        : "Change Logo"}
                      <input
                        type="file"
                        className="hidden"
                        onChange={(e) => handleFileChange(e, "logo_url")}
                      />
                    </label>
                  </div>
                </div>

                <div className="space-y-4">
                  <Label className="font-bold text-slate-700">
                    Hero Banner
                  </Label>
                  <div className="relative group h-44 w-full rounded-[2rem] bg-slate-50 border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden transition-all hover:border-blue-400">
                    {allData.banner_url ? (
                      <img
                        src={allData.banner_url}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <ImageIcon className="text-slate-300 h-8 w-8" />
                    )}
                    <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer text-white text-[10px] font-black uppercase tracking-widest">
                      {uploading === "banner_url"
                        ? "Uploading..."
                        : "Upload Banner"}
                      <input
                        type="file"
                        className="hidden"
                        onChange={(e) => handleFileChange(e, "banner_url")}
                      />
                    </label>
                  </div>
                </div>
              </div>
            </Card>

            {/* INFO BISNIS */}
            <Card className="rounded-[2.5rem] border-none shadow-sm p-8 bg-white">
              <CardTitle className="text-xl font-black mb-6 uppercase tracking-widest text-blue-600">
                Business Info
              </CardTitle>
              <div className="space-y-5">
                <div className="space-y-2">
                  <Label className="font-bold">Nama Brand</Label>
                  <Input
                    {...register("name")}
                    className="h-12 rounded-xl bg-slate-50 border-none font-medium focus:ring-2 focus:ring-blue-600"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="font-bold">Slogan Catchy</Label>
                  <Input
                    {...register("slogan")}
                    className="h-12 rounded-xl bg-slate-50 border-none font-medium focus:ring-2 focus:ring-blue-600"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="font-bold">Alamat Fisik</Label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-blue-500" />
                    <Input
                      {...register("address")}
                      className="h-12 pl-12 rounded-xl bg-slate-50 border-none font-medium focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="space-y-2">
                    <Label className="text-xs font-black uppercase text-slate-400">
                      Jam Buka
                    </Label>
                    <Input
                      type="time"
                      {...register("open_time")}
                      className="h-12 rounded-xl bg-slate-50 border-none font-bold"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-black uppercase text-slate-400">
                      Jam Tutup
                    </Label>
                    <Input
                      type="time"
                      {...register("close_time")}
                      className="h-12 rounded-xl bg-slate-50 border-none font-bold"
                    />
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* GALLERY SECTION */}
          <Card className="rounded-[2.5rem] border-none shadow-sm p-8 bg-white">
            <div className="flex justify-between items-center mb-8">
              <CardTitle className="text-xl font-black uppercase tracking-widest text-blue-600">
                Gallery Portfolio
              </CardTitle>
              <label className="cursor-pointer h-10 px-6 rounded-xl bg-blue-50 text-blue-600 flex items-center gap-2 font-black text-xs hover:bg-blue-100 transition-all active:scale-95">
                <Plus className="h-4 w-4" /> ADD PHOTO
                <input
                  type="file"
                  className="hidden"
                  onChange={handleAddGallery}
                  disabled={uploading === "gallery"}
                />
              </label>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
              {allData.gallery?.map((url: string, idx: number) => (
                <div
                  key={idx}
                  className="relative aspect-square rounded-[2rem] overflow-hidden group border border-slate-100 shadow-sm"
                >
                  <img
                    src={url}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <button
                    onClick={() => removeGalleryItem(idx)}
                    className="absolute top-3 right-3 bg-red-500 text-white p-2 rounded-xl opacity-0 group-hover:opacity-100 transition-all hover:bg-red-600 shadow-lg"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
              {uploading === "gallery" && (
                <div className="aspect-square rounded-[2rem] bg-slate-50 border-2 border-dashed border-blue-200 flex flex-col items-center justify-center text-blue-400">
                  <Loader2 className="animate-spin h-6 w-6 mb-2" />
                  <span className="text-[10px] font-black uppercase tracking-widest">
                    Uploading...
                  </span>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* SEKSI KANAN: PREVIEW (30%) - Hidden on Mobile */}
        <div className="hidden xl:block w-[380px] sticky top-8">
          <LandingPreview data={allData} />
        </div>
      </div>
    </div>
  );
}
