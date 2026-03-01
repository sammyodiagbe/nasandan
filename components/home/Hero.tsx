'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MapPin, Calendar, Search, ChevronDown, Star, Shield, Users } from 'lucide-react';
import { Container } from '@/components/shared';
import { PICKUP_LOCATIONS } from '@/types';
import { toISODateString, getMinBookingDate } from '@/lib/utils';

export function Hero() {
  const router = useRouter();
  const today = toISODateString(getMinBookingDate());
  const [pickupLocation, setPickupLocation] = useState('');
  const [pickupDate, setPickupDate] = useState(today);
  const [returnDate, setReturnDate] = useState('');

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (pickupLocation) params.set('location', pickupLocation);
    if (pickupDate) params.set('startDate', pickupDate);
    if (returnDate) params.set('endDate', returnDate);
    router.push(`/vehicles?${params.toString()}`);
  };

  return (
    <section className="relative min-h-[700px] flex items-center overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1920&q=80')`,
        }}
      />

      {/* Dark overlay with gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#0c2340]/95 via-[#0c2340]/85 to-[#0c2340]/70" />

      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 opacity-[0.03]">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="white" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Accent glow */}
      <div className="absolute top-20 right-[10%] w-[500px] h-[500px] bg-[#E8AC41]/20 rounded-full blur-[150px]" />

      <Container className="relative z-10 py-24 md:py-32">
        <div className="max-w-4xl mx-auto">
          {/* Badge */}
          <div className="flex justify-center mb-8 animate-fade-in">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/10 rounded-full px-4 py-2">
              <div className="flex -space-x-1">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="w-6 h-6 rounded-full bg-gradient-to-br from-amber-400 to-amber-500 border-2 border-[#0c2340] flex items-center justify-center">
                    <Star className="w-3 h-3 text-white fill-white" />
                  </div>
                ))}
              </div>
              <span className="text-sm font-medium text-white/90">Trusted by 50,000+ customers</span>
            </div>
          </div>

          {/* Headline */}
          <div className="text-center mb-10 animate-slide-up">
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 tracking-tight">
              Find your perfect
              <br />
              <span className="text-[#E8AC41]">rental car</span>
            </h1>
            <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto">
              Compare deals from top car rental companies. Book online in seconds with free cancellation on most bookings.
            </p>
          </div>

          {/* Search Card */}
          <div className="animate-slide-up stagger-2">
            <div className="bg-white rounded-2xl shadow-2xl shadow-black/20 p-6 md:p-8">
              <div className="grid grid-cols-1 md:grid-cols-[1fr,1fr,1fr,auto] gap-4">
                {/* Location */}
                <div className="relative">
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                    Pick-up Location
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <select
                      value={pickupLocation}
                      onChange={(e) => setPickupLocation(e.target.value)}
                      className="w-full pl-10 pr-10 py-3.5 text-[15px] font-medium text-slate-900 bg-slate-50 border-2 border-slate-100 rounded-xl appearance-none cursor-pointer hover:border-slate-200 focus:border-[#0c2340] focus:bg-white focus:ring-4 focus:ring-[#0c2340]/5 transition-all outline-none"
                    >
                      <option value="">Select location</option>
                      {PICKUP_LOCATIONS.map((loc) => (
                        <option key={loc} value={loc}>{loc}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 pointer-events-none" />
                  </div>
                </div>

                {/* Pickup Date */}
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                    Pick-up Date
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 pointer-events-none" />
                    <input
                      type="date"
                      min={today}
                      value={pickupDate}
                      onChange={(e) => setPickupDate(e.target.value)}
                      className="w-full pl-10 pr-4 py-3.5 text-[15px] font-medium text-slate-900 bg-slate-50 border-2 border-slate-100 rounded-xl hover:border-slate-200 focus:border-[#0c2340] focus:bg-white focus:ring-4 focus:ring-[#0c2340]/5 transition-all outline-none"
                    />
                  </div>
                </div>

                {/* Return Date */}
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                    Return Date
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 pointer-events-none" />
                    <input
                      type="date"
                      min={pickupDate || today}
                      value={returnDate}
                      onChange={(e) => setReturnDate(e.target.value)}
                      className="w-full pl-10 pr-4 py-3.5 text-[15px] font-medium text-slate-900 bg-slate-50 border-2 border-slate-100 rounded-xl hover:border-slate-200 focus:border-[#0c2340] focus:bg-white focus:ring-4 focus:ring-[#0c2340]/5 transition-all outline-none"
                    />
                  </div>
                </div>

                {/* Search Button */}
                <div className="flex items-end">
                  <button
                    onClick={handleSearch}
                    className="w-full md:w-auto px-8 py-3.5 bg-[#E8AC41] hover:bg-[#D19830] text-white font-semibold rounded-xl transition-all hover:shadow-lg hover:shadow-[#E8AC41]/25 flex items-center justify-center gap-2"
                  >
                    <Search className="h-5 w-5" />
                    <span>Search</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Trust indicators */}
          <div className="flex flex-wrap justify-center gap-6 md:gap-10 mt-10 animate-slide-up stagger-3">
            {[
              { icon: Shield, text: 'Free cancellation' },
              { icon: Star, text: 'Best price guarantee' },
              { icon: Users, text: '24/7 support' },
            ].map((item) => (
              <div key={item.text} className="flex items-center gap-2 text-white/70">
                <item.icon className="h-4 w-4" />
                <span className="text-sm font-medium">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
