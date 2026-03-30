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
  const tenant = params.tenant as string;

  const routes = [
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      href: `/${tenant}`,
      active: pathname === `/${tenant}`,
    },
    {
      label: "Bookings",
      icon: CalendarDays,
      href: `/${tenant}/bookings`,
      active: pathname === `/${tenant}/bookings`,
    },
    {
      label: "POS / Kasir",
      icon: MonitorPlay,
      href: `/${tenant}/pos`,
      active: pathname === `/${tenant}/pos`,
    },
    {
      label: "Resources",
      icon: Box,
      href: `/${tenant}/resources`,
      active: pathname === `/${tenant}/resources`,
    },
    {
      label: "Customers",
      icon: Users,
      href: `/${tenant}/customers`,
      active: pathname === `/${tenant}/customers`,
    },
  ];

  return (
    <div className="flex h-full flex-col bg-white border-r border-slate-100 selection:bg-blue-500/30">
      {/* Logo Section */}
      <div className="flex h-20 items-center px-8 border-b border-slate-50">
        <Link href={`/${tenant}`} className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 font-black text-white text-sm">
            B
          </div>
          <span className="text-lg font-black tracking-tighter text-slate-900">
            {tenant.toUpperCase()}
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
                ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
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
          href={`/${tenant}/settings`}
          className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-slate-500 hover:bg-slate-50 hover:text-blue-600 transition-all"
        >
          <Settings className="h-5 w-5 text-slate-400" />
          Settings
        </Link>
        <button
          className="w-full flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-red-500 hover:bg-red-50 transition-all"
          onClick={() => {
            // Logic Logout (Hapus Cookie)
            document.cookie =
              "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
            window.location.href = `/${tenant}/login`;
          }}
        >
          <LogOut className="h-5 w-5" />
          Logout
        </button>
      </div>
    </div>
  );
}
