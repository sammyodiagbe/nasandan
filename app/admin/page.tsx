'use client';

import Link from 'next/link';
import { ArrowRight, Plus, Calendar, Car as CarIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, Button, Badge } from '@/components/ui';
import { DashboardStats, BookingTable } from '@/components/admin';
import { getRecentBookings, vehicles } from '@/data';
import { useAdminAuth } from '@/lib/context';

export default function AdminDashboardPage() {
  const { admin } = useAdminAuth();
  const recentBookings = getRecentBookings(5);

  return (
    <div className="space-y-8 p-2">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-500 mt-1">Welcome back, {admin?.name}! Here&apos;s what&apos;s happening.</p>
        </div>
        <div className="flex gap-3">
          <Link href="/admin/vehicles/new">
            <Button variant="outline" leftIcon={<Plus className="h-4 w-4" />}>
              Add Vehicle
            </Button>
          </Link>
          <Link href="/admin/bookings">
            <Button variant="gradient" leftIcon={<Calendar className="h-4 w-4" />}>
              View Bookings
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats */}
      <DashboardStats />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Bookings */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Bookings</CardTitle>
            <Link href="/admin/bookings">
              <Button variant="ghost" size="sm" rightIcon={<ArrowRight className="h-4 w-4" />}>
                View All
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            <BookingTable bookings={recentBookings} />
          </CardContent>
        </Card>

        {/* Quick Actions & Fleet Status */}
        <div className="space-y-6">
          {/* Fleet Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CarIcon className="h-5 w-5 text-blue-600" />
                Fleet Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { status: 'Available', count: vehicles.filter(v => v.status === 'available').length, color: 'success' },
                { status: 'Rented', count: vehicles.filter(v => v.status === 'rented').length, color: 'info' },
                { status: 'Maintenance', count: vehicles.filter(v => v.status === 'maintenance').length, color: 'warning' },
              ].map((item) => (
                <div key={item.status} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Badge variant={item.color as 'success' | 'info' | 'warning'} dot>
                      {item.status}
                    </Badge>
                  </div>
                  <span className="text-2xl font-bold text-slate-900">{item.count}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/admin/vehicles/new" className="block">
                <div className="p-4 rounded-xl border-2 border-dashed border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 transition-all cursor-pointer group">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-blue-100 group-hover:bg-blue-200 transition-colors">
                      <Plus className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">Add New Vehicle</p>
                      <p className="text-sm text-slate-500">Expand your fleet</p>
                    </div>
                  </div>
                </div>
              </Link>
              <Link href="/admin/bookings" className="block">
                <div className="p-4 rounded-xl border-2 border-dashed border-slate-200 hover:border-purple-300 hover:bg-purple-50/50 transition-all cursor-pointer group">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-purple-100 group-hover:bg-purple-200 transition-colors">
                      <Calendar className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">Manage Bookings</p>
                      <p className="text-sm text-slate-500">View all reservations</p>
                    </div>
                  </div>
                </div>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
