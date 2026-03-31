import { Sidebar } from "@/components/dashboard/sidebar";

export default function DashboardInternalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-slate-50/50">
      {/* Sidebar tetap di kiri (Desktop) */}
      <div className="hidden md:flex w-72 flex-col fixed inset-y-0 z-50">
        <Sidebar />
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col md:pl-72">
        <header className="sticky top-0 z-40 flex h-20 items-center justify-between border-b bg-white/80 px-8 backdrop-blur-md">
          <h2 className="text-sm font-black uppercase tracking-widest text-slate-400">
            Admin Panel
          </h2>
          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-600">
            HF
          </div>
        </header>

        <main className="p-8">{children}</main>
      </div>
    </div>
  );
}
