'use client';

import { useState } from 'react';
import { User, Phone, Calendar, CreditCard, Mail } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, Input, Button } from '@/components/ui';
import { useBooking } from '@/lib/context';

interface CustomerInfoFormProps {
  onBack: () => void;
  onSubmit: () => void;
  isSubmitting?: boolean;
}

export function CustomerInfoForm({ onBack, onSubmit, isSubmitting }: CustomerInfoFormProps) {
  const { setCustomerInfo } = useBooking();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    age: '',
    phone: '',
    hasFullLicense: null as boolean | null,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.age) {
      newErrors.age = 'Age is required';
    } else {
      const age = parseInt(formData.age);
      if (isNaN(age) || age < 18) {
        newErrors.age = 'You must be at least 18 years old';
      } else if (age > 100) {
        newErrors.age = 'Please enter a valid age';
      }
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (formData.phone.replace(/\D/g, '').length < 10) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    if (formData.hasFullLicense === null) {
      newErrors.hasFullLicense = 'Please confirm your license status';
    } else if (!formData.hasFullLicense) {
      newErrors.hasFullLicense = 'A full driver\'s license is required to rent a vehicle';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    // Store customer info in context
    setCustomerInfo({
      firstName: formData.fullName.split(' ')[0] || '',
      lastName: formData.fullName.split(' ').slice(1).join(' ') || '',
      email: formData.email,
      phone: formData.phone,
      dateOfBirth: '',
      driversLicenseNumber: '',
      driversLicenseState: '',
      driversLicenseExpiration: '',
      street: '',
      city: '',
      state: '',
      zipCode: '',
      // Custom fields
      age: formData.age,
      fullName: formData.fullName,
      hasFullLicense: formData.hasFullLicense,
    });

    onSubmit();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Details</CardTitle>
        <p className="text-sm text-slate-500">Please provide your information to complete the booking</p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Full Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            <User className="h-4 w-4 inline mr-1.5" />
            Full Name
          </label>
          <Input
            placeholder="Enter your full name"
            value={formData.fullName}
            onChange={(e) => handleChange('fullName', e.target.value)}
            error={errors.fullName}
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            <Mail className="h-4 w-4 inline mr-1.5" />
            Email Address
          </label>
          <Input
            type="email"
            placeholder="Enter your email address"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            error={errors.email}
          />
          <p className="text-xs text-slate-500 mt-1">We&apos;ll send booking confirmation to this email</p>
        </div>

        {/* Age */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            <Calendar className="h-4 w-4 inline mr-1.5" />
            Age
          </label>
          <Input
            type="number"
            placeholder="Enter your age"
            min="18"
            max="100"
            value={formData.age}
            onChange={(e) => handleChange('age', e.target.value)}
            error={errors.age}
          />
          <p className="text-xs text-slate-500 mt-1">You must be at least 18 years old to rent</p>
        </div>

        {/* Phone Number */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            <Phone className="h-4 w-4 inline mr-1.5" />
            Phone Number
          </label>
          <Input
            type="tel"
            placeholder="Enter your phone number"
            value={formData.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            error={errors.phone}
          />
        </div>

        {/* Full License */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            <CreditCard className="h-4 w-4 inline mr-1.5" />
            Do you have a full driver&apos;s license?
          </label>
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => handleChange('hasFullLicense', true)}
              className={`flex-1 py-3 px-4 rounded-xl border-2 font-medium transition-all ${
                formData.hasFullLicense === true
                  ? 'border-[#E8AC41] bg-[#E8AC41]/10 text-[#0c2340]'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
              }`}
            >
              Yes, I have a full license
            </button>
            <button
              type="button"
              onClick={() => handleChange('hasFullLicense', false)}
              className={`flex-1 py-3 px-4 rounded-xl border-2 font-medium transition-all ${
                formData.hasFullLicense === false
                  ? 'border-red-300 bg-red-50 text-red-700'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
              }`}
            >
              No
            </button>
          </div>
          {errors.hasFullLicense && (
            <p className="text-sm text-red-600 mt-2">{errors.hasFullLicense}</p>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-between pt-6 border-t border-gray-100">
          <Button variant="outline" onClick={onBack} disabled={isSubmitting}>
            Back
          </Button>
          <Button onClick={handleSubmit} size="lg" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                Booking...
              </>
            ) : (
              'Complete Booking'
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
