"use client";

import { useState } from "react";
import { Sidebar } from "@/components/dashboard/sidebar";
import { cn } from "@/lib/utils";
import { TooltipProvider } from "@/components/ui/tooltip";

export default function DashboardInternalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    // Set delayDuration ke 0 dan skipDelayDuration agar tidak nyangkut saat hover cepat
    <TooltipProvider delayDuration={0} skipDelayDuration={0}>
      <div className="flex min-h-screen bg-slate-50/50 selection:bg-blue-500/30">
        <div
          className={cn(
            "hidden md:flex flex-col fixed inset-y-0 z-50 transition-all duration-300 ease-in-out",
            isCollapsed ? "w-20" : "w-72",
          )}
        >
          <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
        </div>

        <div
          className={cn(
            "flex flex-1 flex-col transition-all duration-300 ease-in-out",
            isCollapsed ? "md:pl-20" : "md:pl-72",
          )}
        >
          <header className="sticky top-0 z-40 flex h-20 items-center justify-between border-b bg-white/80 px-8 backdrop-blur-md">
            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 italic">
              Admin <span className="text-blue-600">Panel</span> / Dashboard
            </h2>
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-[10px] font-black uppercase italic leading-none text-slate-900">
                  Helwiza Fahry
                </p>
                <p className="text-[8px] font-bold text-blue-600 uppercase tracking-widest mt-1">
                  Super Admin
                </p>
              </div>
              <div className="h-10 w-10 rounded-2xl bg-blue-600 flex items-center justify-center font-black text-white shadow-lg shadow-blue-600/20 italic border-b-4 border-blue-800">
                HF
              </div>
            </div>
          </header>

          <main className="p-8">
            <div className="animate-in fade-in duration-500">{children}</div>
          </main>
        </div>
      </div>
    </TooltipProvider>
  );
}
