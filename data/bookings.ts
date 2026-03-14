import type { Booking } from '@/types';

export const bookings: Booking[] = [
  {
    id: 'b1',
    confirmationNumber: 'NR-2024-001',
    vehicleId: 'v7',
    customerId: 'c1',
    dates: {
      startDate: '2025-02-15',
      endDate: '2025-02-20',
      pickupTime: '10:00',
      returnTime: '10:00',
    },
    pricing: {
      dailyRate: 135,
      numberOfDays: 5,
      subtotal: 675,
      taxRate: 0.085,
      taxAmount: 57.38,
      fees: [
        { name: 'Insurance Coverage', amount: 75 },
      ],
      total: 807.38,
    },
    extras: {
      insurance: true,
      gps: false,
      childSeat: false,
      additionalDriver: false,
    },
    status: 'active',
    pickupLocation: 'Main Office - 123 Downtown Ave',
    returnLocation: 'Main Office - 123 Downtown Ave',
    notes: '',
    createdAt: '2025-02-10T14:30:00Z',
    updatedAt: '2025-02-15T10:05:00Z',
  },
  {
    id: 'b2',
    confirmationNumber: 'NR-2024-002',
    vehicleId: 'v2',
    customerId: 'c2',
    dates: {
      startDate: '2025-02-22',
      endDate: '2025-02-25',
      pickupTime: '14:00',
      returnTime: '14:00',
    },
    pricing: {
      dailyRate: 75,
      numberOfDays: 3,
      subtotal: 225,
      taxRate: 0.085,
      taxAmount: 19.13,
      fees: [],
      total: 244.13,
    },
    extras: {
      insurance: false,
      gps: false,
      childSeat: false,
      additionalDriver: false,
    },
    status: 'confirmed',
    pickupLocation: 'Airport Terminal - Arrivals Hall',
    returnLocation: 'Airport Terminal - Arrivals Hall',
    notes: 'Flight arrives at 1:30pm',
    createdAt: '2025-02-18T09:15:00Z',
    updatedAt: '2025-02-18T09:15:00Z',
  },
  {
    id: 'b3',
    confirmationNumber: 'NR-2024-003',
    vehicleId: 'v1',
    customerId: 'c3',
    dates: {
      startDate: '2025-02-10',
      endDate: '2025-02-12',
      pickupTime: '09:00',
      returnTime: '17:00',
    },
    pricing: {
      dailyRate: 45,
      numberOfDays: 2,
      subtotal: 90,
      taxRate: 0.085,
      taxAmount: 7.65,
      fees: [
        { name: 'GPS Navigation', amount: 20 },
      ],
      total: 117.65,
    },
    extras: {
      insurance: false,
      gps: true,
      childSeat: false,
      additionalDriver: false,
    },
    status: 'completed',
    pickupLocation: 'Main Office - 123 Downtown Ave',
    returnLocation: 'Northside Branch - 456 Oak Street',
    notes: '',
    createdAt: '2025-02-05T16:20:00Z',
    updatedAt: '2025-02-12T17:30:00Z',
  },
  {
    id: 'b4',
    confirmationNumber: 'NR-2024-004',
    vehicleId: 'v5',
    customerId: 'c1',
    dates: {
      startDate: '2025-02-08',
      endDate: '2025-02-09',
      pickupTime: '08:00',
      returnTime: '08:00',
    },
    pricing: {
      dailyRate: 55,
      numberOfDays: 1,
      subtotal: 55,
      taxRate: 0.085,
      taxAmount: 4.68,
      fees: [],
      total: 59.68,
    },
    extras: {
      insurance: false,
      gps: false,
      childSeat: false,
      additionalDriver: false,
    },
    status: 'completed',
    pickupLocation: 'Eastside Location - 789 Elm Road',
    returnLocation: 'Eastside Location - 789 Elm Road',
    notes: '',
    createdAt: '2025-02-07T11:00:00Z',
    updatedAt: '2025-02-09T08:15:00Z',
  },
  {
    id: 'b5',
    confirmationNumber: 'NR-2024-005',
    vehicleId: 'v6',
    customerId: 'c4',
    dates: {
      startDate: '2025-03-01',
      endDate: '2025-03-08',
      pickupTime: '10:00',
      returnTime: '10:00',
    },
    pricing: {
      dailyRate: 95,
      numberOfDays: 7,
      subtotal: 570,
      taxRate: 0.085,
      taxAmount: 48.45,
      fees: [
        { name: 'Insurance Coverage', amount: 105 },
        { name: 'Child Seat', amount: 56 },
      ],
      total: 779.45,
    },
    extras: {
      insurance: true,
      gps: false,
      childSeat: true,
      additionalDriver: false,
    },
    status: 'pending',
    pickupLocation: 'Main Office - 123 Downtown Ave',
    returnLocation: 'Main Office - 123 Downtown Ave',
    notes: 'Family vacation - need car seat for toddler',
    createdAt: '2025-02-19T10:45:00Z',
    updatedAt: '2025-02-19T10:45:00Z',
  },
  {
    id: 'b6',
    confirmationNumber: 'NR-2024-006',
    vehicleId: 'v3',
    customerId: 'c5',
    dates: {
      startDate: '2025-02-01',
      endDate: '2025-02-03',
      pickupTime: '12:00',
      returnTime: '12:00',
    },
    pricing: {
      dailyRate: 120,
      numberOfDays: 2,
      subtotal: 240,
      taxRate: 0.085,
      taxAmount: 20.40,
      fees: [],
      total: 260.40,
    },
    extras: {
      insurance: false,
      gps: false,
      childSeat: false,
      additionalDriver: false,
    },
    status: 'cancelled',
    pickupLocation: 'Airport Terminal - Arrivals Hall',
    returnLocation: 'Airport Terminal - Arrivals Hall',
    notes: 'Customer cancelled due to flight change',
    createdAt: '2025-01-25T08:30:00Z',
    updatedAt: '2025-01-30T14:00:00Z',
  },
];

