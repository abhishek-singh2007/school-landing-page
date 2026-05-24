'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { LayoutDashboard, Home, Info, Trophy, Images, LogOut, Menu, X } from 'lucide-react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = () => {
    document.cookie = 'admin_session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    router.push('/admin/login');
  };

  const navItems = [
    {
      label: 'Dashboard',
      href: '/admin',
      icon: LayoutDashboard,
    },
    {
      label: 'Manage Home',
      href: '/admin/manage-home',
      icon: Home,
    },
    {
      label: 'Manage About',
      href: '/admin/manage-about',
      icon: Info,
    },
    {
      label: 'Manage Toppers',
      href: '/admin/manage-toppers',
      icon: Trophy,
    },
    {
      label: 'Manage Gallery',
      href: '/admin/manage-gallery',
      icon: Images,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar - Desktop */}
      <div
        className={`hidden md:flex md:flex-col fixed md:relative h-screen w-64 bg-slate-900/90 backdrop-blur-sm border-r border-slate-700/50 transition-all duration-300 z-40 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo/Brand */}
        <div className="px-6 py-8 border-b border-slate-700/50">
          <h1 className="text-2xl font-bold text-yellow-400">JKD Admin</h1>
          <p className="text-slate-400 text-xs mt-1">Dashboard</p>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-slate-800 hover:text-yellow-400 rounded-lg transition-all group"
              >
                <Icon className="w-5 h-5 group-hover:text-yellow-400" />
                <span className="font-medium text-sm">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Separator */}
        <div className="px-4 py-4">
          <div className="h-px bg-slate-700/50"></div>
        </div>

        {/* Logout Button */}
        <div className="px-4 pb-6">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 bg-red-600/20 hover:bg-red-600/30 text-red-400 hover:text-red-300 rounded-lg transition-all font-medium text-sm"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Mobile Header */}
        <div className="md:hidden bg-slate-900 border-b border-slate-700 px-4 py-4 flex items-center justify-between sticky top-0 z-30">
          <h1 className="text-xl font-bold text-yellow-400">JKD Admin</h1>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
          >
            {sidebarOpen ? (
              <X className="w-6 h-6 text-white" />
            ) : (
              <Menu className="w-6 h-6 text-white" />
            )}
          </button>
        </div>

        {/* Mobile Sidebar Drawer */}
        {sidebarOpen && (
          <div className="md:hidden fixed inset-0 z-30 bg-black/50">
            <div className="w-64 h-screen bg-slate-900/95 backdrop-blur-sm border-r border-slate-700/50 flex flex-col">
              {/* Logo/Brand */}
              <div className="px-6 py-8 border-b border-slate-700/50">
                <h1 className="text-2xl font-bold text-yellow-400">JKD Admin</h1>
                <p className="text-slate-400 text-xs mt-1">Dashboard</p>
              </div>

              {/* Navigation Links */}
              <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-slate-800 hover:text-yellow-400 rounded-lg transition-all group"
                      onClick={() => setSidebarOpen(false)}
                    >
                      <Icon className="w-5 h-5 group-hover:text-yellow-400" />
                      <span className="font-medium text-sm">{item.label}</span>
                    </Link>
                  );
                })}
              </nav>

              {/* Sidebar Separator */}
              <div className="px-4 py-4">
                <div className="h-px bg-slate-700/50"></div>
              </div>

              {/* Logout Button */}
              <div className="px-4 pb-6">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 bg-red-600/20 hover:bg-red-600/30 text-red-400 hover:text-red-300 rounded-lg transition-all font-medium text-sm"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Content Area */}
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
