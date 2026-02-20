'use client';

import { use } from 'react';
import { notFound, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Users,
  Fuel,
  Settings2,
  Briefcase,
  Calendar,
  ArrowLeft,
  Check,
  Shield,
  Star,
} from 'lucide-react';
import { Container } from '@/components/shared';
import { Header, Footer } from '@/components/layout';
import { BookingExtras, PriceBreakdown } from '@/components/booking';
import { getVehicleById } from '@/data';
import { useBooking, useToast } from '@/lib/context';
import { formatCurrency, toISODateString, getMinBookingDate, calculateRentalPrice } from '@/lib/utils';
import { VEHICLE_CATEGORIES, FEATURE_LABELS } from '@/types';
import { addDays } from 'date-fns';

interface VehicleDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function VehicleDetailPage({ params }: VehicleDetailPageProps) {
  const { id } = use(params);
  const router = useRouter();
  const { setVehicle, setDates, extras, calculatePrice, pricing } = useBooking();
  const { showToast } = useToast();

  const vehicle = getVehicleById(id);

  if (!vehicle) {
    notFound();
  }

  const categoryInfo = VEHICLE_CATEGORIES[vehicle.category];
  const today = getMinBookingDate();
  const defaultStartDate = toISODateString(addDays(today, 1));
  const defaultEndDate = toISODateString(addDays(today, 4));

  const handleBookNow = () => {
    setVehicle(vehicle);
    setDates({
      startDate: defaultStartDate,
      endDate: defaultEndDate,
      pickupTime: '10:00',
      returnTime: '10:00',
    });
    calculatePrice();
    router.push('/booking');
  };

  const defaultPricing = calculateRentalPrice(
    vehicle,
    new Date(defaultStartDate),
    new Date(defaultEndDate),
    extras
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#f7f5f2]">
      <Header />

      {/* Hero Header */}
      <div className="pt-[72px] bg-[#0c2340]">
        <Container>
          <div className="py-8">
            <Link
              href="/vehicles"
              className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors mb-6"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to vehicles
            </Link>
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="px-3 py-1 bg-white/10 text-white/90 text-xs font-semibold rounded-lg">
                {categoryInfo.label}
              </span>
              {vehicle.status !== 'available' && (
                <span className="px-3 py-1 bg-amber-500/20 text-amber-300 text-xs font-semibold rounded-lg">
                  {vehicle.status === 'rented' ? 'Currently Rented' : 'In Maintenance'}
                </span>
              )}
            </div>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-white">
              {vehicle.year} {vehicle.make} {vehicle.model}
            </h1>
          </div>
        </Container>
      </div>

      <main className="flex-1 py-8 md:py-12">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Hero Image */}
              <div className="relative h-72 md:h-96 bg-gradient-to-br from-slate-100 to-slate-50 rounded-2xl overflow-hidden border border-slate-200">
                {/* Car placeholder illustration */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative scale-150">
                    {/* Car body */}
                    <div className="w-28 h-14 bg-gradient-to-br from-slate-300 to-slate-400 rounded-xl" />
                    {/* Wheels */}
                    <div className="absolute -bottom-2 left-2 w-6 h-6 bg-slate-500 rounded-full border-4 border-slate-300" />
                    <div className="absolute -bottom-2 right-2 w-6 h-6 bg-slate-500 rounded-full border-4 border-slate-300" />
                    {/* Window */}
                    <div className="absolute top-1 left-6 right-6 h-5 bg-slate-200/80 rounded-t-lg" />
                  </div>
                </div>

                {/* Rating badge */}
                <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-lg">
                  <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
                  <span className="font-semibold text-[#0c2340] text-sm">4.9</span>
                </div>
              </div>

              {/* Vehicle Info */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8">
                <p className="text-slate-600 mb-8 leading-relaxed">{vehicle.description}</p>

                {/* Specs Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-6 border-y border-slate-100">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-[#f7f5f2] rounded-xl flex items-center justify-center mx-auto mb-3">
                      <Users className="h-5 w-5 text-[#0c2340]" />
                    </div>
                    <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Seats</p>
                    <p className="font-display font-bold text-[#0c2340]">{vehicle.seats} passengers</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-[#f7f5f2] rounded-xl flex items-center justify-center mx-auto mb-3">
                      <Settings2 className="h-5 w-5 text-[#0c2340]" />
                    </div>
                    <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Transmission</p>
                    <p className="font-display font-bold text-[#0c2340] capitalize">{vehicle.transmission}</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-[#f7f5f2] rounded-xl flex items-center justify-center mx-auto mb-3">
                      <Fuel className="h-5 w-5 text-[#0c2340]" />
                    </div>
                    <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Fuel Type</p>
                    <p className="font-display font-bold text-[#0c2340] capitalize">{vehicle.fuelType}</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-[#f7f5f2] rounded-xl flex items-center justify-center mx-auto mb-3">
                      <Briefcase className="h-5 w-5 text-[#0c2340]" />
                    </div>
                    <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Luggage</p>
                    <p className="font-display font-bold text-[#0c2340]">{vehicle.luggage} bags</p>
                  </div>
                </div>

                {/* Features */}
                <div className="mt-8">
                  <h3 className="font-display font-bold text-[#0c2340] mb-5">Included Features</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {vehicle.features.map((feature) => (
                      <div key={feature} className="flex items-center gap-3">
                        <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <Check className="h-3.5 w-3.5 text-emerald-600" />
                        </div>
                        <span className="text-slate-600 text-sm">{FEATURE_LABELS[feature]}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Additional Details */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8">
                <h3 className="font-display font-bold text-[#0c2340] mb-5">Vehicle Details</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Color</p>
                    <p className="font-semibold text-[#0c2340]">{vehicle.color}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Doors</p>
                    <p className="font-semibold text-[#0c2340]">{vehicle.doors}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Mileage</p>
                    <p className="font-semibold text-[#0c2340]">{vehicle.mileage.toLocaleString()} mi</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Booking Sidebar */}
            <div className="space-y-6">
              {/* Price Card */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 sticky top-24">
                <div className="text-center mb-6 pb-6 border-b border-slate-100">
                  <div className="font-display text-4xl font-bold text-[#0c2340]">
                    {formatCurrency(vehicle.dailyRate)}
                  </div>
                  <p className="text-slate-500">per day</p>
                  <p className="text-sm text-slate-400 mt-2">
                    Weekly rate: {formatCurrency(vehicle.weeklyRate)}
                  </p>
                </div>

                <button
                  onClick={handleBookNow}
                  disabled={vehicle.status !== 'available'}
                  className="w-full py-4 bg-[#ff6b5b] hover:bg-[#e85a4a] text-white font-semibold rounded-xl transition-all hover:shadow-lg hover:shadow-[#ff6b5b]/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mb-4"
                >
                  <Calendar className="h-5 w-5" />
                  {vehicle.status === 'available' ? 'Book Now' : 'Not Available'}
                </button>

                <div className="flex items-center justify-center gap-2 text-sm text-slate-500">
                  <Shield className="h-4 w-4 text-emerald-500" />
                  <span>Free cancellation up to 24 hours before</span>
                </div>
              </div>

              {/* Extras */}
              <BookingExtras />

              {/* Price Estimate */}
              <PriceBreakdown vehicle={vehicle} pricing={pricing || defaultPricing} />
            </div>
          </div>
        </Container>
      </main>
      <Footer />
    </div>
  );
}
