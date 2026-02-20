import Link from 'next/link';
import { Users, Fuel, Settings2, ArrowRight } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import type { Vehicle } from '@/types';
import { VEHICLE_CATEGORIES } from '@/types';

interface VehicleCardProps {
  vehicle: Vehicle;
}

export function VehicleCard({ vehicle }: VehicleCardProps) {
  const categoryInfo = VEHICLE_CATEGORIES[vehicle.category];

  return (
    <Link href={`/vehicles/${vehicle.id}`} className="block group">
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden transition-all duration-300 hover:border-slate-300 hover:shadow-lg hover:shadow-slate-200/50 hover:-translate-y-1">
        {/* Image Area */}
        <div className="relative h-44 bg-gradient-to-br from-slate-100 to-slate-50 overflow-hidden">
          {/* Car placeholder illustration */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative">
              {/* Car body */}
              <div className="w-28 h-14 bg-gradient-to-br from-slate-300 to-slate-400 rounded-xl transform group-hover:scale-105 transition-transform duration-300" />
              {/* Wheels */}
              <div className="absolute -bottom-2 left-2 w-6 h-6 bg-slate-500 rounded-full border-4 border-slate-300" />
              <div className="absolute -bottom-2 right-2 w-6 h-6 bg-slate-500 rounded-full border-4 border-slate-300" />
              {/* Window */}
              <div className="absolute top-1 left-6 right-6 h-5 bg-slate-200/80 rounded-t-lg" />
            </div>
          </div>

          {/* Category Badge */}
          <div className="absolute top-3 left-3">
            <span className="inline-block px-2.5 py-1 bg-white/90 backdrop-blur-sm text-xs font-semibold text-[#0c2340] rounded-lg">
              {categoryInfo.label}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          {/* Title */}
          <h3 className="font-display font-bold text-[#0c2340] text-lg mb-1 group-hover:text-[#ff6b5b] transition-colors">
            {vehicle.make} {vehicle.model}
          </h3>
          <p className="text-sm text-slate-500 mb-4">{vehicle.year}</p>

          {/* Features */}
          <div className="flex items-center gap-4 mb-5">
            <div className="flex items-center gap-1.5 text-slate-500">
              <Users className="h-4 w-4" />
              <span className="text-sm">{vehicle.seats}</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-500">
              <Settings2 className="h-4 w-4" />
              <span className="text-sm">{vehicle.transmission === 'automatic' ? 'Auto' : 'Manual'}</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-500">
              <Fuel className="h-4 w-4" />
              <span className="text-sm capitalize">{vehicle.fuelType}</span>
            </div>
          </div>

          {/* Price & CTA */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <div>
              <span className="font-display text-2xl font-bold text-[#0c2340]">
                {formatCurrency(vehicle.dailyRate)}
              </span>
              <span className="text-slate-500 text-sm">/day</span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#ff6b5b] flex items-center justify-center group-hover:bg-[#e85a4a] transition-colors">
              <ArrowRight className="h-5 w-5 text-white group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
