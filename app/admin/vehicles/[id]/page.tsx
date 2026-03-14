'use client';

import { use, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { VehicleForm } from '@/components/admin';
import { LoadingSpinner } from '@/components/shared';
import { getVehicleById } from '@/data';
import { useToast } from '@/lib/context';
import type { Vehicle } from '@/types';

interface EditVehiclePageProps {
  params: Promise<{ id: string }>;
}

export default function EditVehiclePage({ params }: EditVehiclePageProps) {
  const { id } = use(params);
  const router = useRouter();
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchVehicle() {
      const foundVehicle = await getVehicleById(id);
      setVehicle(foundVehicle || null);
      setLoading(false);
    }
    fetchVehicle();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="text-center py-20">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Vehicle Not Found</h1>
        <Link href="/admin/vehicles" className="text-blue-600 hover:underline">
          Back to Vehicles
        </Link>
      </div>
    );
  }

  const handleSubmit = async (data: Partial<Vehicle>) => {
    setIsSubmitting(true);

    // In a real app, this would update the vehicle in Supabase
    await new Promise((resolve) => setTimeout(resolve, 1000));

    showToast('Vehicle updated successfully', 'success');
    setIsSubmitting(false);
    router.push('/admin/vehicles');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Link
          href="/admin/vehicles"
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Vehicles
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Edit Vehicle</h1>
        <p className="text-gray-600">
          {vehicle.year} {vehicle.make} {vehicle.model}
        </p>
      </div>

      {/* Form */}
      <VehicleForm
        vehicle={vehicle}
        onSubmit={handleSubmit}
        onCancel={() => router.push('/admin/vehicles')}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
