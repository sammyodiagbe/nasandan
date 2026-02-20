import { z } from 'zod';

export const customerInfoSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(10, 'Please enter a valid phone number'),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  driversLicenseNumber: z.string().min(5, 'Please enter a valid license number'),
  driversLicenseState: z.string().min(2, 'Please select a state'),
  driversLicenseExpiration: z.string().min(1, 'License expiration date is required'),
  street: z.string().min(5, 'Please enter your street address'),
  city: z.string().min(2, 'Please enter your city'),
  state: z.string().min(2, 'Please select a state'),
  zipCode: z.string().min(5, 'Please enter a valid ZIP code'),
});

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const registerSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
  phone: z.string().min(10, 'Please enter a valid phone number'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

export const vehicleSchema = z.object({
  make: z.string().min(1, 'Make is required'),
  model: z.string().min(1, 'Model is required'),
  year: z.number().min(2000).max(2030),
  category: z.enum(['economy', 'compact', 'midsize', 'fullsize', 'suv', 'luxury', 'van']),
  transmission: z.enum(['automatic', 'manual']),
  fuelType: z.enum(['gasoline', 'diesel', 'hybrid', 'electric']),
  seats: z.number().min(2).max(15),
  doors: z.number().min(2).max(5),
  luggage: z.number().min(1).max(10),
  dailyRate: z.number().min(1),
  weeklyRate: z.number().min(1),
  licensePlate: z.string().min(1, 'License plate is required'),
  color: z.string().min(1, 'Color is required'),
  description: z.string().optional(),
});

export type CustomerInfoFormData = z.infer<typeof customerInfoSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type VehicleFormData = z.infer<typeof vehicleSchema>;
