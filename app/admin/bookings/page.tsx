'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, Select } from '@/components/ui';
import { BookingTable } from '@/components/admin';
import { bookings } from '@/data';
import { useToast } from '@/lib/context';
import type { BookingStatus } from '@/types';

export default function AdminBookingsPage() {
  const { showToast } = useToast();
  const [bookingList, setBookingList] = useState(bookings);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const handleStatusChange = (bookingId: string, newStatus: BookingStatus) => {
    const index = bookings.findIndex((b) => b.id === bookingId);
    if (index !== -1) {
      bookings[index] = {
        ...bookings[index],
        status: newStatus,
        updatedAt: new Date().toISOString(),
      };
      setBookingList([...bookings]);
      showToast('Booking status updated', 'success');
    }
  };

  const filteredBookings = statusFilter === 'all'
    ? bookingList
    : bookingList.filter((b) => b.status === statusFilter);

  const statusOptions = [
    { value: 'all', label: 'All Bookings' },
    { value: 'pending', label: 'Pending' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'active', label: 'Active' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Bookings</h1>
          <p className="text-gray-600">Manage all rental bookings</p>
        </div>
        <Select
          options={statusOptions}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-48"
        />
      </div>

      {/* Booking Table */}
      <Card>
        <CardContent className="p-0">
          <BookingTable
            bookings={filteredBookings}
            onStatusChange={handleStatusChange}
          />
        </CardContent>
      </Card>
    </div>
  );
}
