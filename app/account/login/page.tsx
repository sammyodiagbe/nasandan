'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock } from 'lucide-react';
import { Container } from '@/components/shared';
import { Header, Footer } from '@/components/layout';
import { Card, CardContent, CardHeader, CardTitle, Input, Button } from '@/components/ui';
import { useCustomerAuth, useToast } from '@/lib/context';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useCustomerAuth();
  const { showToast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const success = await login(email, password);

    if (success) {
      showToast('Welcome back!', 'success');
      router.push('/account');
    } else {
      setError('Invalid email or password');
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
                <CardTitle className="text-2xl">Sign In</CardTitle>
                <p className="text-gray-500 text-sm mt-2">
                  Welcome back! Please sign in to your account.
                </p>
              </CardHeader>
              <CardContent>
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

                <p className="text-center text-sm text-gray-500 mt-6">
                  Don&apos;t have an account?{' '}
                  <Link href="/account/register" className="text-blue-600 hover:underline font-medium">
                    Sign up
                  </Link>
                </p>

                {/* Demo credentials */}
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500 mb-2">Demo credentials:</p>
                  <p className="text-xs text-gray-600 font-mono">
                    Email: john.doe@email.com<br />
                    Password: password123
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </Container>
      </main>
      <Footer />
    </div>
  );
}
