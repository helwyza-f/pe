"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useParams, useRouter } from "next/navigation";
import { setCookie } from "cookies-next";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Lock, Mail, ArrowRight } from "lucide-react";
import api from "@/lib/api";

export default function TenantLoginPage() {
  const [loading, setLoading] = useState(false);
  const params = useParams();
  const router = useRouter();
  const { register, handleSubmit } = useForm();

  // Nama tenant dari URL (misal: 'minibos')
  const tenantName = params.tenant as string;

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      const res = await api.post("/login", {
        email: data.email,
        password: data.password,
        tenant_slug: tenantName, // Kirim slug ke Go untuk validasi kepemilikan
      });

      // Simpan JWT ke Cookie (berlaku 7 hari)
      setCookie("auth_token", res.data.token, {
        maxAge: 60 * 60 * 24 * 7,
        path: "/",
        // Jika sudah production, tambahkan domain: ".bookinaja.com"
      });

      toast.success(`Selamat datang kembali di ${tenantName.toUpperCase()}!`);

      // Redirect ke Dashboard Utama tenant
      router.push(`/${tenantName}`);
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Email atau password salah.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12 selection:bg-blue-500/30">
      <Card className="w-full max-w-[400px] border-none shadow-[0_20px_50px_rgba(0,0,0,0.05)] rounded-[2rem] p-4">
        <CardHeader className="space-y-4 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 shadow-lg shadow-blue-500/20">
            <Lock className="h-8 w-8 text-white" />
          </div>
          <div className="space-y-1">
            <CardTitle className="text-2xl font-black tracking-tight">
              Admin Login
            </CardTitle>
            <CardDescription className="text-sm font-medium">
              Masuk ke panel{" "}
              <span className="text-blue-600 font-bold uppercase tracking-wider">
                {tenantName}
              </span>
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@email.com"
                  className="h-12 pl-10 rounded-xl border-slate-200"
                  {...register("email")}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <button
                  type="button"
                  className="text-xs font-bold text-blue-600 hover:underline"
                >
                  Lupa?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="h-12 pl-10 rounded-xl border-slate-200"
                  {...register("password")}
                  required
                />
              </div>
            </div>
            <Button
              className="w-full h-12 rounded-xl bg-blue-600 font-bold shadow-lg shadow-blue-600/20 hover:bg-blue-700 active:scale-95 transition-all"
              disabled={loading}
            >
              {loading ? "Memverifikasi..." : "Masuk ke Dashboard"}
              {!loading && <ArrowRight className="ml-2 h-4 w-4" />}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
