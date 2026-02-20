'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { VehicleForm } from '@/components/admin';
import { vehicles } from '@/data';
import { useToast } from '@/lib/context';
import type { Vehicle } from '@/types';

export default function NewVehiclePage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: Partial<Vehicle>) => {
    setIsSubmitting(true);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    const newVehicle: Vehicle = {
      id: `v${vehicles.length + 1}`,
      make: data.make || '',
      model: data.model || '',
      year: data.year || new Date().getFullYear(),
      category: data.category || 'compact',
      transmission: data.transmission || 'automatic',
      fuelType: data.fuelType || 'gasoline',
      seats: data.seats || 5,
      doors: data.doors || 4,
      luggage: data.luggage || 3,
      dailyRate: data.dailyRate || 50,
      weeklyRate: data.weeklyRate || 300,
      features: data.features || [],
      images: [],
      thumbnail: '',
      status: data.status || 'available',
      licensePlate: data.licensePlate || '',
      mileage: data.mileage || 0,
      color: data.color || '',
      description: data.description || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    vehicles.push(newVehicle);

    showToast('Vehicle added successfully', 'success');
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
        <h1 className="text-2xl font-bold text-gray-900">Add New Vehicle</h1>
        <p className="text-gray-600">Add a new vehicle to your fleet</p>
      </div>

      {/* Form */}
      <VehicleForm
        onSubmit={handleSubmit}
        onCancel={() => router.push('/admin/vehicles')}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
