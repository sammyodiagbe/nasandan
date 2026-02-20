'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Car,
  Calendar,
  LogOut,
  Menu,
  X,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { useAdminAuth } from '@/lib/context/AdminAuthContext';

const navItems = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Vehicles', href: '/admin/vehicles', icon: Car },
  { name: 'Bookings', href: '/admin/bookings', icon: Calendar },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { admin, logout } = useAdminAuth();

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className="p-6">
        <Link href="/admin" className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg shadow-blue-500/30">
            <Car className="h-5 w-5 text-white" />
          </div>
          <div>
            <span className="font-bold text-lg text-slate-900 block">Admin</span>
            <span className="text-xs text-slate-500">Nasandan Rentals</span>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6">
        <div className="space-y-1">
          {navItems.map((item) => {
            const isActive =
              item.href === '/admin'
                ? pathname === '/admin'
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group',
                  isActive
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/30'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                )}
                onClick={() => setMobileOpen(false)}
              >
                <item.icon className={cn('h-5 w-5', isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-600')} />
                <span className="flex-1">{item.name}</span>
                {isActive && <ChevronRight className="h-4 w-4 text-white/60" />}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-slate-200">
        {admin && (
          <div className="flex items-center gap-3 px-4 py-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center">
              <span className="text-white font-semibold">{admin.name[0]}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-900 truncate">{admin.name}</p>
              <p className="text-xs text-slate-500 truncate">{admin.email}</p>
            </div>
          </div>
        )}
        <button
          onClick={logout}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut className="h-5 w-5" />
          Sign Out
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white/90 backdrop-blur-xl border-b border-slate-200 flex items-center justify-between px-4 z-40">
        <Link href="/admin" className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600">
            <Car className="h-5 w-5 text-white" />
          </div>
          <span className="font-bold text-slate-900">Admin</span>
        </Link>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded-xl hover:bg-slate-100 transition-colors"
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-30 bg-black/50 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        >
          <div
            className="fixed top-16 left-0 bottom-0 w-72 bg-white flex flex-col animate-slide-in-right shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <SidebarContent />
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <div className="hidden lg:flex fixed top-0 left-0 bottom-0 w-72 bg-white border-r border-slate-200 flex-col">
        <SidebarContent />
      </div>
    </>
  );
}
