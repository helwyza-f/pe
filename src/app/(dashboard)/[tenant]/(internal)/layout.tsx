import { Sidebar } from "@/components/dashboard/sidebar";

export default function InternalDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-slate-50/30">
      <div className="hidden md:flex w-72 flex-col fixed inset-y-0 z-50">
        <Sidebar />
      </div>
      <div className="flex flex-1 flex-col md:pl-72">
        <header className="sticky top-0 z-40 flex h-20 items-center justify-between border-b bg-white/80 px-8 backdrop-blur-md">
          <div className="flex flex-col">
            <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">
              Control Panel
            </h2>
            <p className="text-sm font-bold text-slate-800">
              Welcome back, Admin!
            </p>
          </div>
        </header>
        <main className="p-8">{children}</main>
      </div>
    </div>
  );
}
