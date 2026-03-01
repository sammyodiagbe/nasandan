'use client';

import { useState } from 'react';
import { ChevronDown, X, SlidersHorizontal } from 'lucide-react';
import { VEHICLE_CATEGORIES } from '@/types';
import type { VehicleCategory, TransmissionType, FuelType } from '@/types';
import { cn } from '@/lib/utils';

export interface VehicleFiltersState {
  categories: VehicleCategory[];
  transmission: TransmissionType[];
  fuelType: FuelType[];
  minPrice: number;
  maxPrice: number;
}

interface VehicleFiltersProps {
  filters: VehicleFiltersState;
  onFilterChange: (filters: VehicleFiltersState) => void;
  onReset: () => void;
}

export function VehicleFilters({ filters, onFilterChange, onReset }: VehicleFiltersProps) {
  const [openSection, setOpenSection] = useState<string | null>('category');

  const toggleCategory = (category: VehicleCategory) => {
    const newCategories = filters.categories.includes(category)
      ? filters.categories.filter((c) => c !== category)
      : [...filters.categories, category];
    onFilterChange({ ...filters, categories: newCategories });
  };

  const toggleTransmission = (transmission: TransmissionType) => {
    const newTransmission = filters.transmission.includes(transmission)
      ? filters.transmission.filter((t) => t !== transmission)
      : [...filters.transmission, transmission];
    onFilterChange({ ...filters, transmission: newTransmission });
  };

  const toggleFuelType = (fuelType: FuelType) => {
    const newFuelType = filters.fuelType.includes(fuelType)
      ? filters.fuelType.filter((f) => f !== fuelType)
      : [...filters.fuelType, fuelType];
    onFilterChange({ ...filters, fuelType: newFuelType });
  };

  const hasActiveFilters =
    filters.categories.length > 0 ||
    filters.transmission.length > 0 ||
    filters.fuelType.length > 0;

  const activeCount =
    filters.categories.length + filters.transmission.length + filters.fuelType.length;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-[#0c2340] rounded-lg flex items-center justify-center">
            <SlidersHorizontal className="h-4 w-4 text-white" />
          </div>
          <span className="font-display font-bold text-[#0c2340]">Filters</span>
          {activeCount > 0 && (
            <span className="px-2 py-0.5 text-xs font-semibold bg-[#E8AC41]/10 text-[#E8AC41] rounded-full">
              {activeCount}
            </span>
          )}
        </div>
        {hasActiveFilters && (
          <button
            onClick={onReset}
            className="text-sm text-slate-500 hover:text-[#E8AC41] flex items-center gap-1 transition-colors"
          >
            <X className="h-4 w-4" />
            Clear all
          </button>
        )}
      </div>

      {/* Category */}
      <FilterSection
        title="Category"
        isOpen={openSection === 'category'}
        onToggle={() => setOpenSection(openSection === 'category' ? null : 'category')}
        count={filters.categories.length}
      >
        <div className="space-y-3 px-6 pb-5">
          {(Object.entries(VEHICLE_CATEGORIES) as [VehicleCategory, { label: string }][]).map(
            ([key, { label }]) => (
              <label
                key={key}
                className="flex items-center gap-3 cursor-pointer group"
              >
                <input
                  type="checkbox"
                  checked={filters.categories.includes(key)}
                  onChange={() => toggleCategory(key)}
                  className="w-5 h-5 rounded border-2 border-slate-300 text-[#E8AC41] focus:ring-[#E8AC41]/20 focus:ring-offset-0 transition-colors cursor-pointer"
                />
                <span className="text-sm text-slate-600 group-hover:text-[#0c2340] transition-colors">
                  {label}
                </span>
              </label>
            )
          )}
        </div>
      </FilterSection>

      {/* Transmission */}
      <FilterSection
        title="Transmission"
        isOpen={openSection === 'transmission'}
        onToggle={() => setOpenSection(openSection === 'transmission' ? null : 'transmission')}
        count={filters.transmission.length}
      >
        <div className="space-y-3 px-6 pb-5">
          {[
            { key: 'automatic' as const, label: 'Automatic' },
            { key: 'manual' as const, label: 'Manual' },
          ].map(({ key, label }) => (
            <label
              key={key}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <input
                type="checkbox"
                checked={filters.transmission.includes(key)}
                onChange={() => toggleTransmission(key)}
                className="w-5 h-5 rounded border-2 border-slate-300 text-[#E8AC41] focus:ring-[#E8AC41]/20 focus:ring-offset-0 transition-colors cursor-pointer"
              />
              <span className="text-sm text-slate-600 group-hover:text-[#0c2340] transition-colors">
                {label}
              </span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Fuel Type */}
      <FilterSection
        title="Fuel Type"
        isOpen={openSection === 'fuelType'}
        onToggle={() => setOpenSection(openSection === 'fuelType' ? null : 'fuelType')}
        count={filters.fuelType.length}
      >
        <div className="space-y-3 px-6 pb-5">
          {[
            { key: 'gasoline' as const, label: 'Gasoline' },
            { key: 'diesel' as const, label: 'Diesel' },
            { key: 'hybrid' as const, label: 'Hybrid' },
            { key: 'electric' as const, label: 'Electric' },
          ].map(({ key, label }) => (
            <label
              key={key}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <input
                type="checkbox"
                checked={filters.fuelType.includes(key)}
                onChange={() => toggleFuelType(key)}
                className="w-5 h-5 rounded border-2 border-slate-300 text-[#E8AC41] focus:ring-[#E8AC41]/20 focus:ring-offset-0 transition-colors cursor-pointer"
              />
              <span className="text-sm text-slate-600 group-hover:text-[#0c2340] transition-colors">
                {label}
              </span>
            </label>
          ))}
        </div>
      </FilterSection>
    </div>
  );
}

interface FilterSectionProps {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  count?: number;
  children: React.ReactNode;
}

function FilterSection({ title, isOpen, onToggle, count, children }: FilterSectionProps) {
  return (
    <div className="border-t border-slate-100">
      <button
        onClick={onToggle}
        className="flex items-center justify-between w-full px-6 py-4 text-left hover:bg-slate-50 transition-colors"
      >
        <span className="font-semibold text-[#0c2340] flex items-center gap-2">
          {title}
          {count && count > 0 && (
            <span className="px-1.5 py-0.5 text-xs font-semibold bg-[#E8AC41]/10 text-[#E8AC41] rounded">
              {count}
            </span>
          )}
        </span>
        <ChevronDown
          className={cn('h-5 w-5 text-slate-400 transition-transform duration-200', isOpen && 'rotate-180')}
        />
      </button>
      <div className={cn('overflow-hidden transition-all duration-200', isOpen ? 'max-h-96' : 'max-h-0')}>
        {children}
      </div>
    </div>
  );
}
