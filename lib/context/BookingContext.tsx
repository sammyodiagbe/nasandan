'use client';

import { createContext, useContext, useState, useCallback } from 'react';
import type { Vehicle, BookingDates, BookingExtras, BookingPricing } from '@/types';
import { calculateRentalPrice } from '@/lib/utils';

export interface CustomerInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  driversLicenseNumber: string;
  driversLicenseState: string;
  driversLicenseExpiration: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
}

export type BookingStep = 'select-dates' | 'customer-info' | 'review' | 'confirmation';

interface BookingContextType {
  vehicle: Vehicle | null;
  dates: Partial<BookingDates>;
  extras: BookingExtras;
  customerInfo: Partial<CustomerInfo>;
  pricing: BookingPricing | null;
  confirmationNumber: string | null;
  currentStep: BookingStep;
  setVehicle: (vehicle: Vehicle | null) => void;
  setDates: (dates: Partial<BookingDates>) => void;
  setExtras: (extras: BookingExtras) => void;
  setCustomerInfo: (info: Partial<CustomerInfo>) => void;
  setCurrentStep: (step: BookingStep) => void;
  setConfirmationNumber: (number: string) => void;
  calculatePrice: () => void;
  resetBooking: () => void;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

const initialExtras: BookingExtras = {
  insurance: false,
  gps: false,
  childSeat: false,
  additionalDriver: false,
};

export function BookingProvider({ children }: { children: React.ReactNode }) {
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [dates, setDates] = useState<Partial<BookingDates>>({});
  const [extras, setExtras] = useState<BookingExtras>(initialExtras);
  const [customerInfo, setCustomerInfo] = useState<Partial<CustomerInfo>>({});
  const [pricing, setPricing] = useState<BookingPricing | null>(null);
  const [confirmationNumber, setConfirmationNumber] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState<BookingStep>('select-dates');

  const calculatePrice = useCallback(() => {
    if (vehicle && dates.startDate && dates.endDate) {
      const startDate = new Date(dates.startDate);
      const endDate = new Date(dates.endDate);
      const calculatedPricing = calculateRentalPrice(vehicle, startDate, endDate, extras);
      setPricing(calculatedPricing);
    }
  }, [vehicle, dates.startDate, dates.endDate, extras]);

  const resetBooking = useCallback(() => {
    setVehicle(null);
    setDates({});
    setExtras(initialExtras);
    setCustomerInfo({});
    setPricing(null);
    setConfirmationNumber(null);
    setCurrentStep('select-dates');
  }, []);

  return (
    <BookingContext.Provider
      value={{
        vehicle,
        dates,
        extras,
        customerInfo,
        pricing,
        confirmationNumber,
        currentStep,
        setVehicle,
        setDates,
        setExtras,
        setCustomerInfo,
        setCurrentStep,
        setConfirmationNumber,
        calculatePrice,
        resetBooking,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const context = useContext(BookingContext);
  if (context === undefined) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
}
