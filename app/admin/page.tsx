'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, Plus, Calendar, Car as CarIcon, Users, DollarSign, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, Button, Badge } from '@/components/ui';
import { LoadingSpinner } from '@/components/shared';
import { useAdminAuth, useToast } from '@/lib/context';
import { supabase } from '@/lib/supabase';
import { formatCurrency } from '@/lib/utils';
import { format } from 'date-fns';
import type { BookingStatus } from '@/types';
import { BOOKING_STATUS_LABELS } from '@/types';

interface DashboardBooking {
  id: string;
  confirmation_number: string | null;
  customer_name: string;
  customer_phone: string | null;
  start_date: string;
  end_date: string;
  total_price: number;
  status: BookingStatus;
  created_at: string;
  cars: {
    make: string;
    model: string;
    year: number;
  }[] | null;
}

interface DashboardStats {
  totalBookings: number;
  pendingBookings: number;
  totalRevenue: number;
  totalVehicles: number;
}

export default function AdminDashboardPage() {
  const { admin } = useAdminAuth();
  const { showToast } = useToast();
  const [recentBookings, setRecentBookings] = useState<DashboardBooking[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalBookings: 0,
    pendingBookings: 0,
    totalRevenue: 0,
    totalVehicles: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        // Fetch recent bookings
        const { data: bookings, error: bookingsError } = await supabase
          .from('bookings')
          .select(`
            id,
            confirmation_number,
            customer_name,
            customer_phone,
            start_date,
            end_date,
            total_price,
            status,
            created_at,
            cars (
              make,
              model,
              year
            )
          `)
          .order('created_at', { ascending: false })
          .limit(5);

        if (bookingsError) throw bookingsError;
        setRecentBookings(bookings || []);

        // Fetch stats
        const { count: totalBookings } = await supabase
          .from('bookings')
          .select('*', { count: 'exact', head: true });

        const { count: pendingBookings } = await supabase
          .from('bookings')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'pending');

        const { data: revenueData } = await supabase
          .from('bookings')
          .select('total_price')
          .in('status', ['confirmed', 'active', 'completed']);

        const totalRevenue = revenueData?.reduce((sum, b) => sum + Number(b.total_price), 0) || 0;

        const { count: totalVehicles } = await supabase
          .from('cars')
          .select('*', { count: 'exact', head: true });

        setStats({
          totalBookings: totalBookings || 0,
          pendingBookings: pendingBookings || 0,
          totalRevenue,
          totalVehicles: totalVehicles || 0,
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        showToast('Failed to load dashboard data', 'error');
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();

    // Set up real-time subscription
    const channel = supabase
      .channel('dashboard-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'bookings' },
        () => {
          fetchDashboardData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [showToast]);

  const getStatusBadgeVariant = (status: BookingStatus) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'confirmed': return 'info';
      case 'active': return 'success';
      case 'completed': return 'gray';
      case 'cancelled': return 'danger';
      default: return 'default';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Total Bookings</p>
                <p className="text-3xl font-bold text-slate-900">{stats.totalBookings}</p>
              </div>
              <div className="p-3 rounded-xl bg-blue-100">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Pending Review</p>
                <p className="text-3xl font-bold text-amber-600">{stats.pendingBookings}</p>
              </div>
              <div className="p-3 rounded-xl bg-amber-100">
                <Clock className="h-6 w-6 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Total Revenue</p>
                <p className="text-3xl font-bold text-emerald-600">{formatCurrency(stats.totalRevenue)}</p>
              </div>
              <div className="p-3 rounded-xl bg-emerald-100">
                <DollarSign className="h-6 w-6 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Fleet Size</p>
                <p className="text-3xl font-bold text-slate-900">{stats.totalVehicles}</p>
              </div>
              <div className="p-3 rounded-xl bg-purple-100">
                <CarIcon className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

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
            {recentBookings.length === 0 ? (
              <div className="text-center py-8 text-slate-500">
                No bookings yet
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Booking</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vehicle</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {recentBookings.map((booking) => (
                      <tr key={booking.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <Link href={`/admin/bookings/${booking.id}`} className="hover:underline">
                            <p className="font-mono text-sm font-medium text-gray-900">
                              {booking.confirmation_number || 'N/A'}
                            </p>
                            <p className="text-xs text-gray-500">{booking.customer_name}</p>
                          </Link>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          {booking.cars && booking.cars[0]
                            ? `${booking.cars[0].year} ${booking.cars[0].make} ${booking.cars[0].model}`
                            : 'Unknown'}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-500">
                          {format(new Date(booking.start_date), 'MMM d')}
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant={getStatusBadgeVariant(booking.status)} size="sm">
                            {BOOKING_STATUS_LABELS[booking.status]}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/admin/bookings?status=pending" className="block">
                <div className="p-4 rounded-xl border-2 border-dashed border-amber-200 hover:border-amber-300 hover:bg-amber-50/50 transition-all cursor-pointer group">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-amber-100 group-hover:bg-amber-200 transition-colors">
                      <Clock className="h-5 w-5 text-amber-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">Pending Bookings</p>
                      <p className="text-sm text-slate-500">{stats.pendingBookings} awaiting review</p>
                    </div>
                  </div>
                </div>
              </Link>
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
