'use client';

import { MapPin, Calendar, Clock, User, CreditCard } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, Button } from '@/components/ui';
import { PriceBreakdown } from './PriceBreakdown';
import { useBooking } from '@/lib/context';
import { formatDate, formatTime } from '@/lib/utils';
import { PICKUP_LOCATIONS } from '@/types';

interface BookingReviewProps {
  onBack: () => void;
  onConfirm: () => void;
  isSubmitting: boolean;
}

export function BookingReview({ onBack, onConfirm, isSubmitting }: BookingReviewProps) {
  const { vehicle, dates, customerInfo, pricing } = useBooking();

  if (!vehicle || !pricing || !dates.startDate || !dates.endDate) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        {/* Vehicle Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Vehicle</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <div className="w-24 h-20 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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

        {/* Rental Details */}
        <Card>
          <CardHeader>
            <CardTitle>Rental Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <MapPin className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Pick-up</p>
                  <p className="text-sm text-gray-600">{PICKUP_LOCATIONS[0]}</p>
                  <p className="text-sm text-gray-500">
                    {formatDate(dates.startDate)} at {formatTime(dates.pickupTime || '10:00')}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <MapPin className="h-4 w-4 text-red-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Drop-off</p>
                  <p className="text-sm text-gray-600">{PICKUP_LOCATIONS[0]}</p>
                  <p className="text-sm text-gray-500">
                    {formatDate(dates.endDate)} at {formatTime(dates.returnTime || '10:00')}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Customer Info */}
        <Card>
          <CardHeader>
            <CardTitle>Customer Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Name</p>
                <p className="font-medium text-gray-900">
                  {customerInfo.firstName} {customerInfo.lastName}
                </p>
              </div>
              <div>
                <p className="text-gray-500">Email</p>
                <p className="font-medium text-gray-900">{customerInfo.email}</p>
              </div>
              <div>
                <p className="text-gray-500">Phone</p>
                <p className="font-medium text-gray-900">{customerInfo.phone}</p>
              </div>
              <div>
                <p className="text-gray-500">Driver&apos;s License</p>
                <p className="font-medium text-gray-900">
                  {customerInfo.driversLicenseNumber} ({customerInfo.driversLicenseState})
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-between pt-4">
          <Button variant="outline" onClick={onBack}>
            Back to Your Info
          </Button>
          <Button
            onClick={onConfirm}
            isLoading={isSubmitting}
            size="lg"
            leftIcon={<CreditCard className="h-5 w-5" />}
          >
            Confirm Booking
          </Button>
        </div>
      </div>

      <div>
        <PriceBreakdown vehicle={vehicle} pricing={pricing} />
      </div>
    </div>
  );
}
