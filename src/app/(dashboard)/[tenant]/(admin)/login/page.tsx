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

  const tenantSlug = params.tenant as string;

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      const res = await api.post("/login", {
        email: data.email,
        password: data.password,
        tenant_slug: tenantSlug,
      });

      setCookie("auth_token", res.data.token, {
        maxAge: 60 * 60 * 24 * 7,
        path: "/",
      });

      toast.success("Login Berhasil!");

      // REDIRECT KE PATH KHUSUS DASHBOARD
      router.push(`/dashboard`);
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Login Gagal.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <Card className="w-full max-w-[420px] border-none shadow-[0_32px_64px_-15px_rgba(0,0,0,0.1)] rounded-[2.5rem] p-4">
        <CardHeader className="space-y-4 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 shadow-xl shadow-blue-600/20">
            <Lock className="h-8 w-8 text-white" />
          </div>
          <div>
            <CardTitle className="text-3xl font-black tracking-tight">
              Admin Login
            </CardTitle>
            <CardDescription className="font-bold uppercase text-blue-600 text-xs tracking-[0.2em] mt-2">
              Panel {tenantSlug}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label className="font-bold ml-1">Email Admin</Label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <Input
                  type="email"
                  placeholder="admin@email.com"
                  className="h-13 pl-12 rounded-xl border-slate-200"
                  {...register("email")}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="font-bold ml-1">Password</Label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <Input
                  type="password"
                  placeholder="••••••••"
                  className="h-13 pl-12 rounded-xl border-slate-200"
                  {...register("password")}
                  required
                />
              </div>
            </div>
            <Button
              className="w-full h-14 rounded-2xl bg-blue-600 text-lg font-bold shadow-xl shadow-blue-600/20 hover:bg-blue-700 transition-all active:scale-95"
              disabled={loading}
            >
              {loading ? "Memverifikasi..." : "Masuk ke Dashboard"}
              {!loading && <ArrowRight className="ml-2 h-5 w-5" />}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
