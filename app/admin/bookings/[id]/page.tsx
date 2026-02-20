'use client';

import { use, useState } from 'react';
import { notFound, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Calendar, MapPin, User, CreditCard, Car } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, Badge, Button, Select } from '@/components/ui';
import { getBookingById, getVehicleById, getCustomerById, bookings } from '@/data';
import { formatDate, formatTime, formatCurrency } from '@/lib/utils';
import { BOOKING_STATUS_LABELS, BookingStatus } from '@/types';
import { useToast } from '@/lib/context';

interface BookingDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function BookingDetailPage({ params }: BookingDetailPageProps) {
  const { id } = use(params);
  const router = useRouter();
  const { showToast } = useToast();

  const booking = getBookingById(id);

  if (!booking) {
    notFound();
  }

  const vehicle = getVehicleById(booking.vehicleId);
  const customer = getCustomerById(booking.customerId);

  const [status, setStatus] = useState(booking.status);

  const handleStatusUpdate = () => {
    const index = bookings.findIndex((b) => b.id === id);
    if (index !== -1) {
      bookings[index] = {
        ...bookings[index],
        status,
        updatedAt: new Date().toISOString(),
      };
      showToast('Booking status updated', 'success');
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

  const statusOptions = Object.entries(BOOKING_STATUS_LABELS).map(([value, label]) => ({
    value,
    label,
  }));

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
            <p className="text-gray-600 font-mono">{booking.confirmationNumber}</p>
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
              {vehicle ? (
                <div className="flex items-center gap-4">
                  <div className="w-20 h-16 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                    <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {vehicle.year} {vehicle.make} {vehicle.model}
                    </p>
                    <p className="text-sm text-gray-500 capitalize">
                      {vehicle.category} • {vehicle.transmission} • {vehicle.licensePlate}
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
                  <p className="font-medium text-gray-900">{formatDate(booking.dates.startDate)}</p>
                  <p className="text-sm text-gray-500">{formatTime(booking.dates.pickupTime)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Drop-off</p>
                  <p className="font-medium text-gray-900">{formatDate(booking.dates.endDate)}</p>
                  <p className="text-sm text-gray-500">{formatTime(booking.dates.returnTime)}</p>
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
                  <p className="font-medium text-gray-900">{booking.pickupLocation}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Return Location</p>
                  <p className="font-medium text-gray-900">{booking.returnLocation}</p>
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
              {customer ? (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Name</p>
                    <p className="font-medium text-gray-900">{customer.firstName} {customer.lastName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium text-gray-900">{customer.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="font-medium text-gray-900">{customer.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Driver&apos;s License</p>
                    <p className="font-medium text-gray-900">{customer.driversLicense.number}</p>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500">Guest booking</p>
              )}
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
              <Button onClick={handleStatusUpdate} className="w-full">
                Update Status
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
                  Daily rate x {booking.pricing.numberOfDays} days
                </span>
                <span>{formatCurrency(booking.pricing.dailyRate * booking.pricing.numberOfDays)}</span>
              </div>
              {booking.pricing.fees.map((fee) => (
                <div key={fee.name} className="flex justify-between text-sm">
                  <span className="text-gray-600">{fee.name}</span>
                  <span>{formatCurrency(fee.amount)}</span>
                </div>
              ))}
              <div className="flex justify-between text-sm pt-2 border-t">
                <span className="text-gray-600">Tax</span>
                <span>{formatCurrency(booking.pricing.taxAmount)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t font-semibold">
                <span>Total</span>
                <span className="text-blue-600">{formatCurrency(booking.pricing.total)}</span>
              </div>
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
