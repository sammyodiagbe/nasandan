import { differenceInDays } from 'date-fns';
import type { Vehicle, BookingExtras, BookingPricing } from '@/types';
import { EXTRAS_PRICING } from '@/types';

const TAX_RATE = 0.085; // 8.5%

export function calculateNumberOfDays(startDate: Date, endDate: Date): number {
  const days = differenceInDays(endDate, startDate);
  return Math.max(1, days);
}

export function calculateRentalPrice(
  vehicle: Vehicle,
  startDate: Date,
  endDate: Date,
  extras: BookingExtras
): BookingPricing {
  const numberOfDays = calculateNumberOfDays(startDate, endDate);

  // Use weekly rate if applicable
  const fullWeeks = Math.floor(numberOfDays / 7);
  const remainingDays = numberOfDays % 7;

  let subtotal = 0;
  if (fullWeeks > 0 && vehicle.weeklyRate < vehicle.dailyRate * 7) {
    subtotal = fullWeeks * vehicle.weeklyRate + remainingDays * vehicle.dailyRate;
  } else {
    subtotal = numberOfDays * vehicle.dailyRate;
  }

  const fees: { name: string; amount: number }[] = [];

  // Add extras
  if (extras.insurance) {
    const insuranceCost = EXTRAS_PRICING.insurance * numberOfDays;
    fees.push({ name: 'Insurance Coverage', amount: insuranceCost });
    subtotal += insuranceCost;
  }

  if (extras.gps) {
    const gpsCost = EXTRAS_PRICING.gps * numberOfDays;
    fees.push({ name: 'GPS Navigation', amount: gpsCost });
    subtotal += gpsCost;
  }

  if (extras.childSeat) {
    const childSeatCost = EXTRAS_PRICING.childSeat * numberOfDays;
    fees.push({ name: 'Child Seat', amount: childSeatCost });
    subtotal += childSeatCost;
  }

  if (extras.additionalDriver) {
    const additionalDriverCost = EXTRAS_PRICING.additionalDriver * numberOfDays;
    fees.push({ name: 'Additional Driver', amount: additionalDriverCost });
    subtotal += additionalDriverCost;
  }

  const taxAmount = subtotal * TAX_RATE;
  const total = subtotal + taxAmount;

  return {
    dailyRate: vehicle.dailyRate,
    numberOfDays,
    subtotal,
    taxRate: TAX_RATE,
    taxAmount,
    fees,
    total,
  };
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}
