export type VehicleCategory =
  | 'economy'
  | 'compact'
  | 'midsize'
  | 'fullsize'
  | 'suv'
  | 'luxury'
  | 'van';

export type TransmissionType = 'automatic' | 'manual';
export type FuelType = 'gasoline' | 'diesel' | 'hybrid' | 'electric';
export type VehicleStatus = 'available' | 'rented' | 'maintenance';

export type VehicleFeature =
  | 'air_conditioning'
  | 'bluetooth'
  | 'backup_camera'
  | 'cruise_control'
  | 'gps_navigation'
  | 'heated_seats'
  | 'leather_seats'
  | 'sunroof'
  | 'apple_carplay'
  | 'android_auto'
  | 'usb_ports'
  | 'keyless_entry'
  | 'blind_spot_monitoring'
  | 'lane_assist'
  | 'parking_sensors'
  | 'all_wheel_drive'
  | 'child_seat_anchor'
  | 'roof_rack';

export interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  category: VehicleCategory;
  transmission: TransmissionType;
  fuelType: FuelType;
  seats: number;
  doors: number;
  luggage: number;
  dailyRate: number;
  weeklyRate: number;
  features: VehicleFeature[];
  images: string[];
  thumbnail: string;
  status: VehicleStatus;
  licensePlate: string;
  mileage: number;
  color: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export const VEHICLE_CATEGORIES: Record<VehicleCategory, { label: string; description: string }> = {
  economy: { label: 'Economy', description: 'Fuel-efficient and budget-friendly' },
  compact: { label: 'Compact', description: 'Perfect for city driving' },
  midsize: { label: 'Midsize', description: 'Balanced comfort and efficiency' },
  fullsize: { label: 'Full Size', description: 'Spacious and comfortable' },
  suv: { label: 'SUV', description: 'Adventure-ready with extra space' },
  luxury: { label: 'Luxury', description: 'Premium comfort and style' },
  van: { label: 'Van', description: 'Ideal for groups and cargo' },
};

export const FEATURE_LABELS: Record<VehicleFeature, string> = {
  air_conditioning: 'Air Conditioning',
  bluetooth: 'Bluetooth',
  backup_camera: 'Backup Camera',
  cruise_control: 'Cruise Control',
  gps_navigation: 'GPS Navigation',
  heated_seats: 'Heated Seats',
  leather_seats: 'Leather Seats',
  sunroof: 'Sunroof',
  apple_carplay: 'Apple CarPlay',
  android_auto: 'Android Auto',
  usb_ports: 'USB Ports',
  keyless_entry: 'Keyless Entry',
  blind_spot_monitoring: 'Blind Spot Monitoring',
  lane_assist: 'Lane Assist',
  parking_sensors: 'Parking Sensors',
  all_wheel_drive: 'All-Wheel Drive',
  child_seat_anchor: 'Child Seat Anchor',
  roof_rack: 'Roof Rack',
};
