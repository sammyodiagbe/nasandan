'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, Input, Select, Button } from '@/components/ui';
import { useBooking, useCustomerAuth } from '@/lib/context';
import { customerInfoSchema } from '@/lib/utils/validation';

const US_STATES = [
  { value: 'AL', label: 'Alabama' }, { value: 'AK', label: 'Alaska' },
  { value: 'AZ', label: 'Arizona' }, { value: 'AR', label: 'Arkansas' },
  { value: 'CA', label: 'California' }, { value: 'CO', label: 'Colorado' },
  { value: 'CT', label: 'Connecticut' }, { value: 'DE', label: 'Delaware' },
  { value: 'FL', label: 'Florida' }, { value: 'GA', label: 'Georgia' },
  { value: 'HI', label: 'Hawaii' }, { value: 'ID', label: 'Idaho' },
  { value: 'IL', label: 'Illinois' }, { value: 'IN', label: 'Indiana' },
  { value: 'IA', label: 'Iowa' }, { value: 'KS', label: 'Kansas' },
  { value: 'KY', label: 'Kentucky' }, { value: 'LA', label: 'Louisiana' },
  { value: 'ME', label: 'Maine' }, { value: 'MD', label: 'Maryland' },
  { value: 'MA', label: 'Massachusetts' }, { value: 'MI', label: 'Michigan' },
  { value: 'MN', label: 'Minnesota' }, { value: 'MS', label: 'Mississippi' },
  { value: 'MO', label: 'Missouri' }, { value: 'MT', label: 'Montana' },
  { value: 'NE', label: 'Nebraska' }, { value: 'NV', label: 'Nevada' },
  { value: 'NH', label: 'New Hampshire' }, { value: 'NJ', label: 'New Jersey' },
  { value: 'NM', label: 'New Mexico' }, { value: 'NY', label: 'New York' },
  { value: 'NC', label: 'North Carolina' }, { value: 'ND', label: 'North Dakota' },
  { value: 'OH', label: 'Ohio' }, { value: 'OK', label: 'Oklahoma' },
  { value: 'OR', label: 'Oregon' }, { value: 'PA', label: 'Pennsylvania' },
  { value: 'RI', label: 'Rhode Island' }, { value: 'SC', label: 'South Carolina' },
  { value: 'SD', label: 'South Dakota' }, { value: 'TN', label: 'Tennessee' },
  { value: 'TX', label: 'Texas' }, { value: 'UT', label: 'Utah' },
  { value: 'VT', label: 'Vermont' }, { value: 'VA', label: 'Virginia' },
  { value: 'WA', label: 'Washington' }, { value: 'WV', label: 'West Virginia' },
  { value: 'WI', label: 'Wisconsin' }, { value: 'WY', label: 'Wyoming' },
];

interface CustomerInfoFormProps {
  onBack: () => void;
  onContinue: () => void;
}

export function CustomerInfoForm({ onBack, onContinue }: CustomerInfoFormProps) {
  const { customerInfo, setCustomerInfo } = useBooking();
  const { customer, getFullCustomer } = useCustomerAuth();

  const [formData, setFormData] = useState({
    firstName: customerInfo.firstName || '',
    lastName: customerInfo.lastName || '',
    email: customerInfo.email || '',
    phone: customerInfo.phone || '',
    dateOfBirth: customerInfo.dateOfBirth || '',
    driversLicenseNumber: customerInfo.driversLicenseNumber || '',
    driversLicenseState: customerInfo.driversLicenseState || '',
    driversLicenseExpiration: customerInfo.driversLicenseExpiration || '',
    street: customerInfo.street || '',
    city: customerInfo.city || '',
    state: customerInfo.state || '',
    zipCode: customerInfo.zipCode || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (customer) {
      const fullCustomer = getFullCustomer();
      if (fullCustomer) {
        setFormData({
          firstName: fullCustomer.firstName,
          lastName: fullCustomer.lastName,
          email: fullCustomer.email,
          phone: fullCustomer.phone,
          dateOfBirth: fullCustomer.dateOfBirth,
          driversLicenseNumber: fullCustomer.driversLicense.number,
          driversLicenseState: fullCustomer.driversLicense.state,
          driversLicenseExpiration: fullCustomer.driversLicense.expirationDate,
          street: fullCustomer.address.street,
          city: fullCustomer.address.city,
          state: fullCustomer.address.state,
          zipCode: fullCustomer.address.zipCode,
        });
      }
    }
  }, [customer, getFullCustomer]);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleSubmit = () => {
    const result = customerInfoSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as string] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setCustomerInfo(formData);
    onContinue();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Personal Info */}
        <div>
          <h4 className="font-medium text-gray-900 mb-4">Personal Information</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="First Name"
              value={formData.firstName}
              onChange={(e) => handleChange('firstName', e.target.value)}
              error={errors.firstName}
            />
            <Input
              label="Last Name"
              value={formData.lastName}
              onChange={(e) => handleChange('lastName', e.target.value)}
              error={errors.lastName}
            />
            <Input
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              error={errors.email}
            />
            <Input
              label="Phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              error={errors.phone}
            />
            <Input
              label="Date of Birth"
              type="date"
              value={formData.dateOfBirth}
              onChange={(e) => handleChange('dateOfBirth', e.target.value)}
              error={errors.dateOfBirth}
            />
          </div>
        </div>

        {/* Driver's License */}
        <div>
          <h4 className="font-medium text-gray-900 mb-4">Driver&apos;s License</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label="License Number"
              value={formData.driversLicenseNumber}
              onChange={(e) => handleChange('driversLicenseNumber', e.target.value)}
              error={errors.driversLicenseNumber}
            />
            <Select
              label="State"
              options={US_STATES}
              value={formData.driversLicenseState}
              onChange={(e) => handleChange('driversLicenseState', e.target.value)}
              placeholder="Select state"
              error={errors.driversLicenseState}
            />
            <Input
              label="Expiration Date"
              type="date"
              value={formData.driversLicenseExpiration}
              onChange={(e) => handleChange('driversLicenseExpiration', e.target.value)}
              error={errors.driversLicenseExpiration}
            />
          </div>
        </div>

        {/* Address */}
        <div>
          <h4 className="font-medium text-gray-900 mb-4">Address</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Input
                label="Street Address"
                value={formData.street}
                onChange={(e) => handleChange('street', e.target.value)}
                error={errors.street}
              />
            </div>
            <Input
              label="City"
              value={formData.city}
              onChange={(e) => handleChange('city', e.target.value)}
              error={errors.city}
            />
            <div className="grid grid-cols-2 gap-4">
              <Select
                label="State"
                options={US_STATES}
                value={formData.state}
                onChange={(e) => handleChange('state', e.target.value)}
                placeholder="State"
                error={errors.state}
              />
              <Input
                label="ZIP Code"
                value={formData.zipCode}
                onChange={(e) => handleChange('zipCode', e.target.value)}
                error={errors.zipCode}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-between pt-4 border-t border-gray-100">
          <Button variant="outline" onClick={onBack}>
            Back
          </Button>
          <Button onClick={handleSubmit} size="lg">
            Continue to Review
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
