'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, User, Phone } from 'lucide-react';
import { Container } from '@/components/shared';
import { Header, Footer } from '@/components/layout';
import { Card, CardContent, CardHeader, CardTitle, Input, Button } from '@/components/ui';
import { useCustomerAuth, useToast } from '@/lib/context';
import { registerSchema } from '@/lib/utils/validation';

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useCustomerAuth();
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = registerSchema.safeParse(formData);
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

    setIsLoading(true);

    const success = await register({
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      password: formData.password,
    });

    if (success) {
      showToast('Account created successfully!', 'success');
      router.push('/account');
    } else {
      setErrors({ email: 'An account with this email already exists' });
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-gray-50 py-16">
        <Container size="sm">
          <div className="max-w-md mx-auto">
            <Card>
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Create Account</CardTitle>
                <p className="text-gray-500 text-sm mt-2">
                  Join us to start booking vehicles and managing your rentals.
                </p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="First Name"
                      value={formData.firstName}
                      onChange={(e) => handleChange('firstName', e.target.value)}
                      leftIcon={<User className="h-4 w-4" />}
                      error={errors.firstName}
                      required
                    />
                    <Input
                      label="Last Name"
                      value={formData.lastName}
                      onChange={(e) => handleChange('lastName', e.target.value)}
                      error={errors.lastName}
                      required
                    />
                  </div>
                  <Input
                    label="Email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    leftIcon={<Mail className="h-4 w-4" />}
                    error={errors.email}
                    required
                  />
                  <Input
                    label="Phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    leftIcon={<Phone className="h-4 w-4" />}
                    error={errors.phone}
                    required
                  />
                  <Input
                    label="Password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => handleChange('password', e.target.value)}
                    leftIcon={<Lock className="h-4 w-4" />}
                    error={errors.password}
                    required
                  />
                  <Input
                    label="Confirm Password"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleChange('confirmPassword', e.target.value)}
                    leftIcon={<Lock className="h-4 w-4" />}
                    error={errors.confirmPassword}
                    required
                  />

                  <Button type="submit" isLoading={isLoading} className="w-full">
                    Create Account
                  </Button>
                </form>

                <p className="text-center text-sm text-gray-500 mt-6">
                  Already have an account?{' '}
                  <Link href="/account/login" className="text-blue-600 hover:underline font-medium">
                    Sign in
                  </Link>
                </p>
              </CardContent>
            </Card>
          </div>
        </Container>
      </main>
      <Footer />
    </div>
  );
}
