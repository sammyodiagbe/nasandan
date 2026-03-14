'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { CheckCircle, Calendar, Car, MapPin, Phone, User } from 'lucide-react';
import { Container } from '@/components/shared';
import { Header, Footer } from '@/components/layout';
import { Card, CardContent, Button } from '@/components/ui';
import {
  DateRangePicker,
  CustomerInfoForm,
  PriceBreakdown,
} from '@/components/booking';
import { useBooking, useToast } from '@/lib/context';
import { PICKUP_LOCATIONS } from '@/types';
import { formatCurrency } from '@/lib/utils';
import { format } from 'date-fns';

type BookingStep = 'select-dates' | 'customer-info' | 'success';

export default function BookingPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const {
    vehicle,
    dates,
    pricing,
    customerInfo,
    calculatePrice,
    resetBooking,
  } = useBooking();

  const [currentStep, setCurrentStep] = useState<BookingStep>('select-dates');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmationNumber, setConfirmationNumber] = useState<string | null>(null);

  useEffect(() => {
    if (!vehicle) {
      router.push('/vehicles');
    }
  }, [vehicle, router]);

  useEffect(() => {
    if (vehicle && dates.startDate && dates.endDate) {
      calculatePrice();
    }
  }, [vehicle, dates.startDate, dates.endDate, calculatePrice]);

  if (!vehicle) {
    return null;
  }

  const handleBookingSubmit = async () => {
    if (!vehicle || !dates.startDate || !dates.endDate || !pricing) {
      showToast('Missing booking information', 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      const bookingData = {
        vehicleId: vehicle.id,
        customerName: customerInfo.fullName || `${customerInfo.firstName} ${customerInfo.lastName}`,
        customerEmail: customerInfo.email,
        customerPhone: customerInfo.phone,
        startDate: dates.startDate,
        endDate: dates.endDate,
        pickupTime: dates.pickupTime || '10:00',
        returnTime: dates.returnTime || '10:00',
        totalPrice: pricing.total,
      };
      console.log('Submitting booking:', bookingData);

      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      });

      const result = await response.json();

      if (!response.ok) {
        console.error('API Error Response:', result);
        // Show detailed validation errors if available
        if (result.details?.fieldErrors) {
          const fieldErrors = Object.entries(result.details.fieldErrors)
            .map(([field, errors]) => `${field}: ${(errors as string[]).join(', ')}`)
            .join('; ');
          throw new Error(fieldErrors || result.error || 'Validation failed');
        }
        throw new Error(result.error || 'Failed to create booking');
      }

      setConfirmationNumber(result.confirmationNumber);
      showToast('Booking request submitted successfully!', 'success');
      setCurrentStep('success');
    } catch (error) {
      console.error('Booking error:', error);
      showToast(
        error instanceof Error ? error.message : 'Failed to submit booking',
        'error'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNewBooking = () => {
    resetBooking();
    router.push('/vehicles');
  };

  // Success Screen
  if (currentStep === 'success') {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 bg-gradient-to-b from-[#0c2340] to-[#0c2340]/90 py-12">
          <Container size="sm">
            <Card className="overflow-hidden">
              {/* Success Header */}
              <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 p-8 text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full mb-4">
                  <CheckCircle className="h-10 w-10 text-emerald-500" />
                </div>
                <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
                  Booking Request Submitted!
                </h1>
                {confirmationNumber && (
                  <p className="font-mono text-lg text-white bg-white/20 inline-block px-4 py-1 rounded-full mb-2">
                    {confirmationNumber}
                  </p>
                )}
                <p className="text-emerald-100">
                  We&apos;ll contact you shortly to confirm your reservation
                </p>
              </div>

              <CardContent className="p-6 md:p-8 space-y-6">
                {/* Booking Summary */}
                <div className="space-y-4">
                  <h2 className="font-semibold text-[#0c2340] text-lg">Booking Summary</h2>

                  {/* Vehicle */}
                  <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
                    <div className="w-16 h-12 bg-white rounded-lg flex items-center justify-center overflow-hidden">
                      {vehicle.thumbnail && vehicle.thumbnail !== '/vehicles/default-thumb.jpg' ? (
                        <Image
                          src={vehicle.thumbnail}
                          alt={vehicle.model}
                          width={64}
                          height={48}
                          className="object-contain"
                        />
                      ) : (
                        <Car className="h-6 w-6 text-slate-400" />
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-[#0c2340]">
                        {vehicle.year} {vehicle.make} {vehicle.model}
                      </p>
                      <p className="text-sm text-slate-500">{vehicle.color}</p>
                    </div>
                  </div>

                  {/* Dates */}
                  <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl">
                    <Calendar className="h-5 w-5 text-[#E8AC41] mt-0.5" />
                    <div>
                      <p className="font-medium text-[#0c2340]">Rental Period</p>
                      <p className="text-sm text-slate-600">
                        {dates.startDate && format(new Date(dates.startDate), 'MMM d, yyyy')} — {dates.endDate && format(new Date(dates.endDate), 'MMM d, yyyy')}
                      </p>
                      <p className="text-sm text-slate-500">
                        Pickup: {dates.pickupTime || '10:00'} • Return: {dates.returnTime || '10:00'}
                      </p>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl">
                    <MapPin className="h-5 w-5 text-[#E8AC41] mt-0.5" />
                    <div>
                      <p className="font-medium text-[#0c2340]">Pickup Location</p>
                      <p className="text-sm text-slate-600">{PICKUP_LOCATIONS[0]}</p>
                    </div>
                  </div>

                  {/* Customer Info */}
                  <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl">
                    <User className="h-5 w-5 text-[#E8AC41] mt-0.5" />
                    <div>
                      <p className="font-medium text-[#0c2340]">
                        {customerInfo.fullName || `${customerInfo.firstName} ${customerInfo.lastName}`}
                      </p>
                      <p className="text-sm text-slate-600 flex items-center gap-1">
                        <Phone className="h-3.5 w-3.5" />
                        {customerInfo.phone}
                      </p>
                    </div>
                  </div>

                  {/* Total */}
                  {pricing && (
                    <div className="flex items-center justify-between p-4 bg-[#0c2340] rounded-xl text-white">
                      <span className="font-medium">Estimated Total</span>
                      <span className="text-2xl font-bold">{formatCurrency(pricing.total)}</span>
                    </div>
                  )}
                </div>

                {/* Next Steps */}
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                  <h3 className="font-semibold text-amber-800 mb-2">What happens next?</h3>
                  <ul className="text-sm text-amber-700 space-y-1">
                    <li>• We&apos;ll review your booking request</li>
                    <li>• You&apos;ll receive a call or text to confirm availability</li>
                    <li>• Bring a valid driver&apos;s license when picking up</li>
                  </ul>
                </div>

                {/* Action */}
                <Button onClick={handleNewBooking} className="w-full" size="lg">
                  Browse More Vehicles
                </Button>
              </CardContent>
            </Card>
          </Container>
        </main>
        <Footer />
      </div>
    );
  }

  // Booking Flow
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-gray-50 py-8">
        <Container size="md">
          <h1 className="text-3xl font-bold text-[#0c2340] text-center mb-2">
            Complete Your Booking
          </h1>
          <p className="text-slate-500 text-center mb-8">
            {currentStep === 'select-dates' ? 'Step 1 of 2: Select your dates' : 'Step 2 of 2: Your details'}
          </p>

          {/* Progress Bar */}
          <div className="flex items-center gap-2 mb-8 max-w-xs mx-auto">
            <div className={`h-2 flex-1 rounded-full ${currentStep === 'select-dates' ? 'bg-[#E8AC41]' : 'bg-[#E8AC41]'}`} />
            <div className={`h-2 flex-1 rounded-full ${currentStep === 'customer-info' ? 'bg-[#E8AC41]' : 'bg-slate-200'}`} />
          </div>

          {/* Vehicle Summary */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="w-20 h-14 bg-slate-100 rounded-lg flex items-center justify-center overflow-hidden">
                  {vehicle.thumbnail && vehicle.thumbnail !== '/vehicles/default-thumb.jpg' ? (
                    <Image
                      src={vehicle.thumbnail}
                      alt={vehicle.model}
                      width={80}
                      height={56}
                      className="object-contain"
                    />
                  ) : (
                    <Car className="h-8 w-8 text-slate-400" />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-[#0c2340]">
                    {vehicle.year} {vehicle.make} {vehicle.model}
                  </h3>
                  <p className="text-sm text-slate-500">
                    {vehicle.color} • {vehicle.seats} seats • {vehicle.transmission}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-[#0c2340]">{formatCurrency(vehicle.dailyRate)}</p>
                  <p className="text-xs text-slate-500">per day</p>
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
                  onSubmit={handleBookingSubmit}
                  isSubmitting={isSubmitting}
                />
              )}
            </div>

            <div className="space-y-4">
              {pricing && <PriceBreakdown vehicle={vehicle} pricing={pricing} />}
            </div>
          </div>
        </Container>
      </main>
      <Footer />
    </div>
  );
}
