'use client';

import { use, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Calendar, MapPin, User, CreditCard, Car, Phone, Mail } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, Badge, Button, Select } from '@/components/ui';
import { LoadingSpinner } from '@/components/shared';
import { supabase } from '@/lib/supabase';
import { formatCurrency } from '@/lib/utils';
import { format } from 'date-fns';
import { BOOKING_STATUS_LABELS, PICKUP_LOCATIONS } from '@/types';
import type { BookingStatus } from '@/types';
import { useToast } from '@/lib/context';

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
  customer_age: number | null;
  has_full_license: boolean;
  admin_notified_at: string | null;
  confirmed_at: string | null;
  declined_at: string | null;
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
    fuel_type: string;
    doors: number;
    passengers: number;
  } | null;
}

interface BookingDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function BookingDetailPage({ params }: BookingDetailPageProps) {
  const { id } = use(params);
  const router = useRouter();
  const { showToast } = useToast();

  const [booking, setBooking] = useState<DbBookingWithCar | null>(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<BookingStatus>('pending');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    async function fetchBooking() {
      const { data, error } = await supabase
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
            image_url,
            fuel_type,
            doors,
            passengers
          )
        `)
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching booking:', error);
        setLoading(false);
        return;
      }

      setBooking(data);
      setStatus(data.status);
      setLoading(false);
    }

    fetchBooking();
  }, [id]);

  // Set up real-time subscription for this booking
  useEffect(() => {
    const channel = supabase
      .channel(`booking-${id}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'bookings',
          filter: `id=eq.${id}`,
        },
        (payload) => {
          setBooking(prev => prev ? { ...prev, ...payload.new } : null);
          setStatus((payload.new as DbBookingWithCar).status);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="text-center py-20">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Booking Not Found</h1>
        <Link href="/admin/bookings" className="text-blue-600 hover:underline">
          Back to Bookings
        </Link>
      </div>
    );
  }

  const handleStatusUpdate = async () => {
    setUpdating(true);
    try {
      const { error } = await supabase
        .from('bookings')
        .update({
          status,
          updated_at: new Date().toISOString(),
          ...(status === 'confirmed' ? { confirmed_at: new Date().toISOString() } : {}),
          ...(status === 'cancelled' ? { declined_at: new Date().toISOString() } : {}),
        })
        .eq('id', id);

      if (error) throw error;

      showToast('Booking status updated', 'success');
    } catch (error) {
      console.error('Error updating booking:', error);
      showToast('Failed to update booking status', 'error');
    } finally {
      setUpdating(false);
    }
  };

  const getStatusBadgeVariant = (status: string) => {
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
    return format(new Date(dateStr), 'EEEE, MMMM d, yyyy');
  };

  const formatTime = (timeStr: string) => {
    const [hours, minutes] = timeStr.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  const statusOptions = Object.entries(BOOKING_STATUS_LABELS).map(([value, label]) => ({
    value,
    label,
  }));

  // Calculate number of days
  const startDate = new Date(booking.start_date);
  const endDate = new Date(booking.end_date);
  const numberOfDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  const dailyRate = booking.cars?.price_per_day || 0;
  const subtotal = dailyRate * numberOfDays;
  const taxAmount = subtotal * 0.085; // 8.5% tax

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Link
          href="/admin/bookings"
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Bookings
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Booking Details</h1>
            <p className="text-gray-600 font-mono">{booking.confirmation_number || 'No confirmation number'}</p>
          </div>
          <Badge variant={getStatusBadgeVariant(booking.status)} size="md">
            {BOOKING_STATUS_LABELS[booking.status]}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Vehicle Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Car className="h-5 w-5" />
                Vehicle
              </CardTitle>
            </CardHeader>
            <CardContent>
              {booking.cars ? (
                <div className="flex items-center gap-4">
                  <div className="w-20 h-16 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                    <Car className="h-8 w-8" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {booking.cars.year} {booking.cars.make} {booking.cars.model}
                    </p>
                    <p className="text-sm text-gray-500 capitalize">
                      {booking.cars.color} • {booking.cars.fuel_type} • {booking.cars.passengers} passengers
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500">Vehicle not found</p>
              )}
            </CardContent>
          </Card>

          {/* Rental Period */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Rental Period
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Pick-up</p>
                  <p className="font-medium text-gray-900">{formatDate(booking.start_date)}</p>
                  <p className="text-sm text-gray-500">{formatTime(booking.pickup_time)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Drop-off</p>
                  <p className="font-medium text-gray-900">{formatDate(booking.end_date)}</p>
                  <p className="text-sm text-gray-500">{formatTime(booking.return_time)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Location */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Location
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Pick-up Location</p>
                  <p className="font-medium text-gray-900">{PICKUP_LOCATIONS[0]}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Return Location</p>
                  <p className="font-medium text-gray-900">{PICKUP_LOCATIONS[0]}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Customer */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Customer
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Name</p>
                  <p className="font-medium text-gray-900">{booking.customer_name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium text-gray-900 flex items-center gap-1">
                    <Mail className="h-3.5 w-3.5 text-gray-400" />
                    {booking.customer_email}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-medium text-gray-900 flex items-center gap-1">
                    <Phone className="h-3.5 w-3.5 text-gray-400" />
                    {booking.customer_phone || 'N/A'}
                  </p>
                </div>
                {booking.customer_age && (
                  <div>
                    <p className="text-sm text-gray-500">Age</p>
                    <p className="font-medium text-gray-900">{booking.customer_age} years old</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Update Status */}
          <Card>
            <CardHeader>
              <CardTitle>Update Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Select
                options={statusOptions}
                value={status}
                onChange={(e) => setStatus(e.target.value as BookingStatus)}
              />
              <Button onClick={handleStatusUpdate} className="w-full" disabled={updating}>
                {updating ? 'Updating...' : 'Update Status'}
              </Button>
            </CardContent>
          </Card>

          {/* Price Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Price Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">
                  Daily rate x {numberOfDays} day{numberOfDays !== 1 ? 's' : ''}
                </span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm pt-2 border-t">
                <span className="text-gray-600">Tax (8.5%)</span>
                <span>{formatCurrency(taxAmount)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t font-semibold">
                <span>Total</span>
                <span className="text-blue-600">{formatCurrency(booking.total_price)}</span>
              </div>
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Timeline</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Created</span>
                <span>{format(new Date(booking.created_at), 'MMM d, yyyy h:mm a')}</span>
              </div>
              {booking.admin_notified_at && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Admin notified</span>
                  <span>{format(new Date(booking.admin_notified_at), 'MMM d, yyyy h:mm a')}</span>
                </div>
              )}
              {booking.confirmed_at && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Confirmed</span>
                  <span>{format(new Date(booking.confirmed_at), 'MMM d, yyyy h:mm a')}</span>
                </div>
              )}
              {booking.declined_at && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Declined</span>
                  <span>{format(new Date(booking.declined_at), 'MMM d, yyyy h:mm a')}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Notes */}
          {booking.notes && (
            <Card>
              <CardHeader>
                <CardTitle>Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">{booking.notes}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
