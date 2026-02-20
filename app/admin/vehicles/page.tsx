'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Plus, Edit, Trash2, MoreVertical } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, Button, Badge, Modal } from '@/components/ui';
import { vehicles } from '@/data';
import { formatCurrency } from '@/lib/utils';
import { VEHICLE_CATEGORIES } from '@/types';
import { useToast } from '@/lib/context';
import type { Vehicle } from '@/types';

export default function AdminVehiclesPage() {
  const { showToast } = useToast();
  const [vehicleList, setVehicleList] = useState(vehicles);
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; vehicle: Vehicle | null }>({
    open: false,
    vehicle: null,
  });

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'available': return 'success';
      case 'rented': return 'info';
      case 'maintenance': return 'warning';
      default: return 'default';
    }
  };

  const handleDelete = () => {
    if (deleteModal.vehicle) {
      const index = vehicles.findIndex((v) => v.id === deleteModal.vehicle!.id);
      if (index !== -1) {
        vehicles.splice(index, 1);
        setVehicleList([...vehicles]);
        showToast('Vehicle deleted successfully', 'success');
      }
    }
    setDeleteModal({ open: false, vehicle: null });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Vehicles</h1>
          <p className="text-gray-600">Manage your vehicle fleet</p>
        </div>
        <Link href="/admin/vehicles/new">
          <Button leftIcon={<Plus className="h-4 w-4" />}>Add Vehicle</Button>
        </Link>
      </div>

      {/* Vehicle Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vehicle
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Daily Rate
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    License
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {vehicleList.map((vehicle) => (
                  <tr key={vehicle.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-10 bg-gray-100 rounded flex items-center justify-center text-gray-400">
                          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                          </svg>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {vehicle.year} {vehicle.make} {vehicle.model}
                          </p>
                          <p className="text-sm text-gray-500">{vehicle.color}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-900">
                        {VEHICLE_CATEGORIES[vehicle.category].label}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-gray-900">
                        {formatCurrency(vehicle.dailyRate)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={getStatusBadgeVariant(vehicle.status)}>
                        {vehicle.status.charAt(0).toUpperCase() + vehicle.status.slice(1)}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-mono text-gray-500">{vehicle.licensePlate}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/admin/vehicles/${vehicle.id}`}>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDeleteModal({ open: true, vehicle })}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, vehicle: null })}
        title="Delete Vehicle"
        description="Are you sure you want to delete this vehicle? This action cannot be undone."
      >
        {deleteModal.vehicle && (
          <div className="space-y-4">
            <p className="text-gray-600">
              You are about to delete:{' '}
              <span className="font-medium text-gray-900">
                {deleteModal.vehicle.year} {deleteModal.vehicle.make} {deleteModal.vehicle.model}
              </span>
            </p>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setDeleteModal({ open: false, vehicle: null })}>
                Cancel
              </Button>
              <Button variant="danger" onClick={handleDelete}>
                Delete
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
