'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Eye, RefreshCw } from 'lucide-react';
import { Card, CardContent, Select, Badge, Button } from '@/components/ui';
import { LoadingSpinner } from '@/components/shared';
import { useToast } from '@/lib/context';
import { supabase } from '@/lib/supabase';
import { formatCurrency } from '@/lib/utils';
import { format } from 'date-fns';
import type { BookingStatus } from '@/types';
import { BOOKING_STATUS_LABELS } from '@/types';

// Database booking type with joined car data
interface DbBookingWithCar {
  id: string;
  confirmation_number: string | null;
  customer_name: string;
  customer_email: string;
  customer_phone: string | null;
  start_date: string;
  end_date: string;
  pickup_time: string;
  return_time: string;
  total_price: number;
  status: BookingStatus;
  notes: string | null;
  created_at: string;
  updated_at: string;
  cars: {
    id: string;
    make: string;
    model: string;
    year: number;
    color: string;
    price_per_day: number;
    image_url: string | null;
  } | null;
}

export default function AdminBookingsPage() {
  const { showToast } = useToast();
  const [bookings, setBookings] = useState<DbBookingWithCar[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('bookings')
        .select(`
          *,
          cars (
            id,
            make,
            model,
            year,
            color,
            price_per_day,
            image_url
          )
        `)
        .order('created_at', { ascending: false });

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching bookings:', error);
        showToast('Failed to load bookings', 'error');
        return;
      }

      setBookings(data || []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      showToast('Failed to load bookings', 'error');
    } finally {
      setLoading(false);
    }
  }, [statusFilter, showToast]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  // Set up real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel('bookings-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'bookings',
        },
        () => {
          // Refresh bookings when any change occurs
          fetchBookings();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchBookings]);

  const handleStatusChange = async (bookingId: string, newStatus: BookingStatus) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({
          status: newStatus,
          updated_at: new Date().toISOString(),
          ...(newStatus === 'confirmed' ? { confirmed_at: new Date().toISOString() } : {}),
          ...(newStatus === 'cancelled' ? { declined_at: new Date().toISOString() } : {}),
        })
        .eq('id', bookingId);

      if (error) throw error;

      showToast('Booking status updated', 'success');
      // The real-time subscription will handle the refresh
    } catch (error) {
      console.error('Error updating status:', error);
      showToast('Failed to update booking status', 'error');
    }
  };

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

  const formatDate = (dateStr: string) => {
    return format(new Date(dateStr), 'MMM d, yyyy');
  };

  const statusOptions = [
    { value: 'all', label: 'All Bookings' },
    { value: 'pending', label: 'Pending' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'active', label: 'Active' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' },
  ];

  const statusSelectOptions = Object.entries(BOOKING_STATUS_LABELS).map(([value, label]) => ({
    value,
    label,
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Bookings</h1>
          <p className="text-gray-600">Manage all rental bookings</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={fetchBookings} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Select
            options={statusOptions}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-48"
          />
        </div>
      </div>

      {/* Booking Table */}
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <LoadingSpinner size="lg" />
            </div>
          ) : bookings.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              No bookings found
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Confirmation
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Vehicle
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Dates
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {bookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4">
                        <span className="font-mono text-sm font-medium text-gray-900">
                          {booking.confirmation_number || 'N/A'}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {booking.customer_name}
                        </div>
                        <div className="text-xs text-gray-500">
                          {booking.customer_phone}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        {booking.cars ? (
                          <span className="text-sm text-gray-900">
                            {booking.cars.year} {booking.cars.make} {booking.cars.model}
                          </span>
                        ) : (
                          <span className="text-sm text-gray-400">Unknown</span>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-sm text-gray-900">
                          {formatDate(booking.start_date)}
                        </div>
                        <div className="text-xs text-gray-500">
                          to {formatDate(booking.end_date)}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-sm font-medium text-gray-900">
                          {formatCurrency(booking.total_price)}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <Select
                          options={statusSelectOptions}
                          value={booking.status}
                          onChange={(e) => handleStatusChange(booking.id, e.target.value as BookingStatus)}
                          className="w-32 text-xs"
                        />
                      </td>
                      <td className="px-4 py-4">
                        <Link href={`/admin/bookings/${booking.id}`}>
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
