'use client';

import { useState, useEffect } from 'react';
import { format, addDays, differenceInDays } from 'date-fns';
import { Calendar, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, Select, Button } from '@/components/ui';
import { PICKUP_LOCATIONS, PICKUP_TIMES } from '@/types';
import { toISODateString, getMinBookingDate } from '@/lib/utils';
import { useBooking } from '@/lib/context';

interface DateRangePickerProps {
  onContinue: () => void;
}

export function DateRangePicker({ onContinue }: DateRangePickerProps) {
  const { dates, setDates, calculatePrice } = useBooking();
  const today = getMinBookingDate();
  const minDate = toISODateString(today);

  const [pickupLocation, setPickupLocation] = useState(dates.startDate ? '' : PICKUP_LOCATIONS[0]);
  const [returnLocation, setReturnLocation] = useState(dates.endDate ? '' : PICKUP_LOCATIONS[0]);
  const [pickupDate, setPickupDate] = useState(dates.startDate || toISODateString(addDays(today, 1)));
  const [returnDate, setReturnDate] = useState(dates.endDate || toISODateString(addDays(today, 4)));
  const [pickupTime, setPickupTime] = useState(dates.pickupTime || '10:00');
  const [returnTime, setReturnTime] = useState(dates.returnTime || '10:00');

  useEffect(() => {
    if (dates.startDate) setPickupDate(dates.startDate);
    if (dates.endDate) setReturnDate(dates.endDate);
    if (dates.pickupTime) setPickupTime(dates.pickupTime);
    if (dates.returnTime) setReturnTime(dates.returnTime);
  }, [dates]);

  const numberOfDays = pickupDate && returnDate
    ? Math.max(1, differenceInDays(new Date(returnDate), new Date(pickupDate)))
    : 0;

  const handleContinue = () => {
    setDates({
      startDate: pickupDate,
      endDate: returnDate,
      pickupTime,
      returnTime,
    });
    calculatePrice();
    onContinue();
  };

  const locationOptions = PICKUP_LOCATIONS.map((loc) => ({ value: loc, label: loc }));
  const timeOptions = PICKUP_TIMES.map((time) => ({
    value: time,
    label: format(new Date(`2000-01-01T${time}`), 'h:mm a'),
  }));

  const isValid = pickupDate && returnDate && pickupLocation && returnLocation && pickupTime && returnTime;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Select Your Dates</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Pickup */}
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Pick-up</h4>
            <Select
              label="Location"
              options={locationOptions}
              value={pickupLocation}
              onChange={(e) => setPickupLocation(e.target.value)}
            />
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  <Calendar className="h-4 w-4 inline mr-1" />
                  Date
                </label>
                <input
                  type="date"
                  min={minDate}
                  value={pickupDate}
                  onChange={(e) => {
                    setPickupDate(e.target.value);
                    if (returnDate && e.target.value > returnDate) {
                      setReturnDate(e.target.value);
                    }
                  }}
                  className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                />
              </div>
              <Select
                label={
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    Time
                  </span>
                }
                options={timeOptions}
                value={pickupTime}
                onChange={(e) => setPickupTime(e.target.value)}
              />
            </div>
          </div>

          {/* Return */}
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Drop-off</h4>
            <Select
              label="Location"
              options={locationOptions}
              value={returnLocation}
              onChange={(e) => setReturnLocation(e.target.value)}
            />
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  <Calendar className="h-4 w-4 inline mr-1" />
                  Date
                </label>
                <input
                  type="date"
                  min={pickupDate || minDate}
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                  className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                />
              </div>
              <Select
                label={
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    Time
                  </span>
                }
                options={timeOptions}
                value={returnTime}
                onChange={(e) => setReturnTime(e.target.value)}
              />
            </div>
          </div>
        </div>

        {numberOfDays > 0 && (
          <div className="bg-blue-50 rounded-lg p-4 text-center">
            <span className="text-blue-700 font-medium">
              Rental Duration: {numberOfDays} {numberOfDays === 1 ? 'day' : 'days'}
            </span>
          </div>
        )}

        <div className="flex justify-end pt-4 border-t border-gray-100">
          <Button onClick={handleContinue} disabled={!isValid} size="lg">
            Continue to Your Info
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
