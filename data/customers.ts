import type { Customer, AdminUser } from '@/types';

export const customers: Customer[] = [
  {
    id: 'c1',
    email: 'john.doe@email.com',
    password: 'password123',
    firstName: 'John',
    lastName: 'Doe',
    phone: '555-123-4567',
    dateOfBirth: '1985-06-15',
    driversLicense: {
      number: 'D123456789',
      state: 'CA',
      expirationDate: '2027-06-15',
    },
    address: {
      street: '123 Main Street',
      city: 'Los Angeles',
      state: 'CA',
      zipCode: '90001',
      country: 'USA',
    },
    createdAt: '2024-01-10T10:00:00Z',
    updatedAt: '2024-01-10T10:00:00Z',
  },
  {
    id: 'c2',
    email: 'sarah.smith@email.com',
    password: 'password123',
    firstName: 'Sarah',
    lastName: 'Smith',
    phone: '555-234-5678',
    dateOfBirth: '1990-03-22',
    driversLicense: {
      number: 'S987654321',
      state: 'NY',
      expirationDate: '2026-03-22',
    },
    address: {
      street: '456 Oak Avenue',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'USA',
    },
    createdAt: '2024-02-05T14:30:00Z',
    updatedAt: '2024-02-05T14:30:00Z',
  },
  {
    id: 'c3',
    email: 'mike.johnson@email.com',
    password: 'password123',
    firstName: 'Mike',
    lastName: 'Johnson',
    phone: '555-345-6789',
    dateOfBirth: '1978-11-08',
    driversLicense: {
      number: 'M456789012',
      state: 'TX',
      expirationDate: '2025-11-08',
    },
    address: {
      street: '789 Pine Road',
      city: 'Houston',
      state: 'TX',
      zipCode: '77001',
      country: 'USA',
    },
    createdAt: '2024-01-20T09:15:00Z',
    updatedAt: '2024-01-20T09:15:00Z',
  },
  {
    id: 'c4',
    email: 'emily.wilson@email.com',
    password: 'password123',
    firstName: 'Emily',
    lastName: 'Wilson',
    phone: '555-456-7890',
    dateOfBirth: '1995-07-30',
    driversLicense: {
      number: 'E789012345',
      state: 'FL',
      expirationDate: '2028-07-30',
    },
    address: {
      street: '321 Beach Blvd',
      city: 'Miami',
      state: 'FL',
      zipCode: '33101',
      country: 'USA',
    },
    createdAt: '2024-02-15T16:45:00Z',
    updatedAt: '2024-02-15T16:45:00Z',
  },
  {
    id: 'c5',
    email: 'david.brown@email.com',
    password: 'password123',
    firstName: 'David',
    lastName: 'Brown',
    phone: '555-567-8901',
    dateOfBirth: '1982-09-12',
    driversLicense: {
      number: 'B234567890',
      state: 'IL',
      expirationDate: '2026-09-12',
    },
    address: {
      street: '654 Lake Street',
      city: 'Chicago',
      state: 'IL',
      zipCode: '60601',
      country: 'USA',
    },
    createdAt: '2024-01-28T11:30:00Z',
    updatedAt: '2024-01-28T11:30:00Z',
  },
];

export const adminUsers: AdminUser[] = [
  {
    id: 'a1',
    email: 'admin@nasandanrentals.com',
    password: 'admin123',
    name: 'Admin User',
    role: 'admin',
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'a2',
    email: 'manager@nasandanrentals.com',
    password: 'manager123',
    name: 'Store Manager',
    role: 'manager',
    createdAt: '2024-01-01T00:00:00Z',
  },
];

export function getCustomerById(id: string): Customer | undefined {
  return customers.find((c) => c.id === id);
}

export function getCustomerByEmail(email: string): Customer | undefined {
  return customers.find((c) => c.email.toLowerCase() === email.toLowerCase());
}

export function getAdminByEmail(email: string): AdminUser | undefined {
  return adminUsers.find((a) => a.email.toLowerCase() === email.toLowerCase());
}

export function validateCustomerLogin(email: string, password: string): Customer | null {
  const customer = getCustomerByEmail(email);
  if (customer && customer.password === password) {
    return customer;
  }
  return null;
}

export function validateAdminLogin(email: string, password: string): AdminUser | null {
  const admin = getAdminByEmail(email);
  if (admin && admin.password === password) {
    return admin;
  }
  return null;
}
