export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface Customer {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  dateOfBirth: string;
  driversLicense: {
    number: string;
    state: string;
    expirationDate: string;
  };
  address: Address;
  createdAt: string;
  updatedAt: string;
}

export interface AdminUser {
  id: string;
  email: string;
  password: string;
  name: string;
  role: 'admin' | 'manager';
  createdAt: string;
}

export interface CustomerSession {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

export interface AdminSession {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'manager';
}
