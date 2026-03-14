import type { Vehicle, VehicleCategory, FuelType } from '@/types';
import { supabase, type DbCar } from '@/lib/supabase';

// Map database fuel_type to app FuelType
function mapFuelType(dbFuelType: string): FuelType {
  const fuelMap: Record<string, FuelType> = {
    gas: 'gasoline',
    gasoline: 'gasoline',
    diesel: 'diesel',
    hybrid: 'hybrid',
    electric: 'electric',
  };
  return fuelMap[dbFuelType.toLowerCase()] || 'gasoline';
}

// Determine category based on model name
function determineCategory(make: string, model: string): VehicleCategory {
  const modelLower = model.toLowerCase();
  const makeLower = make.toLowerCase();

  if (modelLower.includes('suv') || modelLower.includes('cherokee') || modelLower.includes('cr-v')) {
    return 'suv';
  }
  if (modelLower.includes('van') || modelLower.includes('sienna') || modelLower.includes('pacifica')) {
    return 'van';
  }
  if (modelLower.includes('malibu') || modelLower.includes('elantra')) {
    return 'midsize';
  }
  if (modelLower.includes('sonic') || modelLower.includes('versa')) {
    return 'economy';
  }
  if (modelLower.includes('cruze') || modelLower.includes('corolla')) {
    return 'compact';
  }
  if (makeLower.includes('bmw') || makeLower.includes('mercedes') || modelLower.includes('mustang')) {
    return 'luxury';
  }
  return 'compact';
}

// Convert database car to app Vehicle type
function dbCarToVehicle(car: DbCar): Vehicle {
  const category = determineCategory(car.make, car.model);
  const dailyRate = Number(car.price_per_day);

  return {
    id: car.id,
    make: car.make,
    model: car.model,
    year: car.year,
    category,
    transmission: 'automatic',
    fuelType: mapFuelType(car.fuel_type),
    seats: car.passengers,
    doors: car.doors,
    luggage: 3,
    dailyRate,
    weeklyRate: Math.round(dailyRate * 6),
    features: ['air_conditioning', 'bluetooth', 'backup_camera', 'cruise_control', 'usb_ports'],
    images: car.image_url ? [car.image_url] : [],
    thumbnail: car.image_url || '/vehicles/default-thumb.jpg',
    status: car.available ? 'available' : 'rented',
    licensePlate: '',
    mileage: 0,
    color: car.color,
    description: `${car.year} ${car.make} ${car.model} - A reliable ${category} vehicle perfect for your rental needs. Features ${car.doors} doors and seats ${car.passengers} passengers comfortably.`,
    createdAt: car.created_at,
    updatedAt: car.updated_at,
  };
}

// Fetch all vehicles from Supabase
export async function getVehicles(): Promise<Vehicle[]> {
  const { data, error } = await supabase
    .from('cars')
    .select('*')
    .order('make', { ascending: true });

  if (error) {
    console.error('Error fetching vehicles:', error);
    return [];
  }

  return (data || []).map(dbCarToVehicle);
}

// Fetch a single vehicle by ID
export async function getVehicleById(id: string): Promise<Vehicle | undefined> {
  const { data, error } = await supabase
    .from('cars')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) {
    console.error('Error fetching vehicle:', error);
    return undefined;
  }

  return dbCarToVehicle(data);
}

// Fetch available vehicles
export async function getAvailableVehicles(): Promise<Vehicle[]> {
  const { data, error } = await supabase
    .from('cars')
    .select('*')
    .eq('available', true)
    .order('make', { ascending: true });

  if (error) {
    console.error('Error fetching available vehicles:', error);
    return [];
  }

  return (data || []).map(dbCarToVehicle);
}

// Fetch vehicles by category
export async function getVehiclesByCategory(category: string): Promise<Vehicle[]> {
  const vehicles = await getAvailableVehicles();
  return vehicles.filter((v) => v.category === category);
}

// Fetch featured vehicles (first 4 available)
export async function getFeaturedVehicles(): Promise<Vehicle[]> {
  const { data, error } = await supabase
    .from('cars')
    .select('*')
    .eq('available', true)
    .limit(4);

  if (error) {
    console.error('Error fetching featured vehicles:', error);
    return [];
  }

  return (data || []).map(dbCarToVehicle);
}

// Legacy sync exports for backwards compatibility (empty arrays, use async versions)
export const vehicles: Vehicle[] = [];
