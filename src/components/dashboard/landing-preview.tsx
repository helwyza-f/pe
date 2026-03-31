"use client";

import { MapPin, Clock, Star, Calendar } from "lucide-react";

export function LandingPreview({ data }: { data: any }) {
  return (
    <div className="sticky top-28 flex flex-col items-center">
      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-4 italic">
        Live Mobile Preview
      </p>

      {/* iPhone Frame Mockup */}
      <div className="relative w-[280px] h-[580px] bg-slate-900 rounded-[3rem] border-[6px] border-slate-800 shadow-2xl overflow-hidden ring-4 ring-slate-100">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-800 rounded-b-2xl z-20" />{" "}
        {/* Notch */}
        {/* Inner Content (Simulasi Landing Page) */}
        <div className="h-full overflow-y-auto bg-white scrollbar-hide">
          {/* Header/Banner */}
          <div className="relative h-44 bg-slate-800 flex items-center justify-center overflow-hidden">
            <img
              src={
                data.banner_url ||
                "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069"
              }
              className="absolute inset-0 w-full h-full object-cover opacity-50"
            />
            <div className="relative z-10 text-center px-4">
              {data.logo_url && (
                <img
                  src={data.logo_url}
                  className="h-10 w-10 mx-auto rounded-lg mb-2 shadow-lg"
                />
              )}
              <h4 className="text-white text-sm font-black uppercase tracking-tighter truncate">
                {data.name || "Nama Bisnis"}
              </h4>
              <p className="text-[8px] text-slate-300 font-medium italic line-clamp-1">
                {data.slogan || "Slogan bisnis Anda"}
              </p>
            </div>
          </div>

          {/* Info Bar Mini */}
          <div className="px-4 -translate-y-4">
            <div className="bg-white rounded-2xl shadow-xl p-3 border border-slate-50 space-y-2">
              <div className="flex items-center gap-2">
                <Clock className="h-3 w-3 text-blue-600" />
                <p className="text-[8px] font-bold text-slate-700">
                  {data.open_time || "09:00"} - {data.close_time || "22:00"}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-3 w-3 text-emerald-600" />
                <p className="text-[8px] font-bold text-slate-700 line-clamp-1">
                  {data.address || "Alamat lengkap"}
                </p>
              </div>
            </div>
          </div>

          {/* Gallery Grid Mini */}
          <div className="px-4 mt-2">
            <p className="text-[9px] font-black uppercase mb-2 tracking-widest">
              Gallery
            </p>
            <div className="grid grid-cols-3 gap-2">
              {data.gallery?.slice(0, 6).map((url: string, i: number) => (
                <div
                  key={i}
                  className="aspect-square rounded-lg bg-slate-100 overflow-hidden"
                >
                  <img src={url} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>

          {/* CTA Button Mini */}
          <div className="p-4 mt-4">
            <div className="w-full h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white text-[10px] font-black shadow-lg shadow-blue-600/30">
              BOOK NOW
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
