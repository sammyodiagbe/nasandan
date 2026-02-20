'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, Input, Select, Button } from '@/components/ui';
import type { Vehicle, VehicleCategory, TransmissionType, FuelType, VehicleFeature } from '@/types';
import { VEHICLE_CATEGORIES, FEATURE_LABELS } from '@/types';

interface VehicleFormProps {
  vehicle?: Vehicle;
  onSubmit: (data: Partial<Vehicle>) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export function VehicleForm({ vehicle, onSubmit, onCancel, isSubmitting }: VehicleFormProps) {
  const [formData, setFormData] = useState({
    make: vehicle?.make || '',
    model: vehicle?.model || '',
    year: vehicle?.year || new Date().getFullYear(),
    category: vehicle?.category || 'compact',
    transmission: vehicle?.transmission || 'automatic',
    fuelType: vehicle?.fuelType || 'gasoline',
    seats: vehicle?.seats || 5,
    doors: vehicle?.doors || 4,
    luggage: vehicle?.luggage || 3,
    dailyRate: vehicle?.dailyRate || 50,
    weeklyRate: vehicle?.weeklyRate || 300,
    licensePlate: vehicle?.licensePlate || '',
    color: vehicle?.color || '',
    mileage: vehicle?.mileage || 0,
    description: vehicle?.description || '',
    features: vehicle?.features || [],
    status: vehicle?.status || 'available',
  });

  const handleChange = (field: string, value: string | number | string[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleFeature = (feature: VehicleFeature) => {
    const newFeatures = formData.features.includes(feature)
      ? formData.features.filter((f) => f !== feature)
      : [...formData.features, feature];
    handleChange('features', newFeatures);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const categoryOptions = Object.entries(VEHICLE_CATEGORIES).map(([value, { label }]) => ({
    value,
    label,
  }));

  const transmissionOptions = [
    { value: 'automatic', label: 'Automatic' },
    { value: 'manual', label: 'Manual' },
  ];

  const fuelOptions = [
    { value: 'gasoline', label: 'Gasoline' },
    { value: 'diesel', label: 'Diesel' },
    { value: 'hybrid', label: 'Hybrid' },
    { value: 'electric', label: 'Electric' },
  ];

  const statusOptions = [
    { value: 'available', label: 'Available' },
    { value: 'rented', label: 'Rented' },
    { value: 'maintenance', label: 'Maintenance' },
  ];

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-6">
        {/* Basic Info */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                label="Make"
                value={formData.make}
                onChange={(e) => handleChange('make', e.target.value)}
                required
              />
              <Input
                label="Model"
                value={formData.model}
                onChange={(e) => handleChange('model', e.target.value)}
                required
              />
              <Input
                label="Year"
                type="number"
                min={2000}
                max={2030}
                value={formData.year}
                onChange={(e) => handleChange('year', parseInt(e.target.value))}
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Select
                label="Category"
                options={categoryOptions}
                value={formData.category}
                onChange={(e) => handleChange('category', e.target.value)}
              />
              <Select
                label="Transmission"
                options={transmissionOptions}
                value={formData.transmission}
                onChange={(e) => handleChange('transmission', e.target.value)}
              />
              <Select
                label="Fuel Type"
                options={fuelOptions}
                value={formData.fuelType}
                onChange={(e) => handleChange('fuelType', e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Specifications */}
        <Card>
          <CardHeader>
            <CardTitle>Specifications</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Input
                label="Seats"
                type="number"
                min={2}
                max={15}
                value={formData.seats}
                onChange={(e) => handleChange('seats', parseInt(e.target.value))}
              />
              <Input
                label="Doors"
                type="number"
                min={2}
                max={5}
                value={formData.doors}
                onChange={(e) => handleChange('doors', parseInt(e.target.value))}
              />
              <Input
                label="Luggage"
                type="number"
                min={1}
                max={10}
                value={formData.luggage}
                onChange={(e) => handleChange('luggage', parseInt(e.target.value))}
              />
              <Input
                label="Mileage"
                type="number"
                min={0}
                value={formData.mileage}
                onChange={(e) => handleChange('mileage', parseInt(e.target.value))}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                label="License Plate"
                value={formData.licensePlate}
                onChange={(e) => handleChange('licensePlate', e.target.value)}
                required
              />
              <Input
                label="Color"
                value={formData.color}
                onChange={(e) => handleChange('color', e.target.value)}
                required
              />
              <Select
                label="Status"
                options={statusOptions}
                value={formData.status}
                onChange={(e) => handleChange('status', e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Pricing */}
        <Card>
          <CardHeader>
            <CardTitle>Pricing</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Daily Rate ($)"
                type="number"
                min={1}
                value={formData.dailyRate}
                onChange={(e) => handleChange('dailyRate', parseInt(e.target.value))}
                required
              />
              <Input
                label="Weekly Rate ($)"
                type="number"
                min={1}
                value={formData.weeklyRate}
                onChange={(e) => handleChange('weeklyRate', parseInt(e.target.value))}
                required
              />
            </div>
          </CardContent>
        </Card>

        {/* Features */}
        <Card>
          <CardHeader>
            <CardTitle>Features</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {(Object.entries(FEATURE_LABELS) as [VehicleFeature, string][]).map(([key, label]) => (
                <label
                  key={key}
                  className="flex items-center gap-2 text-sm cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={formData.features.includes(key)}
                    onChange={() => toggleFeature(key)}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  {label}
                </label>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Description */}
        <Card>
          <CardHeader>
            <CardTitle>Description</CardTitle>
          </CardHeader>
          <CardContent>
            <textarea
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              rows={4}
              className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
              placeholder="Enter vehicle description..."
            />
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isSubmitting}>
            {vehicle ? 'Update Vehicle' : 'Add Vehicle'}
          </Button>
        </div>
      </div>
    </form>
  );
}
