import Link from 'next/link';
import { Home, ArrowLeft } from 'lucide-react';
import { Container } from '@/components/shared';
import { Button } from '@/components/ui';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <Container size="sm">
        <div className="text-center">
          <h1 className="text-9xl font-bold text-gray-200">404</h1>
          <h2 className="text-2xl font-bold text-gray-900 mt-4">Page Not Found</h2>
          <p className="text-gray-600 mt-2 mb-8">
            Sorry, we couldn&apos;t find the page you&apos;re looking for.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/">
              <Button leftIcon={<Home className="h-4 w-4" />}>
                Go Home
              </Button>
            </Link>
            <Button variant="outline" onClick={() => history.back()} leftIcon={<ArrowLeft className="h-4 w-4" />}>
              Go Back
            </Button>
          </div>
        </div>
      </Container>
    </div>
  );
}
