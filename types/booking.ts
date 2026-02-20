export type BookingStatus =
  | 'pending'
  | 'confirmed'
  | 'active'
  | 'completed'
  | 'cancelled';

export interface BookingDates {
  startDate: string;
  endDate: string;
  pickupTime: string;
  returnTime: string;
}

export interface BookingPricing {
  dailyRate: number;
  numberOfDays: number;
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  fees: {
    name: string;
    amount: number;
  }[];
  total: number;
}

export interface BookingExtras {
  insurance: boolean;
  gps: boolean;
  childSeat: boolean;
  additionalDriver: boolean;
}

export interface Booking {
  id: string;
  confirmationNumber: string;
  vehicleId: string;
  customerId: string;
  dates: BookingDates;
  pricing: BookingPricing;
  extras: BookingExtras;
  status: BookingStatus;
  pickupLocation: string;
  returnLocation: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export const BOOKING_STATUS_LABELS: Record<BookingStatus, string> = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  active: 'Active',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

export const BOOKING_STATUS_COLORS: Record<BookingStatus, string> = {
  pending: 'yellow',
  confirmed: 'blue',
  active: 'green',
  completed: 'gray',
  cancelled: 'red',
};

export const PICKUP_LOCATIONS = [
  'Main Office - 123 Downtown Ave',
  'Airport Terminal - Arrivals Hall',
  'Northside Branch - 456 Oak Street',
  'Eastside Location - 789 Elm Road',
] as const;

export const PICKUP_TIMES = [
  '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
  '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
  '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
  '17:00', '17:30', '18:00',
] as const;

export const EXTRAS_PRICING = {
  insurance: 15, // per day
  gps: 10, // per day
  childSeat: 8, // per day
  additionalDriver: 12, // per day
} as const;
