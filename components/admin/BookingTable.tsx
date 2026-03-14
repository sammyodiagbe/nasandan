'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Eye } from 'lucide-react';
import { Badge, Button, Select } from '@/components/ui';
import { formatDate, formatCurrency } from '@/lib/utils';
import type { Booking, BookingStatus, Vehicle } from '@/types';
import { BOOKING_STATUS_LABELS } from '@/types';
import { getVehicleById } from '@/data';

interface BookingTableProps {
  bookings: Booking[];
  onStatusChange?: (bookingId: string, status: BookingStatus) => void;
}

interface BookingWithVehicle extends Booking {
  vehicle?: Vehicle;
}

export function BookingTable({ bookings, onStatusChange }: BookingTableProps) {
  const [bookingsWithVehicles, setBookingsWithVehicles] = useState<BookingWithVehicle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchVehicles() {
      const enhanced = await Promise.all(
        bookings.map(async (booking) => {
          const vehicle = await getVehicleById(booking.vehicleId);
          return { ...booking, vehicle };
        })
      );
      setBookingsWithVehicles(enhanced);
      setLoading(false);
    }
    fetchVehicles();
  }, [bookings]);

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

  const statusOptions = Object.entries(BOOKING_STATUS_LABELS).map(([value, label]) => ({
    value,
    label,
  }));

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-[#E8AC41] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Confirmation
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
          {bookingsWithVehicles.map((booking) => {
            const vehicle = booking.vehicle;
            return (
              <tr key={booking.id} className="hover:bg-gray-50">
                <td className="px-4 py-4">
                  <span className="font-mono text-sm font-medium text-gray-900">
                    {booking.confirmationNumber}
                  </span>
                </td>
                <td className="px-4 py-4">
                  {vehicle ? (
                    <span className="text-sm text-gray-900">
                      {vehicle.year} {vehicle.make} {vehicle.model}
                    </span>
                  ) : (
                    <span className="text-sm text-gray-400">Unknown</span>
                  )}
                </td>
                <td className="px-4 py-4">
                  <div className="text-sm text-gray-900">
                    {formatDate(booking.dates.startDate)}
                  </div>
                  <div className="text-xs text-gray-500">
                    to {formatDate(booking.dates.endDate)}
                  </div>
                </td>
                <td className="px-4 py-4">
                  <span className="text-sm font-medium text-gray-900">
                    {formatCurrency(booking.pricing.total)}
                  </span>
                </td>
                <td className="px-4 py-4">
                  {onStatusChange ? (
                    <Select
                      options={statusOptions}
                      value={booking.status}
                      onChange={(e) => onStatusChange(booking.id, e.target.value as BookingStatus)}
                      className="w-32 text-xs"
                    />
                  ) : (
                    <Badge variant={getStatusBadgeVariant(booking.status)}>
                      {BOOKING_STATUS_LABELS[booking.status]}
                    </Badge>
                  )}
                </td>
                <td className="px-4 py-4">
                  <Link href={`/admin/bookings/${booking.id}`}>
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
