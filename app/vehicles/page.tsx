'use client';

import { useState, useMemo } from 'react';
import { SlidersHorizontal, X, ChevronDown } from 'lucide-react';
import { Container } from '@/components/shared';
import { Header, Footer } from '@/components/layout';
import { VehicleGrid, VehicleFilters, VehicleFiltersState } from '@/components/vehicles';
import { getAvailableVehicles } from '@/data';

const initialFilters: VehicleFiltersState = {
  categories: [],
  transmission: [],
  fuelType: [],
  minPrice: 0,
  maxPrice: 500,
};

type SortOption = 'price-asc' | 'price-desc' | 'name-asc' | 'newest';

export default function VehiclesPage() {
  const [filters, setFilters] = useState<VehicleFiltersState>(initialFilters);
  const [sortBy, setSortBy] = useState<SortOption>('price-asc');
  const [showFilters, setShowFilters] = useState(false);

  const filteredAndSortedVehicles = useMemo(() => {
    let result = getAvailableVehicles();

    if (filters.categories.length > 0) {
      result = result.filter((v) => filters.categories.includes(v.category));
    }
    if (filters.transmission.length > 0) {
      result = result.filter((v) => filters.transmission.includes(v.transmission));
    }
    if (filters.fuelType.length > 0) {
      result = result.filter((v) => filters.fuelType.includes(v.fuelType));
    }

    switch (sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.dailyRate - b.dailyRate);
        break;
      case 'price-desc':
        result.sort((a, b) => b.dailyRate - a.dailyRate);
        break;
      case 'name-asc':
        result.sort((a, b) => `${a.make} ${a.model}`.localeCompare(`${b.make} ${b.model}`));
        break;
      case 'newest':
        result.sort((a, b) => b.year - a.year);
        break;
    }

    return result;
  }, [filters, sortBy]);

  const sortOptions = [
    { value: 'price-asc', label: 'Price: Low to High' },
    { value: 'price-desc', label: 'Price: High to Low' },
    { value: 'name-asc', label: 'Name: A to Z' },
    { value: 'newest', label: 'Newest First' },
  ];

  const activeFiltersCount =
    filters.categories.length +
    filters.transmission.length +
    filters.fuelType.length;

  return (
    <div className="min-h-screen flex flex-col bg-[#f7f5f2]">
      <Header />

      {/* Hero Section */}
      <div className="pt-[72px] relative overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=1920&q=80')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0c2340]/95 via-[#0c2340]/90 to-[#0c2340]/75" />

        <Container className="relative">
          <div className="py-16 md:py-20">
            <p className="text-[#ff6b5b] font-semibold text-sm uppercase tracking-wide mb-3">
              Our Fleet
            </p>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
              Find your perfect ride
            </h1>
            <p className="text-white/60 text-lg max-w-xl">
              Browse our extensive collection of quality vehicles and find the one that fits your needs and budget.
            </p>
          </div>
        </Container>
      </div>

      <main className="flex-1 py-8 md:py-12">
        <Container>
          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-4">
              {/* Mobile filter button */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-700 font-medium hover:border-slate-300 transition-colors"
              >
                <SlidersHorizontal className="h-4 w-4" />
                Filters
                {activeFiltersCount > 0 && (
                  <span className="w-5 h-5 bg-[#ff6b5b] text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {activeFiltersCount}
                  </span>
                )}
              </button>

              <p className="text-slate-600">
                <span className="font-semibold text-[#0c2340]">{filteredAndSortedVehicles.length}</span> vehicles available
              </p>
            </div>

            {/* Sort dropdown */}
            <div className="flex items-center gap-3">
              <span className="text-sm text-slate-500">Sort by:</span>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="appearance-none pl-4 pr-10 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 hover:border-slate-300 focus:border-[#0c2340] focus:ring-4 focus:ring-[#0c2340]/5 outline-none transition-all cursor-pointer"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Filters Sidebar - Desktop */}
            <div className="hidden lg:block lg:col-span-1">
              <div className="sticky top-24">
                <VehicleFilters
                  filters={filters}
                  onFilterChange={setFilters}
                  onReset={() => setFilters(initialFilters)}
                />
              </div>
            </div>

            {/* Mobile Filters Drawer */}
            {showFilters && (
              <div className="lg:hidden fixed inset-0 z-50">
                {/* Backdrop */}
                <div
                  className="absolute inset-0 bg-black/50"
                  onClick={() => setShowFilters(false)}
                />
                {/* Drawer */}
                <div className="absolute right-0 top-0 bottom-0 w-full max-w-sm bg-white animate-slide-in-right">
                  <div className="flex items-center justify-between p-4 border-b border-slate-200">
                    <h2 className="font-display font-bold text-lg">Filters</h2>
                    <button
                      onClick={() => setShowFilters(false)}
                      className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                  <div className="p-4 overflow-y-auto h-[calc(100vh-64px)]">
                    <VehicleFilters
                      filters={filters}
                      onFilterChange={setFilters}
                      onReset={() => setFilters(initialFilters)}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Vehicle Grid */}
            <div className="lg:col-span-3">
              <VehicleGrid vehicles={filteredAndSortedVehicles} />
            </div>
          </div>
        </Container>
      </main>

      <Footer />
    </div>
  );
}
