'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Shield } from 'lucide-react';
import { Container } from '@/components/shared';
import { Card, CardContent, CardHeader, CardTitle, Input, Button } from '@/components/ui';
import { useAdminAuth, useToast } from '@/lib/context';

export default function AdminLoginPage() {
  const router = useRouter();
  const { admin, login } = useAdminAuth();
  const { showToast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (admin) {
      router.push('/admin');
    }
  }, [admin, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const success = await login(email, password);

    if (success) {
      showToast('Welcome to the admin portal!', 'success');
      router.push('/admin');
    } else {
      setError('Invalid email or password');
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center py-12 px-4">
      <Container size="sm">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">Admin Portal</h1>
            <p className="text-gray-400 mt-2">Sign in to manage your rental business</p>
          </div>

          <Card>
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  label="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  leftIcon={<Mail className="h-4 w-4" />}
                  required
                />
                <Input
                  label="Password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  leftIcon={<Lock className="h-4 w-4" />}
                  required
                />

                {error && (
                  <p className="text-sm text-red-600">{error}</p>
                )}

                <Button type="submit" isLoading={isLoading} className="w-full">
                  Sign In
                </Button>
              </form>

              {/* Demo credentials */}
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500 mb-2">Demo credentials:</p>
                <p className="text-xs text-gray-600 font-mono">
                  Email: admin@nasandanrentals.com<br />
                  Password: admin123
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </Container>
    </div>
  );
}
