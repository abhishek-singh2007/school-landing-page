'use client';

import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const router = useRouter();

  const handleLogout = () => {
    // Clear admin_session cookie
    document.cookie = 'admin_session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    router.push('/admin/login');
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col">
      {/* Header */}
      <div className="bg-slate-800 border-b border-slate-700 px-6 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">JKD Admin Panel</h1>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-semibold rounded transition-colors"
        >
          Logout
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Sidebar */}
        <div className="w-64 bg-slate-800 border-r border-slate-700 p-6">
          <div className="space-y-4">
            <h2 className="text-yellow-400 font-semibold text-sm uppercase tracking-wider">Navigation</h2>
            <nav className="space-y-2">
              <a href="#" className="block px-4 py-2 text-slate-300 hover:bg-slate-700 rounded transition">
                Dashboard
              </a>
              <a href="#" className="block px-4 py-2 text-slate-300 hover:bg-slate-700 rounded transition">
                Toppers Management
              </a>
              <a href="#" className="block px-4 py-2 text-slate-300 hover:bg-slate-700 rounded transition">
                Gallery
              </a>
              <a href="#" className="block px-4 py-2 text-slate-300 hover:bg-slate-700 rounded transition">
                Settings
              </a>
            </nav>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 p-8">
          <div className="bg-slate-800 rounded-lg shadow-lg p-8 border border-slate-700">
            <h2 className="text-3xl font-bold text-yellow-400 mb-4">Welcome to JKD Admin Dashboard</h2>
            <p className="text-slate-300 text-lg mb-6">
              You have successfully logged in. Select an option from the sidebar to manage your content.
            </p>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="bg-slate-700 rounded-lg p-6 border border-slate-600">
                <h3 className="text-yellow-400 font-semibold mb-2">Toppers</h3>
                <p className="text-slate-300">Manage your toppers content</p>
              </div>
              <div className="bg-slate-700 rounded-lg p-6 border border-slate-600">
                <h3 className="text-yellow-400 font-semibold mb-2">Gallery</h3>
                <p className="text-slate-300">Manage gallery images</p>
              </div>
              <div className="bg-slate-700 rounded-lg p-6 border border-slate-600">
                <h3 className="text-yellow-400 font-semibold mb-2">Settings</h3>
                <p className="text-slate-300">Configure admin settings</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