export function getBookingById(id: string): Booking | undefined {
  return bookings.find((b) => b.id === id);
}

export function getBookingByConfirmation(confirmationNumber: string): Booking | undefined {
  return bookings.find((b) => b.confirmationNumber.toLowerCase() === confirmationNumber.toLowerCase());
}

export function getBookingsByCustomerId(customerId: string): Booking[] {
  return bookings.filter((b) => b.customerId === customerId);
}

export function getRecentBookings(limit: number = 5): Booking[] {
  return [...bookings]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit);
}

export function generateConfirmationNumber(): string {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `NR-${year}-${random}`;
}

// Supabase booking functions
import { supabase } from '@/lib/supabase';
import { eachDayOfInterval, parseISO } from 'date-fns';

export interface BookedDateRange {
  start_date: string;
  end_date: string;
}

// Fetch booked date ranges for a specific vehicle
export async function getBookedDatesForVehicle(vehicleId: string): Promise<Date[]> {
  const { data, error } = await supabase
    .from('bookings')
    .select('start_date, end_date')
    .eq('car_id', vehicleId)
    .in('status', ['confirmed', 'active', 'pending'])
    .gte('end_date', new Date().toISOString().split('T')[0]);

  if (error) {
    console.error('Error fetching booked dates:', error);
    return [];
  }

  // Convert date ranges to individual dates
  const bookedDates: Date[] = [];
  for (const booking of data || []) {
    const dates = eachDayOfInterval({
      start: parseISO(booking.start_date),
      end: parseISO(booking.end_date),
    });
    bookedDates.push(...dates);
  }

  return bookedDates;
}

// Create a new booking in Supabase
export async function createBooking(booking: {
  carId: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  startDate: string;
  endDate: string;
  pickupTime?: string;
  returnTime?: string;
  totalPrice: number;
  notes?: string;
}): Promise<{ success: boolean; confirmationNumber?: string; error?: string }> {
  const { data, error } = await supabase
    .from('bookings')
    .insert({
      car_id: booking.carId,
      customer_name: booking.customerName,
      customer_email: booking.customerEmail,
      customer_phone: booking.customerPhone,
      start_date: booking.startDate,
      end_date: booking.endDate,
      pickup_time: booking.pickupTime || '10:00',
      return_time: booking.returnTime || '10:00',
      total_price: booking.totalPrice,
      notes: booking.notes,
      status: 'confirmed',
    })
    .select('confirmation_number')
    .single();

  if (error) {
    console.error('Error creating booking:', error);
    return { success: false, error: error.message };
  }

  return { success: true, confirmationNumber: data?.confirmation_number };
}
