'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { User, Mail, Phone, MapPin, Calendar, CreditCard, Settings } from 'lucide-react';
import { Container, LoadingPage } from '@/components/shared';
import { Header, Footer } from '@/components/layout';
import { Card, CardContent, CardHeader, CardTitle, Button } from '@/components/ui';
import { useCustomerAuth } from '@/lib/context';
import { getBookingsByCustomerId } from '@/data';

export default function AccountPage() {
  const router = useRouter();
  const { customer, isLoading, getFullCustomer } = useCustomerAuth();

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

  const fullCustomer = getFullCustomer();
  const recentBookings = getBookingsByCustomerId(customer.id).slice(0, 3);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-gray-50 py-8">
        <Container>
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">My Account</h1>
            <p className="text-gray-600">Welcome back, {customer.firstName}!</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Profile Card */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Personal Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-sm text-gray-500">Full Name</label>
                      <p className="font-medium text-gray-900">
                        {customer.firstName} {customer.lastName}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500">Email</label>
                      <p className="font-medium text-gray-900">{customer.email}</p>
                    </div>
                    {fullCustomer && (
                      <>
                        <div>
                          <label className="text-sm text-gray-500">Phone</label>
                          <p className="font-medium text-gray-900">{fullCustomer.phone}</p>
                        </div>
                        <div>
                          <label className="text-sm text-gray-500">Date of Birth</label>
                          <p className="font-medium text-gray-900">{fullCustomer.dateOfBirth}</p>
                        </div>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>

              {fullCustomer && (
                <>
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <CreditCard className="h-5 w-5" />
                        Driver&apos;s License
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                          <label className="text-sm text-gray-500">License Number</label>
                          <p className="font-medium text-gray-900">{fullCustomer.driversLicense.number}</p>
                        </div>
                        <div>
                          <label className="text-sm text-gray-500">State</label>
                          <p className="font-medium text-gray-900">{fullCustomer.driversLicense.state}</p>
                        </div>
                        <div>
                          <label className="text-sm text-gray-500">Expiration</label>
                          <p className="font-medium text-gray-900">{fullCustomer.driversLicense.expirationDate}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <MapPin className="h-5 w-5" />
                        Address
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="font-medium text-gray-900">
                        {fullCustomer.address.street}<br />
                        {fullCustomer.address.city}, {fullCustomer.address.state} {fullCustomer.address.zipCode}
                      </p>
                    </CardContent>
                  </Card>
                </>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Link href="/vehicles" className="block">
                    <Button variant="outline" className="w-full justify-start">
                      <Calendar className="h-4 w-4 mr-2" />
                      Book a Vehicle
                    </Button>
                  </Link>
                  <Link href="/account/bookings" className="block">
                    <Button variant="outline" className="w-full justify-start">
                      <Calendar className="h-4 w-4 mr-2" />
                      View All Bookings
                    </Button>
                  </Link>
                  <Link href="/booking/lookup" className="block">
                    <Button variant="outline" className="w-full justify-start">
                      <Settings className="h-4 w-4 mr-2" />
                      Look Up Booking
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Recent Bookings */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Bookings</CardTitle>
                </CardHeader>
                <CardContent>
                  {recentBookings.length > 0 ? (
                    <div className="space-y-3">
                      {recentBookings.map((booking) => (
                        <Link
                          key={booking.id}
                          href={`/booking/confirmation?confirmation=${booking.confirmationNumber}`}
                          className="block p-3 rounded-lg hover:bg-gray-50 border border-gray-100"
                        >
                          <p className="font-mono text-sm font-medium text-blue-600">
                            {booking.confirmationNumber}
                          </p>
                          <p className="text-sm text-gray-500 mt-1">
                            {booking.dates.startDate}
                          </p>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">No bookings yet</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </Container>
      </main>
      <Footer />
    </div>
  );
}
