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
  Zap,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (v: boolean) => void;
}

export function Sidebar({ isCollapsed, setIsCollapsed }: SidebarProps) {
  const pathname = usePathname();
  const params = useParams();
  const tenant = (params.tenant as string) || "HUB";

  const routes = [
    { label: "Dashboard", icon: LayoutDashboard, href: "/admin/dashboard" },
    { label: "Bookings", icon: CalendarDays, href: "/admin/bookings" },
    { label: "POS / Kasir", icon: MonitorPlay, href: "/admin/pos" },
    { label: "Resources", icon: Box, href: "/admin/resources" },
    { label: "Customers", icon: Users, href: "/admin/customers" },
  ];

  return (
    <div className="relative flex h-full flex-col bg-slate-950 font-sans border-r border-white/5">
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-10 z-[60] flex h-6 w-6 items-center justify-center rounded-full border border-white/10 bg-slate-900 text-white shadow-xl hover:bg-blue-600 transition-all active:scale-90"
      >
        {isCollapsed ? (
          <ChevronRight className="h-3 w-3" />
        ) : (
          <ChevronLeft className="h-3 w-3" />
        )}
      </button>

      <div
        className={cn(
          "flex h-24 items-center px-6 transition-all border-b border-white/5 shrink-0",
          isCollapsed ? "justify-center" : "justify-start bg-slate-900/40",
        )}
      >
        <Link href="/admin/dashboard" className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 shadow-lg border-b-4 border-blue-800">
            <Zap className="h-5 w-5 text-white fill-white" />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col animate-in fade-in slide-in-from-left-2 duration-300">
              <span className="text-sm font-black italic tracking-tighter text-white uppercase leading-none truncate w-32">
                {tenant}
              </span>
              <span className="text-[8px] font-black text-blue-500 uppercase tracking-[0.4em] mt-1">
                Management
              </span>
            </div>
          )}
        </Link>
      </div>

      <div className="flex flex-col flex-1 gap-2 p-3 pt-8 overflow-y-auto scrollbar-hide">
        {routes.map((route) => {
          const isActive = pathname.includes(route.href);

          return (
            <Tooltip key={route.href}>
              {/* Force tooltip tutup kalau sidebar tidak collapsed */}
              <TooltipTrigger asChild>
                <Link
                  href={route.href}
                  className={cn(
                    "group flex items-center transition-all duration-300",
                    isCollapsed
                      ? "h-12 w-12 justify-center mx-auto rounded-2xl"
                      : "px-5 py-4 w-full gap-4 rounded-2xl",
                    isActive
                      ? "bg-blue-600 text-white shadow-lg"
                      : "text-slate-500 hover:bg-white/5 hover:text-white",
                  )}
                >
                  <route.icon
                    className={cn(
                      "shrink-0",
                      isCollapsed ? "h-5 w-5" : "h-4 w-4",
                      isActive && "scale-110",
                    )}
                  />
                  {!isCollapsed && (
                    <span className="text-[10px] font-black uppercase italic tracking-widest truncate animate-in fade-in duration-300">
                      {route.label}
                    </span>
                  )}
                </Link>
              </TooltipTrigger>
              {isCollapsed && (
                <TooltipContent
                  side="right"
                  className="bg-blue-600 border-none font-black italic uppercase text-[9px] text-white px-3 py-1.5 shadow-2xl ml-2 animate-in zoom-in-95"
                >
                  {route.label}
                </TooltipContent>
              )}
            </Tooltip>
          );
        })}
      </div>

      <div className="p-3 border-t border-white/5 space-y-2 pb-8 bg-slate-900/20">
        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              href="/admin/settings"
              className={cn(
                "flex items-center transition-all",
                isCollapsed
                  ? "h-12 w-12 justify-center mx-auto rounded-2xl"
                  : "rounded-2xl px-5 py-4 gap-4",
                pathname.includes("/admin/settings")
                  ? "bg-slate-800 text-white shadow-lg"
                  : "text-slate-500 hover:bg-white/5 hover:text-white",
              )}
            >
              <Settings
                className={cn("shrink-0", isCollapsed ? "h-5 w-5" : "h-4 w-4")}
              />
              {!isCollapsed && (
                <span className="text-[10px] font-black uppercase italic tracking-widest animate-in fade-in">
                  Settings
                </span>
              )}
            </Link>
          </TooltipTrigger>
          {isCollapsed && (
            <TooltipContent
              side="right"
              className="bg-slate-800 border-none text-white font-black italic uppercase text-[9px] ml-2 px-3 py-1.5"
            >
              Settings
            </TooltipContent>
          )}
        </Tooltip>

        <button
          onClick={() => {
            document.cookie =
              "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
            window.location.href = "/admin/login";
          }}
          className={cn(
            "w-full flex items-center transition-all group text-red-500 hover:bg-red-500/10",
            isCollapsed
              ? "h-12 w-12 justify-center mx-auto rounded-2xl"
              : "rounded-2xl px-5 py-4 gap-4",
          )}
        >
          <LogOut
            className={cn(
              "shrink-0 transition-transform group-hover:-translate-x-0.5",
              isCollapsed ? "h-5 w-5" : "h-4 w-4",
            )}
          />
          {!isCollapsed && (
            <span className="text-[10px] font-black uppercase italic tracking-widest animate-in fade-in">
              Logout
            </span>
          )}
        </button>
      </div>
    </div>
  );
}
