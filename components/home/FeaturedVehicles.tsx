import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Container } from '@/components/shared';
import { VehicleCard } from '@/components/vehicles';
import { getFeaturedVehicles } from '@/data';

export async function FeaturedVehicles() {
  const vehicles = await getFeaturedVehicles();

  return (
    <section className="py-20 md:py-28 bg-white">
      <Container>
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-12">
          <div>
            <p className="text-[#E8AC41] font-semibold text-sm uppercase tracking-wide mb-2">
              Popular choices
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-[#0c2340]">
              Featured vehicles
            </h2>
          </div>
          <Link
            href="/vehicles"
            className="group inline-flex items-center gap-2 text-[#0c2340] font-semibold hover:text-[#E8AC41] transition-colors"
          >
            View all vehicles
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Vehicle Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {vehicles.length > 0 ? (
            vehicles.map((vehicle, index) => (
              <div
                key={vehicle.id}
                className="animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <VehicleCard vehicle={vehicle} />
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12 text-slate-500">
              No vehicles available at the moment. Check back soon!
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}
