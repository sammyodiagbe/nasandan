'use client';

import { useEffect } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import Link from 'next/link';
import { Container } from '@/components/shared';
import { Button } from '@/components/ui';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <Container size="sm">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Something went wrong!</h1>
          <p className="text-gray-600 mt-2 mb-8">
            We&apos;re sorry, but something unexpected happened. Please try again.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={reset} leftIcon={<RefreshCw className="h-4 w-4" />}>
              Try Again
            </Button>
            <Link href="/">
              <Button variant="outline" leftIcon={<Home className="h-4 w-4" />}>
                Go Home
              </Button>
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}
