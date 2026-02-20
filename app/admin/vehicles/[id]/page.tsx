'use client';

import { use, useState } from 'react';
import { useRouter, notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { VehicleForm } from '@/components/admin';
import { getVehicleById, vehicles } from '@/data';
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

  const vehicle = getVehicleById(id);

  if (!vehicle) {
    notFound();
  }

  const handleSubmit = async (data: Partial<Vehicle>) => {
    setIsSubmitting(true);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    const index = vehicles.findIndex((v) => v.id === id);
    if (index !== -1) {
      vehicles[index] = {
        ...vehicles[index],
        ...data,
        updatedAt: new Date().toISOString(),
      };
    }

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
