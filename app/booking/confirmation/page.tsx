'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, Calendar, MapPin, Printer, Home } from 'lucide-react';
import { Container } from '@/components/shared';
import { Header, Footer } from '@/components/layout';
import { Card, CardContent, Button, Badge } from '@/components/ui';
import { getBookingByConfirmation, getVehicleById } from '@/data';
import { formatDate, formatTime, formatCurrency } from '@/lib/utils';

function BookingConfirmationContent() {
  const searchParams = useSearchParams();
  const confirmationNumber = searchParams.get('confirmation');

  const booking = confirmationNumber ? getBookingByConfirmation(confirmationNumber) : null;
  const vehicle = booking ? getVehicleById(booking.vehicleId) : null;

  if (!booking || !vehicle) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 bg-gray-50 py-16">
          <Container size="sm">
            <Card>
              <CardContent className="p-8 text-center">
                <h1 className="text-2xl font-bold text-gray-900 mb-4">Booking Not Found</h1>
                <p className="text-gray-600 mb-6">
                  We couldn&apos;t find a booking with that confirmation number.
                </p>
                <Link href="/booking/lookup">
                  <Button>Look Up Your Booking</Button>
                </Link>
              </CardContent>
            </Card>
          </Container>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-gray-50 py-8">
        <Container size="md">
          {/* Success Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Booking Confirmed!</h1>
            <p className="text-gray-600">
              Your reservation has been successfully confirmed. A confirmation email has been sent.
            </p>
          </div>

          {/* Confirmation Number */}
          <Card className="mb-6">
            <CardContent className="p-6 text-center">
              <p className="text-sm text-gray-500 mb-1">Confirmation Number</p>
              <p className="text-3xl font-bold font-mono text-blue-600">
                {booking.confirmationNumber}
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Please save this number for your records
              </p>
            </CardContent>
          </Card>

          {/* Booking Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Vehicle */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Vehicle</h3>
                <div className="flex gap-4">
                  <div className="w-20 h-16 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 flex-shrink-0">
                    <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {vehicle.year} {vehicle.make} {vehicle.model}
                    </p>
                    <p className="text-sm text-gray-500 capitalize">
                      {vehicle.category} • {vehicle.transmission}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Rental Period */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Rental Period</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Calendar className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Pick-up</p>
                      <p className="font-medium text-gray-900">
                        {formatDate(booking.dates.startDate)} at {formatTime(booking.dates.pickupTime)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-red-100 rounded-lg">
                      <Calendar className="h-4 w-4 text-red-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Drop-off</p>
                      <p className="font-medium text-gray-900">
                        {formatDate(booking.dates.endDate)} at {formatTime(booking.dates.returnTime)}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Location */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Location</h3>
              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <MapPin className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{booking.pickupLocation}</p>
                  <p className="text-sm text-gray-500">Same location for pickup and return</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Price Summary */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Price Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    {vehicle.make} {vehicle.model} x {booking.pricing.numberOfDays} days
                  </span>
                  <span>{formatCurrency(booking.pricing.dailyRate * booking.pricing.numberOfDays)}</span>
                </div>
                {booking.pricing.fees.map((fee) => (
                  <div key={fee.name} className="flex justify-between">
                    <span className="text-gray-600">{fee.name}</span>
                    <span>{formatCurrency(fee.amount)}</span>
                  </div>
                ))}
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span>{formatCurrency(booking.pricing.taxAmount)}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-gray-200 font-semibold">
                  <span>Total</span>
                  <span className="text-blue-600">{formatCurrency(booking.pricing.total)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              variant="outline"
              leftIcon={<Printer className="h-4 w-4" />}
              onClick={() => window.print()}
            >
              Print Confirmation
            </Button>
            <Link href="/">
              <Button leftIcon={<Home className="h-4 w-4" />}>
                Return to Home
              </Button>
            </Link>
          </div>
        </Container>
      </main>
      <Footer />
    </div>
  );
}

export default function BookingConfirmationPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 bg-gray-50 py-16">
          <Container size="md">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-slate-200 border-t-[#E8AC41] rounded-full animate-spin mx-auto mb-4" />
              <p className="text-slate-600">Loading confirmation...</p>
            </div>
          </Container>
        </main>
        <Footer />
      </div>
    }>
      <BookingConfirmationContent />
    </Suspense>
  );
}
