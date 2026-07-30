'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, Home, Info, Trophy, Images, LogOut, Menu, X } from 'lucide-react';
import { clearAdminSession } from '@/app/actions/adminSession';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Ensure component is mounted to avoid hydration mismatch
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleLogout = async () => {
    await clearAdminSession();
    await signOut(auth);
    router.push('/admin/login');
  };

  const closeMenu = () => setIsOpen(false);

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
      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:flex-col fixed md:relative h-screen w-64 bg-slate-900/90 backdrop-blur-sm border-r border-slate-700/50 z-40">
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

        {/* Separator */}
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
          <h1 className="text-lg font-bold text-yellow-400">JKD Admin</h1>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
            aria-label="Toggle menu"
          >
            {isMounted && (
              <motion.div
                animate={{ rotate: isOpen ? 90 : 0 }}
                transition={{ duration: 0.3 }}
              >
                {isOpen ? (
                  <X className="w-6 h-6 text-white" />
                ) : (
                  <Menu className="w-6 h-6 text-white" />
                )}
              </motion.div>
            )}
          </button>
        </div>

        {/* Mobile Bottom-Up Full Screen Menu */}
        <AnimatePresence>
          {isMounted && isOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={() => setIsOpen(false)}
                className="md:hidden fixed inset-0 bg-black/40 z-40"
              />

              {/* Bottom-Up Menu */}
              <motion.div
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                className="md:hidden fixed inset-0 z-50 h-screen w-full bg-slate-900/95 backdrop-blur-lg flex flex-col"
              >
                {/* Menu Header */}
                <div className="flex items-center justify-between px-6 py-6 border-b border-slate-700/50">
                  <h1 className="text-2xl font-bold text-yellow-400">JKD Admin</h1>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsOpen(false)}
                    className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
                    aria-label="Close menu"
                  >
                    <X className="w-6 h-6 text-white" />
                  </motion.button>
                </div>

                {/* Navigation Links */}
                <nav className="flex-1 px-6 py-8 space-y-2 overflow-y-auto">
                  {navItems.map((item, index) => {
                    const Icon = item.icon;
                    return (
                      <motion.div
                        key={item.href}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <Link
                          href={item.href}
                          onClick={closeMenu}
                          className="flex items-center gap-4 px-6 py-4 text-slate-300 hover:bg-slate-800/50 hover:text-yellow-400 rounded-xl transition-all group"
                        >
                          <Icon className="w-6 h-6 group-hover:text-yellow-400" />
                          <span className="font-medium text-lg">{item.label}</span>
                        </Link>
                      </motion.div>
                    );
                  })}
                </nav>

                {/* Separator */}
                <div className="px-6 py-4">
                  <div className="h-px bg-slate-700/50"></div>
                </div>

                {/* Logout Button */}
                <motion.div
                  className="px-6 pb-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: navItems.length * 0.05 }}
                >
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-6 py-4 bg-red-600/20 hover:bg-red-600/30 text-red-400 hover:text-red-300 rounded-xl transition-all font-medium text-lg"
                  >
                    <LogOut className="w-6 h-6" />
                    <span>Logout</span>
                  </motion.button>
                </motion.div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Content Area */}
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
