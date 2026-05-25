'use client';

import { BarChart3, Users, FileText, Clock } from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboard() {
  // Quick stats data
  const stats = [
    {
      label: 'Total Toppers',
      value: '12',
      icon: Users,
      color: 'bg-blue-100 text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      label: 'Gallery Images',
      value: '48',
      icon: FileText,
      color: 'bg-purple-100 text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      label: 'Recent Activities',
      value: '5',
      icon: Clock,
      color: 'bg-green-100 text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      label: 'Total Content',
      value: '65',
      icon: BarChart3,
      color: 'bg-yellow-100 text-yellow-600',
      bgColor: 'bg-yellow-50',
    },
  ];

  const recentActivities = [
    {
      id: 1,
      title: 'Updated Homepage Banner',
      timestamp: '2 hours ago',
      type: 'update',
    },
    {
      id: 2,
      title: 'Added new topper profile',
      timestamp: '5 hours ago',
      type: 'create',
    },
    {
      id: 3,
      title: 'Uploaded gallery images',
      timestamp: '1 day ago',
      type: 'create',
    },
    {
      id: 4,
      title: 'Modified About page content',
      timestamp: '2 days ago',
      type: 'update',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6 md:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
          Welcome to Dashboard
        </h1>
        <p className="text-slate-600">Here's what's happening with your site today.</p>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border border-slate-200 overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-600 text-sm font-medium mb-1">
                      {stat.label}
                    </p>
                    <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-lg ${stat.color} ${stat.bgColor}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activities */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md border border-slate-200">
            <div className="p-6 border-b border-slate-200">
              <h2 className="text-xl font-bold text-slate-900">Recent Activities</h2>
            </div>
            <div className="divide-y divide-slate-200">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="p-4 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-slate-900">{activity.title}</p>
                      <p className="text-sm text-slate-600 mt-1">{activity.timestamp}</p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        activity.type === 'create'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}
                    >
                      {activity.type === 'create' ? 'Created' : 'Updated'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md border border-slate-200">
            <div className="p-6 border-b border-slate-200">
              <h2 className="text-xl font-bold text-slate-900">Quick Actions</h2>
            </div>
            <div className="p-6 space-y-3">
              <Link
                href="/admin/manage-home"
                className="flex items-center justify-center w-full px-4 py-3 bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-semibold rounded-lg transition-colors"
              >
                Edit Homepage
              </Link>
              <Link
                href="/admin/manage-toppers"
                className="flex items-center justify-center w-full px-4 py-3 bg-slate-200 hover:bg-slate-300 text-slate-900 font-semibold rounded-lg transition-colors"
              >
                Manage Toppers
              </Link>
              <Link
                href="/admin/manage-gallery"
                className="flex items-center justify-center w-full px-4 py-3 bg-slate-200 hover:bg-slate-300 text-slate-900 font-semibold rounded-lg transition-colors"
              >
                Manage Gallery
              </Link>
              <Link
                href="/admin/manage-about"
                className="flex items-center justify-center w-full px-4 py-3 bg-slate-200 hover:bg-slate-300 text-slate-900 font-semibold rounded-lg transition-colors"
              >
                Edit About Page
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
