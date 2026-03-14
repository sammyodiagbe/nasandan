'use client';

import { useState, useEffect } from 'react';
import { format, addDays, differenceInDays, isSameDay } from 'date-fns';
import { DayPicker } from 'react-day-picker';
import { Calendar, Clock, MapPin, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, Select, Button } from '@/components/ui';
import { PICKUP_LOCATIONS, PICKUP_TIMES } from '@/types';
import { toISODateString, getMinBookingDate } from '@/lib/utils';
import { useBooking } from '@/lib/context';
import { getBookedDatesForVehicle } from '@/data';
import 'react-day-picker/style.css';

interface DateRangePickerProps {
  onContinue: () => void;
}

export function DateRangePicker({ onContinue }: DateRangePickerProps) {
  const { vehicle, dates, setDates, calculatePrice } = useBooking();
  const today = getMinBookingDate();

  const [pickupDate, setPickupDate] = useState<Date | undefined>(
    dates.startDate ? new Date(dates.startDate) : addDays(today, 1)
  );
  const [returnDate, setReturnDate] = useState<Date | undefined>(
    dates.endDate ? new Date(dates.endDate) : addDays(today, 4)
  );
  const [pickupTime, setPickupTime] = useState(dates.pickupTime || '10:00');
  const [returnTime, setReturnTime] = useState(dates.returnTime || '10:00');
  const [bookedDates, setBookedDates] = useState<Date[]>([]);
  const [loadingDates, setLoadingDates] = useState(true);
  const [dateConflict, setDateConflict] = useState(false);

  // Fetch booked dates when vehicle changes
  useEffect(() => {
    async function fetchBookedDates() {
      if (!vehicle?.id) {
        setLoadingDates(false);
        return;
      }

      setLoadingDates(true);
      const dates = await getBookedDatesForVehicle(vehicle.id);
      setBookedDates(dates);
      setLoadingDates(false);
    }

    fetchBookedDates();
  }, [vehicle?.id]);

  // Check for date conflicts
  useEffect(() => {
    if (!pickupDate || !returnDate || bookedDates.length === 0) {
      setDateConflict(false);
      return;
    }

    const hasConflict = bookedDates.some((bookedDate) => {
      return bookedDate >= pickupDate && bookedDate <= returnDate;
    });

    setDateConflict(hasConflict);
  }, [pickupDate, returnDate, bookedDates]);

  // Update context and pricing in real-time when dates change
  useEffect(() => {
    if (pickupDate && returnDate) {
      setDates({
        startDate: toISODateString(pickupDate),
        endDate: toISODateString(returnDate),
        pickupTime,
        returnTime,
      });
    }
  }, [pickupDate, returnDate, pickupTime, returnTime, setDates]);

  const numberOfDays = pickupDate && returnDate
    ? Math.max(1, differenceInDays(returnDate, pickupDate))
    : 0;

  const handleContinue = () => {
    if (!pickupDate || !returnDate) return;
    onContinue();
  };

  const timeOptions = PICKUP_TIMES.map((time) => ({
    value: time,
    label: format(new Date(`2000-01-01T${time}`), 'h:mm a'),
  }));

  const isValid = pickupDate && returnDate && pickupTime && returnTime && !dateConflict;

  // Disable past dates and booked dates
  const disabledDays = [
    { before: today },
    ...bookedDates.map(date => date),
  ];

  const modifiers = {
    booked: bookedDates,
  };

  const modifiersStyles = {
    booked: {
      backgroundColor: '#fee2e2',
      color: '#991b1b',
      textDecoration: 'line-through',
    },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Select Your Dates</CardTitle>
        {vehicle && (
          <p className="text-sm text-slate-500">
            Booking: {vehicle.year} {vehicle.make} {vehicle.model}
          </p>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Location Display */}
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
          <div className="flex items-center gap-2 text-slate-700">
            <MapPin className="h-5 w-5 text-[#E8AC41]" />
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wide">Pickup & Return Location</p>
              <p className="font-medium">{PICKUP_LOCATIONS[0]}</p>
            </div>
          </div>
        </div>

        {/* Calendar Legend */}
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-100 border border-red-200 rounded" />
            <span className="text-slate-600">Unavailable</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-[#E8AC41] rounded" />
            <span className="text-slate-600">Selected</span>
          </div>
        </div>

        {loadingDates ? (
          <div className="flex items-center justify-center py-8">
            <div className="w-8 h-8 border-4 border-slate-200 border-t-[#E8AC41] rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Pickup Date */}
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900 flex items-center gap-2">
                <Calendar className="h-4 w-4 text-[#0c2340]" />
                Pick-up Date
              </h4>
              <div className="border border-slate-200 rounded-lg p-3 bg-white">
                <DayPicker
                  mode="single"
                  selected={pickupDate}
                  onSelect={(date) => {
                    setPickupDate(date);
                    if (date && returnDate && date > returnDate) {
                      setReturnDate(addDays(date, 1));
                    }
                  }}
                  disabled={disabledDays}
                  modifiers={modifiers}
                  modifiersStyles={modifiersStyles}
                  showOutsideDays={false}
                  className="!font-sans"
                  classNames={{
                    today: 'border-2 border-[#0c2340]',
                    selected: 'bg-[#E8AC41] text-white hover:bg-[#D19830]',
                    root: 'text-sm',
                    day: 'h-9 w-9 rounded-lg hover:bg-slate-100 transition-colors',
                    caption_label: 'font-semibold text-[#0c2340]',
                    nav_button: 'h-7 w-7 bg-transparent hover:bg-slate-100 rounded-lg transition-colors',
                  }}
                />
              </div>
              <Select
                label={
                  <span className="flex items-center gap-1 text-sm">
                    <Clock className="h-4 w-4" />
                    Pickup Time
                  </span>
                }
                options={timeOptions}
                value={pickupTime}
                onChange={(e) => setPickupTime(e.target.value)}
              />
            </div>

            {/* Return Date */}
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900 flex items-center gap-2">
                <Calendar className="h-4 w-4 text-[#0c2340]" />
                Drop-off Date
              </h4>
              <div className="border border-slate-200 rounded-lg p-3 bg-white">
                <DayPicker
                  mode="single"
                  selected={returnDate}
                  onSelect={setReturnDate}
                  disabled={[
                    { before: pickupDate || today },
                    ...bookedDates,
                  ]}
                  modifiers={modifiers}
                  modifiersStyles={modifiersStyles}
                  showOutsideDays={false}
                  className="!font-sans"
                  classNames={{
                    today: 'border-2 border-[#0c2340]',
                    selected: 'bg-[#E8AC41] text-white hover:bg-[#D19830]',
                    root: 'text-sm',
                    day: 'h-9 w-9 rounded-lg hover:bg-slate-100 transition-colors',
                    caption_label: 'font-semibold text-[#0c2340]',
                    nav_button: 'h-7 w-7 bg-transparent hover:bg-slate-100 rounded-lg transition-colors',
                  }}
                />
              </div>
              <Select
                label={
                  <span className="flex items-center gap-1 text-sm">
                    <Clock className="h-4 w-4" />
                    Return Time
                  </span>
                }
                options={timeOptions}
                value={returnTime}
                onChange={(e) => setReturnTime(e.target.value)}
              />
            </div>
          </div>
        )}

        {/* Date Conflict Warning */}
        {dateConflict && (
          <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <p className="text-sm">
              Your selected dates include days that are already booked. Please choose different dates.
            </p>
          </div>
        )}

        {/* Duration Summary */}
        {numberOfDays > 0 && !dateConflict && (
          <div className="bg-[#0c2340]/5 rounded-lg p-4 text-center">
            <span className="text-[#0c2340] font-medium">
              Rental Duration: {numberOfDays} {numberOfDays === 1 ? 'day' : 'days'}
            </span>
            {pickupDate && returnDate && (
              <p className="text-sm text-slate-500 mt-1">
                {format(pickupDate, 'MMM d, yyyy')} — {format(returnDate, 'MMM d, yyyy')}
              </p>
            )}
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
