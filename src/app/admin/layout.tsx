"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  Tags,
  Users,
  ArrowLeft,
  Menu,
  X,
  Settings,
  Gamepad2,
} from "lucide-react";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/categories", label: "Categories", icon: Tags },
  { href: "/admin/users", label: "Players", icon: Users },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen flex">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-imposter-dark-light border-r border-white/10 fixed h-full z-30">
        <div className="p-6 border-b border-white/10">
          <Link href="/" className="flex items-center gap-2 text-white/50 hover:text-white text-sm mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back to Game
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-imposter-red rounded-xl flex items-center justify-center">
              <Gamepad2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="font-bold text-sm">Admin Panel</div>
              <div className="text-xs text-white/40">Imposter Game</div>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  isActive
                    ? "bg-imposter-red/20 text-imposter-red border border-imposter-red/30"
                    : "text-white/50 hover:text-white hover:bg-white/5"
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="text-sm font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10 text-xs text-white/30">
          Imposter Admin v1.0
        </div>
      </aside>

      {/* Mobile Top Bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-imposter-dark-light border-b border-white/10 px-4 py-3 flex items-center justify-between">
        <Link href="/" className="text-white/50 hover:text-white">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <span className="font-bold text-sm">Admin Panel</span>
        <button onClick={() => setMobileOpen(!mobileOpen)} className="text-white/70">
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-30 bg-black/50" onClick={() => setMobileOpen(false)}>
          <div className="bg-imposter-dark-light w-64 h-full p-4 pt-16" onClick={(e) => e.stopPropagation()}>
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl mb-1 transition-all ${
                    isActive
                      ? "bg-imposter-red/20 text-imposter-red"
                      : "text-white/50 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="text-sm font-medium">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 md:ml-64 pt-16 md:pt-0">
        <div className="p-6 md:p-8">{children}</div>
      </main>
    </div>
  );
}
