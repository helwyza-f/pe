"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Sparkles } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils"; // Pastikan util ini ada (bawaan shadcn)

export default function PricingPage() {
  const [isAnnual, setIsAnnual] = useState(true);

  const plans = [
    {
      name: "Starter",
      price: isAnnual ? "0" : "0",
      desc: "Untuk individu atau bisnis yang baru memulai digitalisasi.",
      features: [
        "1 Resource / Spot",
        "50 Reservasi / bulan",
        "Subdomain bookinaja.com",
        "Email Support",
      ],
      cta: "Mulai Gratis",
      popular: false,
    },
    {
      name: "Professional",
      price: isAnnual ? "119k" : "149k",
      desc: "Solusi lengkap untuk bisnis yang sedang bertumbuh pesat.",
      features: [
        "Unlimited Resources",
        "Reservasi Tanpa Batas",
        "Dashboard Analytics Pro",
        "Integrasi WhatsApp Notif",
        "Prioritas Support 24/7",
      ],
      cta: "Coba Pro Gratis",
      popular: true,
    },
    {
      name: "Enterprise",
      price: "Custom",
      desc: "Keamanan dan kontrol penuh untuk jaringan bisnis skala besar.",
      features: [
        "Custom Domain (bisnisanda.com)",
        "White-label Branding",
        "Multi-user Admin Role",
        "Dedicated Database",
        "SLA & Account Manager",
      ],
      cta: "Hubungi Sales",
      popular: false,
    },
  ];

  return (
    <section className="relative flex-1 flex flex-col items-center justify-center py-20 overflow-hidden">
      {/* Background Decorative Blobs */}
      <div className="absolute top-0 -z-10 h-full w-full bg-white">
        <div className="absolute bottom-auto left-auto right-0 top-0 h-[500px] w-[500px] -translate-x-[30%] translate-y-[20%] rounded-full bg-[rgba(173,109,244,0.05)] opacity-50 blur-[80px]"></div>
        <div className="absolute bottom-0 left-0 right-auto top-auto h-[500px] w-[500px] translate-x-[30%] -translate-y-[20%] rounded-full bg-[rgba(100,180,244,0.05)] opacity-50 blur-[80px]"></div>
      </div>

      <div className="container px-4">
        {/* Header Section */}
        <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-6 text-center mb-16">
          <Badge
            variant="outline"
            className="border-primary/20 bg-primary/5 text-primary px-4 py-1"
          >
            Harga Fleksibel
          </Badge>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl">
            Pilih Paket yang <br />{" "}
            <span className="text-primary">Tumbuh Bersama Anda</span>
          </h1>
          <p className="max-w-[85%] text-lg text-muted-foreground">
            Tanpa biaya tersembunyi. Batalkan kapan saja. Mulai dengan gratis,
            upgrade saat Anda siap mendominasi pasar.
          </p>

          {/* Toggle Billing */}
          <div className="flex items-center gap-4 mt-4">
            <span
              className={cn("text-sm font-medium", !isAnnual && "text-primary")}
            >
              Bulanan
            </span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className="relative h-6 w-11 rounded-full bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <div
                className={cn(
                  "absolute left-1 top-1 h-4 w-4 rounded-full bg-white transition-all",
                  isAnnual && "left-6",
                )}
              />
            </button>
            <span
              className={cn("text-sm font-medium", isAnnual && "text-primary")}
            >
              Tahunan{" "}
              <Badge className="ml-1 bg-green-500/10 text-green-600 hover:bg-green-500/10 border-none">
                -20%
              </Badge>
            </span>
          </div>
        </div>

        {/* Cards Grid */}
        <div className="grid w-full gap-8 lg:grid-cols-3 items-stretch">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={cn(
                "relative flex flex-col rounded-3xl border bg-card p-8 transition-all hover:shadow-2xl hover:-translate-y-1",
                plan.popular
                  ? "border-primary shadow-xl ring-1 ring-primary/20 bg-gradient-to-b from-primary/[0.02] to-transparent"
                  : "border-border/50 shadow-sm",
              )}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 rounded-full bg-primary px-4 py-1 text-sm font-bold text-primary-foreground shadow-lg">
                  <Sparkles className="h-3.5 w-3.5" />
                  PALING POPULER
                </div>
              )}

              <div className="mb-8">
                <h3 className="text-xl font-bold">{plan.name}</h3>
                <p className="mt-2 text-sm text-muted-foreground min-h-[40px]">
                  {plan.desc}
                </p>
              </div>

              <div className="mb-8 flex items-baseline gap-1">
                <span className="text-5xl font-extrabold tracking-tight">
                  {plan.price === "Custom" ? "" : "Rp "}
                  {plan.price}
                </span>
                {plan.price !== "Custom" && (
                  <span className="text-muted-foreground font-medium">
                    /bulan
                  </span>
                )}
              </div>

              <div className="flex-1 space-y-4 mb-8">
                <p className="text-sm font-bold uppercase tracking-wider text-muted-foreground/80">
                  Fitur Utama:
                </p>
                <ul className="space-y-3">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-3 text-sm">
                      <div className="mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <Check className="h-3 w-3" />
                      </div>
                      <span className="text-muted-foreground/90 font-medium">
                        {f}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <Link href="/register" className="w-full">
                <Button
                  className={cn(
                    "w-full h-12 text-md font-bold rounded-xl transition-all",
                    plan.popular
                      ? "shadow-lg shadow-primary/20 hover:shadow-primary/30"
                      : "",
                  )}
                  variant={plan.popular ? "default" : "outline"}
                >
                  {plan.cta}
                </Button>
              </Link>
            </div>
          ))}
        </div>

        {/* Trust Footer */}
        <p className="mt-12 text-center text-sm text-muted-foreground">
          Butuh konsultasi khusus?{" "}
          <Link href="#" className="text-primary underline underline-offset-4">
            Hubungi tim kami
          </Link>
        </p>
      </div>
    </section>
  );
}
