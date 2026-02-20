'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Calendar, Car, MapPin } from 'lucide-react';
import { Container } from '@/components/shared';
import { Header, Footer } from '@/components/layout';
import { Card, CardContent, CardHeader, CardTitle, Input, Button, Badge } from '@/components/ui';
import { getBookingByConfirmation, getVehicleById } from '@/data';
import { formatDate, formatTime, formatCurrency } from '@/lib/utils';
import { BOOKING_STATUS_LABELS } from '@/types';
import type { Booking } from '@/types';

export default function BookingLookupPage() {
  const router = useRouter();
  const [confirmationNumber, setConfirmationNumber] = useState('');
  const [booking, setBooking] = useState<Booking | null>(null);
  const [error, setError] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = () => {
    setError('');
    setHasSearched(true);

    const found = getBookingByConfirmation(confirmationNumber.trim());
    if (found) {
      setBooking(found);
    } else {
      setBooking(null);
      setError('No booking found with that confirmation number. Please check and try again.');
    }
  };

  const vehicle = booking ? getVehicleById(booking.vehicleId) : null;

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

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-gray-50 py-16">
        <Container size="sm">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Look Up Your Booking</h1>
            <p className="text-gray-600">
              Enter your confirmation number to view your booking details
            </p>
          </div>

          {/* Search Form */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex gap-4">
                <Input
                  placeholder="Enter confirmation number (e.g., NR-2024-001)"
                  value={confirmationNumber}
                  onChange={(e) => setConfirmationNumber(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  leftIcon={<Search className="h-4 w-4" />}
                  className="flex-1"
                />
                <Button onClick={handleSearch} disabled={!confirmationNumber.trim()}>
                  Search
                </Button>
              </div>
              {error && (
                <p className="text-sm text-red-600 mt-3">{error}</p>
              )}
            </CardContent>
          </Card>

          {/* Booking Result */}
          {booking && vehicle && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Booking Details</CardTitle>
                  <Badge variant={getStatusBadgeVariant(booking.status)}>
                    {BOOKING_STATUS_LABELS[booking.status]}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Confirmation Number */}
                <div className="text-center py-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-600 mb-1">Confirmation Number</p>
                  <p className="text-2xl font-bold font-mono text-blue-700">
                    {booking.confirmationNumber}
                  </p>
                </div>

                {/* Vehicle */}
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2 flex items-center gap-2">
                    <Car className="h-4 w-4" />
                    Vehicle
                  </h4>
                  <p className="font-medium text-gray-900">
                    {vehicle.year} {vehicle.make} {vehicle.model}
                  </p>
                  <p className="text-sm text-gray-500 capitalize">
                    {vehicle.category} • {vehicle.transmission}
                  </p>
                </div>

                {/* Dates */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-2 flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Pick-up
                    </h4>
                    <p className="font-medium text-gray-900">
                      {formatDate(booking.dates.startDate)}
                    </p>
                    <p className="text-sm text-gray-500">
                      {formatTime(booking.dates.pickupTime)}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-2 flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Drop-off
                    </h4>
                    <p className="font-medium text-gray-900">
                      {formatDate(booking.dates.endDate)}
                    </p>
                    <p className="text-sm text-gray-500">
                      {formatTime(booking.dates.returnTime)}
                    </p>
                  </div>
                </div>

                {/* Location */}
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2 flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Location
                  </h4>
                  <p className="text-gray-900">{booking.pickupLocation}</p>
                </div>

                {/* Price */}
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total Price</span>
                    <span className="text-2xl font-bold text-gray-900">
                      {formatCurrency(booking.pricing.total)}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-4">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => router.push(`/booking/confirmation?confirmation=${booking.confirmationNumber}`)}
                  >
                    View Full Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* No Results Message */}
          {hasSearched && !booking && !error && (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-gray-500">No booking found</p>
              </CardContent>
            </Card>
          )}
        </Container>
      </main>
      <Footer />
    </div>
  );
}
