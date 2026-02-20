'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Calendar, ArrowLeft, Car } from 'lucide-react';
import { Container, LoadingPage, EmptyState } from '@/components/shared';
import { Header, Footer } from '@/components/layout';
import { Card, CardContent, Badge, Button } from '@/components/ui';
import { useCustomerAuth } from '@/lib/context';
import { getBookingsByCustomerId, getVehicleById } from '@/data';
import { formatDate, formatCurrency } from '@/lib/utils';
import { BOOKING_STATUS_LABELS } from '@/types';

export default function BookingsPage() {
  const router = useRouter();
  const { customer, isLoading } = useCustomerAuth();

  useEffect(() => {
    if (!isLoading && !customer) {
      router.push('/account/login');
    }
  }, [isLoading, customer, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 bg-gray-50">
          <LoadingPage />
        </main>
        <Footer />
      </div>
    );
  }

  if (!customer) {
    return null;
  }

  const bookings = getBookingsByCustomerId(customer.id);

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
      <main className="flex-1 bg-gray-50 py-8">
        <Container>
          <div className="mb-8">
            <Link
              href="/account"
              className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-4"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Account
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
            <p className="text-gray-600">View and manage your rental bookings</p>
          </div>

          {bookings.length === 0 ? (
            <Card>
              <CardContent className="py-12">
                <EmptyState
                  icon={Calendar}
                  title="No bookings yet"
                  description="You haven't made any bookings yet. Start by browsing our available vehicles."
                  action={
                    <Link href="/vehicles">
                      <Button>Browse Vehicles</Button>
                    </Link>
                  }
                />
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {bookings.map((booking) => {
                const vehicle = getVehicleById(booking.vehicleId);
                return (
                  <Card key={booking.id}>
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="flex items-start gap-4">
                          <div className="w-16 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 flex-shrink-0">
                            <Car className="h-6 w-6" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-mono text-sm font-medium text-blue-600">
                                {booking.confirmationNumber}
                              </span>
                              <Badge variant={getStatusBadgeVariant(booking.status)} size="sm">
                                {BOOKING_STATUS_LABELS[booking.status]}
                              </Badge>
                            </div>
                            {vehicle && (
                              <p className="font-medium text-gray-900">
                                {vehicle.year} {vehicle.make} {vehicle.model}
                              </p>
                            )}
                            <p className="text-sm text-gray-500">
                              {formatDate(booking.dates.startDate)} - {formatDate(booking.dates.endDate)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="text-lg font-bold text-gray-900">
                              {formatCurrency(booking.pricing.total)}
                            </p>
                            <p className="text-sm text-gray-500">
                              {booking.pricing.numberOfDays} days
                            </p>
                          </div>
                          <Link href={`/booking/confirmation?confirmation=${booking.confirmationNumber}`}>
                            <Button variant="outline" size="sm">
                              View Details
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </Container>
      </main>
      <Footer />
    </div>
  );
}
