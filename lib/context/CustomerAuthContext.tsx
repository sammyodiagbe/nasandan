'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import type { CustomerSession, Customer } from '@/types';
import { validateCustomerLogin, getCustomerByEmail, customers } from '@/data';

interface CustomerAuthContextType {
  customer: CustomerSession | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (data: Partial<Customer>) => Promise<boolean>;
  getFullCustomer: () => Customer | undefined;
}

const CustomerAuthContext = createContext<CustomerAuthContextType | undefined>(undefined);

export function CustomerAuthProvider({ children }: { children: React.ReactNode }) {
  const [customer, setCustomer] = useState<CustomerSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const stored = localStorage.getItem('customerSession');
    if (stored) {
      setCustomer(JSON.parse(stored));
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    const validCustomer = validateCustomerLogin(email, password);
    if (validCustomer) {
      const session: CustomerSession = {
        id: validCustomer.id,
        email: validCustomer.email,
        firstName: validCustomer.firstName,
        lastName: validCustomer.lastName,
      };
      setCustomer(session);
      localStorage.setItem('customerSession', JSON.stringify(session));
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    setCustomer(null);
    localStorage.removeItem('customerSession');
    router.push('/');
  }, [router]);

  const register = useCallback(async (data: Partial<Customer>): Promise<boolean> => {
    const existingCustomer = getCustomerByEmail(data.email || '');
    if (existingCustomer) {
      return false;
    }

    const newCustomer: Customer = {
      id: `c${customers.length + 1}`,
      email: data.email || '',
      password: data.password || '',
      firstName: data.firstName || '',
      lastName: data.lastName || '',
      phone: data.phone || '',
      dateOfBirth: data.dateOfBirth || '',
      driversLicense: data.driversLicense || {
        number: '',
        state: '',
        expirationDate: '',
      },
      address: data.address || {
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'USA',
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    customers.push(newCustomer);

    const session: CustomerSession = {
      id: newCustomer.id,
      email: newCustomer.email,
      firstName: newCustomer.firstName,
      lastName: newCustomer.lastName,
    };
    setCustomer(session);
    localStorage.setItem('customerSession', JSON.stringify(session));
    return true;
  }, []);

  const getFullCustomer = useCallback((): Customer | undefined => {
    if (!customer) return undefined;
    return customers.find((c) => c.id === customer.id);
  }, [customer]);

  return (
    <CustomerAuthContext.Provider
      value={{ customer, isLoading, login, logout, register, getFullCustomer }}
    >
      {children}
    </CustomerAuthContext.Provider>
  );
}

export function useCustomerAuth() {
  const context = useContext(CustomerAuthContext);
  if (context === undefined) {
    throw new Error('useCustomerAuth must be used within a CustomerAuthProvider');
  }
  return context;
}
