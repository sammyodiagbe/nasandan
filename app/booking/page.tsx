'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Container } from '@/components/shared';
import { Header, Footer } from '@/components/layout';
import { Card, CardContent } from '@/components/ui';
import {
  BookingSteps,
  DateRangePicker,
  CustomerInfoForm,
  BookingReview,
  PriceBreakdown,
  BookingExtras,
} from '@/components/booking';
import { useBooking, useToast } from '@/lib/context';
import { generateConfirmationNumber, bookings } from '@/data';

export default function BookingPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const {
    vehicle,
    dates,
    extras,
    customerInfo,
    pricing,
    currentStep,
    setCurrentStep,
    setConfirmationNumber,
    calculatePrice,
  } = useBooking();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!vehicle) {
      router.push('/vehicles');
    }
  }, [vehicle, router]);

  useEffect(() => {
    if (vehicle && dates.startDate && dates.endDate) {
      calculatePrice();
    }
  }, [extras, calculatePrice, vehicle, dates.startDate, dates.endDate]);

  if (!vehicle) {
    return null;
  }

  const handleConfirmBooking = async () => {
    setIsSubmitting(true);

    await new Promise((resolve) => setTimeout(resolve, 1500));

    const confirmationNumber = generateConfirmationNumber();

    const newBooking = {
      id: `b${bookings.length + 1}`,
      confirmationNumber,
      vehicleId: vehicle.id,
      customerId: 'guest',
      dates: {
        startDate: dates.startDate!,
        endDate: dates.endDate!,
        pickupTime: dates.pickupTime || '10:00',
        returnTime: dates.returnTime || '10:00',
      },
      pricing: pricing!,
      extras,
      status: 'confirmed' as const,
      pickupLocation: 'Main Office - 123 Downtown Ave',
      returnLocation: 'Main Office - 123 Downtown Ave',
      notes: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    bookings.push(newBooking);

    setConfirmationNumber(confirmationNumber);
    setIsSubmitting(false);
    showToast('Booking confirmed successfully!', 'success');
    setCurrentStep('confirmation');
    router.push(`/booking/confirmation?confirmation=${confirmationNumber}`);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-gray-50 py-8">
        <Container size="md">
          <h1 className="text-3xl font-bold text-gray-900 text-center mb-6">
            Complete Your Booking
          </h1>

          <BookingSteps currentStep={currentStep} />

          {/* Vehicle Summary */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="w-20 h-16 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 flex-shrink-0">
                  <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {vehicle.year} {vehicle.make} {vehicle.model}
                  </h3>
                  <p className="text-sm text-gray-500 capitalize">
                    {vehicle.category} • {vehicle.transmission} • {vehicle.fuelType}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Booking Steps Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              {currentStep === 'select-dates' && (
                <DateRangePicker onContinue={() => setCurrentStep('customer-info')} />
              )}

              {currentStep === 'customer-info' && (
                <CustomerInfoForm
                  onBack={() => setCurrentStep('select-dates')}
                  onContinue={() => setCurrentStep('review')}
                />
              )}

              {currentStep === 'review' && (
                <BookingReview
                  onBack={() => setCurrentStep('customer-info')}
                  onConfirm={handleConfirmBooking}
                  isSubmitting={isSubmitting}
                />
              )}
            </div>

            {currentStep !== 'review' && (
              <div className="space-y-4">
                <BookingExtras />
                {pricing && <PriceBreakdown vehicle={vehicle} pricing={pricing} />}
              </div>
            )}
          </div>
        </Container>
      </main>
      <Footer />
    </div>
  );
}
