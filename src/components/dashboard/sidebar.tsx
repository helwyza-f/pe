"use client";

import Link from "next/link";
import { usePathname, useParams } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  CalendarDays,
  Users,
  Box,
  MonitorPlay,
  Settings,
  LogOut,
} from "lucide-react";

export function Sidebar() {
  const pathname = usePathname();
  const params = useParams();

  // Ambil tenant untuk keperluan UI saja (Label Logo),
  // tapi jangan dipakai di URL href jika sudah pakai subdomain.
  const tenant = params.tenant as string;

  const routes = [
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      href: "/dashboard", // Cukup arahkan ke path aslinya
      active: pathname === "/dashboard" || pathname === `/${tenant}/dashboard`,
    },
    {
      label: "Bookings",
      icon: CalendarDays,
      href: "/bookings",
      active: pathname === "/bookings" || pathname === `/${tenant}/bookings`,
    },
    {
      label: "POS / Kasir",
      icon: MonitorPlay,
      href: "/pos",
      active: pathname === "/pos" || pathname === `/${tenant}/pos`,
    },
    {
      label: "Resources",
      icon: Box,
      href: "/resources",
      active: pathname === "/resources" || pathname === `/${tenant}/resources`,
    },
    {
      label: "Customers",
      icon: Users,
      href: "/customers",
      active: pathname === "/customers" || pathname === `/${tenant}/customers`,
    },
  ];

  return (
    <div className="flex h-full flex-col bg-white border-r border-slate-100 selection:bg-blue-500/30">
      {/* Logo Section */}
      <div className="flex h-20 items-center px-8 border-b border-slate-50">
        <Link href="/" className="group flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 transition-transform group-hover:rotate-6 shadow-lg shadow-blue-600/20">
            <span className="font-black text-white text-xs">B</span>
          </div>
          <span className="text-lg font-black tracking-tighter text-slate-900 uppercase">
            {tenant}
          </span>
        </Link>
      </div>

      {/* Nav Links */}
      <div className="flex flex-col flex-1 gap-2 p-4 pt-6">
        {routes.map((route) => (
          <Link
            key={route.href}
            href={route.href}
            className={cn(
              "group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition-all duration-200",
              route.active
                ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20 translate-x-1"
                : "text-slate-500 hover:bg-slate-50 hover:text-blue-600",
            )}
          >
            <route.icon
              className={cn(
                "h-5 w-5",
                route.active
                  ? "text-white"
                  : "text-slate-400 group-hover:text-blue-600",
              )}
            />
            {route.label}
          </Link>
        ))}
      </div>

      {/* Footer Sidebar (Settings & Logout) */}
      <div className="p-4 border-t border-slate-50 space-y-2">
        <Link
          href="/settings"
          className={cn(
            "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition-all",
            pathname === "/settings" || pathname === `/${tenant}/settings`
              ? "bg-slate-900 text-white shadow-lg"
              : "text-slate-500 hover:bg-slate-50 hover:text-blue-600",
          )}
        >
          <Settings className="h-5 w-5" />
          Settings
        </Link>
        <button
          className="w-full flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-red-500 hover:bg-red-50 transition-all active:scale-95"
          onClick={() => {
            // Hapus Cookie
            document.cookie =
              "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
            // Redirect ke login publik tenant
            window.location.href = "/login";
          }}
        >
          <LogOut className="h-5 w-5" />
          Logout
        </button>
      </div>
    </div>
  );
}
