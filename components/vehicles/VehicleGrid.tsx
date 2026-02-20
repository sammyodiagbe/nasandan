import { Car } from 'lucide-react';
import { VehicleCard } from './VehicleCard';
import { EmptyState } from '@/components/shared';
import type { Vehicle } from '@/types';

interface VehicleGridProps {
  vehicles: Vehicle[];
}

export function VehicleGrid({ vehicles }: VehicleGridProps) {
  if (vehicles.length === 0) {
    return (
      <EmptyState
        icon={Car}
        title="No vehicles found"
        description="Try adjusting your filters or search criteria to find available vehicles."
      />
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {vehicles.map((vehicle) => (
        <VehicleCard key={vehicle.id} vehicle={vehicle} />
      ))}
    </div>
  );
}
