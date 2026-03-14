'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MapPin, Calendar, Search } from 'lucide-react';
import { Button } from '@/components/ui';
import { PICKUP_LOCATIONS } from '@/types';
import { toISODateString, getMinBookingDate } from '@/lib/utils';

export function SearchWidget() {
  const router = useRouter();
  const today = toISODateString(getMinBookingDate());
  const [pickupDate, setPickupDate] = useState(today);
  const [returnDate, setReturnDate] = useState('');

  const handleSearch = () => {
    const params = new URLSearchParams();
    params.set('location', PICKUP_LOCATIONS[0]);
    if (pickupDate) params.set('startDate', pickupDate);
    if (returnDate) params.set('endDate', returnDate);

    router.push(`/vehicles?${params.toString()}`);
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6">
        {/* Pickup Location */}
        <div className="md:col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <MapPin className="h-4 w-4 inline-block mr-1" />
            Pickup Location
          </label>
          <div className="flex items-center gap-2 px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700">
            <MapPin className="h-4 w-4 text-slate-400 flex-shrink-0" />
            <span className="text-sm font-medium">{PICKUP_LOCATIONS[0]}</span>
          </div>
        </div>

        {/* Pickup Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Calendar className="h-4 w-4 inline-block mr-1" />
            Pickup Date
          </label>
          <input
            type="date"
            min={today}
            value={pickupDate}
            onChange={(e) => setPickupDate(e.target.value)}
            className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
          />
        </div>

        {/* Return Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Calendar className="h-4 w-4 inline-block mr-1" />
            Return Date
          </label>
          <input
            type="date"
            min={pickupDate || today}
            value={returnDate}
            onChange={(e) => setReturnDate(e.target.value)}
            className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
          />
        </div>

        {/* Search Button */}
        <div className="flex items-end">
          <Button
            onClick={handleSearch}
            className="w-full"
            size="lg"
            leftIcon={<Search className="h-5 w-5" />}
          >
            Search Cars
          </Button>
        </div>
      </div>
    </div>
  );
}
