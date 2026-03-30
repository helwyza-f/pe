"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  Users,
  CalendarCheck,
  DollarSign,
  ArrowUpRight,
} from "lucide-react";

export default function TenantDashboardSummary() {
  // Data dummy dulu sebelum kita connect ke API summary Go
  const stats = [
    {
      title: "Total Revenue",
      value: "Rp 2.450.000",
      icon: DollarSign,
      desc: "+12% dari kemarin",
      color: "text-emerald-600",
    },
    {
      title: "Active Bookings",
      value: "18",
      icon: CalendarCheck,
      desc: "7 meja sedang terpakai",
      color: "text-blue-600",
    },
    {
      title: "New Customers",
      value: "24",
      icon: Users,
      desc: "Minggu ini",
      color: "text-indigo-600",
    },
    {
      title: "Occupancy Rate",
      value: "85%",
      icon: TrendingUp,
      desc: "Sangat Ramai",
      color: "text-orange-600",
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header Dashboard */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-black tracking-tight text-slate-900">
          Dashboard Overview
        </h1>
        <p className="text-slate-500 font-medium">
          Pantau performa bisnis Anda secara real-time.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card
            key={stat.title}
            className="border-none shadow-sm rounded-3xl overflow-hidden group hover:shadow-md transition-all"
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-400">
                {stat.title}
              </CardTitle>
              <div
                className={`p-2 rounded-xl bg-slate-50 group-hover:scale-110 transition-transform`}
              >
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-black text-slate-900">
                {stat.value}
              </div>
              <div className="flex items-center gap-1 mt-1">
                <Badge
                  variant="outline"
                  className="text-[10px] border-none bg-emerald-50 text-emerald-600 font-bold px-1.5 py-0"
                >
                  <ArrowUpRight className="h-3 w-3 mr-0.5" />
                  {stat.desc}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Placeholder untuk Chart atau Recent Activity */}
      <div className="grid gap-6 md:grid-cols-7">
        <Card className="col-span-4 border-none shadow-sm rounded-[2rem] p-6 h-80 flex items-center justify-center bg-white">
          <p className="text-slate-300 font-bold uppercase tracking-widest">
            Revenue Chart Placeholder
          </p>
        </Card>
        <Card className="col-span-3 border-none shadow-sm rounded-[2rem] p-6 h-80 flex items-center justify-center bg-white">
          <p className="text-slate-300 font-bold uppercase tracking-widest">
            Recent Activity
          </p>
        </Card>
      </div>
    </div>
  );
}
